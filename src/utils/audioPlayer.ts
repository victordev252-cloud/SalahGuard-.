// Offline Web Audio API Synthesizer for Islamic Adhan and Call to Prayer
// Uses modal scales (Maqam Bayati / Rast tones) & gentle acoustic chimes

let audioCtx: AudioContext | null = null;
let activeSourceNodes: { stop: () => void }[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAdhan(): void {
  for (const node of activeSourceNodes) {
    try {
      node.stop();
    } catch {
      // Ignore already stopped nodes
    }
  }
  activeSourceNodes = [];
}

export function playHapticFeedback(pattern: number[] = [30]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if unsupported
    }
  }
}

export function playGentleTapSound(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    console.warn('Audio feedback failed:', e);
  }
}

export function playAdhan(
  sound: 'makkah' | 'madinah' | 'quds' | 'gentle_chime' = 'makkah',
  onEnded?: () => void
): void {
  stopAdhan();
  try {
    const ctx = getAudioContext();

    if (sound === 'gentle_chime') {
      playGentleChime(ctx, onEnded);
      return;
    }

    // Authentic resonant Takbeer & Adhan melody using Maqam Bayati notes
    // Base frequency tuned to calming D3 / G3
    const baseFreq = sound === 'makkah' ? 146.83 : sound === 'madinah' ? 130.81 : 164.81; // D3, C3, E3

    // Sequence of notes simulating "Allahu Akbar, Allahu Akbar"
    // Frequencies: Base (Tonic), Minor 3rd, 4th, 5th
    const notes = [
      { freq: baseFreq * 1.5, dur: 1.2, delay: 0.1 },  // Al- (A3)
      { freq: baseFreq * 1.68, dur: 1.4, delay: 1.3 }, // -laa- (Bb3)
      { freq: baseFreq * 1.5, dur: 2.0, delay: 2.7 },  // -hu (A3)
      { freq: baseFreq * 1.25, dur: 1.2, delay: 4.8 }, // Ak- (F#3)
      { freq: baseFreq * 1.0, dur: 3.2, delay: 6.0 },  // -bar (D3)

      // Second takbeer
      { freq: baseFreq * 1.5, dur: 1.2, delay: 9.5 },
      { freq: baseFreq * 1.68, dur: 1.4, delay: 10.7 },
      { freq: baseFreq * 1.5, dur: 2.0, delay: 12.1 },
      { freq: baseFreq * 1.25, dur: 1.2, delay: 14.1 },
      { freq: baseFreq * 1.0, dur: 3.8, delay: 15.3 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const nodesToTrack: { stop: () => void }[] = [];

    notes.forEach((n) => {
      const startTime = ctx.currentTime + n.delay;
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Formant-like filter for human vocal resonance
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(n.freq * 2.5, startTime);
      filter.Q.setValueAtTime(2.2, startTime);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.freq, startTime);
      // Subtle vibrato
      osc.frequency.linearRampToValueAtTime(n.freq * 1.01, startTime + n.dur * 0.5);
      osc.frequency.linearRampToValueAtTime(n.freq, startTime + n.dur);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(n.freq * 2, startTime);

      // Warm attack and gentle decay
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.35);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + n.dur);
      oscHarmonic.start(startTime);
      oscHarmonic.stop(startTime + n.dur);

      nodesToTrack.push({
        stop: () => {
          try {
            osc.stop();
            oscHarmonic.stop();
          } catch {}
        },
      });
    });

    activeSourceNodes = nodesToTrack;

    // Trigger onEnded after last note completes (~19.5s)
    setTimeout(() => {
      onEnded?.();
    }, 19500);
  } catch (err) {
    console.error('Failed to play synthesized Adhan:', err);
    onEnded?.();
  }
}

function playGentleChime(ctx: AudioContext, onEnded?: () => void): void {
  const chimes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const nodesToTrack: { stop: () => void }[] = [];

  chimes.forEach((f, idx) => {
    const startTime = ctx.currentTime + idx * 0.6;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 2.6);

    nodesToTrack.push({
      stop: () => {
        try {
          osc.stop();
        } catch {}
      },
    });
  });

  activeSourceNodes = nodesToTrack;
  setTimeout(() => {
    onEnded?.();
  }, 4500);
}
