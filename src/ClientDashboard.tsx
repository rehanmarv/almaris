import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  LayoutDashboard, Calendar, LogOut, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

export default function ClientDashboard({ user }: { user: any }) {
  const navigate = useNavigate();

  if (!user) {
    // If not logged in, redirect to home
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
            Almaris<span className="text-primary-600 dark:text-primary-400">.</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/client-portal" className="flex items-center px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg font-heading font-medium transition-colors">
            <LayoutDashboard className="mr-3 h-5 w-5" /> My Bookings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center mb-4 px-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-3" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold mr-3">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-heading font-medium text-slate-900 dark:text-white truncate">{user.displayName || 'Client'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { signOut(auth); navigate('/'); }}
            className="flex w-full items-center px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-heading font-medium transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<MyBookings user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

function MyBookings({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    
    // Fetch appointments for this specific user by email
    const q = query(
      collection(db, 'appointments'), 
      where('email', '==', user.email)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Sort manually since we can't easily compound query without an index
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return dateB - dateA;
      });
      setAppointments(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user appointments:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-heading font-medium">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">My Bookings</h1>
      
      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't scheduled any consultations with us.</p>
          <Link to="/" className="inline-flex px-6 py-3 bg-primary-600 text-white rounded-lg font-heading font-medium hover:bg-primary-700 transition-colors">
            Book a Consultation
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-heading font-semibold rounded-full flex items-center
                  ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                  {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {apt.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                  <span className="capitalize">{apt.status || 'Pending'}</span>
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {apt.service}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="font-medium">{apt.date}</span>
                </div>
                <div className="flex items-center text-slate-700 dark:text-slate-300 mb-4">
                  <Clock className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="font-medium">{apt.time}</span>
                </div>
                
                {apt.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Notes:</span> {apt.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
