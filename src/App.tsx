import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import PublicSite from './PublicSite';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="almaris-theme">
      <Routes>
        <Route path="/" element={<PublicSite user={user} />} />
        <Route 
          path="/secure-portal/*" 
          element={
            <AdminDashboard user={user} />
          } 
        />
        <Route 
          path="/client-portal/*" 
          element={
            <ClientDashboard user={user} />
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}
