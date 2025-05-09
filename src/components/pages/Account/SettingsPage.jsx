import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/core/context/AuthContext';
import AuthService from '@/core/service/AuthService';

const SettingsPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await AuthService.requestWithAuth('account/settings');
        setMessage(`Welcome, ${response.email || 'user'}!`);
      } catch (err) {
        setError(err.message || 'Failed to fetch settings.');
      }
    };

    fetchSettings();
  }, [user, navigate]);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-2">Settings</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600">{message}</p>
      )}
    </div>
  );
};

export default SettingsPage;
