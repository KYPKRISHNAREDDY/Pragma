import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Child, Character, Story } from '../types';
import { localDB } from '../services/localStorage';

const ChildView: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stories' | 'characters'>('stories');
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterRelationship, setNewCharacterRelationship] = useState('');
  const [newCharacterPhoto, setNewCharacterPhoto] = useState('');

  useEffect(() => {
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  const fetchChildData = () => {
    try {
      const childData = localDB.getChild(childId!);
      setChild(childData);

      const charactersData = localDB.getCharacters(childId!);
      setCharacters(charactersData);

      const storiesData = localDB.getStories(childId!);
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching child data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCharacter = () => {
    if (!newCharacterName || !newCharacterRelationship) {
      alert('Please fill in all fields');
      return;
    }

    try {
      localDB.addCharacter({
        childId: childId!,
        name: newCharacterName,
        relationship: newCharacterRelationship,
        photoUrl: newCharacterPhoto || 'https://via.placeholder.com/150?text=' + newCharacterName[0],
      });

      // Reset form
      setNewCharacterName('');
      setNewCharacterRelationship('');
      setNewCharacterPhoto('');
      setShowAddCharacter(false);

      // Refresh data
      fetchChildData();
    } catch (error) {
      console.error('Error adding character:', error);
      alert('Failed to add character');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCharacterPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Add family members, friends, and professionals (like barbers or doctors) to personalize stories!
              </p>
              <button
                onClick={() => setShowAddCharacter(true)}
                className="btn-primary"
              >
                ➕ Add Character
              </button>
            </div>

            {showAddCharacter && (
              <div className="card mb-6 bg-blue-50 border-2 border-blue-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Character</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newCharacterName}
                      onChange={(e) => setNewCharacterName(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Sarah, Mr. Tom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relationship
                      <span className="text-xs text-gray-500 ml-2">
                        (e.g., Mother, Father, Parent, Friend, Teacher, Barber, Doctor, Guide)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newCharacterRelationship}
                      onChange={(e) => setNewCharacterRelationship(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Mother, Barber, Friend"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Photo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="input-field"
                    />
                    {newCharacterPhoto && (
                      <img
                        src={newCharacterPhoto}
                        alt="Preview"
                        className="mt-2 w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                      />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddCharacter} className="btn-primary">
                      ✅ Add Character
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCharacter(false);
                        setNewCharacterName('');
                        setNewCharacterRelationship('');
                        setNewCharacterPhoto('');
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {characters.length === 0 ? (
              <div className="text-center py-16 card">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Characters Yet</h3>
                <p className="text-gray-600 mb-6">
                  Add family members and helpers to make stories more personal!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <div key={character.characterId} className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
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
