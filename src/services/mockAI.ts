// Enhanced Mock AI Story Generator with Photo Slot Positioning
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

  // Generate story based on template with character slots
  const stories: Record<string, StoryFrame[]> = {
    'Morning Arrival at School': [
      {
        frameNumber: 1,
        backgroundColor: '#DBEAFE',
        backgroundScene: 'bedroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 200 },
            size: { width: 120, height: 120 },
            zIndex: 2,
            description: 'lying in bed'
          }
        ],
        characters: [],
        text: `${childName} wakes up in the morning.\n\n"Time to get ready for school!"`,
        emotions: ['calm'],
        soundDescription: 'Alarm clock beeping softly',
      },
      {
        frameNumber: 2,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 200, y: 250 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'at breakfast table'
          },
          {
            role: 'parent',
            position: { x: 450, y: 230 },
            size: { width: 90, height: 90 },
            zIndex: 1,
            description: 'helping with breakfast'
          }
        ],
        characters: [],
        text: `${childName} eats breakfast and brushes teeth.\n\n"I am getting ready for a good day."`,
        emotions: ['happy'],
        soundDescription: 'Water running, dishes clinking',
      },
      {
        frameNumber: 3,
        backgroundColor: '#DBEAFE',
        backgroundScene: 'classroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 150, y: 350 },
            size: { width: 110, height: 110 },
            zIndex: 3,
            description: 'entering classroom'
          },
          {
            role: 'teacher',
            position: { x: 450, y: 320 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'greeting at door'
          }
        ],
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
        backgroundScene: 'classroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 350 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'sitting at desk'
          }
        ],
        characters: [],
        text: `${childName} hangs up the backpack and sits at the desk.\n\n"I am ready to learn!"`,
        emotions: ['happy'],
        soundDescription: 'Papers shuffling, chairs moving',
      },
      {
        frameNumber: 5,
        backgroundColor: '#DBEAFE',
        backgroundScene: 'classroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 340 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'working at desk'
          },
          {
            role: 'friend',
            position: { x: 500, y: 350 },
            size: { width: 95, height: 95 },
            zIndex: 1,
            description: 'working nearby'
          }
        ],
        characters: [],
        text: `${childName} starts the morning work.\n\n"I can do this!"`,
        emotions: ['calm'],
        soundDescription: 'Pencils writing, quiet classroom',
      },
      {
        frameNumber: 6,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'classroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 330 },
            size: { width: 120, height: 120 },
            zIndex: 3,
            description: 'happy at desk'
          },
          {
            role: 'teacher',
            position: { x: 100, y: 320 },
            size: { width: 90, height: 90 },
            zIndex: 2,
            description: 'giving praise'
          }
        ],
        characters: [],
        text: `${childName} had a great morning at school!\n\n"I did it!"`,
        emotions: ['excited'],
        soundDescription: 'Happy voices',
      },
    ],

    'Visit to the Barber Shop': [
      {
        frameNumber: 1,
        backgroundColor: '#E8D5C4',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 300 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'at home'
          },
          {
            role: 'parent',
            position: { x: 450, y: 280 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'talking to child'
          }
        ],
        characters: [],
        text: `${childName}'s hair is getting long.\n\n"It's time for a haircut!"`,
        emotions: ['calm'],
        soundDescription: 'Quiet conversation',
      },
      {
        frameNumber: 2,
        backgroundColor: '#D5E8F0',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'parent',
            position: { x: 150, y: 300 },
            size: { width: 90, height: 90 },
            zIndex: 1,
            description: 'driving'
          },
          {
            role: 'child',
            position: { x: 350, y: 310 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'in car seat'
          }
        ],
        characters: [],
        text: `${childName} and parent drive to the barber shop.\n\n"We're almost there!"`,
        emotions: ['calm'],
        soundDescription: 'Car engine, radio music',
      },
      {
        frameNumber: 3,
        backgroundColor: '#E8D5C4',
        backgroundScene: 'barber_shop',
        characterSlots: [
          {
            role: 'child',
            position: { x: 150, y: 380 },
            size: { width: 105, height: 105 },
            zIndex: 3,
            description: 'entering shop'
          },
          {
            role: 'parent',
            position: { x: 50, y: 400 },
            size: { width: 80, height: 80 },
            zIndex: 2,
            description: 'holding door'
          },
          {
            role: 'guide',
            position: { x: 450, y: 320 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'barber standing'
          }
        ],
        characters: [],
        text: `${childName} arrives at the barber shop and meets the barber.\n\n"Hello! Ready for your haircut?"`,
        emotions: ['calm'],
        soundDescription: 'Door chime, clippers buzzing',
        choices: [
          { text: 'Say hello', isCorrect: true, feedback: '✅ Nice! Being friendly is great!' },
          { text: 'Hide behind parent', isCorrect: false, feedback: '💭 The barber is friendly! Try saying hello.' },
        ],
      },
      {
        frameNumber: 4,
        backgroundColor: '#E8D5C4',
        backgroundScene: 'barber_shop',
        characterSlots: [
          {
            role: 'child',
            position: { x: 380, y: 260 },
            size: { width: 130, height: 130 },
            zIndex: 3,
            description: 'sitting in barber chair'
          },
          {
            role: 'guide',
            position: { x: 520, y: 220 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'barber standing behind'
          },
          {
            role: 'parent',
            position: { x: 60, y: 380 },
            size: { width: 85, height: 85 },
            zIndex: 1,
            description: 'sitting on waiting bench'
          }
        ],
        characters: [],
        text: `${childName} sits in the big barber chair. Parent waits on the bench.\n\n"You're doing great!"`,
        emotions: ['calm'],
        soundDescription: 'Chair hydraulics, soft music',
      },
      {
        frameNumber: 5,
        backgroundColor: '#E8D5C4',
        backgroundScene: 'barber_shop',
        characterSlots: [
          {
            role: 'child',
            position: { x: 380, y: 260 },
            size: { width: 130, height: 130 },
            zIndex: 3,
            description: 'getting haircut'
          },
          {
            role: 'guide',
            position: { x: 520, y: 220 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'cutting hair'
          }
        ],
        characters: [],
        text: `The barber cuts ${childName}'s hair gently.\n\n"Almost done! You're sitting so still!"`,
        emotions: ['calm'],
        soundDescription: 'Scissors snipping, clippers buzzing',
      },
      {
        frameNumber: 6,
        backgroundColor: '#E8D5C4',
        backgroundScene: 'barber_shop',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 320 },
            size: { width: 120, height: 120 },
            zIndex: 3,
            description: 'admiring haircut'
          },
          {
            role: 'parent',
            position: { x: 150, y: 340 },
            size: { width: 90, height: 90 },
            zIndex: 2,
            description: 'looking proud'
          },
          {
            role: 'guide',
            position: { x: 480, y: 300 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'showing mirror'
          }
        ],
        characters: [],
        text: `All done! ${childName} looks great with the new haircut!\n\n"Thank you! I love it!"`,
        emotions: ['excited'],
        soundDescription: 'Happy voices, high-five',
      },
    ],

    'Birthday Party': [
      {
        frameNumber: 1,
        backgroundColor: '#FCE7F3',
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'child',
            position: { x: 270, y: 350 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'holding invitation'
          }
        ],
        characters: [],
        text: `${childName} is invited to a birthday party!\n\n"I'm excited to celebrate with my friend!"`,
        emotions: ['excited'],
        soundDescription: 'Happy music playing',
      },
      {
        frameNumber: 2,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'child',
            position: { x: 200, y: 340 },
            size: { width: 115, height: 115 },
            zIndex: 3,
            description: 'arriving with gift'
          },
          {
            role: 'parent',
            position: { x: 80, y: 350 },
            size: { width: 85, height: 85 },
            zIndex: 2,
            description: 'standing behind'
          },
          {
            role: 'friend',
            position: { x: 450, y: 330 },
            size: { width: 105, height: 105 },
            zIndex: 3,
            description: 'birthday child greeting'
          }
        ],
        characters: [],
        text: `${childName} arrives at the party with a gift.\n\n"Happy birthday!"`,
        emotions: ['happy'],
        soundDescription: 'Children laughing, doorbell ringing',
      },
      {
        frameNumber: 3,
        backgroundColor: '#FCE7F3',
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 340 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'looking at games'
          },
          {
            role: 'friend',
            position: { x: 450, y: 330 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'playing game'
          },
          {
            role: 'friend',
            position: { x: 120, y: 350 },
            size: { width: 95, height: 95 },
            zIndex: 1,
            description: 'playing game'
          }
        ],
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
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'friend',
            position: { x: 280, y: 300 },
            size: { width: 130, height: 130 },
            zIndex: 3,
            description: 'birthday child at cake'
          },
          {
            role: 'child',
            position: { x: 450, y: 330 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'singing'
          },
          {
            role: 'friend',
            position: { x: 120, y: 340 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'singing'
          }
        ],
        characters: [],
        text: `Time for birthday cake! ${childName} sings "Happy Birthday."\n\n"Happy birthday to you..."`,
        emotions: ['happy'],
        soundDescription: 'Everyone singing together',
      },
      {
        frameNumber: 5,
        backgroundColor: '#FCE7F3',
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'child',
            position: { x: 270, y: 330 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'eating cake'
          },
          {
            role: 'friend',
            position: { x: 450, y: 340 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'eating cake'
          }
        ],
        characters: [],
        text: `${childName} eats cake and has fun!\n\n"This is delicious!"`,
        emotions: ['excited'],
        soundDescription: 'Forks on plates, happy chatter',
      },
      {
        frameNumber: 6,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'party',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 330 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'waving goodbye'
          },
          {
            role: 'parent',
            position: { x: 120, y: 350 },
            size: { width: 90, height: 90 },
            zIndex: 1,
            description: 'waiting'
          }
        ],
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
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 330 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'in living room'
          },
          {
            role: 'parent',
            position: { x: 450, y: 320 },
            size: { width: 90, height: 90 },
            zIndex: 2,
            description: 'nearby'
          }
        ],
        characters: [],
        text: `It's evening. ${childName} knows it's almost bedtime.\n\n"Time to get ready for bed."`,
        emotions: ['calm'],
        soundDescription: 'Quiet house sounds',
      },
      {
        frameNumber: 2,
        backgroundColor: '#DBEAFE',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 270, y: 320 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'in pajamas'
          }
        ],
        characters: [],
        text: `${childName} takes a bath and puts on pajamas.\n\n"I'm getting cozy!"`,
        emotions: ['calm'],
        soundDescription: 'Water splashing, toothbrush',
      },
      {
        frameNumber: 3,
        backgroundColor: '#E0E7FF',
        backgroundScene: 'bedroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 200, y: 300 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'choosing book'
          },
          {
            role: 'parent',
            position: { x: 420, y: 290 },
            size: { width: 95, height: 95 },
            zIndex: 2,
            description: 'holding books'
          }
        ],
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
        backgroundScene: 'bedroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 200, y: 280 },
            size: { width: 120, height: 120 },
            zIndex: 2,
            description: 'in bed listening'
          },
          {
            role: 'parent',
            position: { x: 420, y: 290 },
            size: { width: 90, height: 90 },
            zIndex: 2,
            description: 'reading story'
          }
        ],
        characters: [],
        text: `${childName} listens to the story in bed.\n\n"This is a good story!"`,
        emotions: ['calm'],
        soundDescription: 'Gentle reading voice',
      },
      {
        frameNumber: 5,
        backgroundColor: '#E0E7FF',
        backgroundScene: 'bedroom',
        characterSlots: [
          {
            role: 'child',
            position: { x: 250, y: 280 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'sleeping peacefully'
          }
        ],
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
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 330 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'hearing bell'
          }
        ],
        characters: [],
        text: `The lunch bell rings! ${childName} walks to the cafeteria.\n\n"Time for lunch!"`,
        emotions: ['happy'],
        soundDescription: 'Bell ringing, footsteps',
      },
      {
        frameNumber: 2,
        backgroundColor: '#DBEAFE',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 340 },
            size: { width: 110, height: 110 },
            zIndex: 2,
            description: 'in line'
          },
          {
            role: 'friend',
            position: { x: 150, y: 350 },
            size: { width: 95, height: 95 },
            zIndex: 1,
            description: 'in line ahead'
          },
          {
            role: 'friend',
            position: { x: 450, y: 350 },
            size: { width: 95, height: 95 },
            zIndex: 1,
            description: 'in line behind'
          }
        ],
        characters: [],
        text: `${childName} waits in line to get food.\n\n"I'll wait my turn."`,
        emotions: ['calm'],
        soundDescription: 'Trays sliding, people talking',
      },
      {
        frameNumber: 3,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 330 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'looking for seat'
          },
          {
            role: 'friend',
            position: { x: 450, y: 350 },
            size: { width: 100, height: 100 },
            zIndex: 1,
            description: 'waving from table'
          }
        ],
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
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 270, y: 340 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'eating lunch'
          },
          {
            role: 'friend',
            position: { x: 460, y: 350 },
            size: { width: 100, height: 100 },
            zIndex: 2,
            description: 'eating nearby'
          }
        ],
        characters: [],
        text: `${childName} eats lunch slowly.\n\n"This tastes good!"`,
        emotions: ['happy'],
        soundDescription: 'Eating sounds, quiet conversation',
      },
      {
        frameNumber: 5,
        backgroundColor: '#FEF3C7',
        backgroundScene: 'default',
        characterSlots: [
          {
            role: 'child',
            position: { x: 280, y: 330 },
            size: { width: 115, height: 115 },
            zIndex: 2,
            description: 'cleaning up'
          }
        ],
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
