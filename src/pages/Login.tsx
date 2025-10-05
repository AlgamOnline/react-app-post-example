import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building, Settings } from 'lucide-react';

interface LoginProps {
  onRegister: () => void;
  onMembership: () => void;
}

export function Login({ onRegister, onMembership }: LoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">POS System Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>Demo accounts:</p>
          <ul className="list-disc list-inside">
            <li>Super Admin: superadmin / super123</li>
            <li>Store 1 Admin: admin / admin123</li>
            <li>Store 1 Cashier: cashier / cashier123</li>
            <li>Store 2 Admin: store2admin / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}