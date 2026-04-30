import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshAccessToken, fetchProfile } from '../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap();
        await dispatch(fetchProfile()).unwrap();
        // go to profile/home
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth success handling failed', err);
        // if refresh failed, go to login
        navigate('/login', { replace: true });
      }
    })();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Finishing authentication... please wait</div>
    </div>
  );
}
