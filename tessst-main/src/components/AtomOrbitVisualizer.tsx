import React, { useRef, useEffect } from 'react';

interface AtomOrbitVisualizerProps {
  elementNumber: number;
  elementSymbol: string;
  elementName: string;
}

export default function AtomOrbitVisualizer({ elementNumber, elementSymbol, elementName }: AtomOrbitVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate electron shells configuration using classic Bohr Model guidelines
  // Shell capacities: K=2, L=8, M=18, N=32, O=18, P=8
  const getShellDistribution = (num: number): number[] => {
    const shells: number[] = [];
    let remaining = num;
    const capacities = [2, 8, 18, 32, 18, 18, 8];

    for (let i = 0; i < capacities.length; i++) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, capacities[i]);
      shells.push(count);
      remaining -= count;
    }
    return shells;
  };

  const shellsArr = getShellDistribution(elementNumber);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rAFId: number;
    let angle = 0;

    // Nuclear particle coordinates (Protons and Neutrons clustered)
    const nucleusParticles: { x: number; y: number; z: number; isProton: boolean; radius: number; color: string }[] = [];
    const numNucleus = Math.max(8, Math.min(elementNumber, 45)); // Cap visually to protect rendering
    
    for (let i = 0; i < numNucleus; i++) {
      const isProton = Math.random() > 0.48;
      // Spherical random coordinate distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.random() * 16 + 4; // nucleus radius bounds
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      nucleusParticles.push({
        x, y, z,
        isProton,
        radius: Math.random() * 3.5 + 2.5,
        color: isProton ? '#ef4444' : '#3b82f6' // Red Protons, Blue Neutrons
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 280;
      }
    });
    
    if (canvas.parentElement) {
       resizeObserver.observe(canvas.parentElement);
    }

    // Set initial size
    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = 280;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      angle += 0.015;

      // Draw futuristic orbital scanning grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.lineWidth = 1;
      for (let w = 40; w < canvas.width; w += 40) {
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, canvas.height);
        ctx.stroke();
      }
      for (let h = 40; h < canvas.height; h += 40) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(canvas.width, h);
        ctx.stroke();
      }

      // Draw radar scanners indicators
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
      ctx.stroke();

      // 1. Draw Simulated central Nucleus with 3D Z-sorting
      nucleusParticles.sort((a, b) => a.z - b.z);
      nucleusParticles.forEach((p) => {
        // Simple rotation model
        const cosAngle = Math.cos(angle * 0.2);
        const sinAngle = Math.sin(angle * 0.2);
        const rotX = p.x * cosAngle - p.z * sinAngle;
        const rotZ = p.x * sinAngle + p.z * cosAngle;

        // Apply depth factor
        const depth = (rotZ + 30) / 60; // 0 to 1
        const opacity = 0.3 + depth * 0.6;
        const scaleRadius = p.radius * (0.8 + depth * 0.4);

        const radialGradient = ctx.createRadialGradient(
          centerX + rotX - scaleRadius * 0.3,
          centerY + p.y - scaleRadius * 0.3,
          scaleRadius * 0.1,
          centerX + rotX,
          centerY + p.y,
          scaleRadius
        );

        if (p.isProton) {
          radialGradient.addColorStop(0, '#fca5a5');
          radialGradient.addColorStop(0.3, '#ef4444');
          radialGradient.addColorStop(1, '#7f1d1d');
        } else {
          radialGradient.addColorStop(0, '#93c5fd');
          radialGradient.addColorStop(0.3, '#3b82f6');
          radialGradient.addColorStop(1, '#1e3a8a');
        }

        ctx.fillStyle = radialGradient;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(centerX + rotX, centerY + p.y, scaleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 2. Render Bohr concentric energy Shell orbits and revolving glowing electrons
      shellsArr.forEach((electronCount, shellIndex) => {
        const shellRadius = 38 + (shellIndex * 24);
        const shellSpeed = 0.8 / (shellIndex + 1); // Inner shells rotate faster

        // Draw isometric projection orbital ellipse
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, shellRadius, shellRadius * 0.5, (shellIndex * 26 * Math.PI) / 180, 0, Math.PI * 2);
        ctx.stroke();

        // Draw electrons revolving on this orbit ring
        for (let e = 0; e < electronCount; e++) {
          const spacing = (Math.PI * 2) / electronCount;
          const eAngle = angle * shellSpeed + e * spacing;

          // Trigonometry of rotated ellipse coordinates
          const localX = shellRadius * Math.cos(eAngle);
          const localY = (shellRadius * 0.5) * Math.sin(eAngle);
          
          // Apply tilt transformation
          const tiltRad = (shellIndex * 26 * Math.PI) / 180;
          const mapX = centerX + localX * Math.cos(tiltRad) - localY * Math.sin(tiltRad);
          const mapY = centerY + localX * Math.sin(tiltRad) + localY * Math.cos(tiltRad);

          // Draw electron tail particles glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#06b6d4';
          ctx.fillStyle = '#22d3ee';
          
          ctx.beginPath();
          ctx.arc(mapX, mapY, 3.2, 0, Math.PI * 2);
          ctx.fill();

          // Reset shadows
          ctx.shadowBlur = 0;
        }
      });

      // Overlay text metadata on the bottom of visualizer
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ATOMIC MODEL: ${elementName.toUpperCase()} (Z=${elementNumber})`, centerX, canvas.height - 15);
      
      ctx.fillStyle = '#0ea5e9';
      ctx.font = '8px monospace';
      ctx.fillText(`SHELLS: [${shellsArr.join('-')}] • ELECTRONS: ${elementNumber}`, centerX, canvas.height - 5);

      rAFId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rAFId);
      resizeObserver.disconnect();
    };
  }, [elementNumber, elementSymbol, elementName, shellsArr]);

  return (
    <div className="w-full h-[280px] rounded-xl border border-slate-800 bg-slate-950/75 relative overflow-hidden flex items-center justify-center">
      {/* Visual scanning lines overlay */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-500/10 animate-pulse pointer-events-none" />
      
      <canvas ref={canvasRef} className="w-full h-full block" id="orbital-atom-canvas" />

      {/* Futuristic scanning labels */}
      <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest flex items-center space-x-1 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
        <span>3D ORBITAL SIM: ACTIVE</span>
      </div>
    </div>
  );
}
