import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ArrowRight, CheckCircle2, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import pagluConfig from '../../config/pagluConfig';
import soundEngine from '../../utils/soundEngine';
import { persistQuizBest } from '../../utils/universeStore';

export default function FriendshipQuiz({ initialBestScore = 0 }) {
  const questions = pagluConfig.funPlanet.quizQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(initialBestScore);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100;

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      soundEngine.playSuccess();
      setScore((s) => s + 1);
    } else {
      soundEngine.playError();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      const finalScore = score;
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        persistQuizBest(finalScore);
      }
      soundEngine.playUnlock();
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const getRankVerdict = (s) => {
    const ratio = s / questions.length;
    if (ratio >= 0.86) {
      return {
        title: 'Certified Paglu Telepath 🏆',
        message: 'Unbelievable score! You practically share a cosmic brainwave.'
      };
    }
    if (ratio >= 0.6) {
      return {
        title: 'Chaotic Bestie Scholar ✨',
        message: 'Solid performance! A few suspiciously wild guesses, yet respectable!'
      };
    }
    return {
      title: 'Sleepy Space Tourist 😂',
      message: 'Were you guessing with your eyes closed?! Hit replay and redeem yourself!'
    };
  };

  if (isFinished) {
    const verdict = getRankVerdict(score);
    return (
      <motion.div
        className="glass-panel-strong"
        style={{ maxWidth: 720, margin: '0 auto', padding: '36px 26px', textAlign: 'center' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: '50%',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(56, 189, 248, 0.16)',
            border: '1.5px solid #38bdf8'
          }}
        >
          <Award size={36} color="#38bdf8" />
        </div>

        <span className="cosmic-badge">Quiz Complete</span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
            margin: '14px 0 8px',
            color: '#ffffff'
          }}
        >
          {score} / {questions.length}
        </h3>
        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f472b6', marginBottom: 8 }}>
          {verdict.title}
        </p>
        <p style={{ color: '#cbd5e1', maxWidth: 480, margin: '0 auto 22px', lineHeight: 1.6 }}>
          {verdict.message}
        </p>

        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 24 }}>
          Session Best: {Math.max(bestScore, score)} / {questions.length}
        </p>

        <button type="button" className="cosmic-btn-primary" onClick={handleRestart}>
          <RotateCcw size={17} />
          <span>Play Quiz Again</span>
        </button>
      </motion.div>
    );
  }

  const isCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div
      className="glass-panel-strong"
      style={{ maxWidth: 760, margin: '0 auto', padding: '30px 24px' }}
    >
      {/* Top Score & Progress Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.82rem',
            color: '#38bdf8',
            fontWeight: 600
          }}
        >
          QUESTION {currentIndex + 1} OF {questions.length}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.84rem',
              color: '#fde68a',
              fontWeight: 700
            }}
          >
            <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
            Score: {score}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: 7,
          borderRadius: 99,
          background: 'rgba(148, 163, 184, 0.16)',
          overflow: 'hidden',
          marginBottom: 24
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #38bdf8, #a855f7, #f472b6)',
            transition: 'width 0.35s ease'
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <h3
            style={{
              fontSize: 'clamp(1.08rem, 2.4vw, 1.32rem)',
              lineHeight: 1.45,
              color: '#ffffff',
              marginBottom: 22
            }}
          >
            {currentQ.question}
          </h3>

          <div style={{ display: 'grid', gap: 11 }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isAnswer = idx === currentQ.correctIndex;
              let borderColor = 'rgba(148, 163, 184, 0.24)';
              let bg = 'rgba(17, 24, 56, 0.65)';

              if (selectedOption !== null) {
                if (isAnswer) {
                  borderColor = '#34d399';
                  bg = 'rgba(16, 185, 129, 0.2)';
                } else if (isSelected) {
                  borderColor = '#fb7185';
                  bg = 'rgba(244, 63, 94, 0.2)';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '15px 18px',
                    borderRadius: 15,
                    textAlign: 'left',
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    color: '#f8fafc',
                    fontSize: '0.94rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>
                    <strong style={{ color: '#38bdf8', marginRight: 10 }}>
                      {String.fromCharCode(65 + idx)}.
                    </strong>
                    {opt}
                  </span>
                  {selectedOption !== null && isAnswer && (
                    <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0 }} />
                  )}
                  {selectedOption !== null && isSelected && !isAnswer && (
                    <XCircle size={18} color="#fb7185" style={{ flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Funny Feedback & Next Button */}
      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 20,
              padding: '16px 18px',
              borderRadius: 16,
              background: isCorrect ? 'rgba(16, 185, 129, 0.14)' : 'rgba(244, 114, 182, 0.14)',
              border: `1px solid ${isCorrect ? 'rgba(52, 211, 153, 0.4)' : 'rgba(244, 114, 182, 0.4)'}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14
            }}
          >
            <p style={{ fontSize: '0.92rem', color: '#f1f5f9', flex: '1 1 260px' }}>
              {isCorrect ? currentQ.funnyRight : currentQ.funnyWrong}
            </p>

            <button type="button" className="cosmic-btn-primary" onClick={handleNext}>
              <span>
                {currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question'}
              </span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
