import { useState, useCallback } from 'react';
import api from '../lib/api';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    const qs = new URLSearchParams(params).toString();
    const data = await api.get(`/api/appointments${qs ? '?' + qs : ''}`).catch(() => []);
    setAppointments(data);
    setLoading(false);
  }, []);

  return { appointments, loading, load };
}
