import { useEffect, useRef } from "react";
import { AudioSettings, AudioControls, SCALES } from "../types";
import {
  getFrequency,
  getAudioContext,
  resumeAudioContext,
} from "../utils/audio";

export const useAudioEngine = (settings: AudioSettings): AudioControls => {
  const { waveform, scale, baseOctave, volume, maxSustainDuration } = settings;

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentOscillatorRef = useRef<OscillatorNode | null>(null);
  const currentGainNodeRef = useRef<GainNode | null>(null);
  const lastNoteIndexRef = useRef<number>(-1);
  const sustainStartTimeRef = useRef<number>(0);
  const sustainTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioContextRef.current = getAudioContext();

    return () => {
      if (sustainTimerRef.current) {
        clearTimeout(sustainTimerRef.current);
      }
      if (currentOscillatorRef.current) {
        currentOscillatorRef.current.stop();
      }
    };
  }, []);

  const stopCurrentTone = () => {
    if (sustainTimerRef.current) {
      clearTimeout(sustainTimerRef.current);
      sustainTimerRef.current = null;
    }

    if (
      currentOscillatorRef.current &&
      currentGainNodeRef.current &&
      audioContextRef.current
    ) {
      const now = audioContextRef.current.currentTime;
      const releaseTime = 0.2;

      currentGainNodeRef.current.gain.cancelScheduledValues(now);
      currentGainNodeRef.current.gain.setValueAtTime(
        currentGainNodeRef.current.gain.value,
        now
      );
      currentGainNodeRef.current.gain.linearRampToValueAtTime(
        0,
        now + releaseTime
      );

      currentOscillatorRef.current.stop(now + releaseTime);

      currentOscillatorRef.current = null;
      currentGainNodeRef.current = null;
    }
  };

  const playNote = (
    noteIndex: number,
    priceChangeMagnitude: number = 0,
    sustain: boolean = false
  ) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const currentScale = SCALES[scale];
    const scaleIndex = noteIndex % currentScale.length;
    const semitones = currentScale[scaleIndex];

    const baseFreq = 261.63 * Math.pow(2, baseOctave - 4);
    const frequency = getFrequency(baseFreq, semitones);

    if (
      sustain &&
      noteIndex === lastNoteIndexRef.current &&
      currentOscillatorRef.current
    ) {
      return;
    }

    stopCurrentTone();
    const oscillator = ctx.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, now);

    const gainNode = ctx.createGain();
    const volumeMultiplier = Math.min(1 + priceChangeMagnitude * 0.5, 2);
    const maxVolume = Math.min(volume * volumeMultiplier, 1);

    const attackTime = 0.05;
    const decayTime = 0.1;
    const sustainLevel = maxVolume * 0.7;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attackTime + decayTime
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);

    if (sustain) {
      currentOscillatorRef.current = oscillator;
      currentGainNodeRef.current = gainNode;
      lastNoteIndexRef.current = noteIndex;
      sustainStartTimeRef.current = Date.now();

      if (sustainTimerRef.current) {
        clearTimeout(sustainTimerRef.current);
      }

      sustainTimerRef.current = setTimeout(() => {
        stopCurrentTone();
      }, maxSustainDuration);
    } else {
      const releaseTime = 0.3;
      gainNode.gain.setValueAtTime(sustainLevel, now + 0.5 - releaseTime);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      oscillator.stop(now + 0.5);
    }
  };

  const enableAudio = async (): Promise<boolean> => {
    return await resumeAudioContext();
  };

  return {
    playNote,
    enableAudio,
  };
};
