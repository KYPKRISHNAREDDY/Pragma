// User and authentication types
export interface User {
  userId: string;
  email: string;
  role: 'parent' | 'teacher';
  createdAt: string;
}

// Child profile types
export interface SensorySettings {
  soundTolerance: number; // 1-10
  crowdComfort: number; // 1-10
  preferredPace: 'slow' | 'medium' | 'fast';
  visualBrightness: number; // 1-10
}

export interface Child {
  childId: string;
  parentId: string;
  name: string;
  age: number;
  photoUrl: string;
  sensorySettings: SensorySettings;
  createdAt: string;
  updatedAt: string;
}

// Character types (family, friends, teachers)
export interface Character {
  characterId: string;
  childId: string;
  name: string;
  relationship: string; // 'mother', 'father', 'sibling', 'friend', 'teacher', etc.
  photoUrl: string;
  createdAt: string;
}

// Story types
export interface Choice {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

// Character slot defines WHERE to place a character photo in the frame
export interface CharacterSlot {
  role: 'child' | 'parent' | 'guide' | 'friend' | 'teacher' | 'sibling'; // Who goes here
  position: { x: number; y: number }; // Position in pixels (or percentage)
  size: { width: number; height: number }; // Size of the photo slot
  zIndex?: number; // Layer order (higher = in front)
  rotation?: number; // Rotation angle in degrees
  description?: string; // e.g., "sitting on barber chair", "standing at door"
}

export interface StoryFrame {
  frameNumber: number;
  backgroundUrl?: string; // URL to background scene image
  backgroundColor?: string; // Fallback solid color
  backgroundScene?: string; // Scene type: 'classroom', 'barber_shop', 'bedroom', etc.
  characterSlots: CharacterSlot[]; // Defined slots for where to place photos
  characters: Array<{
    characterId: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
  }>; // Actual assigned characters (legacy, will be replaced by slots)
  text: string;
  emotions: Array<'happy' | 'calm' | 'worried' | 'scared' | 'excited' | 'sad' | 'surprised'>;
  soundUrl?: string;
  soundDescription?: string;
  choices?: Choice[];
}

export interface Story {
  storyId: string;
  childId: string;
  templateId: string;
  title: string;
  description: string;
  frames: StoryFrame[];
  createdBy: string;
  createdAt: string;
  lastViewedAt?: string;
  isFavorite?: boolean;
  completionCount: number;
}

// Story template types
export interface StoryTemplate {
  templateId: string;
  name: string;
  category: 'school' | 'social' | 'medical' | 'routine' | 'unexpected';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frameCount: number;
  requiredCharacters: Array<{
    role: string;
    description: string;
  }>;
  thumbnailUrl?: string;
}

// Progress tracking types
export interface ChoiceMade {
  frameNumber: number;
  choice: string;
  correct: boolean;
  timestamp: string;
}

export interface Progress {
  progressId: string;
  childId: string;
  storyId: string;
  completedAt: string;
  choicesMade: ChoiceMade[];
  timeSpent: number; // in seconds
  completionRate: number; // percentage
}

// Collaboration types
export interface Collaboration {
  collaborationId: string;
  childId: string;
  invitedEmail: string;
  invitedBy: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  acceptedAt?: string;
}

// Claude API types
export interface StoryGenerationRequest {
  childId: string;
  childName: string;
  age: number;
  templateId: string;
  templateName: string;
  scenarioDetails: string;
  characters: Array<{
    characterId: string;
    name: string;
    relationship: string;
  }>;
  sensorySettings: SensorySettings;
}

export interface ClaudeStoryResponse {
  frames: Array<{
    sceneDescription: string;
    characterActions: string[];
    dialogue: string;
    emotion: string;
    sounds?: string[];
    choices?: Array<{
      text: string;
      isCorrect: boolean;
      feedback: string;
    }>;
  }>;
}

// Component prop types
export interface StoryViewerProps {
  story: Story;
  onComplete: (progress: Progress) => void;
  onExit: () => void;
}

export interface ChildCardProps {
  child: Child;
  onSelect: () => void;
  onEdit: () => void;
}

export interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacters: string[];
  onToggle: (characterId: string) => void;
  maxSelections?: number;
}
