import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Story, ChoiceMade, Child, Character } from '../types';
import { localDB } from '../services/localStorage';
import SensoryControls from '../components/SensoryControls';
import { composeFrame, generateSceneBackground } from '../services/imageComposer';

const StoryViewer: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [composedImages, setComposedImages] = useState<Record<number, string>>({});
  const [currentFrame, setCurrentFrame] = useState(0);
  const [choicesMade, setChoicesMade] = useState<ChoiceMade[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
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
      const data = localDB.getStory(storyId!);
      if (data) {
        setStory(data);

        // Fetch child and characters
        const childData = localDB.getChild(data.childId);
        const charactersData = localDB.getCharacters(data.childId);

        // Update last viewed
        localDB.updateStory(storyId!, {
          lastViewedAt: new Date().toISOString()
        });

        // Compose images for all frames
        if (childData) {
          await composeAllFrames(data, childData, charactersData);
        }
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  };

  const composeAllFrames = async (story: Story, child: Child, chars: Character[]) => {
    const composed: Record<number, string> = {};

    for (let i = 0; i < story.frames.length; i++) {
      const frame = story.frames[i];

      if (frame.characterSlots && frame.characterSlots.length > 0) {
        try {
          // Generate background if needed
          const backgroundUrl = frame.backgroundUrl ||
            (frame.backgroundScene ?
              generateSceneBackground(frame.backgroundScene, 700, 500) :
              undefined);

          // Map slots to actual photos
          const characterSlots = frame.characterSlots.map(slot => {
            let photoUrl = '';

            if (slot.role === 'child') {
              photoUrl = child.photoUrl;
            } else {
              // Find matching character by role/relationship with flexible matching
              const char = chars.find(c => {
                const relationship = c.relationship.toLowerCase();
                const role = slot.role.toLowerCase();

                // Direct match
                if (relationship === role) return true;

                // Partial match (e.g., "mother" matches "parent", "barber" matches "guide")
                if (relationship.includes(role)) return true;

                // Reverse match
                if (role.includes(relationship)) return true;

                // Special cases
                if (role === 'parent' && (relationship.includes('mom') || relationship.includes('dad') ||
                    relationship.includes('mother') || relationship.includes('father'))) return true;

                if (role === 'guide' && (relationship.includes('barber') || relationship.includes('doctor') ||
                    relationship.includes('dentist') || relationship.includes('professional'))) return true;

                return false;
              });

              photoUrl = char?.photoUrl || '';
            }

            return { slot, photoUrl };
          }).filter(s => s.photoUrl); // Only include slots with photos

          if (characterSlots.length > 0) {
            const composedImage = await composeFrame({
              backgroundUrl,
              backgroundColor: frame.backgroundColor,
              width: 700,
              height: 500,
              characterSlots,
            });

            composed[i] = composedImage;
          }
        } catch (error) {
          console.error(`Error composing frame ${i}:`, error);
          // Continue to next frame even if one fails
        }
      }
    }

    setComposedImages(composed);
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

    try {
      // Increment completion count
      localDB.updateStory(story.storyId, {
        completionCount: story.completionCount + 1
      });

      // Show completion screen
      alert('🎉 Great job! Story completed!');
      navigate('/child/' + story.childId);
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
            {/* Composed Scene Image */}
            {composedImages[currentFrame] && (
              <div className="mb-6 flex justify-center">
                <img
                  src={composedImages[currentFrame]}
                  alt={`Story frame ${currentFrame + 1}`}
                  className="rounded-xl shadow-2xl border-4 border-white max-w-full"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            )}

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
