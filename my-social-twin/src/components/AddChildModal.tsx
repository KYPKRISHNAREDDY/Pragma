import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { SensorySettings } from '../types';

interface AddChildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [sensorySettings, setSensorySettings] = useState<SensorySettings>({
    soundTolerance: 5,
    crowdComfort: 5,
    preferredPace: 'medium',
    visualBrightness: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      let photoUrl = '';

      // Upload photo to Supabase Storage
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('children_photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('children_photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Create child profile
      const { error: insertError } = await supabase.from('children').insert({
        parent_id: user.userId,
        name,
        age: parseInt(age),
        photo_url: photoUrl || 'https://via.placeholder.com/150',
        sensory_settings: sensorySettings,
      });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Add Child Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Child's Photo
            </label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                  👶
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Child's name"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-lg font-semibold text-gray-700 mb-2">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
              placeholder="Age"
              min="1"
              max="17"
              required
            />
          </div>

          {/* Sensory Settings */}
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sensory Preferences</h3>

            {/* Sound Tolerance */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                🔊 Sound Tolerance: {sensorySettings.soundTolerance}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sensorySettings.soundTolerance}
                onChange={(e) =>
                  setSensorySettings({
                    ...sensorySettings,
                    soundTolerance: parseInt(e.target.value),
                  })
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Sensitive</span>
                <span>Comfortable</span>
              </div>
            </div>

            {/* Crowd Comfort */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                👥 Crowd Comfort: {sensorySettings.crowdComfort}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sensorySettings.crowdComfort}
                onChange={(e) =>
                  setSensorySettings({
                    ...sensorySettings,
                    crowdComfort: parseInt(e.target.value),
                  })
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Prefers alone</span>
                <span>Loves groups</span>
              </div>
            </div>

            {/* Preferred Pace */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                ⚡ Preferred Pace
              </label>
              <div className="flex gap-3">
                {(['slow', 'medium', 'fast'] as const).map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() =>
                      setSensorySettings({ ...sensorySettings, preferredPace: pace })
                    }
                    className={`flex-1 py-3 rounded-lg text-lg font-semibold border-2 transition-all ${
                      sensorySettings.preferredPace === pace
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {pace.charAt(0).toUpperCase() + pace.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Brightness */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                💡 Visual Brightness: {sensorySettings.visualBrightness}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sensorySettings.visualBrightness}
                onChange={(e) =>
                  setSensorySettings({
                    ...sensorySettings,
                    visualBrightness: parseInt(e.target.value),
                  })
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
