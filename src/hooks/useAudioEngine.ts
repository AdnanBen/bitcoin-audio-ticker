import { useEffect, useRef } from "react";
import { AudioSettings, AudioControls, SCALES, EnvelopeSpeed } from "../types";
import {
  getFrequency,
  getAudioContext,
  resumeAudioContext,
} from "../utils/audio";

export const useAudioEngine = (settings: AudioSettings): AudioControls => {
  const {
    waveform,
    scale,
    baseOctave,
    volume,
    maxSustainDuration,
    reverb,
    envelopeSpeed,
    pitchShift,
    sustainDepth,
    polyphony
  } = settings;

  const audioContextRef = useRef<AudioContext | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);

  const currentOscillatorRef = useRef<OscillatorNode | null>(null);
  const currentGainNodeRef = useRef<GainNode | null>(null);
  const lastNoteIndexRef = useRef<number>(-1);
  const sustainStartTimeRef = useRef<number>(0);
  const sustainTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Polyphony support
  const harmonyOscillatorsRef = useRef<OscillatorNode[]>([]);
  const harmonyGainNodesRef = useRef<GainNode[]>([]);

  const getEnvelopeTimes = (speed: EnvelopeSpeed) => {
    switch (speed) {
      case "snappy":
        return { attack: 0.01, decay: 0.05, release: 0.1 };
      case "smooth":
        return { attack: 0.2, decay: 0.15, release: 0.5 };
      default: // "normal"
        return { attack: 0.05, decay: 0.1, release: 0.2 };
    }
  };

  useEffect(() => {
    audioContextRef.current = getAudioContext();

    // Create reverb node using a simple delay-based reverb
    const ctx = audioContextRef.current;
    const reverbNode = ctx.createConvolver();
    const reverbGain = ctx.createGain();

    // Create impulse response for reverb
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 2; // 2 second reverb
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    reverbNode.buffer = impulse;
    reverbNode.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    reverbNodeRef.current = reverbNode;
    reverbGainRef.current = reverbGain;

    return () => {
      if (sustainTimerRef.current) {
        clearTimeout(sustainTimerRef.current);
      }
      if (currentOscillatorRef.current) {
        currentOscillatorRef.current.stop();
      }
      harmonyOscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
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
      const { release } = getEnvelopeTimes(envelopeSpeed);

      currentGainNodeRef.current.gain.cancelScheduledValues(now);
      currentGainNodeRef.current.gain.setValueAtTime(
        currentGainNodeRef.current.gain.value,
        now
      );
      currentGainNodeRef.current.gain.linearRampToValueAtTime(
        0,
        now + release
      );

      currentOscillatorRef.current.stop(now + release);

      currentOscillatorRef.current = null;
      currentGainNodeRef.current = null;
    }

    // Stop harmony oscillators
    harmonyOscillatorsRef.current.forEach((osc, i) => {
      const gainNode = harmonyGainNodesRef.current[i];
      if (osc && gainNode && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        const { release } = getEnvelopeTimes(envelopeSpeed);

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + release);

        try {
          osc.stop(now + release);
        } catch (e) {
          // Already stopped
        }
      }
    });

    harmonyOscillatorsRef.current = [];
    harmonyGainNodesRef.current = [];
  };

  const playNote = (
    noteIndex: number,
    priceChangeMagnitude: number = 0,
    sustain: boolean = false
  ) => {
    if (!audioContextRef.current || !reverbNodeRef.current || !reverbGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const currentScale = SCALES[scale];
    const scaleIndex = noteIndex % currentScale.length;
    const semitones = currentScale[scaleIndex];

    const baseFreq = 261.63 * Math.pow(2, baseOctave - 4);
    const frequency = getFrequency(baseFreq, semitones) * pitchShift;

    if (
      sustain &&
      noteIndex === lastNoteIndexRef.current &&
      currentOscillatorRef.current
    ) {
      return;
    }

    stopCurrentTone();

    // Get envelope times based on speed setting
    const { attack, decay, release } = getEnvelopeTimes(envelopeSpeed);

    // Set reverb amount
    reverbGainRef.current.gain.setValueAtTime(reverb, now);

    // Create main oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, now);

    const gainNode = ctx.createGain();
    const volumeMultiplier = Math.min(1 + priceChangeMagnitude * 0.5, 2);
    const maxVolume = Math.min(volume * volumeMultiplier, 1);

    const sustainLevel = maxVolume * sustainDepth;

    // ADSR envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + attack);
    gainNode.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attack + decay
    );

    // Create dry/wet mix for reverb
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();

    dryGain.gain.setValueAtTime(1 - reverb, now);
    wetGain.gain.setValueAtTime(reverb, now);

    oscillator.connect(gainNode);
    gainNode.connect(dryGain);
    dryGain.connect(ctx.destination);

    gainNode.connect(wetGain);
    wetGain.connect(reverbNodeRef.current!);

    oscillator.start(now);

    // Handle polyphony modes
    if (polyphony === "harmony" || polyphony === "chord") {
      const intervals = polyphony === "harmony" ? [7] : [4, 7]; // Fifth for harmony, major triad for chord

      intervals.forEach((interval) => {
        const harmonyOsc = ctx.createOscillator();
        harmonyOsc.type = waveform;
        harmonyOsc.frequency.setValueAtTime(frequency * Math.pow(2, interval / 12), now);

        const harmonyGain = ctx.createGain();
        const harmonyVolume = maxVolume * 0.5; // Quieter harmony notes
        const harmonySustainLevel = harmonyVolume * sustainDepth;

        harmonyGain.gain.setValueAtTime(0, now);
        harmonyGain.gain.linearRampToValueAtTime(harmonyVolume, now + attack);
        harmonyGain.gain.linearRampToValueAtTime(
          harmonySustainLevel,
          now + attack + decay
        );

        const harmonyDryGain = ctx.createGain();
        const harmonyWetGain = ctx.createGain();

        harmonyDryGain.gain.setValueAtTime(1 - reverb, now);
        harmonyWetGain.gain.setValueAtTime(reverb, now);

        harmonyOsc.connect(harmonyGain);
        harmonyGain.connect(harmonyDryGain);
        harmonyDryGain.connect(ctx.destination);

        harmonyGain.connect(harmonyWetGain);
        harmonyWetGain.connect(reverbNodeRef.current!);

        harmonyOsc.start(now);

        harmonyOscillatorsRef.current.push(harmonyOsc);
        harmonyGainNodesRef.current.push(harmonyGain);
      });
    }

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
      const noteLength = 0.5;
      gainNode.gain.setValueAtTime(sustainLevel, now + noteLength - release);
      gainNode.gain.linearRampToValueAtTime(0, now + noteLength);
      oscillator.stop(now + noteLength);

      // Stop harmony oscillators for non-sustain notes
      harmonyOscillatorsRef.current.forEach((harmonyOsc, i) => {
        const harmonyGain = harmonyGainNodesRef.current[i];
        const harmonySustainLevel = harmonyGain.gain.value;

        harmonyGain.gain.setValueAtTime(harmonySustainLevel, now + noteLength - release);
        harmonyGain.gain.linearRampToValueAtTime(0, now + noteLength);
        harmonyOsc.stop(now + noteLength);
      });

      if (!sustain) {
        harmonyOscillatorsRef.current = [];
        harmonyGainNodesRef.current = [];
      }
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
