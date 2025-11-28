import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Child, Character, Story } from '../types';
import { supabase } from '../services/supabase';

const ChildView: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stories' | 'characters'>('stories');

  useEffect(() => {
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  const fetchChildData = async () => {
    try {
      // Fetch child profile
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('child_id', childId)
        .single();

      if (childError) throw childError;

      setChild({
        childId: childData.child_id,
        parentId: childData.parent_id,
        name: childData.name,
        age: childData.age,
        photoUrl: childData.photo_url,
        sensorySettings: childData.sensory_settings,
        createdAt: childData.created_at,
        updatedAt: childData.updated_at,
      });

      // Fetch characters
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .eq('child_id', childId);

      if (charactersError) throw charactersError;

      setCharacters(
        charactersData.map((c) => ({
          characterId: c.character_id,
          childId: c.child_id,
          name: c.name,
          relationship: c.relationship,
          photoUrl: c.photo_url,
          createdAt: c.created_at,
        }))
      );

      // Fetch stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (storiesError) throw storiesError;

      setStories(
        storiesData.map((s) => ({
          storyId: s.story_id,
          childId: s.child_id,
          templateId: s.template_id,
          title: s.title,
          description: s.description,
          frames: s.frames,
          createdBy: s.created_by,
          createdAt: s.created_at,
          lastViewedAt: s.last_viewed_at,
          isFavorite: s.is_favorite,
          completionCount: s.completion_count,
        }))
      );
    } catch (error) {
      console.error('Error fetching child data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Child not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary text-lg font-semibold hover:underline"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/child/${childId}/create-story`)}
              className="btn-primary"
            >
              ➕ Create New Story
            </button>
          </div>
        </div>
      </header>

      {/* Child Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-8">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200">
              <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{child.name}'s Stories</h1>
              <p className="text-xl text-gray-600">Age {child.age}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all ${
              activeTab === 'stories'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📚 Stories ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all ${
              activeTab === 'characters'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 Characters ({characters.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'stories' ? (
          <div>
            {stories.length === 0 ? (
              <div className="text-center py-16 card">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Stories Yet</h3>
                <p className="text-gray-600 mb-6">Create the first social story for {child.name}</p>
                <button
                  onClick={() => navigate(`/child/${childId}/create-story`)}
                  className="btn-primary"
                >
                  Create First Story
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.storyId}
                    className="card hover:shadow-2xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/story/${story.storyId}`)}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Viewed {story.completionCount} times</span>
                      {story.isFavorite && <span>⭐</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {characters.length === 0 ? (
              <div className="text-center py-16 card">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Characters Added</h3>
                <p className="text-gray-600 mb-6">
                  Add family members, friends, and teachers to personalize stories
                </p>
                <button className="btn-primary">Add First Character</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <div key={character.characterId} className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={character.photoUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{character.name}</h3>
                        <p className="text-gray-600 capitalize">{character.relationship}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildView;
