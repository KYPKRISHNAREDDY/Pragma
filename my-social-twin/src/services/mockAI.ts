// Mock AI Story Generator - No API keys needed!
import type { StoryFrame } from '../types';

export interface StoryGenerationRequest {
  childName: string;
  age: number;
  templateName: string;
  scenarioDetails: string;
  sensorySettings: {
    soundTolerance: number;
    crowdComfort: number;
    preferredPace: 'slow' | 'medium' | 'fast';
  };
}

export const generateStory = async (
  request: StoryGenerationRequest
): Promise<StoryFrame[]> => {
  const { childName, templateName } = request;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate story based on template
  const stories: Record<string, StoryFrame[]> = {
    'Morning Arrival at School': [
      {
        frameNumber: 1,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} wakes up in the morning.\n\n"Time to get ready for school!"`,
        emotions: ['calm'],
        soundDescription: 'Alarm clock beeping softly',
      },
      {
        frameNumber: 2,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} eats breakfast and brushes teeth.\n\n"I am getting ready for a good day."`,
        emotions: ['happy'],
        soundDescription: 'Water running, dishes clinking',
      },
      {
        frameNumber: 3,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} arrives at school and sees the teacher.\n\n"Good morning ${childName}!"`,
        emotions: ['calm'],
        soundDescription: 'Children talking, birds chirping',
        choices: [
          { text: 'Say "Good morning" back', isCorrect: true, feedback: '✅ Great job! Being polite is wonderful!' },
          { text: 'Run away', isCorrect: false, feedback: '💭 Let\'s try greeting our teacher. It makes them happy!' },
        ],
      },
      {
        frameNumber: 4,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} hangs up the backpack and sits at the desk.\n\n"I am ready to learn!"`,
        emotions: ['happy'],
        soundDescription: 'Papers shuffling, chairs moving',
      },
      {
        frameNumber: 5,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} starts the morning work.\n\n"I can do this!"`,
        emotions: ['calm'],
        soundDescription: 'Pencils writing, quiet classroom',
      },
      {
        frameNumber: 6,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} had a great morning at school!\n\n"I did it!"`,
        emotions: ['excited'],
        soundDescription: 'Happy voices',
      },
    ],

    'Birthday Party': [
      {
        frameNumber: 1,
        backgroundColor: '#FCE7F3',
        characters: [],
        text: `${childName} is invited to a birthday party!\n\n"I'm excited to celebrate with my friend!"`,
        emotions: ['excited'],
        soundDescription: 'Happy music playing',
      },
      {
        frameNumber: 2,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} arrives at the party with a gift.\n\n"Happy birthday!"`,
        emotions: ['happy'],
        soundDescription: 'Children laughing, doorbell ringing',
      },
      {
        frameNumber: 3,
        backgroundColor: '#FCE7F3',
        characters: [],
        text: `Everyone is playing games. ${childName} can choose what to do.\n\n"What game should I play?"`,
        emotions: ['happy'],
        soundDescription: 'Party music, kids playing',
        choices: [
          { text: 'Join a game with friends', isCorrect: true, feedback: '✅ Awesome! Playing together is fun!' },
          { text: 'Watch from the side', isCorrect: true, feedback: '✅ That\'s okay too! Join when you feel ready.' },
        ],
      },
      {
        frameNumber: 4,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `Time for birthday cake! ${childName} sings "Happy Birthday."\n\n"Happy birthday to you..."`,
        emotions: ['happy'],
        soundDescription: 'Everyone singing together',
      },
      {
        frameNumber: 5,
        backgroundColor: '#FCE7F3',
        characters: [],
        text: `${childName} eats cake and has fun!\n\n"This is delicious!"`,
        emotions: ['excited'],
        soundDescription: 'Forks on plates, happy chatter',
      },
      {
        frameNumber: 6,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} says thank you and goes home happy.\n\n"That was a great party!"`,
        emotions: ['happy'],
        soundDescription: 'Goodbyes, car doors',
      },
    ],

    'Bedtime Routine': [
      {
        frameNumber: 1,
        backgroundColor: '#E0E7FF',
        characters: [],
        text: `It's evening. ${childName} knows it's almost bedtime.\n\n"Time to get ready for bed."`,
        emotions: ['calm'],
        soundDescription: 'Quiet house sounds',
      },
      {
        frameNumber: 2,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} takes a bath and puts on pajamas.\n\n"I'm getting cozy!"`,
        emotions: ['calm'],
        soundDescription: 'Water splashing, toothbrush',
      },
      {
        frameNumber: 3,
        backgroundColor: '#E0E7FF',
        characters: [],
        text: `${childName} picks a bedtime story to read.\n\n"Which book tonight?"`,
        emotions: ['calm'],
        soundDescription: 'Pages turning softly',
        choices: [
          { text: 'Pick favorite book', isCorrect: true, feedback: '✅ Great choice! Reading helps us relax.' },
          { text: 'Ask parent to choose', isCorrect: true, feedback: '✅ That works too! Parents love helping.' },
        ],
      },
      {
        frameNumber: 4,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} listens to the story in bed.\n\n"This is a good story!"`,
        emotions: ['calm'],
        soundDescription: 'Gentle reading voice',
      },
      {
        frameNumber: 5,
        backgroundColor: '#E0E7FF',
        characters: [],
        text: `${childName} feels sleepy and closes eyes.\n\n"Good night. Sweet dreams!"`,
        emotions: ['calm'],
        soundDescription: 'Soft lullaby, quiet breathing',
      },
    ],

    'Lunch in the Cafeteria': [
      {
        frameNumber: 1,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `The lunch bell rings! ${childName} walks to the cafeteria.\n\n"Time for lunch!"`,
        emotions: ['happy'],
        soundDescription: 'Bell ringing, footsteps',
      },
      {
        frameNumber: 2,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} waits in line to get food.\n\n"I'll wait my turn."`,
        emotions: ['calm'],
        soundDescription: 'Trays sliding, people talking',
      },
      {
        frameNumber: 3,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} finds a table to sit at.\n\n"Where should I sit?"`,
        emotions: ['calm'],
        soundDescription: 'Cafeteria noise, chairs moving',
        choices: [
          { text: 'Sit with friends', isCorrect: true, feedback: '✅ Nice! Friends make lunch fun!' },
          { text: 'Sit at a quiet spot', isCorrect: true, feedback: '✅ Good choice! Quiet lunch is okay too.' },
        ],
      },
      {
        frameNumber: 4,
        backgroundColor: '#DBEAFE',
        characters: [],
        text: `${childName} eats lunch slowly.\n\n"This tastes good!"`,
        emotions: ['happy'],
        soundDescription: 'Eating sounds, quiet conversation',
      },
      {
        frameNumber: 5,
        backgroundColor: '#FEF3C7',
        characters: [],
        text: `${childName} cleans up and goes to recess!\n\n"All done! Time to play!"`,
        emotions: ['excited'],
        soundDescription: 'Trays clattering, outside sounds',
      },
    ],
  };

  // Return matching story or default
  const frames = stories[templateName] || stories['Morning Arrival at School'];

  return frames;
};
