export interface AlbumQuestions {
  [albumName: string]: string[];
}

export const albumQuestions: AlbumQuestions = {
  "Our Family History": [
    "When you think of your childhood home, what picture or feeling comes to mind first?",
    "Did your family have any small traditions or habits that made your days special?",
    "Which dishes instantly take you back to your childhood, and who used to make them?",
    "What was your neighborhood like when you were growing up?",
    "Who were your childhood friends, and what games did you play together?",
    "What was school like for you as a child?",
    "Did you have a favorite teacher or mentor who influenced you?",
    "What festivals or celebrations did your family observe?",
    "What stories did your parents or grandparents tell you about their own childhoods?",
    "What was your relationship like with your siblings or cousins?",
    "Were there any family heirlooms or treasures that were important to your family?",
    "What kind of music or entertainment did your family enjoy together?",
    "Did your family face any hardships when you were young, and how did you overcome them?",
    "What values did your parents emphasize most when raising you?",
    "Is there a family story that has been passed down through generations?"
  ],
  "Their Life Paths": [
    "What was your first job, and how did you feel earning your first income?",
    "What were your dreams when you were young, and how did they change with time?",
    "Was there a mistake that ended up teaching you something important?",
    "How did you meet your life partner, and what drew you to them?",
    "What was the proudest moment of your career or work life?",
    "Have you ever taken a risk that completely changed your life's direction?",
    "What was the most difficult decision you ever had to make?",
    "Who has been your greatest source of support throughout your life?",
    "What accomplishment are you most proud of?",
    "If you could go back and give your younger self advice, what would it be?",
    "What was a turning point in your life that shaped who you became?",
    "How did you handle setbacks or failures along the way?",
    "What traditions or practices have you carried forward from your own upbringing?",
    "What unexpected joy or surprise has life brought you?",
    "How has your definition of success changed over the years?"
  ],
  "Words of Wisdom": [
    "What lesson from your parents has stayed with you through life?",
    "Have you ever experienced a complete change in your beliefs or outlook?",
    "How have your personal or spiritual beliefs guided your path?",
    "What do you think is the secret to a happy life?",
    "What would you like future generations to know about living a meaningful life?",
    "What does love mean to you, and how has that understanding evolved?",
    "What do you consider your greatest strength, and how did you develop it?",
    "If you could share one piece of wisdom with the world, what would it be?",
    "What brings you the most peace and contentment in life?",
    "How do you want to be remembered by those you love?",
    "What role has forgiveness played in your life?",
    "What do you think is most important when raising a family?",
    "What advice would you give about handling difficult times?",
    "What do you believe makes a relationship strong and lasting?",
    "Looking back on your life, what matters most to you now?"
  ],
  "Love & Relationships": [
    "How did you know you had found the right person to spend your life with?",
    "What is the most important lesson you've learned about love?",
    "How has your understanding of relationships changed over the years?",
    "What advice would you give to someone about building lasting relationships?"
  ]
};

export function getQuestionsForAlbum(albumName: string): string[] {
  return albumQuestions[albumName] || [];
}

export function getQuestionByIndex(albumName: string, index: number): string | undefined {
  const questions = getQuestionsForAlbum(albumName);
  return questions[index];
}

export function getTotalQuestionsForAlbum(albumName: string): number {
  return getQuestionsForAlbum(albumName).length;
}
