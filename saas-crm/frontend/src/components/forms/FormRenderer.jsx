import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import FieldInput from './FieldTypes';
import TimeSlotPicker from '../appointments/TimeSlotPicker';
import { evaluateLogic } from './ConditionalLogic';

export default function FormRenderer({ form, fields, onSubmitted, standalone = false }) {
  const [values, setValues] = useState({});
  const [rdvDate, setRdvDate] = useState('');
  const [rdvTime, setRdvTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const advCfg = form.adv_config || {};
  const isAppointment = !!advCfg.isAppointment;
  const isQuiz = !!advCfg.isQuiz;
  const timerMin = parseInt(advCfg.timer || 0);
  const storageKey = `form_timer_${form.id}`;

  // Timer
  useEffect(() => {
    if (!timerMin) return;
    const saved = parseInt(localStorage.getItem(storageKey) || '0');
    const start = saved || timerMin * 60;
    setTimeLeft(start);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          localStorage.removeItem(storageKey);
          return 0;
        }
        const next = prev - 1;
        localStorage.setItem(storageKey, String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerMin]);

  const visibleFields = fields.filter(f => evaluateLogic(f.logique, values));

  function setValue(label, val) {
    setValues(prev => ({ ...prev, [label]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Check open/close period
    if (advCfg.openDate && new Date() < new Date(advCfg.openDate)) {
      setError('Ce formulaire n\'est pas encore ouvert.');
      return;
    }
    if (advCfg.closeDate && new Date() > new Date(advCfg.closeDate)) {
      setError('Ce formulaire est fermé.');
      return;
    }

    // Quiz scoring
    let scoreText = null;
    if (isQuiz) {
      let total = 0, earned = 0;
      for (const f of fields) {
        if (f.correct_answer && f.points) {
          total += f.points;
          const ans = values[f.label];
          const correct = Array.isArray(ans)
            ? ans.join(',').toLowerCase() === f.correct_answer.toLowerCase()
            : String(ans || '').toLowerCase() === f.correct_answer.toLowerCase();
          if (correct) earned += f.points;
        }
      }
      scoreText = total > 0 ? `${earned}/${total}` : null;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/entries/${form.id}`, {
        data: values,
        rdv_date: rdvDate || undefined,
        rdv_time: rdvTime || undefined,
        score_quiz: scoreText,
      });
      localStorage.removeItem(storageKey);
      clearInterval(timerRef.current);
      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {advCfg.successMessage || 'Votre réponse a été enregistrée !'}
        </h2>
      </div>
    );
  }

  const bgStyle = {};
  if (form.color) bgStyle['--primary-color'] = form.color;

  return (
    <div className={`${standalone ? 'min-h-screen flex items-center justify-center p-4' : ''}`}
      style={{ background: standalone ? '#f7f9fc' : undefined, direction: form.rtl ? 'rtl' : 'ltr' }}>
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-xl">
        {/* Timer */}
        {timerMin > 0 && timeLeft !== null && (
          <div className={`text-center mb-4 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
            ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}

        {advCfg.subtitle && <p className="text-gray-500 text-sm mb-4">{advCfg.subtitle}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {visibleFields.map(field => (
            <div key={field.id || field.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.requis && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.image_url && (
                <img src={field.image_url} alt="" className="mb-2 rounded-lg max-h-48 object-cover" />
              )}
              {field.description && (
                <p className={`text-xs mb-1 ${field.desc_style === 'bold' ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                  {field.description}
                </p>
              )}
              <FieldInput
                field={field}
                value={values[field.label]}
                onChange={val => setValue(field.label, val)}
              />
            </div>
          ))}

          {/* Appointment date/time pickers */}
          {isAppointment && (
            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date du rendez-vous *</label>
                <input
                  type="date"
                  value={rdvDate}
                  onChange={e => { setRdvDate(e.target.value); setRdvTime(''); }}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                />
              </div>
              {rdvDate && (
                <TimeSlotPicker
                  formId={form.id}
                  date={rdvDate}
                  advCfg={advCfg}
                  selected={rdvTime}
                  onSelect={setRdvTime}
                />
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || (isAppointment && (!rdvDate || !rdvTime))}
            className="w-full py-2.5 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: form.color || '#111827' }}
          >
            {submitting ? 'Envoi...' : 'Soumettre'}
          </button>
        </form>
      </div>
    </div>
  );
}
