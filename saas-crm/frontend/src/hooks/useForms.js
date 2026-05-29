import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await api.get('/api/forms').catch(() => []);
    setForms(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return { forms, loading, reload: load };
}
