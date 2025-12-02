// Local Storage Service - replaces Supabase
export interface User {
  userId: string;
  email: string;
  role: 'parent' | 'teacher';
  createdAt: string;
}

export interface Child {
  childId: string;
  parentId: string;
  name: string;
  age: number;
  photoUrl: string;
  sensorySettings: {
    soundTolerance: number;
    crowdComfort: number;
    preferredPace: 'slow' | 'medium' | 'fast';
    visualBrightness: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  characterId: string;
  childId: string;
  name: string;
  relationship: string;
  photoUrl: string;
  createdAt: string;
}

export interface Story {
  storyId: string;
  childId: string;
  templateId: string;
  title: string;
  description: string;
  frames: any[];
  createdBy: string;
  createdAt: string;
  lastViewedAt?: string;
  isFavorite?: boolean;
  completionCount: number;
}

export interface StoryTemplate {
  templateId: string;
  name: string;
  category: 'school' | 'social' | 'medical' | 'routine' | 'unexpected';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frameCount: number;
  requiredCharacters: any[];
}

class LocalStorageService {
  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Auth methods
  getCurrentUser(): User | null {
    return this.getItem<User>('currentUser');
  }

  login(email: string, _password: string): User | null {
    const users = this.getItem<User[]>('users') || [];
    const user = users.find(u => u.email === email);
    if (user) {
      this.setItem('currentUser', user);
      return user;
    }
    return null;
  }

  register(email: string, _password: string, role: 'parent' | 'teacher'): User {
    const users = this.getItem<User[]>('users') || [];
    const newUser: User = {
      userId: Date.now().toString(),
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.setItem('users', users);
    this.setItem('currentUser', newUser);
    return newUser;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Children methods
  getChildren(parentId: string): Child[] {
    const children = this.getItem<Child[]>('children') || [];
    return children.filter(c => c.parentId === parentId);
  }

  getChild(childId: string): Child | null {
    const children = this.getItem<Child[]>('children') || [];
    return children.find(c => c.childId === childId) || null;
  }

  addChild(child: Omit<Child, 'childId' | 'createdAt' | 'updatedAt'>): Child {
    const children = this.getItem<Child[]>('children') || [];
    const newChild: Child = {
      ...child,
      childId: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    children.push(newChild);
    this.setItem('children', children);
    return newChild;
  }

  // Characters methods
  getCharacters(childId: string): Character[] {
    const characters = this.getItem<Character[]>('characters') || [];
    return characters.filter(c => c.childId === childId);
  }

  addCharacter(character: Omit<Character, 'characterId' | 'createdAt'>): Character {
    const characters = this.getItem<Character[]>('characters') || [];
    const newCharacter: Character = {
      ...character,
      characterId: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    characters.push(newCharacter);
    this.setItem('characters', characters);
    return newCharacter;
  }

  // Stories methods
  getStories(childId: string): Story[] {
    const stories = this.getItem<Story[]>('stories') || [];
    return stories.filter(s => s.childId === childId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getStory(storyId: string): Story | null {
    const stories = this.getItem<Story[]>('stories') || [];
    return stories.find(s => s.storyId === storyId) || null;
  }

  addStory(story: Omit<Story, 'storyId' | 'createdAt' | 'completionCount'>): Story {
    const stories = this.getItem<Story[]>('stories') || [];
    const newStory: Story = {
      ...story,
      storyId: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completionCount: 0,
    };
    stories.push(newStory);
    this.setItem('stories', stories);
    return newStory;
  }

  updateStory(storyId: string, updates: Partial<Story>): void {
    const stories = this.getItem<Story[]>('stories') || [];
    const index = stories.findIndex(s => s.storyId === storyId);
    if (index !== -1) {
      stories[index] = { ...stories[index], ...updates };
      this.setItem('stories', stories);
    }
  }

  // Templates
  getTemplates(): StoryTemplate[] {
    let templates = this.getItem<StoryTemplate[]>('templates');
    if (!templates) {
      // Initialize with 12 DEMO TEMPLATES - All with required photos!
      templates = [
        {
          templateId: '1',
          name: 'Morning Arrival at School',
          category: 'school',
          description: 'Arriving at school, greeting teacher, finding desk',
          difficulty: 'easy',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent dropping off' },
            { role: 'teacher', description: 'Classroom teacher' },
          ],
        },
        {
          templateId: '2',
          name: 'Birthday Party Adventure',
          category: 'social',
          description: 'Celebrating birthday with games and cake',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent accompanying' },
            { role: 'friend', description: 'Birthday friend' },
          ],
        },
        {
          templateId: '3',
          name: 'Visit to the Dentist',
          category: 'medical',
          description: 'Dentist checkup - sitting in chair, opening mouth',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent for support' },
            { role: 'guide', description: 'Dentist' },
          ],
        },
        {
          templateId: '4',
          name: 'Bedtime Routine',
          category: 'routine',
          description: 'Bath, pajamas, story, sleep',
          difficulty: 'easy',
          frameCount: 5,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent helping' },
          ],
        },
        {
          templateId: '5',
          name: 'Fire Drill at School',
          category: 'unexpected',
          description: 'Alarm rings, line up, exit safely',
          difficulty: 'hard',
          frameCount: 7,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'teacher', description: 'Teacher leading' },
            { role: 'friend', description: 'Classmate' },
          ],
        },
        {
          templateId: '6',
          name: 'Lunch in the Cafeteria',
          category: 'school',
          description: 'Getting food, finding seat, eating',
          difficulty: 'easy',
          frameCount: 5,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'friend', description: 'Lunch buddy' },
          ],
        },
        {
          templateId: '7',
          name: 'Visit to the Barber Shop',
          category: 'routine',
          description: 'Getting haircut in big chair',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
            { role: 'guide', description: 'Barber' },
          ],
        },
        {
          templateId: '8',
          name: 'Doctor Visit for Checkup',
          category: 'medical',
          description: 'Routine checkup - height, weight, heart',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
            { role: 'guide', description: 'Doctor' },
          ],
        },
        {
          templateId: '9',
          name: 'First Day at New School',
          category: 'school',
          description: 'Meeting new teacher, finding classroom',
          difficulty: 'hard',
          frameCount: 7,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
            { role: 'teacher', description: 'New teacher' },
          ],
        },
        {
          templateId: '10',
          name: 'Playdate at Friend\'s House',
          category: 'social',
          description: 'Playing games, snack time',
          difficulty: 'easy',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
            { role: 'friend', description: 'Friend' },
          ],
        },
        {
          templateId: '11',
          name: 'Shopping at Grocery Store',
          category: 'routine',
          description: 'Pushing cart, choosing items, checkout',
          difficulty: 'easy',
          frameCount: 6,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
          ],
        },
        {
          templateId: '12',
          name: 'Going to the Library',
          category: 'social',
          description: 'Choosing books, quiet voices, checkout',
          difficulty: 'easy',
          frameCount: 5,
          requiredCharacters: [
            { role: 'child', description: 'Your child' },
            { role: 'parent', description: 'Parent' },
            { role: 'guide', description: 'Librarian' },
          ],
        },
      ];
      this.setItem('templates', templates);
    }
    return templates;
  }

  getTemplate(templateId: string): StoryTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.templateId === templateId) || null;
  }
}

export const localDB = new LocalStorageService();
