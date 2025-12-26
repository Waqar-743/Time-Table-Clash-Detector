
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Subject, Conflict, User } from './types';
import { INITIAL_SUBJECTS } from './constants';
import { detectConflicts } from './utils';
import Dashboard from './screens/Dashboard';
import Timetable from './screens/Timetable';
import AddSubject from './screens/AddSubject';
import ClashResults from './screens/ClashResults';
import Auth from './screens/Auth';
import { supabase } from './supabaseClient';

const Sidebar = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/timetable', label: 'My Timetable', icon: 'calendar_month' },
    { path: '/clashes', label: 'Clash Results', icon: 'error' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-secondary h-full shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 dark:bg-white/5 p-1.5 rounded-xl">
              <img src="/Time-Table-Clash-Detector/logo.png" alt="Logo" className="size-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-primary dark:text-white text-lg font-bold leading-tight tracking-tighter">TimeSmart</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Plan better</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-4 gap-2 flex-1 overflow-y-auto mt-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive(item.path)
                ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'icon-fill' : ''}`}>
                {item.icon}
              </span>
              <p className="text-sm font-semibold leading-normal">{item.label}</p>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            title="Log out"
          >
            <div className="rounded-full size-8 bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0C2B4E&color=fff`} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate group-hover:text-red-500 transition-colors">Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center py-2 px-4 z-50">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive(item.path)
              ? 'text-primary dark:text-white'
              : 'text-slate-400 dark:text-slate-500'
              }`}
          >
            <span className={`material-symbols-outlined ${isActive(item.path) ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        <Link
          to="/add"
          className="flex flex-col items-center gap-1 p-2 text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined">add_box</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Add</span>
        </Link>
      </nav>
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('timesmart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    setLoading(true);
    // Fetch ALL subjects from the table to check for clashes with other users
    const { data, error } = await supabase
      .from('subjects')
      .select('*');

    if (error) {
      console.error('Error fetching subjects:', error);
      setSubjects(INITIAL_SUBJECTS);
    } else if (data) {
      const formattedSubjects: Subject[] = data.map((s: any) => ({
        id: s.id,
        title: s.title,
        day: s.day,
        startTime: s.start_time.substring(0, 5),
        endTime: s.end_time.substring(0, 5),
        room: s.room,
        type: s.subject_type,
        instructor: s.instructor,
        color: s.color,
        // Store email to identify if it's the current user's or someone else's
        userEmail: s.user_email 
      }));
      setSubjects(formattedSubjects);
    }
    setLoading(false);
  };

  useEffect(() => {
    const detected = detectConflicts(subjects);
    setConflicts(detected);
  }, [subjects]);

  const addSubject = async (newSubject: Subject) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{
        title: newSubject.title,
        day: newSubject.day,
        start_time: newSubject.startTime,
        end_time: newSubject.endTime,
        room: newSubject.room,
        subject_type: newSubject.type,
        instructor: newSubject.instructor,
        color: newSubject.color,
        user_email: user?.email
      }])
      .select();

    if (error) {
      alert('Error adding subject: ' + error.message);
    } else {
      fetchSubjects();
    }
  };

  const removeSubject = async (id: string) => {
    if (confirm('Are you sure you want to remove this subject?')) {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error removing subject: ' + error.message);
      } else {
        setSubjects(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const updateSubject = async (updatedSubject: Subject) => {
    const { error } = await supabase
      .from('subjects')
      .update({
        title: updatedSubject.title,
        day: updatedSubject.day,
        start_time: updatedSubject.startTime,
        end_time: updatedSubject.endTime,
        room: updatedSubject.room,
        subject_type: updatedSubject.type,
        instructor: updatedSubject.instructor,
        color: updatedSubject.color
      })
      .eq('id', updatedSubject.id);

    if (error) {
      alert('Error updating subject: ' + error.message);
    } else {
      fetchSubjects();
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('timesmart_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setUser(null);
      localStorage.removeItem('timesmart_user');
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-primary/5 dark:bg-white/5 p-1 rounded-lg">
              <img src="/Time-Table-Clash-Detector/logo.png" alt="Logo" className="size-8 object-contain" />
            </div>
            <h1 className="text-primary dark:text-white text-lg font-black tracking-tighter">TimeSmart</h1>
          </div>
          <div
            onClick={handleLogout}
            className="rounded-full size-8 bg-slate-200 overflow-hidden border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0C2B4E&color=fff`} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>

        <Sidebar user={user} onLogout={handleLogout} />

        <div className="flex-1 flex flex-col h-full overflow-hidden pb-16 md:pb-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Dashboard subjects={subjects} conflicts={conflicts} onRemove={removeSubject} currentUserEmail={user.email} />}
              />
              <Route
                path="/timetable"
                element={<Timetable subjects={subjects} onRemove={removeSubject} onUpdate={updateSubject} currentUserEmail={user.email} />}
              />
              <Route
                path="/add"
                element={<AddSubject onAdd={addSubject} />}
              />
              <Route
                path="/clashes"
                element={<ClashResults subjects={subjects} conflicts={conflicts} onRemove={removeSubject} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </HashRouter>
  );
}
