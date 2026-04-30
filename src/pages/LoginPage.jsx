import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, fetchProfile } from '../store/auth/authSlice';
import { backendUrl } from '../utils/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (auth.accessToken) {
    navigate("/");
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await dispatch(login({ email, password })).unwrap();
      // fetch profile
      await dispatch(fetchProfile());
      // redirect after success
      window.location.href = '/profile';
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed: ' + err.message);
    }
  };

  const openGoogle = () => {
    // open in same window (or popup). Because backend uses bell and will redirect to FRONTEND_URL/auth/success
    // using same window makes redirect flow simple
    window.location.href = `${backendUrl}/api/auth/google`;
    // alternatively, open popup:
    // window.open('/api/auth/google', 'google_oauth', 'width=600,height=700');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded shadow">
        <h2 className="text-2xl mb-4">Login</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input type="email" className="w-full rounded border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full rounded border px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Sign in</button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={openGoogle} className="inline-flex items-center gap-2 px-4 py-2 border rounded">
            <img src="https://www.google.com/favicon.ico" alt="g" className="w-4 h-4" /> Sign in with Google
          </button>
        </div>

        {auth.error && <p className="mt-2 text-red-600">{auth.error}</p>}
      </div>
    </div>
  );
}
