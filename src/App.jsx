import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Registration from './pages/Registration';
import Bracket from './pages/Bracket';
import ToastProvider from './components/ToastProvider';
import useStore from './store/useStore';

export default function App() {
  const initFirebase = useStore((s) => s.initFirebase);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register/:tournamentId" element={<Registration />} />
          <Route path="/bracket/:tournamentId" element={<Bracket />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
