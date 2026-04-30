import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuthSuccess from './pages/AuthSuccess';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import { useDispatch } from 'react-redux';
import { fetchProfile, refreshAccessToken } from './store/auth/authSlice';
import PrivateRoute from './components/PrivateRoute';
import DetailPage from './pages/DetailPage';
import { fetchHistory } from './store/history/action';

export default function App() {
  const dispatch = useDispatch();

  // On mount, try refresh if no token
  useEffect(() => {
    // if there is no token, try to refresh using cookie
    const token = localStorage.getItem('access_token');
    if (!token) {
      dispatch(refreshAccessToken());
    } else {
      // optionally fetch profile
      dispatch(fetchHistory());
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <>
    {/* // <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes/:id" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    {/* </BrowserRouter> */}
    </>
  );
}
