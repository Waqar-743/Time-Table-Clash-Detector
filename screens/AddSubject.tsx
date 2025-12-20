
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Subject, SubjectType, DayOfWeek } from '../types';

interface Props {
  onAdd: (subject: Subject) => void;
}

const COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Slate', hex: '#64748B' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Indigo', hex: '#6366F1' },
];

const AddSubject: React.FC<Props> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    day: 'Monday' as DayOfWeek,
    room: '',
    startTime: '09:00',
    endTime: '10:30',
    type: SubjectType.LECTURE,
    color: COLORS[0].hex
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    });
    navigate('/timetable');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-10 px-4 md:px-10">
      <div className="max-w-[800px] mx-auto flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tighter">Add New Subject</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Update your master timetable. Each subject can have its own distinct color.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800 self-start md:self-end">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm">check_circle</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">System Ready</span>
          </div>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl">
          <div className="h-3 w-full relative" style={{ backgroundColor: formData.color }}>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-black opacity-10"></div>
          </div>
          <form className="p-8 md:p-12 flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <label className="text-primary dark:text-white text-base font-black uppercase tracking-widest">Subject Title</label>
              <div className="relative">
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-primary/20 h-16 pl-14 text-lg transition-all"
                  placeholder="e.g., Advanced Calculus"
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">menu_book</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-primary dark:text-white text-sm font-black uppercase tracking-widest">Subject Color</label>
              <div className="flex flex-wrap gap-4">
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c.hex })}
                    className={`size-10 rounded-full transition-all border-4 ${formData.color === c.hex ? 'ring-4 ring-primary/20' : ''}`}
                    style={{
                      backgroundColor: c.hex,
                      borderColor: formData.color === c.hex ? 'white' : 'transparent'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-primary dark:text-white text-sm font-black uppercase tracking-widest">Day of the Week</label>
                <div className="relative">
                  <select
                    value={formData.day}
                    onChange={e => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
                    className="w-full rounded-xl text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-primary/20 h-16 pl-14 appearance-none font-bold"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-primary dark:text-white text-sm font-black uppercase tracking-widest">Room Number</label>
                <div className="relative">
                  <input
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    className="w-full rounded-xl text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-primary/20 h-16 pl-14 text-lg"
                    placeholder="e.g., Room 302"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">meeting_room</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-primary dark:text-white text-sm font-black uppercase tracking-widest">Duration</label>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1 w-full relative">
                  <span className="absolute left-4 -top-3 bg-white dark:bg-slate-900 px-2 text-[10px] font-black text-accent uppercase z-10">Start Time</span>
                  <input
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-16 p-5 font-bold focus:ring-4 focus:ring-primary/20"
                    type="time"
                  />
                </div>
                <span className="material-symbols-outlined text-slate-300 hidden sm:block">arrow_forward</span>
                <div className="flex-1 w-full relative">
                  <span className="absolute left-4 -top-3 bg-white dark:bg-slate-900 px-2 text-[10px] font-black text-slate-400 uppercase z-10">End Time</span>
                  <input
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-16 p-5 font-bold focus:ring-4 focus:ring-primary/20"
                    type="time"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
              <Link to="/timetable" className="w-full sm:w-auto px-10 h-14 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                Cancel
              </Link>
              <button type="submit" className="w-full sm:w-auto px-12 h-14 rounded-xl bg-primary hover:bg-secondary text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="material-symbols-outlined">add</span>
                Save Subject
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
