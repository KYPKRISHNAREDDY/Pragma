import React, { useState } from 'react';

interface SensoryControlsProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  brightness: number;
  onBrightnessChange: (brightness: number) => void;
}

const SensoryControls: React.FC<SensoryControlsProps> = ({
  volume,
  onVolumeChange,
  brightness,
  onBrightnessChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-indigo-700 transition-all"
      >
        ⚙️
      </button>

      {/* Controls Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-6 w-80 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sensory Controls</h3>

          {/* Volume Control */}
          <div className="mb-6">
            <label className="flex items-center justify-between text-lg font-semibold text-gray-700 mb-2">
              <span>🔊 Volume</span>
              <span className="text-primary">{volume}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Brightness Control */}
          <div className="mb-4">
            <label className="flex items-center justify-between text-lg font-semibold text-gray-700 mb-2">
              <span>💡 Brightness</span>
              <span className="text-primary">{brightness}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Presets */}
          <div className="border-t-2 border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Quick Presets:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onVolumeChange(30);
                  onBrightnessChange(80);
                }}
                className="flex-1 py-2 px-3 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200"
              >
                Calm
              </button>
              <button
                onClick={() => {
                  onVolumeChange(50);
                  onBrightnessChange(100);
                }}
                className="flex-1 py-2 px-3 bg-green-100 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-200"
              >
                Normal
              </button>
              <button
                onClick={() => {
                  onVolumeChange(70);
                  onBrightnessChange(120);
                }}
                className="flex-1 py-2 px-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold hover:bg-yellow-200"
              >
                Energetic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensoryControls;
