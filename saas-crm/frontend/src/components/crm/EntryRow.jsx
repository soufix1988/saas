import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth.jsx';

const STATUS_COLORS = {
  'Confirmé': 'bg-green-100 text-green-700',
  'En attente': 'bg-yellow-100 text-yellow-700',
  'Annulé': 'bg-red-100 text-red-700',
};

export default function EntryRow({ entry, fields, rights, onDelete, onEdit }) {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notify, setNotify] = useState(true);
  const isAppointment = entry.rdv_date != null;

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-colors text-sm">
        <td className="px-4 py-3 font-mono text-xs text-blue-600 font-bold">#{entry.id}</td>
        {fields.map(f => (
          <td key={f.id} className="px-4 py-3 max-w-32 truncate">
            {Array.isArray(entry.data?.[f.label]) ? entry.data[f.label].join(', ') : entry.data?.[f.label] || '—'}
          </td>
        ))}
        {isAppointment && (
          <td className="px-4 py-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[entry.rdv_status] || 'bg-gray-100 text-gray-600'}`}>
              {entry.rdv_status}
            </span>
          </td>
        )}
        {entry.score_quiz && (
          <td className="px-4 py-3">
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold">
              {entry.score_quiz}
            </span>
          </td>
        )}
        <td className="px-4 py-3 text-gray-400 text-xs">
          {new Date(entry.submitted_at).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="text-gray-400 hover:text-gray-600" title="Imprimer">
              <i className="fas fa-print" />
            </button>
            {(user?.isAdmin || rights?.edit) && (
              <button onClick={() => onEdit(entry)} className="text-blue-400 hover:text-blue-600">
                <i className="fas fa-edit" />
              </button>
            )}
            {(user?.isAdmin || rights?.del) && (
              <button onClick={() => setShowDeleteModal(true)} className="text-red-400 hover:text-red-600">
                <i className="fas fa-trash" />
              </button>
            )}
          </div>
        </td>
      </tr>

      <Modal
        open={showDeleteModal}
        title="Supprimer cette entrée ?"
        onConfirm={() => { onDelete(entry.id, isAppointment && notify); setShowDeleteModal(false); }}
        onCancel={() => setShowDeleteModal(false)}
        confirmLabel="Supprimer"
        danger
      >
        {isAppointment && (
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
            <span className="text-sm">Notifier le client par email</span>
          </label>
        )}
      </Modal>
    </>
  );
}
