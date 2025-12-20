
import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, Conflict } from '../types';
import { getDayFromDate } from '../utils';

interface Props {
  subjects: Subject[];
  conflicts: Conflict[];
  onRemove: (id: string) => void;
}

const StatCard = ({ label, value, subtext, icon, color = 'primary' }: any) => {
  const getColorClasses = (clr: string) => {
    if (clr === 'red-500') return 'text-red-500 bg-red-500/10';
    if (clr === 'green-500') return 'text-green-500 bg-green-500/10';
    return 'text-primary dark:text-white bg-primary/10 dark:bg-white/10';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/40 dark:hover:border-white/30 transition-all duration-300 shadow-sm flex flex-col gap-1 group cursor-default">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 font-semibold group-hover:text-primary dark:group-hover:text-white transition-colors text-sm">{label}</p>
        <span className={`material-symbols-outlined ${getColorClasses(color)} p-2 rounded-xl text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-black text-primary dark:text-white mt-1">{value}</p>
      <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${subtext.startsWith('+') ||
          subtext.includes('clear') ||
          subtext.includes('modules loaded') ||
          subtext.includes('Estimated load')
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-slate-400'
        }`}>
        {subtext}
      </p>
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ subjects, conflicts, onRemove }) => {
  const currentDay = getDayFromDate(new Date());
  const todaysSchedule = subjects
    .filter(s => s.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalHours = subjects.reduce((acc, curr) => {
    const [hStart, mStart] = curr.startTime.split(':').map(Number);
    const [hEnd, mEnd] = curr.endTime.split(':').map(Number);
    return acc + (hEnd + mEnd / 60) - (hStart + mStart / 60);
  }, 0);

  const getStatIconColor = (color: string) => {
    if (color === 'red-500') return 'text-red-500 bg-red-500/10';
    if (color === 'green-500') return 'text-green-500 bg-green-500/10';
    return 'text-primary bg-primary/10';
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Overview of your semester activities.</p>
          </div>
          <Link to="/add" className="hidden md:flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl transition-all font-black shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Subject</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard label="Total Subjects" value={subjects.length} subtext={`${subjects.length} modules loaded`} icon="book" />
          <StatCard label="Weekly Hours" value={totalHours.toFixed(1)} subtext="Estimated load" icon="schedule" />
          <StatCard
            label="Conflicts"
            value={conflicts.length}
            subtext={conflicts.length > 0 ? "Resolve now" : "All clear"}
            icon="warning"
            color={conflicts.length > 0 ? "red-500" : "green-500"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {conflicts.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-500/40 transition-all duration-300 shadow-sm overflow-hidden group">
                <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 flex flex-col justify-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-6 rounded-full bg-red-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[14px] text-red-500 font-black">priority_high</span>
                        </div>
                        <span className="text-red-700 dark:text-red-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">CRITICAL CLASH</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-primary dark:text-white mb-2 leading-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        Schedule Overlap Detected
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {conflicts[0].message}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/clashes" className="bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        Resolve Now
                      </Link>
                    </div>
                  </div>
                  <div className="w-full sm:w-40 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 group-hover:border-red-500/20 transition-colors">
                    <img src="https://picsum.photos/seed/calendar/300/200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Conflict" />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300 shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-white text-xl">event_upcoming</span>
                  <h3 className="font-black text-base text-primary dark:text-white">Today's Schedule ({currentDay})</h3>
                </div>
                <Link to="/timetable" className="text-primary hover:underline dark:text-slate-300 text-xs font-black uppercase tracking-tighter">View All</Link>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex flex-col relative">
                  <div className="absolute left-[54px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  {todaysSchedule.length > 0 ? todaysSchedule.map((item, idx) => {
                    const isLive = idx === 0; // Simplified for demo
                    return (
                      <div key={item.id} className="flex gap-5 md:gap-6 mb-6 last:mb-0 group relative">
                        <div className="w-[45px] text-right pt-0.5 shrink-0">
                          <span className={`text-[11px] font-black ${isLive ? 'text-primary dark:text-white' : 'text-slate-400'}`}>
                            {item.startTime}
                          </span>
                        </div>
                        <div className="relative z-10 pt-1.5 shrink-0">
                          <div className={`size-3 rounded-full border-4 border-white dark:border-slate-900 ${isLive ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                        </div>
                        <div className={`flex-1 p-4 rounded-2xl border transition-all flex justify-between items-start group-hover:shadow-md ${isLive
                          ? 'bg-white dark:bg-slate-800 border-l-4 border-l-primary shadow-xl scale-[1.01]'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80'
                          }`}>
                          <div className="flex-1 min-w-0">
                            {isLive && (
                              <span className="bg-primary/10 dark:bg-white/10 text-primary dark:text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mb-1 inline-block">COMING UP</span>
                            )}
                            <h4 className="font-black text-primary dark:text-white text-base truncate">{item.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>{item.room}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">history</span>
                                <span>{item.endTime}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-60">
                      <span className="material-symbols-outlined text-4xl mb-2">bedtime</span>
                      <p className="text-sm font-bold italic">No classes today. Rest up!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary dark:text-slate-300 text-lg">build</span>
                <h3 className="font-black text-primary dark:text-white uppercase text-xs tracking-widest">Quick Tools</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'add_circle', label: 'Add', to: '/add' },
                  { icon: 'edit_calendar', label: 'Edit', to: '/timetable' },
                  { icon: 'download', label: 'PDF', action: () => alert('Generating PDF...') },
                  { icon: 'share', label: 'Share', action: () => alert('Opening share...') },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.to || '#'}
                    onClick={action.action}
                    className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-white/5 group transition-all border border-transparent hover:border-primary/10"
                  >
                    <span className="material-symbols-outlined text-accent group-hover:text-primary dark:text-slate-400 dark:group-hover:text-white transition-colors">
                      {action.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary dark:group-hover:text-white">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-slate-300 text-lg">bar_chart</span>
                  <h3 className="font-black text-primary dark:text-white uppercase text-xs tracking-widest">Study Load</h3>
                </div>
                <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full uppercase">WEEK 12</span>
              </div>
              <div className="flex justify-between text-center items-end h-24 gap-2">
                {[
                  { d: 'M', h: '60%' }, { d: 'T', h: '85%', active: true }, { d: 'W', h: '45%' },
                  { d: 'T', h: '55%' }, { d: 'F', h: '30%' }
                ].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full">
                    <div className={`w-full bg-slate-100 dark:bg-slate-800/40 rounded-full relative overflow-hidden h-full ${day.active ? 'ring-2 ring-primary dark:ring-white ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                      <div
                        className={`absolute bottom-0 w-full rounded-full transition-all duration-1000 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] ${day.active
                          ? 'bg-gradient-to-t from-primary to-accent dark:from-white dark:to-slate-300'
                          : 'bg-gradient-to-t from-primary/30 to-accent/30 dark:from-white/20 dark:to-white/5'
                          }`}
                        style={{ height: day.h }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-black ${day.active ? 'text-primary dark:text-white' : 'text-slate-400'}`}>{day.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
