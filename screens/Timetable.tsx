
import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, SubjectType, DayOfWeek } from '../types';

interface Props {
  subjects: Subject[];
  onRemove: (id: string) => void;
  onUpdate: (subject: Subject) => void;
  currentUserEmail?: string;
}

const Timetable: React.FC<Props> = ({ subjects, onRemove, onUpdate, currentUserEmail }) => {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 08:00 to 17:00

  const getEventStyle = (subject: Subject) => {
    const startParts = subject.startTime.split(':').map(Number);
    const endParts = subject.endTime.split(':').map(Number);

    const startMins = (startParts[0] - 8) * 60 + startParts[1];
    const endMins = (endParts[0] - 8) * 60 + endParts[1];
    const durationMins = endMins - startMins;

    return {
      top: `${(startMins / 60) * 80 + 10}px`, // 80px per hour
      height: `${(durationMins / 60) * 80 - 10}px`,
    };
  };

  const handleDragStart = (e: React.DragEvent, subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject && subject.userEmail !== currentUserEmail) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('subjectId', subjectId);
    e.dataTransfer.effectAllowed = 'move';

    // Create a ghost image or just set a class
    const target = e.target as HTMLElement;
    target.style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: DayOfWeek) => {
    e.preventDefault();
    const subjectId = e.dataTransfer.getData('subjectId');
    const subject = subjects.find(s => s.id === subjectId);

    if (!subject) return;

    // Calculate Y position relative to the grid container
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Each hour is 80px. Start hour is 08:00
    // We'll snap to 30-minute intervals (40px)
    const totalMinutes = Math.floor(y / 40) * 30;
    const newStartHour = Math.floor(totalMinutes / 60) + 8;
    const newStartMinutes = totalMinutes % 60;

    // Format new start time
    const startTimeStr = `${newStartHour.toString().padStart(2, '0')}:${newStartMinutes.toString().padStart(2, '0')}`;

    // Calculate duration to keep it the same
    const startParts = subject.startTime.split(':').map(Number);
    const endParts = subject.endTime.split(':').map(Number);
    const durationMins = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);

    const endTotalMinutes = (newStartHour * 60 + newStartMinutes) + durationMins;
    const newEndHour = Math.floor(endTotalMinutes / 60);
    const newEndMinutes = endTotalMinutes % 60;
    const endTimeStr = `${newEndHour.toString().padStart(2, '0')}:${newEndMinutes.toString().padStart(2, '0')}`;

    // Update subject
    onUpdate({
      ...subject,
      day,
      startTime: startTimeStr,
      endTime: endTimeStr
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="flex-none flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary dark:text-white">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-primary dark:text-white tracking-tighter">My Timetable</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Drag subjects to reschedule</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/add" className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Add Event</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters - Hidden on small mobile */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:flex flex-col gap-8">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">LEGEND</h3>
            <ul className="space-y-4">
              {[
                { label: 'Lecture', color: 'bg-primary/5 dark:bg-primary/20 border-primary' },
                { label: 'Lab / Practical', color: 'bg-green-50 dark:bg-green-900/20 border-green-500' },
                { label: 'Tutorial', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-500' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`size-3 rounded-full border ${item.color.split(' ')[0]} ${item.color.split(' ')[2]}`}></div>
                  <span className={`text-sm font-bold text-slate-600 dark:text-slate-400`}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <p className="text-[11px] font-bold text-slate-500 mb-2">MANUAL RESOLUTION</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Reschedule your classes by dragging the cards to new time slots. Conflicts must be managed manually to ensure your preferences are met.
            </p>
          </div>
        </aside>

        {/* Calendar Grid Container */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/30 relative">
          {/* Scroll instruction for mobile */}
          <div className="lg:hidden absolute top-2 right-4 z-10 bg-black/50 text-white text-[9px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">swap_horiz</span>
            Swipe horizontally
          </div>

          <div className="p-4 md:p-6 min-w-[1000px]">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              {/* Day Headers */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-16 flex-none border-r border-slate-100 dark:border-slate-800"></div>
                {days.map(day => (
                  <div key={day} className="flex-1 p-4 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{day.slice(0, 3)}</p>
                    <p className="text-lg font-black text-primary dark:text-white">
                      {day === 'Monday' ? '21' : day === 'Tuesday' ? '22' : '23'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="flex relative h-[800px]">
                {/* Hour labels */}
                <div className="w-16 flex-none bg-slate-50/20 dark:bg-slate-800/10 border-r border-slate-100 dark:border-slate-800">
                  {hours.map(h => (
                    <div key={h} className="h-20 text-right pr-3 pt-2">
                      <span className="text-[10px] font-black text-slate-400">{h}:00</span>
                    </div>
                  ))}
                </div>

                {/* Grid columns */}
                <div className="flex-1 grid grid-cols-5 relative">
                  {days.map(day => (
                    <div
                      key={day}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day)}
                      className="flex-1 border-r last:border-r-0 border-slate-100 dark:border-slate-800 relative group transition-colors hover:bg-primary/5 cursor-crosshair"
                    >
                      {subjects.filter(s => s.day === day).map(subject => {
                        const baseColor = subject.color || '#0C2B4E';
                        const isOwner = subject.userEmail === currentUserEmail;
                        return (
                          <div
                            key={subject.id}
                            draggable={isOwner}
                            onDragStart={(e) => handleDragStart(e, subject.id)}
                            onDragEnd={handleDragEnd}
                            className={`absolute left-1 right-1 md:left-2 md:right-2 rounded-xl p-3 border-l-4 shadow-sm hover:shadow-xl hover:z-20 transition-all ${isOwner ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} group/item overflow-hidden`}
                            style={{
                              ...getEventStyle(subject),
                              backgroundColor: `${baseColor}15`, // 15% opacity
                              borderLeftColor: baseColor,
                              color: baseColor,
                              opacity: isOwner ? 1 : 0.7
                            }}
                          >
                            <div className="absolute inset-0 bg-white/40 dark:bg-black/20 -z-10 group-hover/item:opacity-0 transition-opacity"></div>

                            <div className="flex justify-between items-start pointer-events-none">
                              <p className="text-[9px] font-black opacity-80 mb-0.5" style={{ color: baseColor }}>{subject.startTime} - {subject.endTime}</p>
                              {isOwner && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onRemove(subject.id); }}
                                  className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:text-red-500 transition-all pointer-events-auto"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              )}
                            </div>
                            <h4 className="text-[11px] font-black leading-tight line-clamp-2 pointer-events-none" style={{ color: baseColor }}>
                              {subject.title} {!isOwner && <span className="text-[8px] opacity-60">({subject.userEmail?.split('@')[0]})</span>}
                            </h4>
                            <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] font-bold opacity-80 pointer-events-none" style={{ color: baseColor }}>
                              <span className="material-symbols-outlined text-[12px]">location_on</span>
                              <span className="truncate">{subject.room}</span>
                            </div>

                            {/* Drag handle visual */}
                            {isOwner && (
                              <div className="absolute bottom-1 right-1 opacity-0 group-hover/item:opacity-30">
                                <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* Horizontal background lines */}
                      {hours.map((_, i) => (
                        <div key={i} className="absolute w-full h-px bg-slate-100 dark:bg-slate-800 pointer-events-none" style={{ top: `${(i + 1) * 80}px` }}></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Timetable;
