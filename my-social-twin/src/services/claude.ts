import Anthropic from '@anthropic-ai/sdk';
import type { StoryGenerationRequest, ClaudeStoryResponse, StoryFrame } from '../types';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend API
});

export const generateStory = async (
  request: StoryGenerationRequest
): Promise<StoryFrame[]> => {
  const { childName, age, templateName, scenarioDetails, characters, sensorySettings } = request;

  const characterList = characters.map((c) => `${c.name} (${c.relationship})`).join(', ');

  const prompt = `You are creating a social story for an autistic child named ${childName}, age ${age}.

Template: ${templateName}
Scenario: ${scenarioDetails}
Characters involved: ${characterList}

Sensory needs:
- Sound tolerance: ${sensorySettings.soundTolerance}/10 (1=very sensitive, 10=very comfortable)
- Crowd comfort: ${sensorySettings.crowdComfort}/10 (1=prefers alone, 10=loves groups)
- Preferred pace: ${sensorySettings.preferredPace}
- Visual brightness: ${sensorySettings.visualBrightness}/10

Create a social story with 6 frames. For each frame provide:
1. Scene description (simple, literal, concrete language)
2. Character positions and what they are doing
3. Dialogue (maximum 10 words, use simple language)
4. Primary emotion to display (choose one: happy, calm, worried, scared, excited, sad, surprised)
5. Any sounds present in the scene
6. If it's a decision point (frames 3-4), provide 2-3 choices with clear correct option

Important guidelines:
- Use predictable, sequential structure
- Focus on positive outcomes
- Use concrete, specific language (avoid metaphors)
- Label emotions clearly
- Prepare for sensory experiences (sounds, sights, feelings)
- Make the "good" choice obvious and rewarding
- Keep sentences short (5-10 words each)
- Use ${childName}'s name frequently

Format your response as a valid JSON array with this exact structure:
[
  {
    "sceneDescription": "description here",
    "characterActions": ["action 1", "action 2"],
    "dialogue": "what someone says",
    "emotion": "happy",
    "sounds": ["sound 1", "sound 2"],
    "choices": [
      {"text": "choice text", "isCorrect": true, "feedback": "positive feedback"}
    ]
  }
]

Only include "choices" for frames where a decision is needed (typically frames 3-4).
Return ONLY the JSON array, no other text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const claudeResponse: ClaudeStoryResponse['frames'] = JSON.parse(responseText);

    // Convert to StoryFrame format
    const frames: StoryFrame[] = claudeResponse.map((frame, index) => ({
      frameNumber: index + 1,
      backgroundColor: getBackgroundColor(frame.emotion),
      characters: characters.map((char, charIndex) => ({
        characterId: char.characterId,
        position: getCharacterPosition(charIndex, characters.length),
      })),
      text: `${frame.sceneDescription}\n\n"${frame.dialogue}"`,
      emotions: [frame.emotion as any],
      soundDescription: frame.sounds?.join(', '),
      choices: frame.choices,
    }));

    return frames;
  } catch (error) {
    console.error('Error generating story with Claude:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
};

// Helper function to get background color based on emotion
function getBackgroundColor(emotion: string): string {
  const colors: Record<string, string> = {
    happy: '#FEF3C7',
    calm: '#DBEAFE',
    worried: '#FED7AA',
    scared: '#FEE2E2',
    excited: '#FCE7F3',
    sad: '#E0E7FF',
    surprised: '#FEF3C7',
  };
  return colors[emotion] || '#F3F4F6';
}

// Helper function to position characters in the frame
function getCharacterPosition(index: number, total: number): { x: number; y: number } {
  const spacing = 100 / (total + 1);
  return {
    x: spacing * (index + 1),
    y: 50,
  };
}
