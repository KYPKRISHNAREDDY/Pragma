import React from 'react';
import type { ChildCardProps } from '../types';

const ChildCard: React.FC<ChildCardProps> = ({ child, onSelect, onEdit }) => {
  return (
    <div className="card hover:shadow-2xl transition-shadow duration-200">
      {/* Child Photo */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200">
          <img
            src={child.photoUrl}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Child Info */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{child.name}</h3>
        <p className="text-lg text-gray-600">Age {child.age}</p>
      </div>

      {/* Sensory Settings Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">🔊 Sound Tolerance:</span>
          <span className="font-semibold">{child.sensorySettings.soundTolerance}/10</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">👥 Crowd Comfort:</span>
          <span className="font-semibold">{child.sensorySettings.crowdComfort}/10</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">⚡ Pace:</span>
          <span className="font-semibold capitalize">{child.sensorySettings.preferredPace}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSelect}
          className="btn-primary flex-1 text-base"
        >
          View Stories
        </button>
        <button
          onClick={onEdit}
          className="btn-outline flex-1 text-base"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
};

export default ChildCard;
