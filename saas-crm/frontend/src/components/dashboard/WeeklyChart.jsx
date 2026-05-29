import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function WeeklyChart({ weeklyData }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const color = appConfig?.app_color || '#111827';

  const labels = (weeklyData || []).map((_, i) => t[DAY_KEYS[i]] || DAY_KEYS[i]);

  const data = {
    labels,
    datasets: [
      {
        label: t.confirmed,
        data: (weeklyData || []).map(d => d.confirmed),
        backgroundColor: color,
        borderRadius: 6,
      },
      {
        label: t.pending,
        data: (weeklyData || []).map(d => d.pending),
        backgroundColor: '#fbbf24',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 mb-4">{t.weeklyChart}</h3>
      <Bar data={data} options={options} height={120} />
    </div>
  );
}
