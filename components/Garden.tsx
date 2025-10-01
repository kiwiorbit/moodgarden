import React from 'react';

interface GardenProps {
  level: number;
}

const GardenElement: React.FC<{ children: React.ReactNode, show: boolean, className?: string, style?: React.CSSProperties }> = ({ children, show, className, style }) => {
  return (
    <div className={`transition-all duration-700 absolute ${className} ${show ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-15'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', ...style }}>
      {children}
    </div>
  );
};

export const Garden: React.FC<GardenProps> = ({ level }) => {
  return (
    <div className="w-full h-full bg-sky-400 shadow-2xl overflow-hidden relative flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-300 via-sky-400 to-blue-500"></div>
      
      {/* Clouds */}
      <div className="absolute top-1/4 -left-1/4 w-32 h-20 bg-white/70 rounded-full filter blur-sm animate-drift-slow opacity-80"></div>
      <div className="absolute top-1/3 -right-1/4 w-48 h-24 bg-white/60 rounded-full filter blur-md animate-drift-fast opacity-70"></div>
      <div className="absolute top-1/4 left-1/4 w-24 h-16 bg-white/60 rounded-full filter blur-sm animate-drift-medium opacity-60"></div>


      <GardenElement show={level >= 6} className="top-8 right-12 text-5xl">
        <div className="animate-sun-glow">☀️</div>
      </GardenElement>

      {/* Ground layers */}
      <div className="absolute bottom-0 left-[-20%] right-[-20%] h-1/2 bg-green-500 rounded-t-full"></div>
      <div className="absolute bottom-[-5%] left-[-10%] right-[-10%] h-1/3 bg-green-600 rounded-t-full"></div>
      <div className="absolute bottom-[-10%] left-0 right-0 h-1/4 bg-green-700 rounded-t-full"></div>


      {/* Main Garden elements */}
      <div className="relative w-full h-full flex items-center justify-center">
        <GardenElement show={level >= 0} className="bottom-1/4 text-4xl" style={{ transformOrigin: 'bottom center' }}>
           <div className="transform -translate-x-12 origin-bottom animate-gentle-sway">🌱</div>
        </GardenElement>

        <GardenElement show={level >= 1} className="bottom-1/4 -translate-x-12 text-6xl" style={{ transformOrigin: 'bottom center' }}>
           <div className="origin-bottom animate-medium-sway">🌿</div>
        </GardenElement>

        <GardenElement show={level >= 2} className="bottom-1/4 -translate-x-12 text-8xl" style={{ transformOrigin: 'bottom center' }}>
            <div className="origin-bottom animate-medium-sway">🌸</div>
        </GardenElement>
        
        <GardenElement show={level >= 3} className="bottom-1/4 -translate-x-12 text-8xl" style={{ transformOrigin: 'bottom center' }}>
            <div className="origin-bottom animate-medium-sway text-pink-400">🌺</div>
        </GardenElement>

        <GardenElement show={level >= 4} className="top-1/3 left-1/4 text-4xl">
           <div className="animate-flutter">🦋</div>
        </GardenElement>
        
        <GardenElement show={level >= 5} className="bottom-1/4 translate-x-16 text-7xl" style={{ transformOrigin: 'bottom center' }}>
            <div className="origin-bottom animate-gentle-sway-delay text-purple-400">🌷</div>
        </GardenElement>
        
        <GardenElement show={level >= 7} className="bottom-1/4 translate-x-32 text-8xl" style={{ transformOrigin: 'bottom center' }}>
            <div className="origin-bottom animate-medium-sway text-red-500">🌻</div>
        </GardenElement>
         <GardenElement show={level >= 7} className="bottom-1/4 -translate-x-32 text-9xl" style={{ transformOrigin: 'bottom center' }}>
            <div className="origin-bottom animate-gentle-sway text-blue-400">🌼</div>
        </GardenElement>
      </div>

       <style>{`
          @keyframes gentle-sway { 0%, 100% { transform: rotate(-3deg) translateX(-2px); } 50% { transform: rotate(3deg) translateX(2px); } }
          .animate-gentle-sway { animation: gentle-sway 5s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
          
          @keyframes medium-sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
          .animate-medium-sway { animation: medium-sway 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
          
          .animate-gentle-sway-delay { animation: gentle-sway 6s cubic-bezier(0.45, 0, 0.55, 1) infinite 0.5s; }

          @keyframes flutter { 
            0%   { transform: translate(0, 0) rotate(15deg) scale(1); }
            20%  { transform: translate(25px, -35px) rotate(-10deg) scale(1.05); }
            40%  { transform: translate(40px, -20px) rotate(20deg) scale(1); }
            60%  { transform: translate(20px, 20px) rotate(-15deg) scale(0.95); }
            80%  { transform: translate(-15px, -30px) rotate(10deg) scale(1); }
            100% { transform: translate(0, 0) rotate(15deg) scale(1); }
           }
          .animate-flutter { animation: flutter 12s ease-in-out infinite; }
          
          @keyframes sun-glow { 
            0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 10px #fef08a); }
            50% { transform: scale(1.1) rotate(5deg); filter: drop-shadow(0 0 20px #fef08a); }
          }
          .animate-sun-glow { animation: sun-glow 8s ease-in-out infinite; }

          @keyframes drift-slow { 0% { transform: translateX(-100%); } 100% { transform: translateX(500%); } }
          .animate-drift-slow { animation: drift-slow 80s linear infinite; }
          
          @keyframes drift-medium { 0% { transform: translateX(-150%); } 100% { transform: translateX(400%); } }
          .animate-drift-medium { animation: drift-medium 60s linear infinite 5s; }

          @keyframes drift-fast { 0% { transform: translateX(400%); } 100% { translateX(-150%); } }
          .animate-drift-fast { animation: drift-fast 50s linear infinite 2s; }
       `}</style>
    </div>
  );
};