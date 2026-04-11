import { useEffect, useState } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export function GradientBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-white overflow-hidden">
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 1.0, 
        }}
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate="on"
          uSpeed={isMobile ? 0.05 : 0.12}
          uTime={0}
          uAmplitude={isMobile ? 0.4 : 1.2}
          uDensity={isMobile ? 0.2 : 1.0}
          uFrequency={isMobile ? 1.5 : 4.5}
          brightness={1.2}
          color1="#ecfdf5"
          color2="#34d399"
          color3="#10b981"
        />
      </ShaderGradientCanvas>
    </div>
  );
}
