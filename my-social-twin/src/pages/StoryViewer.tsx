import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Story, ChoiceMade } from '../types';
import { supabase } from '../services/supabase';
import SensoryControls from '../components/SensoryControls';

const StoryViewer: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [choicesMade, setChoicesMade] = useState<ChoiceMade[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(100);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('story_id', storyId)
        .single();

      if (error) throw error;

      setStory({
        storyId: data.story_id,
        childId: data.child_id,
        templateId: data.template_id,
        title: data.title,
        description: data.description,
        frames: data.frames,
        createdBy: data.created_by,
        createdAt: data.created_at,
        lastViewedAt: data.last_viewed_at,
        isFavorite: data.is_favorite,
        completionCount: data.completion_count,
      });

      // Update last viewed
      await supabase
        .from('stories')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('story_id', storyId);
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  };

  const handleChoice = (choice: any) => {
    const newChoice: ChoiceMade = {
      frameNumber: currentFrame + 1,
      choice: choice.text,
      correct: choice.isCorrect,
      timestamp: new Date().toISOString(),
    };

    setChoicesMade([...choicesMade, newChoice]);
    setIsCorrect(choice.isCorrect);
    setFeedbackMessage(choice.feedback);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (choice.isCorrect) {
        handleNext();
      }
    }, 3000);
  };

  const handleNext = () => {
    if (story && currentFrame < story.frames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    } else if (story) {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  const handleComplete = async () => {
    if (!story) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const completionRate = story.frames.filter((frame) => frame.choices).length > 0
      ? (choicesMade.filter((c) => c.correct).length /
          story.frames.filter((f) => f.choices).length) *
        100
      : 100;

    try {
      // Save progress
      await supabase.from('progress').insert({
        child_id: story.childId,
        story_id: story.storyId,
        choices_made: choicesMade,
        time_spent: timeSpent,
        completion_rate: completionRate,
      });

      // Increment completion count
      await supabase
        .from('stories')
        .update({ completion_count: story.completionCount + 1 })
        .eq('story_id', storyId);

      // Show completion screen
      alert('🎉 Great job! Story completed!');
      navigate(`/child/${story.childId}`);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading story...</div>
      </div>
    );
  }

  const frame = story.frames[currentFrame];
  const progress = ((currentFrame + 1) / story.frames.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: frame.backgroundColor || '#F3F4F6',
        filter: `brightness(${brightness}%)`,
      }}
    >
      {/* Header with Progress */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => navigate(`/child/${story.childId}`)}
              className="text-primary text-lg font-semibold hover:underline"
            >
              ← Exit Story
            </button>
            <div className="text-lg font-semibold text-gray-700">
              Frame {currentFrame + 1} of {story.frames.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Story Frame */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="story-frame">
            {/* Emotion Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {frame.emotions.map((emotion) => (
                <div
                  key={emotion}
                  className="px-6 py-3 bg-white rounded-full text-2xl font-bold shadow-lg border-4 border-gray-200"
                >
                  {getEmotionEmoji(emotion)} {emotion}
                </div>
              ))}
            </div>

            {/* Story Text */}
            <div className="bg-white rounded-xl p-8 mb-6 shadow-lg border-4 border-gray-200">
              <p className="text-2xl leading-relaxed text-gray-900 whitespace-pre-line">
                {frame.text}
              </p>
            </div>

            {/* Sound Indicator */}
            {frame.soundDescription && (
              <div className="mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-400 flex items-center gap-3">
                <span className="text-3xl">🔊</span>
                <p className="text-lg text-gray-800">
                  <strong>Sounds:</strong> {frame.soundDescription}
                </p>
              </div>
            )}

            {/* Interactive Choices */}
            {frame.choices && frame.choices.length > 0 && !showFeedback && (
              <div className="space-y-4">
                <p className="text-xl font-bold text-gray-900 text-center mb-4">
                  What should we do?
                </p>
                {frame.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="w-full btn-secondary text-left text-xl py-6"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}

            {/* Feedback Message */}
            {showFeedback && (
              <div
                className={`p-6 rounded-xl text-center text-xl font-bold ${
                  isCorrect
                    ? 'bg-green-100 border-4 border-green-400 text-green-800'
                    : 'bg-orange-100 border-4 border-orange-400 text-orange-800'
                }`}
              >
                <div className="text-4xl mb-2">{isCorrect ? '✅' : '💭'}</div>
                {feedbackMessage}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {!frame.choices && (
            <div className="flex justify-between mt-8 gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentFrame === 0}
                className="btn-outline text-xl px-8"
              >
                ← Previous
              </button>
              <button onClick={handleNext} className="btn-primary text-xl px-8">
                {currentFrame === story.frames.length - 1 ? '🎉 Finish' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sensory Controls */}
      <SensoryControls
        volume={volume}
        onVolumeChange={setVolume}
        brightness={brightness}
        onBrightnessChange={setBrightness}
      />

      {/* Hidden audio element for sound effects */}
      <audio ref={audioRef} />
    </div>
  );
};

// Helper function to get emotion emoji
function getEmotionEmoji(emotion: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    worried: '😟',
    scared: '😨',
    excited: '🤩',
    sad: '😢',
    surprised: '😲',
  };
  return emojis[emotion] || '😊';
}

export default StoryViewer;
