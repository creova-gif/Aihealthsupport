import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MicroFeedbackProps {
  language: 'sw' | 'en';
  trigger: 'first-action' | '7-days' | 'feature-use';
  onSubmit: (feedback: { rating: number; comment?: string }) => void;
  onDismiss: () => void;
}

const translations = {
  sw: {
    'first-action': {
      title: 'Je, ilikuwa rahisi?',
      subtitle: 'Tuambie kuhusu uzoefu wako wa kwanza',
    },
    '7-days': {
      title: 'Unajisikiaje?',
      subtitle: 'Umetumia AfyaAI kwa wiki moja',
    },
    'feature-use': {
      title: 'Ilikuwaje?',
      subtitle: 'Tuambie kuhusu kipengele hiki',
    },
    ratingPrompt: 'Chagua hisia yako:',
    commentPlaceholder: 'Ongeza maoni (hiari)',
    submit: 'Tuma',
    skip: 'Ruka',
    thanks: 'Asante kwa maoni yako!',
    emojis: ['😞', '😐', '😊', '😄', '🤩'],
    labels: ['Mbaya', 'Wastani', 'Nzuri', 'Nzuri sana', 'Bora kabisa'],
  },
  en: {
    'first-action': {
      title: 'Was it easy?',
      subtitle: 'Tell us about your first experience',
    },
    '7-days': {
      title: 'How are you feeling?',
      subtitle: "You've used AfyaAI for one week",
    },
    'feature-use': {
      title: 'How was it?',
      subtitle: 'Tell us about this feature',
    },
    ratingPrompt: 'Choose your feeling:',
    commentPlaceholder: 'Add comment (optional)',
    submit: 'Submit',
    skip: 'Skip',
    thanks: 'Thanks for your feedback!',
    emojis: ['😞', '😐', '😊', '😄', '🤩'],
    labels: ['Bad', 'Okay', 'Good', 'Very good', 'Excellent'],
  },
};

export function MicroFeedback({ language, trigger, onSubmit, onDismiss }: MicroFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = translations[language];
  const content = t[trigger];

  const handleSubmit = () => {
    if (rating === null) return;
    
    onSubmit({ rating, comment: comment.trim() || undefined });
    setIsSubmitted(true);
    
    // Auto-close after showing thanks
    setTimeout(() => {
      onDismiss();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              ✓
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.thanks}</h2>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 text-center relative">
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.title}
            </h2>
            <p className="text-gray-600">
              {content.subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {t.ratingPrompt}
            </p>

            {/* Emoji rating */}
            <div className="flex justify-center gap-2 mb-6">
              {t.emojis.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(index + 1)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all ${
                    rating === index + 1
                      ? 'bg-blue-500 shadow-lg scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>

            {/* Rating label */}
            {rating !== null && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm font-semibold text-gray-700 mb-4"
              >
                {t.labels[rating - 1]}
              </motion.p>
            )}

            {/* Optional comment */}
            {rating !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.commentPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"
                />
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onDismiss}
                className="flex-1 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {t.skip}
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === null}
                className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                style={{
                  background: rating !== null
                    ? 'linear-gradient(135deg, #1E88E5 0%, #0F9D58 100%)'
                    : '#cccccc',
                }}
              >
                <span>{t.submit}</span>
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
