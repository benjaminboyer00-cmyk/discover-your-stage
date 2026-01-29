import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz } from '@/components/Quiz';
import { TheaterRoom } from '@/components/TheaterRoom';
import { TheaterScene } from '@/components/TheaterScene';

type GameState = 'quiz' | 'room' | 'theater';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('quiz');

  const handleQuizComplete = () => {
    setGameState('room');
  };

  const handleReachStage = () => {
    setGameState('theater');
  };

  const handleRestart = () => {
    setGameState('quiz');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Quiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {gameState === 'room' && (
          <motion.div
            key="room"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TheaterRoom onReachStage={handleReachStage} />
          </motion.div>
        )}

        {gameState === 'theater' && (
          <motion.div
            key="theater"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TheaterScene onComplete={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
