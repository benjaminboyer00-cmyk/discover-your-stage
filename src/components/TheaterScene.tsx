import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import friendshipDrawing from '@/assets/friendship-drawing.png';

interface TheaterSceneProps {
  onComplete: () => void;
}

const sceneTexts = [
  "Dans un monde où les couleurs dansent...",
  "Deux âmes se sont trouvées...",
  "Différentes mais complémentaires...",
  "Unies par un lien invisible...",
  "Une amitié qui transcende tout...",
];

export const TheaterScene = ({ onComplete }: TheaterSceneProps) => {
  const [currentText, setCurrentText] = useState(0);
  const [showDrawing, setShowDrawing] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);

  useEffect(() => {
    // Ouvrir les rideaux après un court délai
    const curtainTimer = setTimeout(() => {
      setCurtainsOpen(true);
    }, 1000);

    return () => clearTimeout(curtainTimer);
  }, []);

  useEffect(() => {
    if (!curtainsOpen) return;

    const textTimer = setInterval(() => {
      setCurrentText(prev => {
        if (prev < sceneTexts.length - 1) {
          return prev + 1;
        } else {
          clearInterval(textTimer);
          setTimeout(() => setShowDrawing(true), 2000);
          return prev;
        }
      });
    }, 4000);

    return () => clearInterval(textTimer);
  }, [curtainsOpen]);

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden">
      {/* Spotify Embed */}
      <div className="absolute top-4 right-4 z-50">
        <iframe
          src="https://open.spotify.com/embed/track/3jhyw60F61gc7nC4dblqtC?utm_source=generator&theme=0"
          width="300"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        />
      </div>

      {/* Rideaux */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full curtain z-40"
        initial={{ x: 0 }}
        animate={{ x: curtainsOpen ? '-100%' : 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full curtain z-40"
        initial={{ x: 0 }}
        animate={{ x: curtainsOpen ? '100%' : 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Scène principale */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {!showDrawing ? (
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-5xl font-display text-foreground italic leading-relaxed">
                {sceneTexts[currentText]}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8"
              >
                <img
                  src={friendshipDrawing}
                  alt="Dessin d'amitié"
                  className="max-w-md md:max-w-xl mx-auto rounded-lg shadow-2xl border-8 border-white"
                  style={{ boxShadow: '0 0 60px rgba(255, 215, 0, 0.3)' }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <h2 className="theater-title text-2xl md:text-4xl mb-4">
                  ✨ L'Amitié ✨
                </h2>
                <p className="text-xl text-muted-foreground italic">
                  Un lien plus fort que tout
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="golden-button mt-12"
              >
                Rejouer depuis le début
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Décor de scène */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stage-floor to-transparent z-20" />
      
      {/* Lumières de scène */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
    </div>
  );
};
