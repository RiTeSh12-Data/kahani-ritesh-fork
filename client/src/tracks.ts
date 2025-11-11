import coverImage from "@assets/Generated Image November 08, 2025 - 8_27PM_1762623023120.png";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

export type Track = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
};

export const ALBUM = {
  title: "Memories of Home",
  artist: "Grandma Asha",
  coverSrc: coverImage,
  logoSrc: kahaniLogo,
};

export const TRACKS: Track[] = [
  {
    id: "t1",
    title: "First Day of School",
    artist: "Grandma Asha",
    audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav",
  },
  {
    id: "t2",
    title: "How We Celebrated Diwali",
    artist: "Grandma Asha",
    audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch3.wav",
  },
  {
    id: "t3",
    title: "My Favorite Song",
    artist: "Grandma Asha",
    audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
  },
];
