import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            My Social Twin
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered Social Stories for Children
          </p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-md text-lg font-semibold transition-all ${
              isLogin
                ? 'bg-white text-primary shadow-md'
                : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-md text-lg font-semibold transition-all ${
              !isLogin
                ? 'bg-white text-primary shadow-md'
                : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {/* Role Selection (only for signup) */}
          {!isLogin && (
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                I am a:
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex-1 py-4 rounded-lg text-lg font-semibold border-2 transition-all ${
                    role === 'parent'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  👨‍👩‍👧‍👦 Parent
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex-1 py-4 rounded-lg text-lg font-semibold border-2 transition-all ${
                    role === 'teacher'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  👨‍🏫 Teacher
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading
              ? 'Please wait...'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Additional Info */}
        {!isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll receive a confirmation email. Please verify your email address to complete registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
