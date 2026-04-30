import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.auth.profile);

  const onLogout = async () => {
    await dispatch(logout());
    // redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="p-6 bg-white dark:bg-slate-800 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {profile ? (
          <div className="space-y-2">
            <img src={profile.avatar} alt={profile.name} />
            <div><strong>ID:</strong> {profile.id}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Roles:</strong> {(profile.roles || []).join(', ')}</div>
          </div>
        ) : (
          <div>Loading profile...</div>
        )}

        <div className="mt-4 flex gap-2">
          <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          <button onClick={() => window.location.href = '/'} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  );
}
