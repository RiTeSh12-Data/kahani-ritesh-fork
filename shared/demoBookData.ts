export interface BookPage {
  id: number;
  content: {
    type: 'cover' | 'story' | 'photo' | 'mixed';
    title?: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    question?: string;
  };
}

export interface DemoBook {
  id: string;
  title: string;
  subtitle: string;
  coverColor: string;
  pages: BookPage[];
}

export const demoBooks: Record<string, DemoBook> = {
  'our-family-history': {
    id: 'our-family-history',
    title: 'Our Family History',
    subtitle: 'Stories from Grandma Rose',
    coverColor: 'from-blue-600 to-blue-800',
    pages: [
      {
        id: 1,
        content: {
          type: 'cover',
          title: 'Our Family History',
          text: 'A collection of cherished memories and stories from Grandma Rose, preserving our family legacy for generations to come.',
        }
      },
      {
        id: 2,
        content: {
          type: 'story',
          question: 'What is your earliest childhood memory?',
          text: 'I remember the smell of fresh bread baking in my mother\'s kitchen. We lived in a small village, and every morning, she would wake up before dawn to prepare bread for the family. The warmth of the oven would fill our entire home. I was maybe four or five years old, and I would sit on a wooden stool, watching her knead the dough with such grace and strength. Those mornings taught me that love is shown through the small, consistent acts we do for those we care about.',
          audioUrl: 'https://example.com/audio/memory1.mp3'
        }
      },
      {
        id: 3,
        content: {
          type: 'photo',
          imageUrl: 'https://images.unsplash.com/photo-1476234251651-f655f8cf5528?w=800&h=600&fit=crop',
          title: 'Family Home, 1952',
          text: 'The old family house where I grew up, surrounded by apple orchards.'
        }
      },
      {
        id: 4,
        content: {
          type: 'story',
          question: 'Tell me about your parents and grandparents.',
          text: 'My father was a carpenter, strong hands that could build anything from a chair to an entire barn. He was a quiet man, but when he spoke, everyone listened. My mother was the heart of our home—always singing, always cooking, always making sure everyone felt loved. My grandmother, whom we called Nonna, lived with us until I was twelve. She would tell us stories about the old country, about her journey across the ocean when she was just sixteen years old. Her courage inspired me throughout my life.',
          audioUrl: 'https://example.com/audio/memory2.mp3'
        }
      },
      {
        id: 5,
        content: {
          type: 'mixed',
          question: 'What family traditions do you cherish most?',
          text: 'Every Sunday, without fail, we would gather for dinner. The whole family—aunts, uncles, cousins—sometimes twenty people around one table. We would eat, laugh, argue about politics, and tell stories late into the evening. My grandmother would always make her special pasta sauce, a recipe that has been passed down through four generations now. I still make it the same way, and every time I do, I feel connected to all those Sunday dinners.',
          imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
          audioUrl: 'https://example.com/audio/memory3.mp3'
        }
      },
      {
        id: 6,
        content: {
          type: 'story',
          question: 'What advice would you give to future generations?',
          text: 'Remember where you came from, but don\'t let it limit where you can go. Honor the past, embrace the present, and have hope for the future. Family is everything—nurture those relationships, forgive quickly, love deeply. And never forget: the most valuable things in life cannot be bought with money. They are the memories you create, the love you share, and the legacy you leave behind.',
          audioUrl: 'https://example.com/audio/memory4.mp3'
        }
      }
    ]
  },
  'their-life-paths': {
    id: 'their-life-paths',
    title: 'Their Life Paths',
    subtitle: 'Career Journey of Papa John',
    coverColor: 'from-amber-600 to-amber-800',
    pages: [
      {
        id: 1,
        content: {
          type: 'cover',
          title: 'Their Life Paths',
          text: 'The remarkable career and life journey of Papa John, from humble beginnings to building a legacy.',
        }
      },
      {
        id: 2,
        content: {
          type: 'story',
          question: 'What was your first job and what did you learn?',
          text: 'My first real job was working at a corner grocery store when I was fourteen. Old Mr. Henderson owned it, and he taught me more than just how to stock shelves and run a cash register. He taught me about integrity, about treating every customer with respect, and about the value of hard work. I would work after school and on weekends, and every penny I earned went into a jar that I kept under my bed. That jar eventually helped pay for my first year of college.',
          audioUrl: 'https://example.com/audio/career1.mp3'
        }
      },
      {
        id: 3,
        content: {
          type: 'photo',
          imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
          title: 'First Day at the Factory, 1968',
          text: 'Starting my career as an engineer at Thompson Manufacturing.'
        }
      },
      {
        id: 4,
        content: {
          type: 'story',
          question: 'Describe a career-defining moment.',
          text: 'In 1975, our factory was facing closure. The company was losing money, and they were going to lay off everyone, including me. But I had an idea for a new production process that could save costs without sacrificing quality. I worked night and day on a proposal, running calculations, building prototypes in my garage. When I presented it to management, they were skeptical at first. But we ran a trial, and it worked better than anyone expected. That proposal not only saved the factory but also got me promoted to lead engineer. It taught me that sometimes taking a risk is the only way forward.',
          audioUrl: 'https://example.com/audio/career2.mp3'
        }
      },
      {
        id: 5,
        content: {
          type: 'mixed',
          question: 'Who mentored you and how did they impact your career?',
          text: 'George Mitchell was my mentor, my boss, and eventually became one of my closest friends. He believed in me when I didn\'t believe in myself. When I made mistakes, he would sit me down and help me understand what went wrong, never with anger, always with patience. He once told me, "John, leadership isn\'t about being the smartest person in the room. It\'s about bringing out the best in everyone around you." That philosophy guided me throughout my entire career.',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
          audioUrl: 'https://example.com/audio/career3.mp3'
        }
      },
      {
        id: 6,
        content: {
          type: 'story',
          question: 'What would you tell your younger professional self?',
          text: 'I would tell myself to be patient. Success doesn\'t happen overnight. I would say, don\'t be afraid to ask for help—nobody succeeds alone. I would remind myself that failures are just lessons in disguise. Most importantly, I would say: remember why you started. It was never about the money or the title. It was about making a difference, about building something that mattered, about providing for your family and leaving the world a little better than you found it.',
          audioUrl: 'https://example.com/audio/career4.mp3'
        }
      }
    ]
  },
  'words-of-wisdom': {
    id: 'words-of-wisdom',
    title: 'Words of Wisdom',
    subtitle: 'Life Lessons from Nana Maria',
    coverColor: 'from-emerald-600 to-emerald-800',
    pages: [
      {
        id: 1,
        content: {
          type: 'cover',
          title: 'Words of Wisdom',
          text: 'Timeless lessons and profound insights from Nana Maria, gathered over nine decades of a life well-lived.',
        }
      },
      {
        id: 2,
        content: {
          type: 'story',
          question: 'What is the most important lesson life has taught you?',
          text: 'Life has taught me that happiness is a choice you make every single day. I\'ve lived through wars, I\'ve lost loved ones, I\'ve faced hardships that seemed impossible to overcome. But I learned that you can choose how you respond to what happens to you. You can choose gratitude over bitterness, hope over despair, love over fear. That choice, made daily, determines the quality of your life more than any external circumstance ever could.',
          audioUrl: 'https://example.com/audio/wisdom1.mp3'
        }
      },
      {
        id: 3,
        content: {
          type: 'photo',
          imageUrl: 'https://images.unsplash.com/photo-1473830394358-91588751b241?w=800&h=600&fit=crop',
          title: 'Garden of Reflection',
          text: 'The garden where I spend my mornings in meditation and gratitude.'
        }
      },
      {
        id: 4,
        content: {
          type: 'story',
          question: 'How do you define a life well-lived?',
          text: 'A life well-lived is measured not by what you accumulate, but by what you give. It\'s measured by the lives you touch, the love you share, the kindness you show to strangers. It\'s about being present for the small moments—a child\'s laughter, a sunset, a quiet cup of tea with a friend. It\'s about facing challenges with courage and treating setbacks as opportunities to grow. Most of all, it\'s about being true to yourself while remaining open to change and growth.',
          audioUrl: 'https://example.com/audio/wisdom2.mp3'
        }
      },
      {
        id: 5,
        content: {
          type: 'mixed',
          question: 'What advice would you give about relationships?',
          text: 'In relationships, whether with family, friends, or a life partner, the most important things are honesty, kindness, and forgiveness. Be honest about your feelings, but always speak with kindness. Forgive quickly—holding grudges only hurts you. Listen more than you speak. Show up for people, especially when it\'s inconvenient. Remember birthdays, celebrate victories, and be present during struggles. Love is a verb—it\'s something you do, every day, through actions small and large.',
          imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
          audioUrl: 'https://example.com/audio/wisdom3.mp3'
        }
      },
      {
        id: 6,
        content: {
          type: 'story',
          question: 'What brings you the most joy in life?',
          text: 'My greatest joy comes from simple things. Watching my grandchildren play and knowing they feel safe and loved. Tending to my garden and seeing new life emerge from tiny seeds. Sharing a meal with family and hearing everyone\'s stories from the week. Reading a good book on a quiet afternoon. Helping someone who needs it. These moments, these ordinary, beautiful moments—they are what life is truly about. Everything else is just noise.',
          audioUrl: 'https://example.com/audio/wisdom4.mp3'
        }
      }
    ]
  }
};
