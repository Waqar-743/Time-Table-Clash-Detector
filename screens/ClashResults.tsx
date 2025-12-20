
import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, Conflict, ConflictType } from '../types';

interface Props {
  subjects: Subject[];
  conflicts: Conflict[];
  onRemove: (id: string) => void;
}

const ConflictCard: React.FC<{ conflict: Conflict; subjects: Subject[]; onRemove: (id: string) => void }> = ({ conflict, subjects, onRemove }) => {
  const involved = subjects.filter(s => conflict.subjects.includes(s.id));

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm hover:shadow-xl transition-all hover:border-red-500/30">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {conflict.type}
        </span>
        <span className="text-[9px] font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 uppercase">
          {conflict.timestamp}
        </span>
      </div>
      <div className="space-y-3">
        {involved.map((s, idx) => (
          <React.Fragment key={s.id}>
            {idx > 0 && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">VERSUS</span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
              </div>
            )}
            <div className="flex items-center justify-between group/s bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="min-w-0">
                <p className="text-sm font-black text-primary dark:text-white truncate">{s.title}</p>
                <p className="text-[10px] font-bold text-slate-400">{s.day}, {s.startTime} - {s.endTime}</p>
              </div>
              <button
                onClick={() => onRemove(s.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove to resolve"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Link
          to="/timetable"
          className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-primary dark:text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all text-center"
        >
          Fix Manually in Timetable
        </Link>
      </div>
    </div>
  );
};

const ClashResults: React.FC<Props> = ({ subjects, conflicts, onRemove }) => {
  return (
    <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
      <div className="flex-none p-5 md:p-8 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl font-black text-primary dark:text-white tracking-tighter">Clash Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Review and resolve timetable conflicts.</p>
          </div>
          <button
            onClick={() => alert('Report summary:\nDetected ' + conflicts.length + ' conflicts.')}
            className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 px-5 h-11 rounded-xl text-primary dark:text-white font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl p-5 border border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30">
            <p className="text-[10px] font-black uppercase text-red-400 mb-1">Clashes</p>
            <p className="text-3xl font-black text-primary dark:text-white">{conflicts.length}</p>
          </div>
          <div className="rounded-2xl p-5 border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Modules Impacted</p>
            <p className="text-3xl font-black text-primary dark:text-white">{new Set(conflicts.flatMap(c => c.subjects)).size}</p>
          </div>
          <div className="rounded-2xl p-5 border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-900/30">
            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Resolved</p>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">0</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 px-5 md:px-8 lg:px-10 pb-10 overflow-visible lg:overflow-hidden">
        <div className="w-full lg:w-[400px] flex flex-col shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-primary dark:text-white">Active Conflict List</h3>
            <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-black text-[9px] px-2 py-1 rounded-full uppercase">{conflicts.length} CRITICAL</span>
          </div>
          <div className="flex-1 overflow-y-visible lg:overflow-y-auto pr-0 lg:pr-2 flex flex-col gap-4">
            {conflicts.length > 0 ? conflicts.map(c => (
              <ConflictCard key={c.id} conflict={c} subjects={subjects} onRemove={onRemove} />
            )) : (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center px-6">
                <span className="material-symbols-outlined text-5xl text-emerald-500 mb-4">check_circle</span>
                <p className="text-slate-500 font-bold text-sm">Your schedule is perfectly aligned!</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              Conflicts must be resolved manually. Go to the <Link to="/timetable" className="text-primary dark:text-white underline">Timetable</Link> and drag subjects to move them to a different time slot.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/50">
            <h3 className="font-black text-sm text-primary dark:text-white">Clash Visualization Map</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-red-500 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Conflict Zone</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-5 h-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 relative">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} className="border-r last:border-r-0 border-slate-100 dark:border-slate-800 h-full relative p-4 bg-slate-50/10">
                  <p className="text-[10px] font-black text-slate-300 text-center uppercase mb-6">{day}</p>
                  {i === 1 && conflicts.length > 0 && (
                    <div className="absolute top-24 left-1 right-1 h-32 rounded-xl bg-pattern-clash border-l-4 border-red-500 p-3 ring-4 ring-red-400/10 shadow-lg animate-pulse">
                      <p className="text-[10px] text-red-600 font-black">COLLISION</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col gap-14 opacity-5">
                {[9, 10, 11, 12, 1, 2, 3, 4].map(h => (
                  <div key={h} className="h-px w-full bg-black dark:bg-white"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClashResults;
