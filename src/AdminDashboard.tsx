import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { 
  LayoutDashboard, Calendar, MessageSquare, Settings, 
  LogOut, CheckCircle, XCircle, Clock, Trash2, FileText
} from 'lucide-react';

export default function AdminDashboard({ user }: { user: any }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h2>
          <p className="text-slate-600 mb-8">Please sign in to access the dashboard.</p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // FRONTEND BOUNCER: Check if the logged-in user is the authorized admin
  const isAdmin = user.email === 'm.reha2006@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            Your account ({user.email}) does not have administrator privileges to view this dashboard.
          </p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => { signOut(auth); navigate('/'); }}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Sign Out & Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Almaris<span className="text-indigo-600">.</span></span>
          <span className="ml-2 text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/secure-portal" className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg font-medium transition-colors">
            <Calendar className="mr-3 h-5 w-5" /> Appointments
          </Link>
          <Link to="/secure-portal/messages" className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg font-medium transition-colors">
            <MessageSquare className="mr-3 h-5 w-5" /> Messages
          </Link>
          <Link to="/secure-portal/content" className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg font-medium transition-colors">
            <FileText className="mr-3 h-5 w-5" /> Site Content
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { signOut(auth); navigate('/'); }}
            className="flex w-full items-center px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<AppointmentsList />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/content" element={<ContentEditor />} />
        </Routes>
      </main>
    </div>
  );
}

function AppointmentsList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Appointments</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No appointments found.</td>
              </tr>
            ) : appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{apt.name}</div>
                  <div className="text-sm text-slate-500">{apt.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 capitalize">
                  {apt.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> {apt.date}</div>
                  <div className="flex items-center mt-1"><Clock className="w-4 h-4 mr-1 text-slate-400"/> {apt.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {apt.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(apt.id, 'confirmed')} className="text-green-600 hover:text-green-900 mr-3" title="Confirm">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => updateStatus(apt.id, 'cancelled')} className="text-red-600 hover:text-red-900 mr-3" title="Cancel">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteAppointment(apt.id)} className="text-slate-400 hover:text-red-600" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesList() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const deleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>
      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">
            No messages found.
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
            <button 
              onClick={() => deleteMessage(msg.id)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{msg.subject}</h3>
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <span className="font-medium text-slate-700 mr-2">{msg.name}</span>
              &lt;{msg.email}&gt;
              <span className="mx-2">•</span>
              {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : new Date(msg.createdAt).toLocaleString()}
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentEditor() {
  const [formData, setFormData] = useState({
    heroTitle: 'Elevate your business with professional solutions.',
    heroSubtitle: 'We provide top-tier consulting and service solutions tailored to your unique needs. Book an appointment today and let\'s build something great together.',
    aboutText: 'At Almaris, we believe in delivering exceptional quality and measurable results. Our team of industry experts works closely with you to understand your challenges and implement strategies that drive growth.\n\nWhether you need strategic consulting, technical implementation, or ongoing support, we have the expertise to help you navigate the complex business landscape.'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'content', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setFormData({
          heroTitle: docSnap.data().heroTitle || formData.heroTitle,
          heroSubtitle: docSnap.data().heroSubtitle || formData.heroSubtitle,
          aboutText: docSnap.data().aboutText || formData.aboutText
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'content', 'main'), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Site Content</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl">
        {saved && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Content saved successfully! Changes are now live on the website.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                <textarea
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">About Section</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">About Text</label>
              <textarea
                name="aboutText"
                value={formData.aboutText}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
