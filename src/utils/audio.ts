export const getFrequency = (baseFreq: number, semitones: number): number => {
  return baseFreq * Math.pow(2, semitones / 12);
};

let audioContextInstance: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioContextInstance) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    audioContextInstance = new AudioContextClass();
  }
  return audioContextInstance;
};

export const resumeAudioContext = async (): Promise<boolean> => {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch (error) {
      console.error("Failed to resume AudioContext:", error);
      return false;
    }
  }
  return ctx.state === "running";
};

export const getAudioContextState = (): AudioContextState => {
  const ctx = getAudioContext();
  return ctx.state;
};
