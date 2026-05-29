import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
}

export default function MonthlyCalendar({ monthlyData }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const color = appConfig?.app_color || '#111827';

  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const { year, month } = viewDate;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const todayStr = today.toISOString().split('T')[0];

  function dateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function prev() {
    setViewDate(v => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function next() {
    setViewDate(v => {
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const maxCount = Math.max(...Object.values(monthlyData || {}).map(d => (d.confirmed + d.pending) || 0), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{t.monthlyCalendar}</h3>
        <div className="flex gap-2 items-center">
          <button onClick={prev} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <i className="fas fa-chevron-left text-xs" />
          </button>
          <span className="text-sm font-medium min-w-24 text-center">
            {new Date(year, month).toLocaleDateString(lang, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={next} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <i className="fas fa-chevron-right text-xs" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_KEYS.map(k => (
          <div key={k} className="text-center text-xs font-medium text-gray-400 py-1">
            {(t[k] || k).slice(0, 2)}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const ds = dateStr(day);
          const dayData = monthlyData?.[ds];
          const total = dayData ? (dayData.confirmed + dayData.pending) : 0;
          const intensity = total ? Math.min(0.9, total / maxCount) : 0;
          const isToday = ds === todayStr;

          return (
            <div key={day} className="aspect-square relative group">
              <div
                className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-xs transition-all
                  ${isToday ? 'ring-2 ring-offset-1' : ''}
                  ${total ? 'cursor-pointer' : ''}`}
                style={{
                  background: total ? `${color}${Math.round(intensity * 255).toString(16).padStart(2,'0')}` : '#f9fafb',
                  ringColor: color,
                }}
              >
                <span className={`font-medium ${isToday ? 'text-gray-900' : total ? 'text-gray-800' : 'text-gray-400'}`}>
                  {day}
                </span>
                {total > 0 && <span className="text-xs font-bold" style={{ color }}>{total}</span>}
              </div>

              {/* Tooltip */}
              {dayData && Object.keys(dayData.forms || {}).length > 0 && (
                <div className="hidden group-hover:block absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs rounded-lg p-2 w-40 shadow-lg">
                  {Object.values(dayData.forms).map(f => (
                    <div key={f.id} className="flex items-center gap-1 mb-1">
                      <i className={`fas ${f.icon || 'fa-list'} text-xs`} />
                      <span className="truncate flex-1">{f.nom}</span>
                      <span className="text-green-400">{f.confirmed}</span>/<span className="text-yellow-400">{f.pending}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
