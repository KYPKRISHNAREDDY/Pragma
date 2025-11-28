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
      // Initialize with default templates
      templates = [
        {
          templateId: '1',
          name: 'Morning Arrival at School',
          category: 'school',
          description: 'A story about arriving at school in the morning',
          difficulty: 'easy',
          frameCount: 6,
          requiredCharacters: [],
        },
        {
          templateId: '2',
          name: 'Birthday Party',
          category: 'social',
          description: 'Attending a friend\'s birthday party',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [],
        },
        {
          templateId: '3',
          name: 'Visit to the Dentist',
          category: 'medical',
          description: 'Going to the dentist for a checkup',
          difficulty: 'medium',
          frameCount: 6,
          requiredCharacters: [],
        },
        {
          templateId: '4',
          name: 'Bedtime Routine',
          category: 'routine',
          description: 'Getting ready for bed',
          difficulty: 'easy',
          frameCount: 5,
          requiredCharacters: [],
        },
        {
          templateId: '5',
          name: 'Fire Drill at School',
          category: 'unexpected',
          description: 'What happens during a fire drill',
          difficulty: 'hard',
          frameCount: 7,
          requiredCharacters: [],
        },
        {
          templateId: '6',
          name: 'Lunch in the Cafeteria',
          category: 'school',
          description: 'Eating lunch at school with friends',
          difficulty: 'easy',
          frameCount: 5,
          requiredCharacters: [],
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
