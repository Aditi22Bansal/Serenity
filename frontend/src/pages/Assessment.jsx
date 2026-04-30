import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions, submitAssessment } from '../utils/api';
import Counselling from './Counselling';
import './Assessment.css';

const CATEGORIES = [
  { id: 'physical', name: 'Physical Wellness', color: '#7BC8A4', desc: 'Body, sleep, activity & nutrition', initial: 'P' },
  { id: 'mental', name: 'Mental Wellness', color: '#89B4E8', desc: 'Stress, focus & mindfulness', initial: 'M' },
  { id: 'emotional', name: 'Emotional Wellness', color: '#B8A9C9', desc: 'Feelings, relationships & resilience', initial: 'E' },
];

const FALLBACK_SCALE = [
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
  { value: 5, label: 'Always' },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select | questions | results
  const [completedCats, setCompletedCats] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const startCategory = async (catId) => {
    setLoading(true);
    try {
      const res = await getQuestions(catId);
      setQuestions(res.data.questions);
      setCurrentCat(catId);
      setCurrentQ(0);
      setAnswers({});
      setStep('questions');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQ].id]: value });
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const submitCategory = async () => {
    setLoading(true);
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id] || 3,
      }));
      const res = await submitAssessment({ category: currentCat, answers: formattedAnswers });
      const newScores = { ...scores, [currentCat]: res.data.assessment.score };
      setScores(newScores);
      setOverallScore(res.data.profile.overallScore);
      setCompletedCats([...completedCats, currentCat]);

      // Check if all categories done
      if (completedCats.length + 1 >= CATEGORIES.length) {
        setStep('results');
      } else {
        setStep('select');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const currentAnswer = answers[questions[currentQ]?.id];
  const catInfo = CATEGORIES.find(c => c.id === currentCat);
  const currentQuestion = questions[currentQ];
  // Use question-specific options if available, otherwise fallback
  const currentOptions = currentQuestion?.options || FALLBACK_SCALE;

  return (
    <div className="assess-page">
      <div className="assess-container">
        {/* Progress Bar */}
        <div className="assess-progress">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className={`prog-step ${completedCats.includes(cat.id) ? 'done' : cat.id === currentCat ? 'active' : ''}`} />
          ))}
        </div>

        {/* Step: Category Select */}
        {step === 'select' && (
          <div>
            <div className="section-header" style={{ marginBottom: 40 }}>
              <span className="section-label green">
                {completedCats.length === 0 ? 'Begin Assessment' : `${completedCats.length} of 3 Complete`}
              </span>
              <h2>{completedCats.length === 0 ? 'Choose a Wellness Area' : 'Continue Your Assessment'}</h2>
              <p>Select a category to begin answering questions about your well-being.</p>
            </div>
            <div className="assess-category-select">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  className={`cat-card ${completedCats.includes(cat.id) ? 'completed' : ''}`}
                  onClick={() => !completedCats.includes(cat.id) && startCategory(cat.id)}
                  style={{ cursor: completedCats.includes(cat.id) ? 'default' : 'pointer' }}
                >
                  <div className="cat-icon-circle" style={{ background: cat.color }}>{cat.initial}</div>
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  {scores[cat.id] !== undefined && (
                    <p style={{ color: cat.color, fontWeight: 700, marginTop: 8 }}>Score: {scores[cat.id]}%</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: Questions */}
        {step === 'questions' && questions.length > 0 && (
          <div className="question-card">
            <div className="question-counter">
              <span className="q-cat-badge" style={{ background: catInfo?.color + '18', color: catInfo?.color }}>{catInfo?.name}</span>
              <span>Question {currentQ + 1} of {questions.length}</span>
            </div>
            <div className="question-text">{questions[currentQ].text}</div>
            <div className="answer-options">
              {currentOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`answer-option ${currentAnswer === opt.value ? 'selected' : ''}`}
                  onClick={() => selectAnswer(opt.value)}
                >
                  <div className="answer-dot" />
                  <span className="answer-label">{opt.label}</span>
                  <span className="answer-value">{opt.value}/5</span>
                </div>
              ))}
            </div>
            <div className="question-nav">
              <button className="btn-secondary btn-sm" onClick={prevQuestion} disabled={currentQ === 0}>Back</button>
              {currentQ < questions.length - 1 ? (
                <button className="btn-primary btn-sm" onClick={nextQuestion} disabled={!currentAnswer}>Next</button>
              ) : (
                <button className="btn-primary btn-sm" onClick={submitCategory} disabled={!allAnswered || loading}>
                  {loading ? 'Submitting...' : completedCats.length + 1 >= CATEGORIES.length ? 'Complete Assessment' : 'Submit & Continue'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <div className="results-card">
            <span className="section-label green">Assessment Complete</span>
            <h2>Your Wellness Profile</h2>
            <div className="results-score" style={{ color: overallScore >= 70 ? '#7BC8A4' : overallScore >= 40 ? '#89B4E8' : '#E57373' }}>
              {overallScore}
            </div>
            <p>Your overall wellness score out of 100</p>
            <div className="results-categories">
              {CATEGORIES.map(cat => (
                <div className="result-cat" key={cat.id}>
                  <div className="result-cat-score" style={{ color: cat.color }}>{scores[cat.id] || 0}</div>
                  <div className="result-cat-label">{cat.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
            <div className="results-btns">
              <Link to="/dashboard"><button className="btn-primary">View Dashboard</button></Link>
              <button className="btn-secondary" onClick={() => { setCompletedCats([]); setScores({}); setStep('select'); }}>Retake Assessment</button>
            </div>
          </div>
        )}

        {/* Counselling Booking / Session Timer — always visible */}
        <Counselling />
      </div>
    </div>
  );
}
