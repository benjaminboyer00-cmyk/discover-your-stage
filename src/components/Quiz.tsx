import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quelle est ma couleur préférée ?",
    options: ["Rouge", "Bleu", "Vert", "Violet"],
    correctIndex: 0, // Rouge
  },
  {
    id: 2,
    question: "Quel est mon plat favori ?",
    options: ["Pizza", "Sushi", "Tacos", "Pâtes"],
    correctIndex: 0, // Pizza
  },
  {
    id: 3,
    question: "Quelle est ma saison préférée ?",
    options: ["Printemps", "Été", "Automne", "Hiver"],
    correctIndex: 0, // Printemps
  },
];

interface QuizProps {
  onComplete: () => void;
}

export const Quiz = ({ onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [shake, setShake] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleValidate = () => {
    if (selectedOption === null) return;
    
    setShowResult(true);
    
    const isCorrect = selectedOption === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        // Quiz terminé
        const finalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        if (finalCorrect === questions.length) {
          onComplete();
        }
      }
    }, 1500);
  };

  const question = questions[currentQuestion];
  const allCorrect = correctAnswers === questions.length && showResult && currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 spotlight-effect">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h1 className="theater-title text-center mb-4">
          Le Test Mystérieux
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 text-lg italic">
          Réponds correctement aux trois questions pour débloquer le théâtre...
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? 'bg-primary'
                  : index === currentQuestion
                  ? 'bg-primary animate-pulse-glow'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              ...(shake ? { x: [0, -10, 10, -10, 10, 0] } : {})
            }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="quiz-card"
          >
            <h2 className="text-2xl md:text-3xl font-display text-center mb-8 text-foreground">
              {question.question}
            </h2>

            <div className="grid gap-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(index)}
                  className={`quiz-option text-left text-lg ${
                    selectedOption === index ? 'selected' : ''
                  } ${
                    showResult && index === question.correctIndex ? 'correct' : ''
                  } ${
                    showResult && selectedOption === index && index !== question.correctIndex ? 'incorrect' : ''
                  }`}
                >
                  <span className="font-display text-primary mr-4">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>

            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleValidate}
                disabled={selectedOption === null}
                className={`golden-button w-full mt-8 text-lg ${
                  selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Valider
              </motion.button>
            )}

            {showResult && !allCorrect && currentQuestion === questions.length - 1 && correctAnswers + (selectedOption === question.correctIndex ? 1 : 0) < questions.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <p className="text-accent text-xl mb-4">
                  Tu n'as pas trouvé toutes les réponses...
                </p>
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedOption(null);
                    setShowResult(false);
                    setCorrectAnswers(0);
                  }}
                  className="golden-button"
                >
                  Réessayer
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
