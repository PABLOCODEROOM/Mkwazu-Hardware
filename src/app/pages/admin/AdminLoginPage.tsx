import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/common/Spinner';
import { Lock } from 'lucide-react';

interface AdminLoginPageProps {
  onLogin?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (!isAuthLoading && isAuthenticated) {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = '/admin/dashibodi';
    }
    return null;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      if (onLogin) {
        onLogin();
      } else {
        window.location.href = '/admin/dashibodi';
      }
    } catch (err: any) {
      setError(err.message || 'Barua pepe au nywila si sahihi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ingia kwenye Admin</h1>
          <p className="text-gray-600 mt-2">Mkwazu Hardware - Mfumo wa Usimamizi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Barua Pepe</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="admin@mkwazuhardware.co.tz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nywila</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
          >
            {loading ? <Spinner size="sm" /> : 'Ingia'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: admin@mkwazuhardware.co.tz</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};
