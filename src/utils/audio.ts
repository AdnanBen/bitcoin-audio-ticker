export const getFrequency = (baseFreq: number, semitones: number): number => {
  return baseFreq * Math.pow(2, semitones / 12);
};

export const getAudioContext = (): AudioContext => {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
};
