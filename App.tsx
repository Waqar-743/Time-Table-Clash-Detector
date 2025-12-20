
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
            <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-xl text-primary dark:text-white">
              <span className="material-symbols-outlined text-3xl">grid_view</span>
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

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('timesmart_data_v1');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    localStorage.setItem('timesmart_data_v1', JSON.stringify(subjects));
    const detected = detectConflicts(subjects);
    setConflicts(detected);
  }, [subjects]);

  const addSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (confirm('Are you sure you want to remove this subject?')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
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
            <div className="bg-primary/10 dark:bg-white/10 p-1.5 rounded-lg text-primary dark:text-white">
              <span className="material-symbols-outlined text-xl">grid_view</span>
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
          <Routes>
            <Route
              path="/"
              element={<Dashboard subjects={subjects} conflicts={conflicts} onRemove={removeSubject} />}
            />
            <Route
              path="/timetable"
              element={<Timetable subjects={subjects} onRemove={removeSubject} onUpdate={updateSubject} />}
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
        </div>
      </div>
    </HashRouter>
  );
}
