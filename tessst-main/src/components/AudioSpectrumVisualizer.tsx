import React, { useRef, useEffect } from 'react';

interface AudioSpectrumVisualizerProps {
  isListening: boolean;
}

export default function AudioSpectrumVisualizer({ isListening }: AudioSpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rAFId: number;
    let fallbackAngle = 0;

    // Optional: Setup real microphone analyzer nodes if permitted
    const setupRealAudio = async () => {
      // Avoid if not listening to save CPU cycles
      if (!isListening) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Small size for responsive frequency bars
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('[WebAudio] Mic denied/blocked. Using active simulator wave.');
      }
    };

    setupRealAudio();

    // Canvas size fitting
    canvas.width = canvas.parentElement?.clientWidth || 280;
    canvas.height = 48;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      
      const analyser = analyserRef.current;

      if (isListening) {
        if (analyser && isListening) {
          // 1. Draw Real Audio Spectral Bars
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          const barWidth = (width / bufferLength) * 1.6;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * height * 0.95;

            // Neon cyan gradients matching ChemStation aesthetic
            const p = i / bufferLength;
            ctx.fillStyle = `rgba(34, 211, 238, ${0.45 + p * 0.5})`;
            ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

            // Glowing top dot indicators
            ctx.fillStyle = '#22d3ee';
            ctx.fillRect(x, height - barHeight - 2, barWidth - 1, 2);

            x += barWidth;
          }
        } else {
          // 2. Draw Realistic Fallback Vocal Oscilloscope Waveform
          fallbackAngle += 0.08;
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#06b6d4';
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';

          for (let i = 0; i < width; i++) {
            // Complex multi-sine curve representing human speech harmonics
            const p = i / width;
            const envelope = Math.sin(p * Math.PI); // Pin down borders to zero
            const wave1 = Math.sin(p * 18 + fallbackAngle) * 12;
            const wave2 = Math.cos(p * 35 - fallbackAngle * 1.5) * 6;
            
            const offset = (wave1 + wave2) * envelope;
            const y = height / 2 + offset;

            if (i === 0) {
              ctx.moveTo(i, y);
            } else {
              ctx.lineTo(i, y);
            }
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }
      } else {
        // 3. Draw Silent horizontal scanning scope
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STT MODULE INACTIVE', width / 2, height / 2 + 3);
      }

      rAFId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rAFId);
      
      // Release streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [isListening]);

  return (
    <div className="w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 flex flex-col items-center justify-center relative">
      <canvas ref={canvasRef} className="w-full block" style={{ height: '48px' }} id="voice-spectrum-canvas" />
    </div>
  );
}
