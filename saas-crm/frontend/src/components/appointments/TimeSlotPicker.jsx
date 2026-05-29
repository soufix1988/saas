import { useState, useEffect } from 'react';
import api from '../../lib/api';

function generateSlots(advCfg, date) {
  const start = advCfg.aptStart || '09:00';
  const end = advCfg.aptEnd || '18:00';
  const duration = advCfg.aptDuration || 30;
  const lunchStart = advCfg.aptLunchStart;
  const lunchEnd = advCfg.aptLunchEnd;

  const toMins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const toTime = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const slots = [];
  let cur = toMins(start);
  const endM = toMins(end);
  const lunchStartM = lunchStart ? toMins(lunchStart) : null;
  const lunchEndM = lunchEnd ? toMins(lunchEnd) : null;
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const today = new Date().toISOString().split('T')[0];

  while (cur < endM) {
    if (lunchStartM && lunchEndM && cur >= lunchStartM && cur < lunchEndM) {
      cur = lunchEndM;
      continue;
    }
    const isPast = date === today && cur <= nowMins;
    slots.push({ time: toTime(cur), isPast });
    cur += duration;
  }
  return slots;
}

export default function TimeSlotPicker({ formId, date, advCfg, selected, onSelect }) {
  const [bookedTimes, setBookedTimes] = useState([]);
  const capacity = advCfg.aptCapacity || 1;
  const daysOff = advCfg.aptDaysOff || [];

  useEffect(() => {
    if (!date) return;
    api.get(`/api/entries/${formId}/booked-times?date=${date}`).then(setBookedTimes).catch(() => {});
  }, [formId, date]);

  const dayOfWeek = (new Date(date).getDay() + 6) % 7; // 0=Mon
  if (daysOff.includes(dayOfWeek)) {
    return <p className="text-sm text-red-500 mt-2">Ce jour est fermé.</p>;
  }

  const slots = generateSlots(advCfg, date);
  const bookingCount = time => bookedTimes.filter(t => t === time).length;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Heure du rendez-vous *</label>
      <div className="grid grid-cols-4 gap-2">
        {slots.map(({ time, isPast }) => {
          const count = bookingCount(time);
          const full = count >= capacity;
          const disabled = isPast || full;
          return (
            <button
              key={time}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(time)}
              className={`py-2 text-sm rounded-lg border-2 font-medium transition-colors
                ${selected === time ? 'border-gray-900 bg-gray-900 text-white' : ''}
                ${disabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100' : 'border-gray-200 hover:border-gray-400'}
              `}
            >
              {time}
              {full && <span className="block text-xs">complet</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
