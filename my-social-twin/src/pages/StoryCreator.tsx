import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Child, StoryTemplate } from '../types';
import { localDB } from '../services/localStorage';
import { generateStory } from '../services/mockAI';
import { useAuth } from '../contexts/AuthContext';

const StoryCreator: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [child, setChild] = useState<Child | null>(null);
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [scenarioDetails, setScenarioDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = () => {
    try {
      const childData = localDB.getChild(childId!);
      setChild(childData);

      const templatesData = localDB.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGenerateStory = async () => {
    if (!child || !selectedTemplate || !user) return;

    setLoading(true);
    setError('');

    try {
      // Generate story using mock AI
      const frames = await generateStory({
        childName: child.name,
        age: child.age,
        templateName: selectedTemplate.name,
        scenarioDetails: scenarioDetails || selectedTemplate.description,
        sensorySettings: child.sensorySettings,
      });

      // Save story to localStorage
      const newStory = localDB.addStory({
        childId: child.childId,
        templateId: selectedTemplate.templateId,
        title: selectedTemplate.name + ' - ' + new Date().toLocaleDateString(),
        description: scenarioDetails || selectedTemplate.description,
        frames: frames,
        createdBy: user.userId,
      });

      // Navigate to story viewer
      navigate('/story/' + newStory.storyId);
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setLoading(false);
    }
  };

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/child/' + childId)}
            className="text-primary text-lg font-semibold hover:underline"
          >
            ← Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Create Story for {child.name}
        </h1>

        {/* Steps Indicator */}
        <div className="flex justify-center mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={'w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ' + (step >= s ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600')}
              >
                {s}
              </div>
              {s < 2 && <div className="w-24 h-1 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Select Template */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 1: Choose a Story Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.templateId}
                  onClick={() => setSelectedTemplate(template)}
                  className={'card cursor-pointer transition-all ' + (selectedTemplate?.templateId === template.templateId ? 'ring-4 ring-primary' : 'hover:shadow-xl')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                    <span
                      className={'px-3 py-1 rounded-full text-sm font-semibold ' + (template.difficulty === 'easy' ? 'bg-green-100 text-green-800' : template.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')}
                    >
                      {template.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{template.description}</p>
                  <p className="text-sm text-gray-500">
                    Category: <span className="capitalize">{template.category}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedTemplate}
                className="btn-primary"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize & Generate */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 2: Add Details & Generate
            </h2>
            <div className="card mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Scenario Details (Optional)
              </label>
              <textarea
                value={scenarioDetails}
                onChange={(e) => setScenarioDetails(e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Add specific details about this scenario"
              />
            </div>

            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Story Summary</h3>
              <p className="mb-2">
                <strong>Template:</strong> {selectedTemplate?.name}
              </p>
              <p>
                <strong>Child:</strong> {child.name}, Age {child.age}
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-outline" disabled={loading}>
                ← Back
              </button>
              <button
                onClick={handleGenerateStory}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? '🤖 Generating Story...' : '✨ Generate Story'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCreator;
