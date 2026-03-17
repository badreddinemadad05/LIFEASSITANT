/* ═══════════════════════════════════════════════════════
   LIFEOS — APPLICATION JAVASCRIPT
   ═══════════════════════════════════════════════════════ */

'use strict';

// ════════════════════════════════════════════════════════
//  STORAGE
// ════════════════════════════════════════════════════════
const DB = {
  PREFIX: 'lifeos_',
  get(key) {
    try { return JSON.parse(localStorage.getItem(this.PREFIX + key)) || null; } catch { return null; }
  },
  set(key, val) {
    try { localStorage.setItem(this.PREFIX + key, JSON.stringify(val)); } catch(e) { console.error('Storage error', e); }
  },
  remove(key) { localStorage.removeItem(this.PREFIX + key); },

  // Events
  getEvents()          { return this.get('events') || []; },
  saveEvents(e)        { this.set('events', e); },
  addEvent(ev)         { const list = this.getEvents(); list.push(ev); this.saveEvents(list); },
  updateEvent(ev)      { const list = this.getEvents(); const i = list.findIndex(x=>x.id===ev.id); if(i>-1){list[i]=ev;this.saveEvents(list);} },
  deleteEvent(id)      { this.saveEvents(this.getEvents().filter(e=>e.id!==id)); },
  getEventsForDate(d)  { return this.getEvents().filter(e=>e.date===d); },

  // Tasks
  getTasks()           { return this.get('tasks') || []; },
  saveTasks(t)         { this.set('tasks', t); },
  addTask(t)           { const list = this.getTasks(); list.push(t); this.saveTasks(list); },
  updateTask(t)        { const list = this.getTasks(); const i = list.findIndex(x=>x.id===t.id); if(i>-1){list[i]=t;this.saveTasks(list);} },
  deleteTask(id)       { this.saveTasks(this.getTasks().filter(t=>t.id!==id)); },

  // Subjects
  getSubjects()        { return this.get('subjects') || []; },
  saveSubjects(s)      { this.set('subjects', s); },
  addSubject(s)        { const list = this.getSubjects(); list.push(s); this.saveSubjects(list); },
  updateSubject(s)     { const list = this.getSubjects(); const i = list.findIndex(x=>x.id===s.id); if(i>-1){list[i]=s;this.saveSubjects(list);} },
  deleteSubject(id)    { this.saveSubjects(this.getSubjects().filter(s=>s.id!==id)); this.saveLessons(this.getLessons().filter(l=>l.subjectId!==id)); this.saveSubjectTasks(this.getSubjectTasks().filter(t=>t.subjectId!==id)); this.saveSubjectResources(this.getSubjectResources().filter(r=>r.subjectId!==id)); const _n=this.getSubjectNotes(); delete _n[id]; this.set('subject_notes',_n); },

  // Lessons
  getLessons()         { return this.get('lessons') || []; },
  saveLessons(l)       { this.set('lessons', l); },
  addLesson(l)         { const list = this.getLessons(); list.push(l); this.saveLessons(list); },
  updateLesson(l)      { const list = this.getLessons(); const i = list.findIndex(x=>x.id===l.id); if(i>-1){list[i]=l;this.saveLessons(list);} },
  deleteLesson(id)     { this.saveLessons(this.getLessons().filter(l=>l.id!==id)); },
  getLessonsForSubject(sid) { return this.getLessons().filter(l=>l.subjectId===sid); },

  // Subject Tasks (Learning)
  getSubjectTasks()        { return this.get('subject_tasks') || []; },
  saveSubjectTasks(t)      { this.set('subject_tasks', t); },
  addSubjectTask(t)        { const list = this.getSubjectTasks(); list.push(t); this.saveSubjectTasks(list); },
  updateSubjectTask(t)     { const list = this.getSubjectTasks(); const i = list.findIndex(x=>x.id===t.id); if(i>-1){list[i]=t;this.saveSubjectTasks(list);} },
  deleteSubjectTask(id)    { this.saveSubjectTasks(this.getSubjectTasks().filter(t=>t.id!==id)); },
  getTasksForSubject(sid)  { return this.getSubjectTasks().filter(t=>t.subjectId===sid); },

  // Subject Resources (Learning)
  getSubjectResources()       { return this.get('subject_resources') || []; },
  saveSubjectResources(r)     { this.set('subject_resources', r); },
  addSubjectResource(r)       { const list = this.getSubjectResources(); list.push(r); this.saveSubjectResources(list); },
  updateSubjectResource(r)    { const list = this.getSubjectResources(); const i = list.findIndex(x=>x.id===r.id); if(i>-1){list[i]=r;this.saveSubjectResources(list);} },
  deleteSubjectResource(id)   { this.saveSubjectResources(this.getSubjectResources().filter(r=>r.id!==id)); },
  getResourcesForSubject(sid) { return this.getSubjectResources().filter(r=>r.subjectId===sid); },

  // Subject Notes (Learning)
  getSubjectNotes()          { return this.get('subject_notes') || {}; },
  getSubjectNote(sid)        { return (this.getSubjectNotes())[sid] || ''; },
  saveSubjectNote(sid, text) { const n = this.getSubjectNotes(); n[sid] = text; this.set('subject_notes', n); },

  // Habits
  getHabits()          { return this.get('habits') || []; },
  saveHabits(h)        { this.set('habits', h); },
  addHabit(h)          { const list = this.getHabits(); list.push(h); this.saveHabits(list); },
  updateHabit(h)       { const list = this.getHabits(); const i = list.findIndex(x=>x.id===h.id); if(i>-1){list[i]=h;this.saveHabits(list);} },
  deleteHabit(id)      { this.saveHabits(this.getHabits().filter(h=>h.id!==id)); },

  // Habit logs
  getHabitLogs()       { return this.get('habitLogs') || {}; },
  saveHabitLogs(l)     { this.set('habitLogs', l); },
  toggleHabitLog(habitId, date) {
    const logs = this.getHabitLogs();
    if (!logs[date]) logs[date] = {};
    logs[date][habitId] = !logs[date][habitId];
    this.saveHabitLogs(logs);
    return logs[date][habitId];
  },
  isHabitDone(habitId, date) { const l = this.getHabitLogs(); return !!(l[date] && l[date][habitId]); },

  // Goals
  getGoals()           { return this.get('goals') || []; },
  saveGoals(g)         { this.set('goals', g); },
  addGoal(g)           { const list = this.getGoals(); list.push(g); this.saveGoals(list); },
  updateGoal(g)        { const list = this.getGoals(); const i = list.findIndex(x=>x.id===g.id); if(i>-1){list[i]=g;this.saveGoals(list);} },
  deleteGoal(id)       { this.saveGoals(this.getGoals().filter(g=>g.id!==id)); },

  // Notes
  getNotes()           { return this.get('notes') || []; },
  saveNotes(n)         { this.set('notes', n); },
  addNote(n)           { const list = this.getNotes(); list.push(n); this.saveNotes(list); },
  updateNote(n)        { const list = this.getNotes(); const i = list.findIndex(x=>x.id===n.id); if(i>-1){list[i]=n;this.saveNotes(list);} },
  deleteNote(id)       { this.saveNotes(this.getNotes().filter(n=>n.id!==id)); },

  // Journal
  getJournal()         { return this.get('journal') || {}; },
  getJournalEntry(d)   { return (this.getJournal())[d] || null; },
  saveJournalEntry(d, entry) { const j = this.getJournal(); j[d] = entry; this.set('journal', j); },

  // Transactions (Finances module)
  getTransactions()      { return this.get('transactions') || []; },
  saveTransactions(t)    { this.set('transactions', t); },
  addTransaction(t)      { const list = this.getTransactions(); list.push(t); this.saveTransactions(list); },
  updateTransaction(t)   { const list = this.getTransactions(); const i = list.findIndex(x=>x.id===t.id); if(i>-1){list[i]=t;this.saveTransactions(list);} },
  deleteTransaction(id)  { this.saveTransactions(this.getTransactions().filter(t=>t.id!==id)); },

  // Phrases (Languages module)
  getPhrases()        { return this.get('phrases') || []; },
  savePhrases(p)      { this.set('phrases', p); },
  addPhrase(p)        { const list = this.getPhrases(); list.push(p); this.savePhrases(list); },
  updatePhrase(p)     { const list = this.getPhrases(); const i = list.findIndex(x=>x.id===p.id); if(i>-1){list[i]=p;this.savePhrases(list);} },
  deletePhrase(id)    { this.savePhrases(this.getPhrases().filter(p=>p.id!==id)); },

  // Settings
  getSettings()        { return this.get('settings') || { name:'Badr', avatar:'B', theme:'light', primaryColor:'#6366f1', startHour:5, endHour:23 }; },
  saveSettings(s)      { this.set('settings', s); },

  // Utils
  generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
  todayStr()   { return new Date().toISOString().slice(0,10); },
};

// ════════════════════════════════════════════════════════
//  UTILS
// ════════════════════════════════════════════════════════
const Utils = {
  formatDate(d) {
    const date = d instanceof Date ? d : new Date(d+'T00:00:00');
    return date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  },
  formatDateShort(d) {
    const date = d instanceof Date ? d : new Date(d+'T00:00:00');
    return date.toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
  },
  formatTime(t) { return t || ''; },
  formatDateFull(date) {
    return date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  },
  getDayName(date) {
    return date.toLocaleDateString('fr-FR', { weekday:'short' }).charAt(0).toUpperCase() + date.toLocaleDateString('fr-FR', { weekday:'short' }).slice(1);
  },
  capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; },
  escHtml(s) {
    if(!s) return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },
  getWeekDates(refDate) {
    const d = new Date(refDate); const day = d.getDay();
    const mon = new Date(d); mon.setDate(d.getDate() - ((day+6)%7));
    return Array.from({length:7}, (_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return x; });
  },
  isSameDay(a, b) { return a.toISOString().slice(0,10) === b.toISOString().slice(0,10); },
  dateStr(date) { return date.toISOString().slice(0,10); },
  timeToMinutes(t) { if(!t) return 0; const [h,m] = t.split(':').map(Number); return h*60+m; },
  minutesToTime(m) { const h = Math.floor(m/60); const min = m%60; return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`; },
  getStreak(habitId) {
    const logs = DB.getHabitLogs();
    let streak = 0; const today = new Date();
    for(let i=0; i<365; i++) {
      const d = new Date(today); d.setDate(today.getDate()-i);
      const ds = Utils.dateStr(d);
      if(logs[ds] && logs[ds][habitId]) streak++;
      else if(i>0) break;
    }
    return streak;
  },
  priorityLabel(p) { return {high:'Haute',medium:'Moyenne',low:'Basse'}[p]||p; },
  categoryLabel(c) { return {work:'Travail',study:'Étude',personal:'Personnel',health:'Santé',social:'Social',other:'Autre',sport:'Sport',finance:'Finance',professional:'Professionnel',learning:'Apprentissage',fitness:'Sport',productivity:'Productivité',mindfulness:'Bien-être'}[c]||c; },
  levelLabel(l) { return {debutant:'Débutant',intermediaire:'Intermédiaire',avance:'Avancé',expert:'Expert'}[l]||l; },
};

const QUOTES = [
  { text: "The secret of getting ahead is getting started. Stop waiting for the perfect moment — it doesn't exist.", author: "Mark Twain", source: "Life Wisdom" },
  { text: "Invest in yourself. Your career is the engine of your wealth.", author: "Paul Clitheroe", source: "Financial Advice" },
  { text: "You are the average of the five people you spend the most time with. Choose wisely.", author: "Jim Rohn", source: "The Art of Exceptional Living" },
  { text: "Your 20s are your 'selfish' years. It's a decade to immerse yourself in every single thing possible. Be selfish with your time, and all-around goals.", author: "Kyoko Escamilla", source: "Life Advice" },
  { text: "Don't compare your chapter 1 to someone else's chapter 20. Run your own race.", author: "Anonymous", source: "Life Wisdom" },
  { text: "Read every day. Not social media — real books. One book a month changes who you are in 5 years.", author: "Charlie Munger", source: "Poor Charlie's Almanack" },
  { text: "Sleep is not a luxury — it's a weapon. Protect it like your most valuable asset.", author: "Matthew Walker", source: "Why We Sleep" },
  { text: "Your habits will either make you or break you. Small daily improvements lead to staggering results.", author: "Robin Sharma", source: "The 5 AM Club" },
  { text: "The most dangerous risk of all is the risk of spending your life not doing what you want, on the bet you can buy yourself the freedom to do it later.", author: "Randy Komisar", source: "The Monk and the Riddle" },
  { text: "Hard choices, easy life. Easy choices, hard life. The pain of discipline is always less than the pain of regret.", author: "Jerzy Gregorek", source: "The Happy Body" },
  { text: "Learn to be comfortable being uncomfortable. Growth lives outside your comfort zone.", author: "David Goggins", source: "Can't Hurt Me" },
  { text: "Your body is the most important tool you'll ever own. Exercise isn't optional — it's maintenance.", author: "James Clear", source: "Atomic Habits" },
  { text: "Show up every day, even when you don't feel like it. Motivation follows action, not the other way around.", author: "Jordan Peterson", source: "12 Rules for Life" },
  { text: "Don't spend money you don't have to impress people you don't like. Save first, spend what's left.", author: "Warren Buffett", source: "Investor Wisdom" },
  { text: "Say yes to things that scare you a little. That fear is the compass pointing to your growth.", author: "Tim Ferriss", source: "The 4-Hour Workweek" },
  { text: "Stop trying to be liked by everyone. The people who matter will respect your authenticity.", author: "Brené Brown", source: "Daring Greatly" },
  { text: "Learn one new skill per year that has nothing to do with your major. Curiosity is a superpower.", author: "Naval Ravikant", source: "The Almanack of Naval Ravikant" },
  { text: "Your attention is your most valuable resource. Guard it from anyone who tries to steal it for free.", author: "Cal Newport", source: "Deep Work" },
  { text: "Failure is not the opposite of success. It is part of success. Fail fast, learn faster.", author: "Arianna Huffington", source: "Thrive" },
  { text: "Start saving money now, even if it's just $20 a month. Compound interest is the eighth wonder of the world.", author: "Albert Einstein", source: "Financial Wisdom" },
  { text: "Learn to cook. It saves money, improves your health, and impresses people — all at once.", author: "Michael Pollan", source: "In Defense of Food" },
  { text: "Write down your goals. People who write their goals are 42% more likely to achieve them.", author: "Dr. Gail Matthews", source: "Research on Goal Setting" },
  { text: "The best investment you can make is in your own abilities. Anything you can do to develop your own abilities is likely to be more productive.", author: "Warren Buffett", source: "Investor Wisdom" },
  { text: "Take care of your mental health. Therapy is not weakness — it is maintenance for your mind.", author: "Anonymous", source: "Modern Wisdom" },
  { text: "Spend time alone with your thoughts. People who can't be alone with themselves are running from something important.", author: "Blaise Pascal", source: "Pensées" },
  { text: "Travel somewhere completely different from home before you're 25. It will change your perspective forever.", author: "Anthony Bourdain", source: "Kitchen Confidential" },
  { text: "Ask for help. The smartest people in any room are the ones willing to admit what they don't know.", author: "Adam Grant", source: "Give and Take" },
  { text: "Stop looking for shortcuts. The 'shortcut' is doing the work consistently, every single day.", author: "David Goggins", source: "Can't Hurt Me" },
  { text: "Your major doesn't define your career. Your skills, network, and work ethic do.", author: "Reid Hoffman", source: "The Start-Up of You" },
  { text: "Drink more water. Most of the fatigue, brain fog, and bad moods you feel are just dehydration.", author: "Anonymous", source: "Health Wisdom" },
  { text: "Every time you feel the urge to scroll mindlessly, replace it with 5 pages of a book. You'll be shocked where you are in a year.", author: "Ryan Holiday", source: "The Daily Stoic" },
  { text: "Learn to say no without guilt. Your time is finite and precious. Protect it.", author: "Greg McKeown", source: "Essentialism" },
  { text: "Build a morning routine. How you start your day determines how you live your day.", author: "Hal Elrod", source: "The Miracle Morning" },
  { text: "Surround yourself with people who push you to be better, not people who are comfortable with you staying the same.", author: "Jim Rohn", source: "The Art of Exceptional Living" },
  { text: "Keep a journal. Your future self will thank you for documenting your thoughts, struggles, and growth.", author: "Marcus Aurelius", source: "Meditations" },
  { text: "Stop comparing your life to a highlight reel on social media. Everyone is fighting a battle you know nothing about.", author: "Plato", source: "Ancient Wisdom" },
  { text: "Learn the basics of finance: budgeting, investing, taxes. Nobody teaches you this in school, but your future depends on it.", author: "Robert Kiyosaki", source: "Rich Dad Poor Dad" },
  { text: "Apologize when you're wrong. It takes more strength to admit a mistake than to defend it.", author: "Anonymous", source: "Life Wisdom" },
  { text: "Eat well. You don't have to be perfect — just eat more vegetables, less junk, and fewer things from a factory.", author: "Michael Pollan", source: "Food Rules" },
  { text: "The people you meet in your 20s will become the network that defines your 30s. Invest in genuine relationships.", author: "Keith Ferrazzi", source: "Never Eat Alone" },
  { text: "Learn to manage your emotions before they manage you. Emotional intelligence is worth more than IQ.", author: "Daniel Goleman", source: "Emotional Intelligence" },
  { text: "Build something. A project, a skill, a blog, a business. Creating things teaches you more than consuming ever will.", author: "Paul Graham", source: "Hackers & Painters" },
  { text: "Forgive people — not for them, but for yourself. Holding a grudge is like drinking poison and expecting the other person to die.", author: "Buddha", source: "Ancient Wisdom" },
  { text: "Quit things that don't serve you. Bad habits, toxic friendships, careers you hate. Life is too short for mediocrity.", author: "Mark Manson", source: "The Subtle Art of Not Giving a F*ck" },
  { text: "Your 20s are for building skills, not just titles. Focus on becoming great at something, not just getting promoted.", author: "Cal Newport", source: "So Good They Can't Ignore You" },
  { text: "Time in the market beats timing the market. Start investing early, even small amounts.", author: "John Bogle", source: "The Little Book of Common Sense Investing" },
  { text: "The discipline you build in your 20s becomes the freedom you enjoy in your 40s.", author: "Anonymous", source: "Life Wisdom" },
  { text: "Learn a second language. It doubles the number of people you can connect with and worlds you can access.", author: "Nelson Mandela", source: "Long Walk to Freedom" },
  { text: "Don't rush into a relationship. Know who you are first. A partner should complement your life, not complete it.", author: "Anonymous", source: "Modern Wisdom" },
  { text: "Get outside every day. Nature reduces cortisol, improves mood, and boosts creativity — for free.", author: "Florence Williams", source: "The Nature Fix" },
  { text: "Be on time. Punctuality is a form of respect that people notice — and so does its absence.", author: "Anonymous", source: "Life Wisdom" },
  { text: "Focus on one thing at a time. Multitasking is a myth that kills quality and drains energy.", author: "Gary Keller", source: "The ONE Thing" },
  { text: "Don't let perfect be the enemy of good. Done and imperfect beats perfect and never started.", author: "Voltaire", source: "Philosophical Wisdom" },
  { text: "Your reputation takes years to build and seconds to destroy. Think before you speak, post, or act.", author: "Warren Buffett", source: "Investor Wisdom" },
  { text: "Stop waiting for motivation. Build systems and routines — motivation is unreliable, discipline is not.", author: "Jocko Willink", source: "Discipline Equals Freedom" },
  { text: "Gratitude is the fastest way to feel better instantly. List 3 things you're grateful for every morning.", author: "Tony Robbins", source: "Awaken the Giant Within" },
  { text: "Learn how to learn. The ability to pick up new skills quickly is the most valuable skill in a changing world.", author: "Scott Young", source: "Ultralearning" },
  { text: "Be kind to strangers. You never know when a small act of kindness becomes the turning point in someone's day.", author: "Anonymous", source: "Life Wisdom" },
  { text: "The quality of your questions determines the quality of your life. Ask better questions.", author: "Tony Robbins", source: "Awaken the Giant Within" },
  { text: "Master the art of delayed gratification. The ability to wait and work toward long-term goals is a rare and powerful skill.", author: "Walter Mischel", source: "The Marshmallow Test" },
  { text: "Spend money on experiences, not things. Experiences become stories, things become clutter.", author: "Thomas Gilovich", source: "Cornell Happiness Research" },
  { text: "Never stop learning. The day you stop learning is the day you start becoming irrelevant.", author: "Albert Einstein", source: "Scientific Wisdom" },
];

// ════════════════════════════════════════════════════════
//  MODAL MANAGER
// ════════════════════════════════════════════════════════
const Modal = {
  current: null,
  open(id) {
    this.closeAll();
    const modal = document.getElementById(id);
    const backdrop = document.getElementById('modalBackdrop');
    if(!modal) return;
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    this.current = id;
    modal.querySelector('input, textarea')?.focus();
  },
  close(id) {
    const modal = document.getElementById(id);
    if(modal) modal.classList.add('hidden');
    if(this.current === id) {
      document.getElementById('modalBackdrop').classList.add('hidden');
      this.current = null;
    }
  },
  closeAll() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.getElementById('modalBackdrop').classList.add('hidden');
    this.current = null;
  }
};
document.getElementById('modalBackdrop').addEventListener('click', () => Modal.closeAll());

// ════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════
const Toast = {
  show(msg, type='info', duration=3000) {
    const icons = {success:'✅', error:'❌', info:'ℹ️', warning:'⚠️'};
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span>${icons[type]||''}</span><span>${Utils.escHtml(msg)}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => { el.classList.add('toast-out'); setTimeout(()=>el.remove(),220); }, duration);
  }
};

// ════════════════════════════════════════════════════════
//  CELEBRATION
// ════════════════════════════════════════════════════════
const Celebration = {
  _timeout: null,

  show(title, msg, big = false) {
    const existing = document.getElementById('celebOverlay');
    if (existing) existing.remove();
    clearTimeout(this._timeout);

    this._spawnConfetti(big ? 90 : 35);

    const overlay = document.createElement('div');
    overlay.id = 'celebOverlay';
    overlay.className = 'celeb-overlay' + (big ? ' celeb-big' : ' celeb-small');
    overlay.innerHTML = `
      <div class="celeb-card">
        <div class="celeb-emoji">${big ? '🏆' : '🎉'}</div>
        <div class="celeb-title">${Utils.escHtml(title)}</div>
        <div class="celeb-msg">${Utils.escHtml(msg)}</div>
      </div>`;
    document.body.appendChild(overlay);

    const duration = big ? 3800 : 2200;
    this._timeout = setTimeout(() => {
      if (!overlay.isConnected) return;
      overlay.classList.add('celeb-exit');
      setTimeout(() => overlay.remove(), 500);
    }, duration);
  },

  _spawnConfetti(count) {
    const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#0ea5e9','#ef4444','#f97316','#a855f7'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-pc';
        const dur = (Math.random() * 1.5 + 1).toFixed(2);
        const delay = (Math.random() * 0.8).toFixed(2);
        const size = Math.floor(Math.random() * 8 + 5);
        el.style.cssText =
          `left:${Math.random()*100}vw;top:-20px;width:${size}px;height:${size}px;` +
          `background:${colors[Math.floor(Math.random()*colors.length)]};` +
          `border-radius:${Math.random()>.5?'50%':'3px'};` +
          `animation:confettiFall ${dur}s ease-in ${delay}s forwards;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), (+dur + +delay) * 1000 + 200);
      }, i * 15);
    }
  }
};

// ════════════════════════════════════════════════════════
//  CLOCK
// ════════════════════════════════════════════════════════
function startClock() {
  let lastDate = DB.todayStr();

  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('clockTime');
    const dateEl = document.getElementById('clockDate');
    if(timeEl) timeEl.textContent = now.toLocaleTimeString('fr-FR');
    if(dateEl) dateEl.textContent = now.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

    // Refresh automatically at midnight (date change)
    const currentDate = DB.todayStr();
    if(currentDate !== lastDate) {
      lastDate = currentDate;
      DashModule.render();
      if(App.currentPage === 'tasks') TaskModule.render();
      if(App.currentPage === 'habits') HabitModule.render();
    }
  }

  tick();
  setInterval(tick, 1000);

  // Update calendar current-time-line every minute
  setInterval(() => {
    if(App.currentPage === 'calendar' && CalModule.currentView === 'day') {
      CalModule.drawCurrentTimeLine();
    }
  }, 60000);

  // Refresh dashboard stats every 5 minutes
  setInterval(() => {
    if(App.currentPage === 'dashboard') {
      DashModule.renderStats(DB.todayStr());
    }
    if(App.currentPage === 'stats') {
      StatsModule.render();
    }
  }, 300000);
}

// ════════════════════════════════════════════════════════
//  DASHBOARD MODULE
// ════════════════════════════════════════════════════════
const DashModule = {
  render() {
    const settings = DB.getSettings();
    const todayStr = DB.todayStr();
    const now = new Date();
    const hour = now.getHours();
    const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const greetEl = document.getElementById('dashGreeting');
    if(greetEl) greetEl.textContent = `${greet}, ${settings.name} 👋`;

    this.renderDailyScore();
    this.renderTimeline(todayStr);
    this.renderTasks(todayStr);
    this.renderHabits(todayStr);
    this.renderGoals();
    this.renderStats(todayStr);
    this.renderQuote();
  },

  renderDailyScore() {
    const el = document.getElementById('dashDailyScore');
    if (!el) return;
    const todayStr = DB.todayStr();
    const tasks = DB.getTasks().filter(t => t.deadline === todayStr);
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const habits = DB.getHabits();
    const doneHabits = habits.filter(h => DB.isHabitDone(h.id, todayStr)).length;
    const totalHabits = habits.length;
    const total = totalTasks + totalHabits;
    const done = doneTasks + doneHabits;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const C = 251.2;
    const offset = C - (pct / 100) * C;
    const isPerfect = pct === 100 && total > 0;

    let msg, msgCls;
    if (total === 0)      { msg = '🚀 Planifie ta journée !'; msgCls = ''; }
    else if (isPerfect)   { msg = '🏆 Journée parfaite ! Tout est accompli !'; msgCls = 'score-msg-perfect'; }
    else if (pct >= 75)   { msg = '🔥 Excellent, tu y es presque !'; msgCls = 'score-msg-good'; }
    else if (pct >= 50)   { msg = '💪 Tu es à mi-chemin, continue !'; msgCls = ''; }
    else if (done === 0)  { msg = '⚡ Prêt à démarrer ta journée ?'; msgCls = ''; }
    else                  { msg = '⚡ Tu avances, ne t\'arrête pas !'; msgCls = ''; }

    el.innerHTML = `
      <div class="score-ring-wrap">
        <svg viewBox="0 0 90 90" width="90" height="90">
          <circle class="score-ring-bg" cx="45" cy="45" r="40"/>
          <circle class="score-ring-fill${isPerfect?' perfect':''}" cx="45" cy="45" r="40"
            style="stroke-dashoffset:${offset}"/>
        </svg>
        <div class="score-pct-text">${pct}%</div>
      </div>
      <div class="score-info">
        <div class="score-title">Score du jour</div>
        <div class="score-breakdown">
          ${totalTasks > 0 ? `<div class="score-item"><div class="score-dot"></div>${doneTasks}/${totalTasks} tâche${totalTasks>1?'s':''}</div>` : ''}
          ${totalHabits > 0 ? `<div class="score-item"><div class="score-dot habits"></div>${doneHabits}/${totalHabits} habitude${totalHabits>1?'s':''}</div>` : ''}
          ${total === 0 ? '<div class="score-item" style="color:var(--text-muted)">Aucun élément planifié aujourd\'hui</div>' : ''}
        </div>
        <div class="score-msg ${msgCls}">${msg}</div>
      </div>`;
  },

  renderTimeline(todayStr) {
    const events = DB.getEventsForDate(todayStr).sort((a,b) => Utils.timeToMinutes(a.start) - Utils.timeToMinutes(b.start));
    const tl = document.getElementById('dashTimeline');
    const badge = document.getElementById('dashEventCount');
    if(!tl) return;
    badge.textContent = `${events.length} événement${events.length!==1?'s':''}`;
    if(events.length === 0) {
      tl.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><p>Aucun événement aujourd'hui</p><button class="btn btn-sm btn-primary" onclick="App.openQuickAdd('event')">Ajouter un événement</button></div>`;
      return;
    }
    tl.innerHTML = events.map(ev => `
      <div class="timeline-item" style="border-left-color:${ev.color||'var(--primary)'};background:${ev.color||'var(--primary)'}18" onclick="CalModule.editEvent('${ev.id}')">
        <div class="timeline-time">${ev.start||'--:--'} – ${ev.end||'--:--'}</div>
        <div>
          <div class="timeline-title">${Utils.escHtml(ev.title)}</div>
          ${ev.location ? `<div class="timeline-desc">📍 ${Utils.escHtml(ev.location)}</div>` : ''}
        </div>
      </div>`).join('');
  },

  renderTasks(todayStr) {
    const allToday = DB.getTasks().filter(t => t.deadline === todayStr);
    const pending = allToday.filter(t => t.status !== 'done').slice(0, 6);
    const el = document.getElementById('dashTasksList');
    const badge = document.getElementById('dashTaskCount');
    if (!el) return;
    const pendingCount = allToday.filter(t => t.status !== 'done').length;
    badge.textContent = `${pendingCount} tâche${pendingCount !== 1 ? 's' : ''}`;

    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = Utils.dateStr(tomorrow);
    const tomorrowTasks = DB.getTasks().filter(t => t.deadline === tomorrowStr && t.status !== 'done').slice(0, 4);

    const tomorrowHtml = tomorrowTasks.length > 0 ? `
      <div class="tomorrow-preview">
        <div class="tomorrow-label">📅 Demain</div>
        ${tomorrowTasks.map(t => `<div class="tomorrow-task-item">
          <div class="priority-dot priority-${t.priority}"></div>
          ${Utils.escHtml(t.title)}
        </div>`).join('')}
      </div>` : '';

    if (allToday.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">✅</div><p>Aucune tâche pour aujourd'hui</p><button class="btn btn-sm btn-primary" onclick="App.openQuickAdd('task')">Ajouter une tâche</button></div>${tomorrowHtml}`;
      return;
    }

    if (pending.length === 0) {
      el.innerHTML = `
        <div class="all-done-msg">
          <span class="all-done-icon">✅</span>
          <div>
            <div class="all-done-title">Toutes les tâches terminées !</div>
            <div class="all-done-sub">Bravo, belle journée de productivité !</div>
          </div>
        </div>
        ${tomorrowHtml}`;
      return;
    }

    el.innerHTML = pending.map(t => `
      <div class="dash-task-item" onclick="TaskModule.openModal('${t.id}')">
        <div class="task-checkbox" onclick="event.stopPropagation();TaskModule.quickToggle('${t.id}')"></div>
        <div class="flex-1">
          <div class="dash-task-title">${Utils.escHtml(t.title)}</div>
          ${t.time ? `<div style="font-size:11px;color:var(--text-muted)">${t.time}</div>` : ''}
        </div>
        <span class="task-badge priority-${t.priority}">${Utils.priorityLabel(t.priority)}</span>
        <button class="dash-task-del" onclick="event.stopPropagation();TaskModule.removeTask('${t.id}')" title="Supprimer la tâche">×</button>
      </div>`).join('');
  },

  renderHabits(todayStr) {
    const habits = DB.getHabits();
    const el = document.getElementById('dashHabitsList');
    const badge = document.getElementById('dashHabitProgress');
    if (!el) return;
    const done = habits.filter(h => DB.isHabitDone(h.id, todayStr)).length;
    badge.textContent = `${done} / ${habits.length}`;

    if (habits.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><p>Aucune habitude définie</p><button class="btn btn-sm btn-primary" onclick="App.navigate('habits')">Configurer</button></div>`;
      return;
    }

    // Hide done habits — only show remaining
    const remaining = habits.filter(h => !DB.isHabitDone(h.id, todayStr));

    if (remaining.length === 0) {
      el.innerHTML = `
        <div class="all-done-msg">
          <span class="all-done-icon">🌟</span>
          <div>
            <div class="all-done-title">Toutes les habitudes validées !</div>
            <div class="all-done-sub">Félicitations pour ta constance !</div>
          </div>
        </div>`;
      return;
    }

    el.innerHTML = remaining.slice(0, 6).map(h => `
      <div class="dash-habit-row">
        <div class="dash-habit-info">
          <span class="habit-icon-sm">${h.icon || '⭐'}</span>
          <span>${Utils.escHtml(h.name)}</span>
        </div>
        <div class="task-checkbox" onclick="HabitModule.dashToggle('${h.id}','${todayStr}')"></div>
      </div>`).join('');
  },

  renderGoals() {
    const goals = DB.getGoals().filter(g => g.status !== 'completed').slice(0, 4);
    const el = document.getElementById('dashGoalsList');
    if(!el) return;
    if(goals.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">🎯</div><p>Aucun objectif défini</p><button class="btn btn-sm btn-primary" onclick="App.navigate('goals')">Définir un objectif</button></div>`;
      return;
    }
    el.innerHTML = goals.map(g => `
      <div class="dash-goal-item">
        <div class="dash-goal-header">
          <span>${Utils.escHtml(g.title)}</span>
          <span class="text-primary-color">${g.progress||0}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${g.progress||0}%"></div></div>
      </div>`).join('');
  },

  renderStats(todayStr) {
    const tasks = DB.getTasks();
    const week = this.getWeekRange();
    const doneTasks = tasks.filter(t => t.status==='done' && t.completedAt >= week.start && t.completedAt <= week.end).length;
    const habits = DB.getHabits();
    const doneTodayHabits = habits.filter(h => DB.isHabitDone(h.id, todayStr)).length;
    const habitRate = habits.length ? Math.round((doneTodayHabits/habits.length)*100) : 0;
    const goals = DB.getGoals().filter(g => g.status!=='completed').length;

    // Study time from events this week
    const events = DB.getEvents().filter(e => e.date >= week.start && e.date <= week.end && e.category === 'study');
    let studyMin = 0;
    events.forEach(e => { if(e.start&&e.end){ studyMin += Utils.timeToMinutes(e.end) - Utils.timeToMinutes(e.start); } });
    const studyH = Math.round(studyMin/60*10)/10;

    const s = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    s('statTasksDone', doneTasks);
    s('statHabitRate', habitRate+'%');
    s('statStudyTime', studyH+'h');
    s('statGoalsActive', goals);
  },

  getWeekRange() {
    const today = new Date();
    const days = Utils.getWeekDates(today);
    return { start: Utils.dateStr(days[0]), end: Utils.dateStr(days[6]) };
  },

  renderQuote() {
    // Same quote all day, changes at midnight — deterministic from date
    const dayIndex = Math.floor(Date.now() / 86400000);
    const q = QUOTES[dayIndex % QUOTES.length];
    const t = document.getElementById('quoteText');
    const a = document.getElementById('quoteAuthor');
    if(t) t.textContent = q.text;
    if(a) a.textContent = `— ${q.author}${q.source ? '  ·  ' + q.source : ''}`;
  }
};

// ════════════════════════════════════════════════════════
//  CALENDAR MODULE
// ════════════════════════════════════════════════════════
const CalModule = {
  currentView: 'day',
  currentDate: new Date(),
  charts: {},

  init() {
    document.getElementById('calPrev').addEventListener('click', () => this.navigate(-1));
    document.getElementById('calNext').addEventListener('click', () => this.navigate(1));
    document.getElementById('calTodayBtn').addEventListener('click', () => { this.currentDate = new Date(); this.render(); });
    document.querySelectorAll('.view-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.dataset.view;
        this.render();
      });
    });
    document.getElementById('eventSaveBtn').addEventListener('click', () => this.saveEvent());
    document.getElementById('eventDeleteBtn').addEventListener('click', () => this.deleteCurrentEvent());
    this.render();
  },

  navigate(dir) {
    const d = this.currentDate;
    if(this.currentView === 'day') d.setDate(d.getDate()+dir);
    else if(this.currentView === 'week') d.setDate(d.getDate()+(dir*7));
    else if(this.currentView === 'month') d.setMonth(d.getMonth()+dir);
    this.render();
  },

  render() {
    const container = document.getElementById('calendarContainer');
    const label = document.getElementById('calCurrentLabel');
    if(!container) return;
    if(this.currentView === 'day') {
      label.textContent = Utils.capitalize(Utils.formatDate(this.currentDate));
      container.innerHTML = this.renderDayView();
      this.addDayClickHandlers();
      this.drawCurrentTimeLine();
    } else if(this.currentView === 'week') {
      const days = Utils.getWeekDates(this.currentDate);
      label.textContent = `${Utils.formatDateShort(days[0])} – ${Utils.formatDateShort(days[6])} ${days[0].getFullYear()}`;
      container.innerHTML = this.renderWeekView(days);
      this.addWeekClickHandlers(days);
    } else {
      label.textContent = Utils.capitalize(this.currentDate.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}));
      container.innerHTML = this.renderMonthView();
      this.addMonthClickHandlers();
    }
  },

  renderDayView() {
    const settings = DB.getSettings();
    const start = settings.startHour || 5;
    const end = settings.endHour || 23;
    const dateStr = Utils.dateStr(this.currentDate);
    const events = DB.getEventsForDate(dateStr);
    const hours = Array.from({length: end-start+1}, (_,i) => i+start);

    let slots = hours.map(h => `
      <div class="time-slot" data-hour="${h}" data-date="${dateStr}">
        <div class="time-slot-half"></div>
      </div>`).join('');

    let evHtml = '';
    events.forEach(ev => {
      if(!ev.start) return;
      const startMin = Utils.timeToMinutes(ev.start);
      const endMin = ev.end ? Utils.timeToMinutes(ev.end) : startMin+60;
      const top = ((startMin - start*60) / 60) * 60;
      const height = Math.max(((endMin - startMin) / 60) * 60, 24);
      evHtml += `
        <div class="cal-event" style="top:${top}px;height:${height}px;background:${ev.color||'var(--primary)'};" onclick="CalModule.editEvent('${ev.id}')">
          <span class="cal-event-title">${Utils.escHtml(ev.title)}</span>
          <span class="cal-event-time">${ev.start}${ev.end?' – '+ev.end:''}</span>
        </div>`;
    });

    const totalH = (end - start + 1) * 60;
    return `
      <div class="day-view">
        <div class="day-header">
          <div class="day-header-title">${Utils.capitalize(Utils.formatDate(this.currentDate))}</div>
          <div class="day-header-sub">${events.length} événement${events.length!==1?'s':''}</div>
        </div>
        <div class="time-grid">
          <div class="time-labels">${hours.map(h=>`<div class="time-label">${String(h).padStart(2,'0')}:00</div>`).join('')}</div>
          <div class="time-slots-area" style="height:${totalH}px">
            ${slots}
            <div id="calEventLayer" style="position:absolute;inset:0;pointer-events:none">${evHtml}</div>
            <div class="current-time-line" id="ctLine" style="display:none"></div>
          </div>
        </div>
      </div>`;
  },

  addDayClickHandlers() {
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const date = slot.dataset.date;
        const hour = slot.dataset.hour;
        this.openNewEvent(date, `${String(hour).padStart(2,'0')}:00`, `${String(parseInt(hour)+1).padStart(2,'0')}:00`);
      });
    });
    // Re-enable pointer events on event layer
    const layer = document.getElementById('calEventLayer');
    if(layer) layer.style.pointerEvents = 'all';
  },

  drawCurrentTimeLine() {
    const settings = DB.getSettings();
    const start = settings.startHour || 5;
    const now = new Date();
    const todayStr = Utils.dateStr(new Date());
    if(Utils.dateStr(this.currentDate) !== todayStr) return;
    const line = document.getElementById('ctLine');
    if(!line) return;
    const nowMin = now.getHours()*60 + now.getMinutes();
    const top = ((nowMin - start*60) / 60) * 60;
    if(top < 0) return;
    line.style.display = 'flex';
    line.style.top = top + 'px';
  },

  renderWeekView(days) {
    const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const settings = DB.getSettings();
    const start = settings.startHour || 5;
    const end = settings.endHour || 23;
    const todayStr = Utils.dateStr(new Date());
    const hours = Array.from({length: end-start+1}, (_,i)=>i+start);

    const headerCells = days.map((d,i) => {
      const ds = Utils.dateStr(d);
      const isToday = ds === todayStr;
      return `<div class="week-header-cell ${isToday?'today':''}">
        <span class="day-num">${d.getDate()}</span>
        <span>${dayNames[i]}</span>
      </div>`;
    }).join('');

    const timeCol = hours.map(h=>`<div class="week-time-cell">${String(h).padStart(2,'0')}:00</div>`).join('');

    const dayCols = days.map(d => {
      const ds = Utils.dateStr(d);
      const evs = DB.getEventsForDate(ds);
      const cells = hours.map(h=>`<div class="week-cell" data-date="${ds}" data-hour="${h}"></div>`).join('');
      const evHtml = evs.map(ev => {
        if(!ev.start) return '';
        const startMin = Utils.timeToMinutes(ev.start);
        const endMin = ev.end ? Utils.timeToMinutes(ev.end) : startMin+60;
        const top = ((startMin - start*60)/60)*48;
        const height = Math.max(((endMin-startMin)/60)*48, 18);
        return `<div class="cal-event" style="top:${top}px;height:${height}px;background:${ev.color||'var(--primary)'};" onclick="CalModule.editEvent('${ev.id}')">${Utils.escHtml(ev.title)}</div>`;
      }).join('');
      return `<div class="week-day-col" style="position:relative">${cells}<div style="position:absolute;inset:0;pointer-events:none">${evHtml}</div></div>`;
    }).join('');

    return `
      <div class="week-view" style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
        <div style="min-width:560px;">
          <div class="week-header" style="grid-template-columns:56px repeat(7,1fr)">
            <div></div>${headerCells}
          </div>
          <div class="week-body">
            <div class="week-time-col">${timeCol}</div>
            <div class="week-days-grid" style="flex:1;display:grid;grid-template-columns:repeat(7,1fr)">${dayCols}</div>
          </div>
        </div>
      </div>`;
  },

  addWeekClickHandlers(days) {
    document.querySelectorAll('.week-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const h = cell.dataset.hour;
        this.openNewEvent(cell.dataset.date, `${String(h).padStart(2,'0')}:00`, `${String(parseInt(h)+1).padStart(2,'0')}:00`);
      });
    });
  },

  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);
    const startDay = (firstDay.getDay()+6)%7; // Mon=0
    const todayStr = Utils.dateStr(new Date());
    const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

    const headers = dayNames.map(d=>`<div class="month-day-name">${d}</div>`).join('');

    const cells = [];
    // Prev month padding
    for(let i=0; i<startDay; i++) {
      const d = new Date(year, month, -startDay+i+1);
      cells.push(`<div class="month-cell other-month"><div class="month-cell-num">${d.getDate()}</div></div>`);
    }
    // Current month
    for(let i=1; i<=lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const ds = Utils.dateStr(d);
      const evs = DB.getEventsForDate(ds).slice(0,3);
      const isToday = ds === todayStr;
      const evHtml = evs.map(ev=>`<div class="month-event" style="background:${ev.color||'var(--primary)'};" onclick="event.stopPropagation();CalModule.editEvent('${ev.id}')">${Utils.escHtml(ev.title)}</div>`).join('');
      const moreCount = DB.getEventsForDate(ds).length - 3;
      cells.push(`
        <div class="month-cell ${isToday?'today':''}" data-date="${ds}">
          <div class="month-cell-num">${i}</div>
          ${evHtml}
          ${moreCount>0?`<div class="month-more">+${moreCount}</div>`:''}
        </div>`);
    }
    // Next month padding
    const remaining = 42 - cells.length;
    for(let i=1; i<=remaining; i++) {
      cells.push(`<div class="month-cell other-month"><div class="month-cell-num">${i}</div></div>`);
    }

    return `<div class="month-view"><div class="month-header">${headers}</div><div class="month-grid">${cells.join('')}</div></div>`;
  },

  addMonthClickHandlers() {
    document.querySelectorAll('.month-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', () => this.openNewEvent(cell.dataset.date));
    });
  },

  openNewEvent(date, start='09:00', end='10:00') {
    document.getElementById('eventModalTitle').textContent = 'Nouvel événement';
    document.getElementById('eventId').value = '';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = date || Utils.dateStr(this.currentDate);
    document.getElementById('eventStart').value = start;
    document.getElementById('eventEnd').value = end;
    document.getElementById('eventCategory').value = 'work';
    document.getElementById('eventColor').value = '#6366f1';
    document.getElementById('eventPriority').value = 'medium';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventDesc').value = '';
    document.getElementById('eventRecurr').value = 'none';
    document.getElementById('eventDeleteBtn').classList.add('hidden');
    Modal.open('eventModal');
  },

  editEvent(id) {
    const ev = DB.getEvents().find(e=>e.id===id);
    if(!ev) return;
    document.getElementById('eventModalTitle').textContent = 'Modifier l\'événement';
    document.getElementById('eventId').value = ev.id;
    document.getElementById('eventTitle').value = ev.title;
    document.getElementById('eventDate').value = ev.date;
    document.getElementById('eventStart').value = ev.start||'';
    document.getElementById('eventEnd').value = ev.end||'';
    document.getElementById('eventCategory').value = ev.category||'work';
    document.getElementById('eventColor').value = ev.color||'#6366f1';
    document.getElementById('eventPriority').value = ev.priority||'medium';
    document.getElementById('eventLocation').value = ev.location||'';
    document.getElementById('eventDesc').value = ev.description||'';
    document.getElementById('eventRecurr').value = ev.recurring||'none';
    document.getElementById('eventDeleteBtn').classList.remove('hidden');
    Modal.open('eventModal');
  },

  saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    if(!title) { Toast.show('Le titre est requis','error'); return; }
    const id = document.getElementById('eventId').value;
    const ev = {
      id: id || DB.generateId(),
      title,
      date: document.getElementById('eventDate').value || Utils.dateStr(new Date()),
      start: document.getElementById('eventStart').value,
      end: document.getElementById('eventEnd').value,
      category: document.getElementById('eventCategory').value,
      color: document.getElementById('eventColor').value,
      priority: document.getElementById('eventPriority').value,
      location: document.getElementById('eventLocation').value,
      description: document.getElementById('eventDesc').value,
      recurring: document.getElementById('eventRecurr').value,
    };
    if(id) DB.updateEvent(ev); else DB.addEvent(ev);
    Modal.close('eventModal');
    Toast.show(id ? 'Événement modifié' : 'Événement ajouté', 'success');
    this.render();
    DashModule.renderTimeline(DB.todayStr());
  },

  deleteCurrentEvent() {
    const id = document.getElementById('eventId').value;
    if(!id) return;
    if(confirm('Supprimer cet événement ?')) {
      DB.deleteEvent(id);
      Modal.close('eventModal');
      Toast.show('Événement supprimé','info');
      this.render();
      DashModule.renderTimeline(DB.todayStr());
    }
  }
};

// ════════════════════════════════════════════════════════
//  TASKS MODULE
// ════════════════════════════════════════════════════════
const TaskModule = {
  currentFilter: 'all',
  currentSubtasks: [],

  init() {
    document.querySelectorAll('.filter-item[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-item[data-filter]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });
    document.getElementById('taskSearch').addEventListener('input', () => this.render());
    document.getElementById('taskSaveBtn').addEventListener('click', () => this.save());
    document.getElementById('taskDeleteBtn').addEventListener('click', () => this.deleteTask());
    document.getElementById('subtaskInput').addEventListener('keydown', e => { if(e.key==='Enter'){e.preventDefault();this.addSubtask();} });
    this.render();
  },

  render() {
    this.updateCounts();
    const tasks = this.getFilteredTasks();
    const el = document.getElementById('tasksList');
    if(!el) return;
    if(tasks.length === 0) {
      el.innerHTML = `<div class="empty-state large"><div class="empty-icon">📋</div><p>Aucune tâche ${this.currentFilter==='all'?'':'pour ce filtre'}</p><button class="btn btn-primary" onclick="TaskModule.openModal()">Créer une tâche</button></div>`;
      return;
    }
    el.innerHTML = tasks.map(t => this.renderTaskItem(t)).join('');
  },

  renderTaskItem(t) {
    const isOverdue = t.deadline && t.deadline < DB.todayStr() && t.status !== 'done';
    const subtasksHtml = t.subtasks?.length ? `
      <div class="subtasks">
        ${t.subtasks.map(s=>`<div class="subtask-item ${s.done?'done':''}">
          <div class="task-checkbox ${s.done?'checked':''}" style="width:14px;height:14px;" onclick="event.stopPropagation();TaskModule.toggleSubtask('${t.id}','${s.id}')"></div>
          <span>${Utils.escHtml(s.title)}</span>
        </div>`).join('')}
      </div>` : '';
    return `
      <div class="task-item ${t.status==='done'?'done':''}" id="task-${t.id}">
        <div class="task-checkbox ${t.status==='done'?'checked':''}" onclick="TaskModule.quickToggle('${t.id}')"></div>
        <div class="task-body" onclick="TaskModule.openModal('${t.id}')">
          <div class="task-title">${Utils.escHtml(t.title)}</div>
          <div class="task-meta">
            <span class="task-badge priority-${t.priority}">${Utils.priorityLabel(t.priority)}</span>
            <span class="task-badge" style="background:var(--bg-hover);color:var(--text-secondary)">${Utils.categoryLabel(t.category)}</span>
            ${t.deadline ? `<span class="task-date ${isOverdue?'overdue':''}">${isOverdue?'⚠ En retard – ':''}${Utils.formatDateShort(t.deadline)}</span>` : ''}
            ${t.duration ? `<span class="task-date">⏱ ${t.duration}min</span>` : ''}
          </div>
          ${subtasksHtml}
        </div>
        <div class="task-actions">
          <button class="task-action-btn" onclick="event.stopPropagation();TaskModule.openModal('${t.id}')" title="Modifier">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="task-action-btn" onclick="event.stopPropagation();TaskModule.removeTask('${t.id}')" title="Supprimer" style="color:var(--danger)">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>`;
  },

  getFilteredTasks() {
    const today = DB.todayStr();
    const query = document.getElementById('taskSearch')?.value.toLowerCase()||'';
    let tasks = DB.getTasks();
    if(query) tasks = tasks.filter(t => t.title.toLowerCase().includes(query));
    switch(this.currentFilter) {
      case 'today': tasks = tasks.filter(t => t.deadline === today); break;
      case 'upcoming': tasks = tasks.filter(t => t.deadline > today && t.status !== 'done'); break;
      case 'overdue': tasks = tasks.filter(t => t.deadline < today && t.status !== 'done'); break;
      case 'completed': tasks = tasks.filter(t => t.status === 'done'); break;
      case 'high': tasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done'); break;
      case 'medium': tasks = tasks.filter(t => t.priority === 'medium' && t.status !== 'done'); break;
      case 'low': tasks = tasks.filter(t => t.priority === 'low' && t.status !== 'done'); break;
    }
    return tasks.sort((a,b) => {
      if(a.status==='done' && b.status!=='done') return 1;
      if(b.status==='done' && a.status!=='done') return -1;
      const pOrder = {high:0,medium:1,low:2};
      return (pOrder[a.priority]||1) - (pOrder[b.priority]||1);
    });
  },

  updateCounts() {
    const all = DB.getTasks();
    const today = DB.todayStr();
    const s = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    s('countAll', all.length);
    s('countToday', all.filter(t=>t.deadline===today).length);
    s('countUpcoming', all.filter(t=>t.deadline>today&&t.status!=='done').length);
    s('countOverdue', all.filter(t=>t.deadline<today&&t.status!=='done').length);
    s('countCompleted', all.filter(t=>t.status==='done').length);
  },

  openModal(id=null) {
    this.currentSubtasks = [];
    if(id) {
      const t = DB.getTasks().find(x=>x.id===id);
      if(!t) return;
      document.getElementById('taskModalTitle').textContent = 'Modifier la tâche';
      document.getElementById('taskId').value = t.id;
      document.getElementById('taskTitle').value = t.title;
      document.getElementById('taskDeadline').value = t.deadline||'';
      document.getElementById('taskTime').value = t.time||'';
      document.getElementById('taskPriority').value = t.priority||'medium';
      document.getElementById('taskCategory').value = t.category||'work';
      document.getElementById('taskDesc').value = t.description||'';
      document.getElementById('taskDuration').value = t.duration||'';
      this.currentSubtasks = t.subtasks ? [...t.subtasks] : [];
      document.getElementById('taskDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('taskModalTitle').textContent = 'Nouvelle tâche';
      document.getElementById('taskId').value = '';
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDeadline').value = DB.todayStr();
      document.getElementById('taskTime').value = '';
      document.getElementById('taskPriority').value = 'medium';
      document.getElementById('taskCategory').value = 'work';
      document.getElementById('taskDesc').value = '';
      document.getElementById('taskDuration').value = '';
      document.getElementById('taskDeleteBtn').classList.add('hidden');
    }
    this.renderSubtasksList();
    Modal.open('taskModal');
  },

  renderSubtasksList() {
    const el = document.getElementById('subtasksList');
    if(!el) return;
    el.innerHTML = this.currentSubtasks.map((s,i) => `
      <div class="subtask-item-form">
        <input type="checkbox" ${s.done?'checked':''} onchange="TaskModule.toggleSubtaskForm(${i})">
        <span style="flex:1">${Utils.escHtml(s.title)}</span>
        <button onclick="TaskModule.removeSubtask(${i})">×</button>
      </div>`).join('');
  },

  addSubtask() {
    const input = document.getElementById('subtaskInput');
    const title = input.value.trim();
    if(!title) return;
    this.currentSubtasks.push({ id: DB.generateId(), title, done: false });
    input.value = '';
    this.renderSubtasksList();
  },

  toggleSubtaskForm(i) { this.currentSubtasks[i].done = !this.currentSubtasks[i].done; },
  removeSubtask(i) { this.currentSubtasks.splice(i,1); this.renderSubtasksList(); },

  save() {
    const title = document.getElementById('taskTitle').value.trim();
    if(!title) { Toast.show('Le titre est requis','error'); return; }
    const id = document.getElementById('taskId').value;
    const existing = id ? DB.getTasks().find(t=>t.id===id) : null;
    const t = {
      id: id || DB.generateId(),
      title,
      deadline: document.getElementById('taskDeadline').value,
      time: document.getElementById('taskTime').value,
      priority: document.getElementById('taskPriority').value,
      category: document.getElementById('taskCategory').value,
      description: document.getElementById('taskDesc').value,
      duration: document.getElementById('taskDuration').value,
      subtasks: this.currentSubtasks,
      status: existing?.status || 'todo',
      completedAt: existing?.completedAt || null,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    if(id) DB.updateTask(t); else DB.addTask(t);
    Modal.close('taskModal');
    Toast.show(id?'Tâche modifiée':'Tâche créée','success');
    this.render();
    DashModule.renderTasks(DB.todayStr());
  },

  quickToggle(id) {
    const tasks = DB.getTasks();
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const wasDone = t.status === 'done';
    t.status = wasDone ? 'todo' : 'done';
    t.completedAt = t.status === 'done' ? DB.todayStr() : null;
    DB.updateTask(t);
    this.render();
    DashModule.renderTasks(DB.todayStr());
    DashModule.renderStats(DB.todayStr());
    DashModule.renderDailyScore();

    if (!wasDone) {
      const settings = DB.getSettings();
      const name = settings.name || 'toi';
      const todayStr = DB.todayStr();
      const todayTasks = DB.getTasks().filter(x => x.deadline === todayStr);
      const allDone = todayTasks.length > 0 && todayTasks.every(x => x.status === 'done');
      if (allDone) {
        Celebration.show(`Yaaay ! Beau travail ${name} ! 🏆`, 'Toutes tes tâches du jour sont terminées !', true);
      } else {
        Celebration.show('Bien joué ! 🎉', `"${t.title.slice(0, 35)}" terminée !`, false);
      }
    }
  },

  toggleSubtask(taskId, subtaskId) {
    const t = DB.getTasks().find(x=>x.id===taskId);
    if(!t) return;
    const s = t.subtasks?.find(x=>x.id===subtaskId);
    if(s) s.done = !s.done;
    DB.updateTask(t);
    this.render();
  },

  deleteTask() {
    const id = document.getElementById('taskId').value;
    if(!id) return;
    if(confirm('Supprimer cette tâche ?')) {
      DB.deleteTask(id);
      Modal.close('taskModal');
      Toast.show('Tâche supprimée','info');
      this.render();
    }
  },

  removeTask(id) {
    if(confirm('Supprimer cette tâche ?')) {
      DB.deleteTask(id);
      Toast.show('Tâche supprimée','info');
      this.render();
    }
  }
};

// ════════════════════════════════════════════════════════
//  LEARNING MODULE
// ════════════════════════════════════════════════════════
const LearningModule = {
  currentSubject: null,
  currentTab: 'overview',
  _taskFilter: 'all',
  _taskSort: 'priority',

  init() {
    document.getElementById('subjectSaveBtn').addEventListener('click', () => this.saveSubject());
    document.getElementById('subjectDeleteBtn').addEventListener('click', () => this.deleteSubject());
    document.getElementById('subjectTaskSaveBtn').addEventListener('click', () => this.saveTask());
    document.getElementById('subjectTaskDeleteBtn').addEventListener('click', () => this.deleteTask());
    document.getElementById('subjectResourceSaveBtn').addEventListener('click', () => this.saveResource());
    document.getElementById('subjectResourceDeleteBtn').addEventListener('click', () => this.deleteResource());
    document.getElementById('learningSearch')?.addEventListener('input', () => this.renderSubjectsList());
    document.getElementById('learningFilter')?.addEventListener('change', () => this.renderSubjectsList());
    document.getElementById('learningSort')?.addEventListener('change', () => this.renderSubjectsList());
    this.renderGlobalStats();
    this.renderSubjectsList();
  },

  renderGlobalStats() {
    const subjects = DB.getSubjects();
    const allTasks = DB.getSubjectTasks();
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter(t => t.status === 'done').length;
    const overdueTasks = allTasks.filter(t => t.deadline && t.status !== 'done' && t.deadline < DB.todayStr()).length;
    const completedSubjects = subjects.filter(s => {
      const tasks = DB.getTasksForSubject(s.id);
      return tasks.length > 0 && tasks.every(t => t.status === 'done');
    }).length;
    const el = document.getElementById('learningGlobalStats');
    if (!el) return;
    if (subjects.length === 0) { el.innerHTML = ''; return; }
    const globalPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    el.innerHTML = `
      <div class="learning-stat-card">
        <div class="learning-stat-icon">📚</div>
        <div><div class="learning-stat-value">${subjects.length}</div><div class="learning-stat-label">Matières</div></div>
      </div>
      <div class="learning-stat-card">
        <div class="learning-stat-icon">✅</div>
        <div><div class="learning-stat-value">${doneTasks}/${totalTasks}</div><div class="learning-stat-label">Tâches terminées</div></div>
      </div>
      <div class="learning-stat-card">
        <div class="learning-stat-icon">📊</div>
        <div><div class="learning-stat-value">${globalPct}%</div><div class="learning-stat-label">Progression globale</div></div>
      </div>
      ${overdueTasks > 0 ? `<div class="learning-stat-card" style="border-color:rgba(239,68,68,0.3)">
        <div class="learning-stat-icon">⚠️</div>
        <div><div class="learning-stat-value" style="color:var(--danger)">${overdueTasks}</div><div class="learning-stat-label">En retard</div></div>
      </div>` : ''}
      ${completedSubjects > 0 ? `<div class="learning-stat-card" style="border-color:rgba(34,197,94,0.3)">
        <div class="learning-stat-icon">🏆</div>
        <div><div class="learning-stat-value" style="color:var(--success)">${completedSubjects}</div><div class="learning-stat-label">Matières terminées</div></div>
      </div>` : ''}
    `;
  },

  renderSubjectsList() {
    let subjects = DB.getSubjects();
    const search = (document.getElementById('learningSearch')?.value || '').toLowerCase();
    const filter = document.getElementById('learningFilter')?.value || 'all';
    const sort = document.getElementById('learningSort')?.value || 'name';
    const el = document.getElementById('subjectsList');
    if (!el) return;
    if (subjects.length === 0) {
      el.innerHTML = `<div class="empty-state large" style="grid-column:1/-1"><div class="empty-icon">📚</div><p>Aucune matière définie. Ajoutez vos premières matières d'apprentissage.</p><button class="btn btn-primary" onclick="LearningModule.openSubjectModal()">Ajouter une matière</button></div>`;
      return;
    }
    if (search) subjects = subjects.filter(s => s.name.toLowerCase().includes(search));
    if (filter !== 'all') {
      subjects = subjects.filter(s => {
        const tasks = DB.getTasksForSubject(s.id);
        const done = tasks.filter(t => t.status === 'done').length;
        const pct = tasks.length ? (done / tasks.length) * 100 : 0;
        if (filter === 'completed') return tasks.length > 0 && pct === 100;
        if (filter === 'notstarted') return done === 0;
        if (filter === 'inprogress') return done > 0 && pct < 100;
        return true;
      });
    }
    subjects = [...subjects].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'fr');
      if (sort === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'progress') return this._getSubjectPct(b.id) - this._getSubjectPct(a.id);
      return 0;
    });
    if (subjects.length === 0) {
      el.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><p>Aucune matière trouvée avec ces critères.</p></div>`;
      return;
    }
    el.innerHTML = subjects.map(s => {
      const tasks = DB.getTasksForSubject(s.id);
      const done = tasks.filter(t => t.status === 'done').length;
      const inprogress = tasks.filter(t => t.status === 'progress').length;
      const todo = tasks.filter(t => t.status === 'todo').length;
      const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
      const isCompleted = tasks.length > 0 && pct === 100;
      const hasOverdue = tasks.some(t => t.deadline && t.status !== 'done' && t.deadline < DB.todayStr());
      const color = s.color || 'var(--primary)';
      return `
        <div class="subject-card${isCompleted ? ' is-completed' : ''}" onclick="LearningModule.showDetail('${s.id}')">
          ${isCompleted ? `<div class="subject-completed-badge">✓ Terminée</div>` : hasOverdue ? `<div class="subject-overdue-badge">⚠ En retard</div>` : ''}
          <button class="subject-edit-btn" onclick="event.stopPropagation();LearningModule.openSubjectModal('${s.id}')">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <div class="subject-card-top" style="${isCompleted || hasOverdue ? 'margin-top:18px' : ''}">
            <div class="subject-icon-wrap" style="background:${color}20">${s.icon || '📖'}</div>
            <div>
              <div class="subject-name">${Utils.escHtml(s.name)}</div>
              <div class="subject-level">${Utils.levelLabel(s.level || 'debutant')}</div>
            </div>
          </div>
          <div class="subject-progress">
            <div class="subject-progress-label"><span>Progression</span><span>${done}/${tasks.length} tâches</span></div>
            <div class="progress-bar"><div class="progress-fill-animated" style="width:${pct}%;background:${isCompleted ? 'var(--success)' : color}"></div></div>
          </div>
          <div class="subject-task-counts">
            ${todo > 0 ? `<span class="stc-badge stc-todo">📋 ${todo} à faire</span>` : ''}
            ${inprogress > 0 ? `<span class="stc-badge stc-progress">⏳ ${inprogress} en cours</span>` : ''}
            ${done > 0 ? `<span class="stc-badge stc-done">✓ ${done} faites</span>` : ''}
            ${tasks.length === 0 ? `<span class="stc-badge stc-todo">Aucune tâche</span>` : ''}
          </div>
          <div class="subject-meta" style="margin-top:10px"><span>${pct}% complété</span><span style="color:var(--primary);font-weight:600">Voir →</span></div>
        </div>`;
    }).join('');
  },

  _getSubjectPct(sid) {
    const tasks = DB.getTasksForSubject(sid);
    if (!tasks.length) return 0;
    return Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100);
  },

  showDetail(subjectId) {
    const s = DB.getSubjects().find(x => x.id === subjectId);
    if (!s) return;
    this.currentSubject = s;
    this.currentTab = 'overview';
    this._taskFilter = 'all';
    this._taskSort = 'priority';
    this._renderDetailView();
  },

  _renderDetailView() {
    const s = this.currentSubject;
    if (!s) return;
    const el = document.getElementById('learningContent');
    if (!el) return;
    const tasks = DB.getTasksForSubject(s.id);
    const resources = DB.getResourcesForSubject(s.id);
    const done = tasks.filter(t => t.status === 'done').length;
    const inprogress = tasks.filter(t => t.status === 'progress').length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const color = s.color || 'var(--primary)';
    el.innerHTML = `
      <div>
        <div class="back-btn" onclick="LearningModule.backToList()">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Retour aux matières
        </div>
        <div class="subject-detail-header">
          <div class="subject-icon-wrap" style="background:${color}20;width:54px;height:54px;font-size:28px">${s.icon || '📖'}</div>
          <div>
            <h2 style="font-size:20px;font-weight:800">${Utils.escHtml(s.name)}</h2>
            <p style="color:var(--text-secondary);font-size:13px">${Utils.levelLabel(s.level)} • ${Utils.escHtml(s.objective || 'Aucun objectif défini')}</p>
          </div>
          <div class="subject-detail-actions">
            <button class="btn btn-secondary btn-sm" onclick="LearningModule.openSubjectModal('${s.id}')">✏️ Modifier</button>
            <button class="btn btn-primary" onclick="LearningModule.openTaskModal()">+ Tâche</button>
            <button class="btn btn-secondary" onclick="LearningModule.openResourceModal()">+ Ressource</button>
          </div>
        </div>
        <div class="subject-detail-stats">
          <div class="sds-card"><div class="sds-value">${tasks.length}</div><div class="sds-label">Tâches totales</div></div>
          <div class="sds-card"><div class="sds-value" style="color:var(--success)">${done}</div><div class="sds-label">Terminées</div></div>
          <div class="sds-card"><div class="sds-value" style="color:var(--warning)">${inprogress}</div><div class="sds-label">En cours</div></div>
          <div class="sds-card"><div class="sds-value" style="color:${color}">${pct}%</div><div class="sds-label">Progression</div></div>
          <div class="sds-card"><div class="sds-value" style="color:var(--info)">${resources.length}</div><div class="sds-label">Ressources</div></div>
        </div>
        <div class="progress-bar" style="height:8px;margin-bottom:24px">
          <div class="progress-fill-animated" style="width:${pct}%;background:${pct === 100 ? 'var(--success)' : color}"></div>
        </div>
        <div class="learning-tabs" id="learningTabsBar">
          <button class="ltab ${this.currentTab === 'overview' ? 'active' : ''}" onclick="LearningModule.switchTab('overview')">Vue d'ensemble</button>
          <button class="ltab ${this.currentTab === 'tasks' ? 'active' : ''}" onclick="LearningModule.switchTab('tasks')">Tâches <span class="ltab-badge">${tasks.length}</span></button>
          <button class="ltab ${this.currentTab === 'resources' ? 'active' : ''}" onclick="LearningModule.switchTab('resources')">Ressources <span class="ltab-badge">${resources.length}</span></button>
          <button class="ltab ${this.currentTab === 'notes' ? 'active' : ''}" onclick="LearningModule.switchTab('notes')">Notes</button>
        </div>
        <div id="learningTabContent">${this._renderTabContent()}</div>
      </div>`;
  },

  switchTab(tab) {
    this.currentTab = tab;
    const tc = document.getElementById('learningTabContent');
    if (tc) tc.innerHTML = this._renderTabContent();
    document.querySelectorAll('#learningTabsBar .ltab').forEach((t, i) => {
      t.classList.toggle('active', ['overview','tasks','resources','notes'][i] === tab);
    });
  },

  _renderTabContent() {
    switch (this.currentTab) {
      case 'overview': return this._renderOverviewTab();
      case 'tasks': return this._renderTasksTab();
      case 'resources': return this._renderResourcesTab();
      case 'notes': return this._renderNotesTab();
      default: return this._renderOverviewTab();
    }
  },

  _renderOverviewTab() {
    const s = this.currentSubject;
    const tasks = DB.getTasksForSubject(s.id);
    const resources = DB.getResourcesForSubject(s.id);
    const overdue = tasks.filter(t => t.deadline && t.status !== 'done' && t.deadline < DB.todayStr());
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const recentTasks = [...tasks].filter(t => t.status !== 'done').sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)).slice(0, 5);
    const categories = {};
    tasks.forEach(t => {
      if (!categories[t.category]) categories[t.category] = { total: 0, done: 0 };
      categories[t.category].total++;
      if (t.status === 'done') categories[t.category].done++;
    });
    const recentResources = resources.slice(-3).reverse();
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px" class="ov-grid">
        <div>
          ${overdue.length > 0 ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius);padding:14px;margin-bottom:16px">
            <div style="font-size:13px;font-weight:700;color:var(--danger);margin-bottom:8px">⚠️ ${overdue.length} tâche(s) en retard</div>
            ${overdue.slice(0, 3).map(t => `<div style="font-size:12px;color:var(--text-secondary);padding:4px 0;border-bottom:1px solid var(--border)">${Utils.escHtml(t.title)} — <span style="color:var(--danger)">${Utils.formatDateShort(t.deadline)}</span></div>`).join('')}
          </div>` : ''}
          <div style="font-size:13px;font-weight:700;margin-bottom:12px">Prochaines tâches prioritaires</div>
          ${recentTasks.length === 0 ? `<div style="color:var(--text-muted);font-size:13px;padding:12px 0">🎉 Toutes les tâches sont terminées !</div>` :
            recentTasks.map(t => {
              const isOv = t.deadline && t.deadline < DB.todayStr();
              const pc = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' }[t.priority] || 'var(--border)';
              return `<div style="display:flex;align-items:center;gap:8px;padding:8px;margin-bottom:6px;background:var(--bg-card);border:1px solid var(--glass-border);border-left:3px solid ${pc};border-radius:var(--radius-sm)">
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Utils.escHtml(t.title)}</div>
                  <div style="font-size:10px;color:${isOv ? 'var(--danger)' : 'var(--text-muted)'}">${t.deadline ? (isOv ? '⚠️ ' : '') + Utils.formatDateShort(t.deadline) : t.category}</div>
                </div>
                <span class="task-badge task-badge-cat" style="font-size:9px">${t.category}</span>
              </div>`;
            }).join('')}
        </div>
        <div>
          <div style="font-size:13px;font-weight:700;margin-bottom:12px">Répartition par catégorie</div>
          ${Object.entries(categories).length === 0 ? `<div style="color:var(--text-muted);font-size:13px">Aucune tâche pour l'instant.</div>` :
            Object.entries(categories).map(([cat, data]) => `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="color:var(--text-secondary)">${cat}</span><span style="color:var(--text-muted)">${data.done}/${data.total}</span></div>
                <div class="progress-bar" style="height:5px"><div class="progress-fill" style="width:${data.total ? Math.round(data.done / data.total * 100) : 0}%;background:var(--primary)"></div></div>
              </div>`).join('')}
          ${recentResources.length > 0 ? `
            <div style="font-size:13px;font-weight:700;margin:16px 0 12px">Ressources récentes</div>
            ${recentResources.map(r => `
              <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:16px">${this._resourceTypeIcon(r.type)}</span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Utils.escHtml(r.title)}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${r.type}</div>
                </div>
                ${r.link ? `<a href="${Utils.escHtml(r.link)}" target="_blank" class="resource-link" style="font-size:11px">↗</a>` : ''}
              </div>`).join('')}
          ` : ''}
        </div>
      </div>
      <style>.ov-grid{} @media(max-width:768px){.ov-grid{grid-template-columns:1fr!important}}</style>`;
  },

  _renderTasksTab() {
    const tasks = DB.getTasksForSubject(this.currentSubject.id);
    const filter = this._taskFilter || 'all';
    const sort = this._taskSort || 'priority';
    let filtered = filter === 'all' ? tasks :
      filter === 'todo' ? tasks.filter(t => t.status === 'todo') :
      filter === 'progress' ? tasks.filter(t => t.status === 'progress') :
      filter === 'done' ? tasks.filter(t => t.status === 'done') :
      tasks.filter(t => t.deadline && t.status !== 'done' && t.deadline < DB.todayStr());
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered = [...filtered].sort((a, b) => {
      if (sort === 'priority') return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
      if (sort === 'deadline') { if (!a.deadline) return 1; if (!b.deadline) return -1; return a.deadline.localeCompare(b.deadline); }
      if (sort === 'category') return (a.category || '').localeCompare(b.category || '');
      if (sort === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    const overdueCount = tasks.filter(t => t.deadline && t.status !== 'done' && t.deadline < DB.todayStr()).length;
    return `
      <div class="tasks-toolbar">
        <select class="form-input" style="width:auto;padding:6px 10px;font-size:12px" onchange="LearningModule._taskFilter=this.value;LearningModule.switchTab('tasks')">
          <option value="all" ${filter === 'all' ? 'selected' : ''}>Toutes (${tasks.length})</option>
          <option value="todo" ${filter === 'todo' ? 'selected' : ''}>À faire (${tasks.filter(t => t.status === 'todo').length})</option>
          <option value="progress" ${filter === 'progress' ? 'selected' : ''}>En cours (${tasks.filter(t => t.status === 'progress').length})</option>
          <option value="done" ${filter === 'done' ? 'selected' : ''}>Terminées (${tasks.filter(t => t.status === 'done').length})</option>
          ${overdueCount > 0 ? `<option value="overdue" ${filter === 'overdue' ? 'selected' : ''}>En retard (${overdueCount})</option>` : ''}
        </select>
        <select class="form-input" style="width:auto;padding:6px 10px;font-size:12px" onchange="LearningModule._taskSort=this.value;LearningModule.switchTab('tasks')">
          <option value="priority" ${sort === 'priority' ? 'selected' : ''}>Par priorité</option>
          <option value="deadline" ${sort === 'deadline' ? 'selected' : ''}>Par date limite</option>
          <option value="category" ${sort === 'category' ? 'selected' : ''}>Par catégorie</option>
          <option value="recent" ${sort === 'recent' ? 'selected' : ''}>Plus récentes</option>
        </select>
        <button class="btn btn-primary" style="margin-left:auto" onclick="LearningModule.openTaskModal()">+ Nouvelle tâche</button>
      </div>
      ${filtered.length === 0 ? `<div class="learning-empty"><div class="learning-empty-icon">📋</div><p>${tasks.length === 0 ? 'Aucune tâche pour cette matière.' : 'Aucune tâche correspondant au filtre.'}</p>${tasks.length === 0 ? `<button class="btn btn-primary" onclick="LearningModule.openTaskModal()">Ajouter une tâche</button>` : ''}</div>` :
        `<div class="tasks-list">${filtered.map(t => this._renderTaskCard(t)).join('')}</div>`}`;
  },

  _renderTaskCard(t) {
    const isOverdue = t.deadline && t.status !== 'done' && t.deadline < DB.todayStr();
    const priorityBadge = { high: 'task-badge-pri-high', medium: 'task-badge-pri-medium', low: 'task-badge-pri-low' }[t.priority] || 'task-badge-pri-medium';
    const priorityLabel = { high: 'Haute', medium: 'Moyenne', low: 'Basse' }[t.priority] || 'Moyenne';
    const isDone = t.status === 'done';
    return `
      <div class="task-card-lrn priority-${t.priority} status-${t.status}" id="tcard-${t.id}">
        <button class="task-check-btn ${isDone ? 'checked' : ''}" onclick="LearningModule.toggleTaskDone('${t.id}')">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <div class="task-card-body">
          <div class="task-card-title-lrn">${Utils.escHtml(t.title)}</div>
          ${t.description ? `<div class="task-card-desc">${Utils.escHtml(t.description)}</div>` : ''}
          <div class="task-card-meta">
            <span class="task-badge task-badge-cat">${t.category}</span>
            <span class="task-badge ${priorityBadge}">${priorityLabel}</span>
            ${t.deadline ? `<span class="task-deadline ${isOverdue ? 'overdue' : ''}">
              <svg viewBox="0 0 24 24" style="width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${isOverdue ? '⚠ ' : ''}${Utils.formatDateShort(t.deadline)}
            </span>` : ''}
            ${t.link ? `<a href="${Utils.escHtml(t.link)}" target="_blank" class="resource-link" style="font-size:11px">🔗 Lien</a>` : ''}
          </div>
        </div>
        <div class="task-card-actions">
          <button class="task-action-btn" onclick="LearningModule.openTaskModal('${t.id}')" title="Modifier">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>`;
  },

  _renderResourcesTab() {
    const resources = DB.getResourcesForSubject(this.currentSubject.id);
    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
        <button class="btn btn-primary" onclick="LearningModule.openResourceModal()">+ Nouvelle ressource</button>
      </div>
      ${resources.length === 0 ? `<div class="learning-empty"><div class="learning-empty-icon">📎</div><p>Aucune ressource pour cette matière.</p><button class="btn btn-primary" onclick="LearningModule.openResourceModal()">Ajouter une ressource</button></div>` :
        `<div class="resources-grid">${resources.map(r => this._renderResourceCard(r)).join('')}</div>`}`;
  },

  _renderResourceCard(r) {
    return `
      <div class="resource-card">
        <div class="resource-card-header">
          <div class="resource-type-icon">${this._resourceTypeIcon(r.type)}</div>
          <div style="flex:1;min-width:0">
            <div class="resource-title">${Utils.escHtml(r.title)}</div>
            <span class="resource-type-badge">${r.type}</span>
          </div>
        </div>
        ${r.description ? `<div class="resource-desc">${Utils.escHtml(r.description)}</div>` : ''}
        ${r.link ? `<a href="${Utils.escHtml(r.link)}" target="_blank" class="resource-link">
          <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Ouvrir le lien
        </a>` : ''}
        <div class="resource-actions">
          <button class="task-action-btn" onclick="LearningModule.openResourceModal('${r.id}')" title="Modifier">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="task-action-btn" onclick="LearningModule.deleteResource('${r.id}')" style="color:var(--danger)" title="Supprimer">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>`;
  },

  _renderNotesTab() {
    const note = DB.getSubjectNote(this.currentSubject.id);
    return `
      <div class="subject-notes-area">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:14px;font-weight:700">Notes personnelles</div>
          <button class="btn btn-primary btn-sm" onclick="LearningModule.saveNote()">💾 Sauvegarder</button>
        </div>
        <textarea id="subjectNotesArea" class="form-textarea" rows="12" placeholder="Rédigez vos notes, résumés, points importants pour cette matière...">${Utils.escHtml(note)}</textarea>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px">Conseil : Notez vos résumés, formules importantes, points à retenir...</div>
      </div>`;
  },

  _resourceTypeIcon(type) {
    return { 'Cours': '📚', 'PDF': '📄', 'Vidéo YouTube': '🎬', 'Note': '📝', 'Document': '📋', 'Exercice': '✏️', 'Chapitre': '📖' }[type] || '📎';
  },

  backToList() {
    this.currentSubject = null;
    this.currentTab = 'overview';
    this._taskFilter = 'all';
    this._taskSort = 'priority';
    const el = document.getElementById('learningContent');
    if (el) el.innerHTML = '<div id="subjectsList" class="subjects-grid"></div>';
    this.renderSubjectsList();
    this.renderGlobalStats();
  },

  // ── TASK ACTIONS ──

  openTaskModal(id = null) {
    if (!this.currentSubject) return;
    if (id) {
      const t = DB.getSubjectTasks().find(x => x.id === id);
      if (!t) return;
      document.getElementById('subjectTaskModalTitle').textContent = 'Modifier la tâche';
      document.getElementById('subjectTaskId').value = t.id;
      document.getElementById('subjectTaskSubjectId').value = t.subjectId;
      document.getElementById('subjectTaskTitle').value = t.title;
      document.getElementById('subjectTaskCategory').value = t.category || 'Cours';
      document.getElementById('subjectTaskPriority').value = t.priority || 'medium';
      document.getElementById('subjectTaskDescription').value = t.description || '';
      document.getElementById('subjectTaskDeadline').value = t.deadline || '';
      document.getElementById('subjectTaskStatus').value = t.status || 'todo';
      document.getElementById('subjectTaskLink').value = t.link || '';
      document.getElementById('subjectTaskDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('subjectTaskModalTitle').textContent = 'Nouvelle tâche';
      document.getElementById('subjectTaskId').value = '';
      document.getElementById('subjectTaskSubjectId').value = this.currentSubject.id;
      document.getElementById('subjectTaskTitle').value = '';
      document.getElementById('subjectTaskCategory').value = 'Cours';
      document.getElementById('subjectTaskPriority').value = 'medium';
      document.getElementById('subjectTaskDescription').value = '';
      document.getElementById('subjectTaskDeadline').value = '';
      document.getElementById('subjectTaskStatus').value = 'todo';
      document.getElementById('subjectTaskLink').value = '';
      document.getElementById('subjectTaskDeleteBtn').classList.add('hidden');
    }
    Modal.open('subjectTaskModal');
  },

  saveTask() {
    const title = document.getElementById('subjectTaskTitle').value.trim();
    if (!title) { Toast.show('Le titre est requis', 'error'); return; }
    const id = document.getElementById('subjectTaskId').value;
    const task = {
      id: id || DB.generateId(),
      subjectId: document.getElementById('subjectTaskSubjectId').value,
      title,
      category: document.getElementById('subjectTaskCategory').value,
      priority: document.getElementById('subjectTaskPriority').value,
      description: document.getElementById('subjectTaskDescription').value.trim(),
      deadline: document.getElementById('subjectTaskDeadline').value,
      status: document.getElementById('subjectTaskStatus').value,
      link: document.getElementById('subjectTaskLink').value.trim(),
      createdAt: id ? (DB.getSubjectTasks().find(x => x.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };
    if (id) DB.updateSubjectTask(task); else DB.addSubjectTask(task);
    Modal.close('subjectTaskModal');
    Toast.show(id ? 'Tâche modifiée' : 'Tâche ajoutée', 'success');
    this.currentTab = 'tasks';
    this._renderDetailView();
  },

  deleteTask() {
    const id = document.getElementById('subjectTaskId').value;
    if (!id) return;
    if (confirm('Supprimer cette tâche ?')) {
      DB.deleteSubjectTask(id);
      Modal.close('subjectTaskModal');
      Toast.show('Tâche supprimée', 'info');
      this._renderDetailView();
    }
  },

  toggleTaskDone(id) {
    const tasks = DB.getSubjectTasks();
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const wasDone = t.status === 'done';
    t.status = wasDone ? 'todo' : 'done';
    if (!wasDone) t.completedAt = new Date().toISOString();
    DB.updateSubjectTask(t);
    if (!wasDone) {
      const card = document.getElementById(`tcard-${id}`);
      if (card) {
        card.querySelector('.task-check-btn')?.classList.add('checked');
        card.classList.add('task-complete-pulse');
      }
      const allTasks = DB.getTasksForSubject(this.currentSubject.id);
      const allDone = allTasks.every(x => x.status === 'done');
      const msgs = ['Excellent travail ! 🌟', 'Bravo ! Continue comme ça ! 💪', 'Super boulot ! 🎯', 'Well done ! 🏆', 'Parfait ! Tu avances ! 🚀'];
      setTimeout(() => {
        if (allDone && allTasks.length > 0) {
          Celebration.show(`🏆 ${this.currentSubject.name} terminée !`, 'Toutes les tâches sont complètes ! Excellent travail !', true);
        } else {
          Celebration.show(msgs[Math.floor(Math.random() * msgs.length)], `"${t.title.slice(0, 40)}" est terminée !`, false);
        }
        this._renderDetailView();
        this.renderGlobalStats();
      }, 400);
    } else {
      this._renderDetailView();
      this.renderGlobalStats();
    }
  },

  // ── RESOURCE ACTIONS ──

  openResourceModal(id = null) {
    if (!this.currentSubject) return;
    if (id) {
      const r = DB.getSubjectResources().find(x => x.id === id);
      if (!r) return;
      document.getElementById('subjectResourceModalTitle').textContent = 'Modifier la ressource';
      document.getElementById('subjectResourceId').value = r.id;
      document.getElementById('subjectResourceSubjectId').value = r.subjectId;
      document.getElementById('subjectResourceTitle').value = r.title;
      document.getElementById('subjectResourceType').value = r.type || 'Cours';
      document.getElementById('subjectResourceLink').value = r.link || '';
      document.getElementById('subjectResourceDescription').value = r.description || '';
      document.getElementById('subjectResourceDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('subjectResourceModalTitle').textContent = 'Nouvelle ressource';
      document.getElementById('subjectResourceId').value = '';
      document.getElementById('subjectResourceSubjectId').value = this.currentSubject.id;
      document.getElementById('subjectResourceTitle').value = '';
      document.getElementById('subjectResourceType').value = 'Cours';
      document.getElementById('subjectResourceLink').value = '';
      document.getElementById('subjectResourceDescription').value = '';
      document.getElementById('subjectResourceDeleteBtn').classList.add('hidden');
    }
    Modal.open('subjectResourceModal');
  },

  saveResource() {
    const title = document.getElementById('subjectResourceTitle').value.trim();
    if (!title) { Toast.show('Le titre est requis', 'error'); return; }
    const id = document.getElementById('subjectResourceId').value;
    const resource = {
      id: id || DB.generateId(),
      subjectId: document.getElementById('subjectResourceSubjectId').value,
      title,
      type: document.getElementById('subjectResourceType').value,
      link: document.getElementById('subjectResourceLink').value.trim(),
      description: document.getElementById('subjectResourceDescription').value.trim(),
      createdAt: id ? (DB.getSubjectResources().find(x => x.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };
    if (id) DB.updateSubjectResource(resource); else DB.addSubjectResource(resource);
    Modal.close('subjectResourceModal');
    Toast.show(id ? 'Ressource modifiée' : 'Ressource ajoutée', 'success');
    this.currentTab = 'resources';
    this._renderDetailView();
  },

  deleteResource(id) {
    if (confirm('Supprimer cette ressource ?')) {
      DB.deleteSubjectResource(id);
      Toast.show('Ressource supprimée', 'info');
      const tc = document.getElementById('learningTabContent');
      if (tc) tc.innerHTML = this._renderResourcesTab();
      this.renderGlobalStats();
    }
  },

  saveNote() {
    const text = document.getElementById('subjectNotesArea')?.value || '';
    DB.saveSubjectNote(this.currentSubject.id, text);
    Toast.show('Notes sauvegardées', 'success');
  },

  // ── SUBJECT MODAL ──

  openSubjectModal(id = null) {
    if (id) {
      const s = DB.getSubjects().find(x => x.id === id);
      if (!s) return;
      document.getElementById('subjectModalTitle').textContent = 'Modifier la matière';
      document.getElementById('subjectId').value = s.id;
      document.getElementById('subjectName').value = s.name;
      document.getElementById('subjectIcon').value = s.icon || '';
      document.getElementById('subjectColor').value = s.color || '#6366f1';
      document.getElementById('subjectLevel').value = s.level || 'debutant';
      document.getElementById('subjectObjective').value = s.objective || '';
      document.getElementById('subjectDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('subjectModalTitle').textContent = 'Nouvelle matière';
      document.getElementById('subjectId').value = '';
      document.getElementById('subjectName').value = '';
      document.getElementById('subjectIcon').value = '📖';
      document.getElementById('subjectColor').value = '#6366f1';
      document.getElementById('subjectLevel').value = 'debutant';
      document.getElementById('subjectObjective').value = '';
      document.getElementById('subjectDeleteBtn').classList.add('hidden');
    }
    Modal.open('subjectModal');
  },

  saveSubject() {
    const name = document.getElementById('subjectName').value.trim();
    if (!name) { Toast.show('Le nom est requis', 'error'); return; }
    const id = document.getElementById('subjectId').value;
    const s = {
      id: id || DB.generateId(), name,
      icon: document.getElementById('subjectIcon').value || '📖',
      color: document.getElementById('subjectColor').value,
      level: document.getElementById('subjectLevel').value,
      objective: document.getElementById('subjectObjective').value,
      createdAt: new Date().toISOString(),
    };
    if (id) DB.updateSubject(s); else DB.addSubject(s);
    Modal.close('subjectModal');
    Toast.show(id ? 'Matière modifiée' : 'Matière ajoutée', 'success');
    if (this.currentSubject && this.currentSubject.id === id) {
      this.currentSubject = s;
      this._renderDetailView();
    } else {
      this.backToList();
    }
    this.renderGlobalStats();
  },

  deleteSubject() {
    const id = document.getElementById('subjectId').value;
    if (!id) return;
    if (confirm('Supprimer cette matière et toutes ses tâches/ressources/notes ?')) {
      DB.deleteSubject(id);
      Modal.close('subjectModal');
      Toast.show('Matière supprimée', 'info');
      this.backToList();
    }
  },
};

// ════════════════════════════════════════════════════════
//  HABITS MODULE
// ════════════════════════════════════════════════════════
const HabitModule = {
  weekOffset: 0,

  init() {
    document.getElementById('habitWeekPrev').addEventListener('click', () => { this.weekOffset--; this.render(); });
    document.getElementById('habitWeekNext').addEventListener('click', () => { this.weekOffset++; this.render(); });
    document.getElementById('habitSaveBtn').addEventListener('click', () => this.save());
    document.getElementById('habitDeleteBtn').addEventListener('click', () => this.deleteHabit());
    this.render();
  },

  getWeekDays() {
    const ref = new Date();
    ref.setDate(ref.getDate() + this.weekOffset * 7);
    return Utils.getWeekDates(ref);
  },

  render() {
    const days = this.getWeekDays();
    const habits = DB.getHabits();
    const label = document.getElementById('habitWeekLabel');
    const todayStr = DB.todayStr();

    if(label) {
      if(this.weekOffset === 0) label.textContent = 'Cette semaine';
      else if(this.weekOffset === -1) label.textContent = 'Semaine précédente';
      else label.textContent = `${Utils.formatDateShort(days[0])} – ${Utils.formatDateShort(days[6])}`;
    }

    const el = document.getElementById('habitsTable');
    if(!el) return;

    if(habits.length === 0) {
      el.innerHTML = `<div class="empty-state large"><div class="empty-icon">⭐</div><p>Aucune habitude définie. Commencez à suivre vos habitudes quotidiennes.</p><button class="btn btn-primary" onclick="HabitModule.openModal()">Ajouter une habitude</button></div>`;
      return;
    }

    const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const headers = `<th>Habitude</th>${days.map((d,i)=>`<th class="${Utils.dateStr(d)===todayStr?'habit-col-today':''}">${dayNames[i]}<br><small style="font-weight:400">${d.getDate()}</small></th>`).join('')}<th>Série</th><th></th>`;

    const rows = habits.map(h => {
      const checks = days.map(d => {
        const ds = Utils.dateStr(d);
        const done = DB.isHabitDone(h.id, ds);
        const isToday = ds === todayStr;
        return `<td class="habit-check-cell ${isToday?'habit-col-today':''}">
          <div class="habit-check ${done?'checked':''} ${isToday?'today-col':''}" onclick="HabitModule.toggle('${h.id}','${ds}')">${done?'✓':''}</div>
        </td>`;
      }).join('');
      const streak = Utils.getStreak(h.id);
      return `
        <tr>
          <td>
            <div class="habit-name-cell">
              <span class="habit-icon" style="background:${h.color||'var(--primary)'}20;padding:4px;border-radius:6px">${h.icon||'⭐'}</span>
              <div>
                <div class="habit-name-text">${Utils.escHtml(h.name)}</div>
                <div class="habit-streak">${streak>0?`🔥 ${streak} jours`:''}</div>
              </div>
            </div>
          </td>
          ${checks}
          <td style="text-align:center;font-weight:700;color:${streak>0?'var(--warning)':'var(--text-muted)'}">${streak}</td>
          <td>
            <div class="habit-actions-cell">
              <button class="task-action-btn" onclick="HabitModule.openModal('${h.id}')">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');

    el.innerHTML = `<table class="habits-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  },

  toggle(habitId, date) {
    DB.toggleHabitLog(habitId, date);
    this.render();
    DashModule.renderHabits(DB.todayStr());
    DashModule.renderStats(DB.todayStr());
  },

  dashToggle(habitId, date) {
    const wasDone = DB.isHabitDone(habitId, date);
    DB.toggleHabitLog(habitId, date);
    DashModule.renderHabits(date);
    DashModule.renderStats(date);
    DashModule.renderDailyScore();

    if (!wasDone) {
      const settings = DB.getSettings();
      const name = settings.name || 'toi';
      const habits = DB.getHabits();
      const allDone = habits.length > 0 && habits.every(h => DB.isHabitDone(h.id, date));
      if (allDone) {
        Celebration.show(`Yaaay ! Incroyable ${name} ! 🌟`, 'Toutes tes habitudes sont validées aujourd\'hui !', true);
      } else {
        const habit = habits.find(h => h.id === habitId);
        Celebration.show('Super ! ⭐', `"${habit?.name?.slice(0, 35) || 'Habitude'}" validée !`, false);
      }
    }
  },

  openModal(id=null) {
    if(id) {
      const h = DB.getHabits().find(x=>x.id===id);
      if(!h) return;
      document.getElementById('habitModalTitle').textContent = 'Modifier l\'habitude';
      document.getElementById('habitId').value = h.id;
      document.getElementById('habitName').value = h.name;
      document.getElementById('habitIcon').value = h.icon||'';
      document.getElementById('habitColor').value = h.color||'#6366f1';
      document.getElementById('habitCategory').value = h.category||'other';
      document.getElementById('habitDesc').value = h.description||'';
      document.getElementById('habitDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('habitModalTitle').textContent = 'Nouvelle habitude';
      document.getElementById('habitId').value = '';
      document.getElementById('habitName').value = '';
      document.getElementById('habitIcon').value = '⭐';
      document.getElementById('habitColor').value = '#6366f1';
      document.getElementById('habitCategory').value = 'other';
      document.getElementById('habitDesc').value = '';
      document.getElementById('habitDeleteBtn').classList.add('hidden');
    }
    Modal.open('habitModal');
  },

  save() {
    const name = document.getElementById('habitName').value.trim();
    if(!name) { Toast.show('Le nom est requis','error'); return; }
    const id = document.getElementById('habitId').value;
    const h = {
      id: id||DB.generateId(), name,
      icon: document.getElementById('habitIcon').value||'⭐',
      color: document.getElementById('habitColor').value,
      category: document.getElementById('habitCategory').value,
      description: document.getElementById('habitDesc').value,
      createdAt: new Date().toISOString(),
    };
    if(id) DB.updateHabit(h); else DB.addHabit(h);
    Modal.close('habitModal');
    Toast.show(id?'Habitude modifiée':'Habitude ajoutée','success');
    this.render();
    DashModule.renderHabits(DB.todayStr());
  },

  deleteHabit() {
    const id = document.getElementById('habitId').value;
    if(!id) return;
    if(confirm('Supprimer cette habitude ?')) {
      DB.deleteHabit(id);
      Modal.close('habitModal');
      Toast.show('Habitude supprimée','info');
      this.render();
    }
  }
};

// ════════════════════════════════════════════════════════
//  GOALS MODULE
// ════════════════════════════════════════════════════════
const GoalModule = {
  currentFilter: 'all',

  init() {
    document.querySelectorAll('.filter-pill[data-gfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill[data-gfilter]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.gfilter;
        this.render();
      });
    });
    document.getElementById('goalSaveBtn').addEventListener('click', () => this.save());
    document.getElementById('goalDeleteBtn').addEventListener('click', () => this.deleteGoal());
    document.getElementById('goalProgress').addEventListener('input', function() {
      document.getElementById('goalProgressLabel').textContent = this.value + '%';
    });
    this.render();
  },

  render() {
    let goals = DB.getGoals();
    if(this.currentFilter === 'active') goals = goals.filter(g=>g.status!=='completed');
    if(this.currentFilter === 'completed') goals = goals.filter(g=>g.status==='completed');

    const el = document.getElementById('goalsList');
    if(!el) return;
    if(goals.length === 0) {
      el.innerHTML = `<div class="empty-state large" style="grid-column:1/-1"><div class="empty-icon">🎯</div><p>Aucun objectif. Commencez par définir vos premiers objectifs.</p><button class="btn btn-primary" onclick="GoalModule.openModal()">Créer un objectif</button></div>`;
      return;
    }
    el.innerHTML = goals.map(g => this.renderGoalCard(g)).join('');
    DashModule.renderGoals();
  },

  renderGoalCard(g) {
    const isCompleted = g.status === 'completed';
    const daysLeft = g.targetDate ? Math.ceil((new Date(g.targetDate+'T00:00:00')-new Date())/86400000) : null;
    return `
      <div class="goal-card" id="goal-${g.id}">
        <div class="goal-card-top">
          <div class="goal-title">${Utils.escHtml(g.title)}</div>
          <span class="goal-badge category-${g.category}">${Utils.categoryLabel(g.category)}</span>
        </div>
        ${g.description ? `<div class="goal-desc">${Utils.escHtml(g.description)}</div>` : ''}
        <div class="goal-progress-section">
          <div class="goal-progress-header">
            <span style="font-size:12px;color:var(--text-secondary)">Progression</span>
            <span class="goal-progress-pct">${g.progress||0}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${g.progress||0}%"></div></div>
        </div>
        <div class="goal-dates">
          ${g.startDate ? `<span>Début : ${Utils.formatDateShort(g.startDate)}</span>` : '<span></span>'}
          ${g.targetDate ? `<span style="${daysLeft&&daysLeft<7&&!isCompleted?'color:var(--danger);font-weight:600':''}">Cible : ${Utils.formatDateShort(g.targetDate)}${daysLeft!==null&&!isCompleted?` (${daysLeft}j)`:''}</span>` : '<span></span>'}
        </div>
        <div class="goal-footer">
          <span class="goal-priority priority-${g.priority}">${Utils.priorityLabel(g.priority)}</span>
          ${isCompleted ? '<span class="goal-completed-badge">✅ Terminé</span>' : `
          <div class="goal-actions">
            <input type="range" min="0" max="100" value="${g.progress||0}" style="flex:1;min-width:60px;max-width:100px;accent-color:var(--primary)" oninput="GoalModule.updateProgress('${g.id}',this.value)">
            <button class="btn btn-sm btn-outline" onclick="GoalModule.openModal('${g.id}')">Modifier</button>
            <button class="btn btn-sm btn-secondary" onclick="GoalModule.markDone('${g.id}')">✓ Terminer</button>
          </div>`}
        </div>
      </div>`;
  },

  openModal(id=null) {
    if(id) {
      const g = DB.getGoals().find(x=>x.id===id);
      if(!g) return;
      document.getElementById('goalModalTitle').textContent = 'Modifier l\'objectif';
      document.getElementById('goalId').value = g.id;
      document.getElementById('goalTitle').value = g.title;
      document.getElementById('goalDesc').value = g.description||'';
      document.getElementById('goalStart').value = g.startDate||'';
      document.getElementById('goalTarget').value = g.targetDate||'';
      document.getElementById('goalPriority').value = g.priority||'medium';
      document.getElementById('goalCategory').value = g.category||'personal';
      document.getElementById('goalProgress').value = g.progress||0;
      document.getElementById('goalProgressLabel').textContent = (g.progress||0)+'%';
      document.getElementById('goalDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('goalModalTitle').textContent = 'Nouvel objectif';
      document.getElementById('goalId').value = '';
      document.getElementById('goalTitle').value = '';
      document.getElementById('goalDesc').value = '';
      document.getElementById('goalStart').value = DB.todayStr();
      document.getElementById('goalTarget').value = '';
      document.getElementById('goalPriority').value = 'medium';
      document.getElementById('goalCategory').value = 'personal';
      document.getElementById('goalProgress').value = 0;
      document.getElementById('goalProgressLabel').textContent = '0%';
      document.getElementById('goalDeleteBtn').classList.add('hidden');
    }
    Modal.open('goalModal');
  },

  save() {
    const title = document.getElementById('goalTitle').value.trim();
    if(!title) { Toast.show('Le titre est requis','error'); return; }
    const id = document.getElementById('goalId').value;
    const existing = id ? DB.getGoals().find(g=>g.id===id) : null;
    const g = {
      id: id||DB.generateId(), title,
      description: document.getElementById('goalDesc').value,
      startDate: document.getElementById('goalStart').value,
      targetDate: document.getElementById('goalTarget').value,
      priority: document.getElementById('goalPriority').value,
      category: document.getElementById('goalCategory').value,
      progress: parseInt(document.getElementById('goalProgress').value)||0,
      status: existing?.status||'active',
      createdAt: existing?.createdAt||new Date().toISOString(),
    };
    if(g.progress >= 100) g.status = 'completed';
    if(id) DB.updateGoal(g); else DB.addGoal(g);
    Modal.close('goalModal');
    Toast.show(id?'Objectif modifié':'Objectif créé','success');
    this.render();
  },

  updateProgress(id, val) {
    const g = DB.getGoals().find(x=>x.id===id);
    if(!g) return;
    g.progress = parseInt(val);
    if(g.progress >= 100) g.status = 'completed';
    DB.updateGoal(g);
    DashModule.renderGoals();
    DashModule.renderStats(DB.todayStr());
  },

  markDone(id) {
    const g = DB.getGoals().find(x=>x.id===id);
    if(!g) return;
    g.progress = 100; g.status = 'completed';
    DB.updateGoal(g);
    Toast.show('Objectif terminé ! 🎉','success');
    this.render();
  },

  deleteGoal() {
    const id = document.getElementById('goalId').value;
    if(!id) return;
    if(confirm('Supprimer cet objectif ?')) {
      DB.deleteGoal(id);
      Modal.close('goalModal');
      Toast.show('Objectif supprimé','info');
      this.render();
    }
  }
};

// ════════════════════════════════════════════════════════
//  NOTES MODULE
// ════════════════════════════════════════════════════════
const NotesModule = {
  currentNote: null,
  currentTab: 'notes',
  journalDate: DB.todayStr(),
  journalMonth: new Date(),

  init() {
    document.querySelectorAll('.notes-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.notes-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.ntab;
        this.switchTab();
      });
    });
    document.getElementById('addNoteBtn').addEventListener('click', () => this.newNote());
    this.renderNotesList();
  },

  switchTab() {
    const notesContent = document.getElementById('notesContent');
    const journalContent = document.getElementById('journalContent');
    const addBtn = document.getElementById('addNoteBtn');
    if(this.currentTab === 'notes') {
      notesContent.classList.remove('hidden');
      journalContent.classList.add('hidden');
      addBtn.textContent = '+ Nouvelle note';
      this.renderNotesList();
    } else {
      notesContent.classList.add('hidden');
      journalContent.classList.remove('hidden');
      addBtn.textContent = '+ Entrée du jour';
      addBtn.onclick = () => this.openJournalEntry(DB.todayStr());
      this.renderJournal();
    }
  },

  renderNotesList() {
    const notes = DB.getNotes().sort((a,b) => {
      if(a.pinned && !b.pinned) return -1;
      if(!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt||b.createdAt) - new Date(a.updatedAt||a.createdAt);
    });
    const el = document.getElementById('notesListPanel');
    if(!el) return;
    if(notes.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">📝</div><p>Aucune note</p></div>`;
      return;
    }
    el.innerHTML = notes.map(n => `
      <div class="note-card ${n.id===this.currentNote?.id?'active':''}" onclick="NotesModule.openNote('${n.id}')">
        <div class="note-card-title">${n.pinned?'📌 ':''}${Utils.escHtml(n.title||'Note sans titre')}</div>
        <div class="note-card-preview">${Utils.escHtml(n.content||'')}</div>
        <div class="note-card-date">${new Date(n.updatedAt||n.createdAt).toLocaleDateString('fr-FR')}</div>
      </div>`).join('');
  },

  openNote(id) {
    const n = DB.getNotes().find(x=>x.id===id);
    if(!n) return;
    this.currentNote = n;
    this.renderNotesList();
    const panel = document.getElementById('noteEditorPanel');
    if(!panel) return;
    panel.innerHTML = `
      <div class="note-editor-header">
        <input type="text" class="note-title-input" id="noteTitleInput" value="${Utils.escHtml(n.title||'')}" placeholder="Titre de la note">
        <button class="icon-btn" onclick="NotesModule.togglePin('${n.id}')" title="${n.pinned?'Désépingler':'Épingler'}" style="color:${n.pinned?'var(--warning)':'var(--text-secondary)'}">📌</button>
        <button class="icon-btn" onclick="NotesModule.deleteNote('${n.id}')" title="Supprimer" style="color:var(--danger)">
          <svg viewBox="0 0 24 24" style="width:16px;height:16px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <textarea class="note-body-input" id="noteBodyInput" placeholder="Écrivez votre note ici...">${Utils.escHtml(n.content||'')}</textarea>
      <div class="note-editor-footer">
        <span style="font-size:11px;color:var(--text-muted)">Modifié le ${new Date(n.updatedAt||n.createdAt).toLocaleDateString('fr-FR')}</span>
        <button class="btn btn-primary" onclick="NotesModule.saveNote('${n.id}')">Enregistrer</button>
      </div>`;
  },

  newNote() {
    const n = {
      id: DB.generateId(), title: '', content: '',
      pinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    DB.addNote(n);
    this.renderNotesList();
    this.openNote(n.id);
    document.getElementById('noteTitleInput')?.focus();
  },

  saveNote(id) {
    const n = DB.getNotes().find(x=>x.id===id);
    if(!n) return;
    n.title = document.getElementById('noteTitleInput')?.value||'';
    n.content = document.getElementById('noteBodyInput')?.value||'';
    n.updatedAt = new Date().toISOString();
    DB.updateNote(n);
    this.currentNote = n;
    Toast.show('Note enregistrée','success');
    this.renderNotesList();
  },

  togglePin(id) {
    const n = DB.getNotes().find(x=>x.id===id);
    if(!n) return;
    n.pinned = !n.pinned;
    DB.updateNote(n);
    this.renderNotesList();
    this.openNote(id);
  },

  deleteNote(id) {
    if(confirm('Supprimer cette note ?')) {
      DB.deleteNote(id);
      this.currentNote = null;
      document.getElementById('noteEditorPanel').innerHTML = `<div class="empty-state large"><div class="empty-icon">📝</div><p>Sélectionnez une note ou créez-en une nouvelle</p></div>`;
      this.renderNotesList();
      Toast.show('Note supprimée','info');
    }
  },

  renderJournal() {
    this.renderJournalCal();
    this.renderJournalEditor(this.journalDate);
  },

  renderJournalCal() {
    const el = document.getElementById('journalCal');
    if(!el) return;
    const year = this.journalMonth.getFullYear();
    const month = this.journalMonth.getMonth();
    const firstDay = new Date(year,month,1);
    const lastDay = new Date(year,month+1,0);
    const startDay = (firstDay.getDay()+6)%7;
    const todayStr = DB.todayStr();
    const journal = DB.getJournal();
    const dayNames = ['L','M','M','J','V','S','D'];

    let cells = '';
    for(let i=0;i<startDay;i++) cells += '<div class="jcal-day other-month"></div>';
    for(let i=1;i<=lastDay.getDate();i++) {
      const d = new Date(year,month,i);
      const ds = Utils.dateStr(d);
      cells += `<div class="jcal-day ${ds===todayStr?'today':''} ${journal[ds]?'has-entry':''} ${ds===this.journalDate?'selected':''}" onclick="NotesModule.openJournalEntry('${ds}')">${i}</div>`;
    }

    el.innerHTML = `
      <div class="journal-mini-cal">
        <div class="jcal-header">
          <button class="icon-btn" onclick="NotesModule.jcalPrev()" style="padding:4px"><svg viewBox="0 0 24 24" style="width:14px;height:14px"><polyline points="15 18 9 12 15 6"/></svg></button>
          <span class="jcal-title">${Utils.capitalize(this.journalMonth.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}))}</span>
          <button class="icon-btn" onclick="NotesModule.jcalNext()" style="padding:4px"><svg viewBox="0 0 24 24" style="width:14px;height:14px"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
        <div class="jcal-grid">
          ${dayNames.map(d=>`<div class="jcal-day-name">${d}</div>`).join('')}
          ${cells}
        </div>
      </div>`;
  },

  jcalPrev() { this.journalMonth.setMonth(this.journalMonth.getMonth()-1); this.renderJournal(); },
  jcalNext() { this.journalMonth.setMonth(this.journalMonth.getMonth()+1); this.renderJournal(); },

  openJournalEntry(date) {
    this.journalDate = date;
    this.renderJournalCal();
    this.renderJournalEditor(date);
  },

  renderJournalEditor(date) {
    const el = document.getElementById('journalEditor');
    if(!el) return;
    const entry = DB.getJournalEntry(date) || {};
    const moods = ['😊','😐','😔','😤','😴','🤔','😁'];
    el.innerHTML = `
      <div class="journal-date-title">${Utils.capitalize(Utils.formatDate(date))}</div>
      <div class="journal-section">
        <label>Humeur du jour</label>
        <div class="mood-row" id="moodRow">
          ${moods.map(m=>`<span class="mood-btn ${entry.mood===m?'selected':''}" onclick="NotesModule.setMood('${m}')">${m}</span>`).join('')}
        </div>
        <input type="hidden" id="journalMood" value="${entry.mood||''}">
      </div>
      <div class="journal-section">
        <label>Qu'est-ce que j'ai fait aujourd'hui ?</label>
        <textarea class="journal-textarea" id="journalDid" rows="3" placeholder="Mes activités et accomplissements...">${Utils.escHtml(entry.did||'')}</textarea>
      </div>
      <div class="journal-section">
        <label>Qu'est-ce que j'ai appris ?</label>
        <textarea class="journal-textarea" id="journalLearned" rows="2" placeholder="Mes apprentissages du jour...">${Utils.escHtml(entry.learned||'')}</textarea>
      </div>
      <div class="journal-section">
        <label>Ce que je veux améliorer</label>
        <textarea class="journal-textarea" id="journalImprove" rows="2" placeholder="Points d'amélioration...">${Utils.escHtml(entry.improve||'')}</textarea>
      </div>
      <div class="journal-section">
        <label>Réflexions & pensées libres</label>
        <textarea class="journal-textarea" id="journalThoughts" rows="3" placeholder="Mes pensées, idées, réflexions...">${Utils.escHtml(entry.thoughts||'')}</textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:10px">
        <button class="btn btn-primary" onclick="NotesModule.saveJournal('${date}')">Enregistrer l'entrée</button>
      </div>`;
  },

  setMood(mood) {
    document.getElementById('journalMood').value = mood;
    document.querySelectorAll('.mood-btn').forEach(b => { b.classList.toggle('selected', b.textContent===mood); });
  },

  saveJournal(date) {
    DB.saveJournalEntry(date, {
      mood: document.getElementById('journalMood')?.value||'',
      did: document.getElementById('journalDid')?.value||'',
      learned: document.getElementById('journalLearned')?.value||'',
      improve: document.getElementById('journalImprove')?.value||'',
      thoughts: document.getElementById('journalThoughts')?.value||'',
      savedAt: new Date().toISOString(),
    });
    Toast.show('Entrée du journal enregistrée','success');
    this.renderJournalCal();
  }
};

// ════════════════════════════════════════════════════════
//  STATS MODULE
// ════════════════════════════════════════════════════════
const StatsModule = {
  charts: {},
  currentPeriod: 'week',

  init() {
    document.querySelectorAll('.period-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.period-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        this.currentPeriod = tab.dataset.period || 'week';
        this.render();
      });
    });
    this.render();
  },

  render() {
    this.renderCharts();
    this.renderSummary();
    this.renderHistory();
  },

  getWeekData() {
    const days = Utils.getWeekDates(new Date());
    return days.map(d => ({
      date: Utils.dateStr(d),
      label: Utils.getDayName(d),
      tasks: DB.getTasks().filter(t=>t.completedAt===Utils.dateStr(d)).length,
      habits: DB.getHabits().filter(h=>DB.isHabitDone(h.id,Utils.dateStr(d))).length,
    }));
  },

  getMonthData() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const result = [];
    for(let i=1; i<=daysInMonth; i++) {
      const d = new Date(year, month, i);
      const ds = Utils.dateStr(d);
      result.push({
        date: ds,
        label: String(i),
        tasks: DB.getTasks().filter(t=>t.completedAt===ds).length,
        habits: DB.getHabits().filter(h=>DB.isHabitDone(h.id,ds)).length,
      });
    }
    return result;
  },

  getPeriodData() {
    return this.currentPeriod === 'month' ? this.getMonthData() : this.getWeekData();
  },

  getPeriodEvents() {
    const today = new Date();
    if(this.currentPeriod === 'month') {
      const year = today.getFullYear();
      const month = today.getMonth();
      const start = Utils.dateStr(new Date(year, month, 1));
      const end = Utils.dateStr(new Date(year, month+1, 0));
      return DB.getEvents().filter(e => e.date >= start && e.date <= end);
    }
    const week = DashModule.getWeekRange();
    return DB.getEvents().filter(e => e.date >= week.start && e.date <= week.end);
  },

  renderCharts() {
    if(typeof Chart === 'undefined') return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    const defaults = {
      responsive: true,
      plugins: { legend: { labels: { color: textColor } } },
      scales: { x: { ticks:{color:textColor}, grid:{color:gridColor} }, y: { ticks:{color:textColor}, grid:{color:gridColor} } }
    };

    // Destroy old charts
    ['chartTasksWeek','chartTimeDistrib','chartHabits','chartLearning'].forEach(id => {
      if(this.charts[id]) { this.charts[id].destroy(); delete this.charts[id]; }
    });

    const periodData = this.getPeriodData();
    const periodLabel = this.currentPeriod === 'month' ? 'Tâches terminées (ce mois)' : 'Tâches terminées (cette semaine)';
    const habitsLabel = this.currentPeriod === 'month' ? 'Habitudes complétées (ce mois)' : 'Habitudes complétées (cette semaine)';

    // Tasks bar chart
    const c1 = document.getElementById('chartTasksWeek');
    if(c1) {
      this.charts['chartTasksWeek'] = new Chart(c1, {
        type: 'bar',
        data: {
          labels: periodData.map(d=>d.label),
          datasets: [{ label: periodLabel, data: periodData.map(d=>d.tasks), backgroundColor:'rgba(99,102,241,0.7)', borderRadius:6 }]
        },
        options: {...defaults, plugins:{...defaults.plugins, title:{display:false}}}
      });
    }

    // Time distribution (events by category) for selected period
    const events = this.getPeriodEvents();
    const cats = {};
    events.forEach(ev => { cats[ev.category||'other'] = (cats[ev.category||'other']||0)+1; });
    const c2 = document.getElementById('chartTimeDistrib');
    if(c2) {
      // Remove any previously added empty-state
      const prev = c2.parentElement.querySelector('.empty-state');
      if(prev) prev.remove();
      if(Object.keys(cats).length > 0) {
        const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#0ea5e9','#ef4444'];
        this.charts['chartTimeDistrib'] = new Chart(c2, {
          type: 'doughnut',
          data: {
            labels: Object.keys(cats).map(k=>Utils.categoryLabel(k)),
            datasets: [{ data: Object.values(cats), backgroundColor: colors, borderWidth: 2, borderColor: isDark?'#1e293b':'#fff' }]
          },
          options: { responsive:true, plugins:{legend:{labels:{color:textColor},position:'bottom'}} }
        });
      } else {
        c2.parentElement.innerHTML += '<div class="empty-state" style="margin-top:20px"><p>Aucun événement sur la période sélectionnée</p></div>';
      }
    }

    // Habits line chart
    const c3 = document.getElementById('chartHabits');
    if(c3) {
      this.charts['chartHabits'] = new Chart(c3, {
        type: 'line',
        data: {
          labels: periodData.map(d=>d.label),
          datasets: [{
            label: habitsLabel,
            data: periodData.map(d=>d.habits),
            borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.1)',
            tension:0.4, fill:true, pointBackgroundColor:'#10b981'
          }]
        },
        options: {...defaults}
      });
    }

    // Learning bar chart (always global, not period-dependent)
    const c4 = document.getElementById('chartLearning');
    if(c4) {
      const subjects = DB.getSubjects();
      const data = subjects.map(s => {
        const lessons = DB.getLessonsForSubject(s.id);
        return lessons.length ? Math.round((lessons.filter(l=>l.status==='done').length/lessons.length)*100) : 0;
      });
      this.charts['chartLearning'] = new Chart(c4, {
        type: 'bar',
        data: {
          labels: subjects.map(s=>s.name),
          datasets: [{ label:'% complété', data, backgroundColor: subjects.map(s=>s.color||'#6366f1'), borderRadius:6 }]
        },
        options: {...defaults, scales:{...defaults.scales, y:{...defaults.scales.y, max:100}}}
      });
    }
  },

  renderSummary() {
    const el = document.getElementById('statsSummary');
    if(!el) return;
    const tasks = DB.getTasks();
    const todayStr = DB.todayStr();
    const habits = DB.getHabits();

    let doneTasks, habitRate, periodLabel;

    if(this.currentPeriod === 'month') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const start = Utils.dateStr(new Date(year, month, 1));
      const end = Utils.dateStr(new Date(year, month+1, 0));
      doneTasks = tasks.filter(t=>t.completedAt && t.completedAt>=start && t.completedAt<=end).length;
      // Monthly habit rate: average completion rate over days elapsed this month
      const daysElapsed = today.getDate();
      let totalHabitDone = 0;
      for(let i=1; i<=daysElapsed; i++) {
        const ds = Utils.dateStr(new Date(year, month, i));
        totalHabitDone += habits.filter(h=>DB.isHabitDone(h.id,ds)).length;
      }
      habitRate = habits.length && daysElapsed ? Math.round((totalHabitDone / (habits.length * daysElapsed)) * 100) : 0;
      periodLabel = 'ce mois';
    } else {
      const week = DashModule.getWeekRange();
      doneTasks = tasks.filter(t=>t.completedAt && t.completedAt>=week.start && t.completedAt<=week.end).length;
      const todayDone = habits.filter(h=>DB.isHabitDone(h.id,todayStr)).length;
      habitRate = habits.length ? Math.round((todayDone/habits.length)*100) : 0;
      periodLabel = 'cette semaine';
    }

    const goals = DB.getGoals();
    const completedGoals = goals.filter(g=>g.status==='completed').length;
    const subjects = DB.getSubjects();
    const avgProgress = subjects.length ? Math.round(subjects.reduce((sum,s) => {
      const l = DB.getLessonsForSubject(s.id);
      return sum + (l.length?Math.round((l.filter(x=>x.status==='done').length/l.length)*100):0);
    }, 0) / subjects.length) : 0;

    el.innerHTML = `
      <div class="summary-widget">
        <span class="summary-number">${doneTasks}</span>
        <span class="summary-label">Tâches terminées ${periodLabel}</span>
      </div>
      <div class="summary-widget">
        <span class="summary-number">${habitRate}%</span>
        <span class="summary-label">Taux habitudes ${this.currentPeriod === 'month' ? 'ce mois' : "aujourd'hui"}</span>
      </div>
      <div class="summary-widget">
        <span class="summary-number">${completedGoals}</span>
        <span class="summary-label">Objectifs atteints</span>
      </div>
      <div class="summary-widget">
        <span class="summary-number">${avgProgress}%</span>
        <span class="summary-label">Progression apprentissage</span>
      </div>`;
  },

  renderHistory() {
    const el = document.getElementById('statsHistory');
    if (!el) return;

    const tasks = DB.getTasks();
    const habits = DB.getHabits();
    const habitLogs = DB.getHabitLogs();
    const todayStr = DB.todayStr();

    // Gather all dates with any activity (past days only)
    const dates = new Set();
    tasks.forEach(t => { if (t.completedAt && t.completedAt < todayStr) dates.add(t.completedAt); });
    Object.keys(habitLogs).forEach(d => { if (d < todayStr) dates.add(d); });

    const sortedDates = [...dates].sort((a, b) => b.localeCompare(a)).slice(0, 30);

    if (sortedDates.length === 0) {
      el.innerHTML = `
        <div class="history-title">📅 Historique des journées</div>
        <div class="empty-state"><div class="empty-icon">📊</div><p>Aucun historique disponible. Commence à cocher tes tâches et habitudes !</p></div>`;
      return;
    }

    const rows = sortedDates.map(dateStr => {
      const doneTasks = tasks.filter(t => t.completedAt === dateStr);
      const doneHabits = habits.filter(h => habitLogs[dateStr] && habitLogs[dateStr][h.id]);
      const habitRate = habits.length ? Math.round((doneHabits.length / habits.length) * 100) : null;

      let scoreClass, scoreLabel;
      if (doneTasks.length > 0 && habitRate === 100) {
        scoreClass = 'perfect'; scoreLabel = '🏆 Parfait';
      } else if (doneTasks.length > 0 || (habitRate !== null && habitRate >= 70)) {
        scoreClass = 'good'; scoreLabel = '🔥 Bien';
      } else if (doneTasks.length > 0 || doneHabits.length > 0) {
        scoreClass = ''; scoreLabel = '✓ Actif';
      } else {
        scoreClass = 'low'; scoreLabel = '○ Repos';
      }

      const taskHtml = doneTasks.map(t => `
        <div class="history-item">
          <span class="history-check">✓</span>
          <span class="history-item-name">${Utils.escHtml(t.title)}</span>
          <span class="history-item-meta priority-${t.priority}">${Utils.priorityLabel(t.priority)}</span>
        </div>`).join('');

      const habitHtml = doneHabits.map(h => `
        <div class="history-item">
          <span>${h.icon || '⭐'}</span>
          <span class="history-item-name">${Utils.escHtml(h.name)}</span>
        </div>`).join('');

      const metaParts = [];
      if (doneTasks.length > 0) metaParts.push(`${doneTasks.length} tâche${doneTasks.length>1?'s':''}`);
      if (habitRate !== null) metaParts.push(`${habitRate}% habitudes`);

      return `
        <div class="history-day">
          <div class="history-day-header" onclick="
            this.classList.toggle('open');
            this.nextElementSibling.classList.toggle('hidden')">
            <div class="history-day-date">${Utils.capitalize(Utils.formatDate(dateStr))}</div>
            <span class="history-day-meta">${metaParts.join(' · ')}</span>
            <span class="history-day-score ${scoreClass}">${scoreLabel}</span>
            <span class="history-chevron">›</span>
          </div>
          <div class="history-day-body hidden">
            ${doneTasks.length > 0 ? `<div class="history-section-label">Tâches accomplies</div>${taskHtml}` : ''}
            ${doneHabits.length > 0 ? `<div class="history-section-label">Habitudes validées</div>${habitHtml}` : ''}
            ${doneTasks.length === 0 && doneHabits.length === 0 ? '<div style="color:var(--text-muted);font-size:13px;padding:8px 0">Aucune activité enregistrée</div>' : ''}
          </div>
        </div>`;
    }).join('');

    el.innerHTML = `<div class="history-title">📅 Historique des journées</div>${rows}`;
  }
};

// ════════════════════════════════════════════════════════
//  SETTINGS MODULE
// ════════════════════════════════════════════════════════
const SettingsModule = {
  init() {
    this.loadSettings();
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.save());
    document.getElementById('setDarkMode').addEventListener('change', e => {
      document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
    });
    document.querySelectorAll('.swatch').forEach(s => {
      s.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active'));
        s.classList.add('active');
        document.documentElement.style.setProperty('--primary', s.dataset.color);
        document.documentElement.style.setProperty('--primary-dark', s.dataset.color);
      });
    });
    document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
    document.getElementById('importFile').addEventListener('change', e => this.importData(e));
    document.getElementById('resetDataBtn').addEventListener('click', () => this.resetData());
  },

  loadSettings() {
    const s = DB.getSettings();
    const nameEl = document.getElementById('setName');
    const avatarEl = document.getElementById('setAvatar');
    const darkEl = document.getElementById('setDarkMode');
    const startEl = document.getElementById('setStartHour');
    const endEl = document.getElementById('setEndHour');
    if(nameEl) nameEl.value = s.name||'Badr';
    if(avatarEl) avatarEl.value = s.avatar||'B';
    if(darkEl) darkEl.checked = s.theme==='dark';
    if(startEl) startEl.value = s.startHour||5;
    if(endEl) endEl.value = s.endHour||23;
    // Active swatch
    if(s.primaryColor) {
      document.querySelectorAll('.swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.color === s.primaryColor);
      });
      document.documentElement.style.setProperty('--primary', s.primaryColor);
    }
  },

  save() {
    const s = {
      name: document.getElementById('setName')?.value||'Badr',
      avatar: document.getElementById('setAvatar')?.value||'B',
      theme: document.getElementById('setDarkMode')?.checked ? 'dark' : 'light',
      primaryColor: document.querySelector('.swatch.active')?.dataset.color||'#6366f1',
      startHour: parseInt(document.getElementById('setStartHour')?.value)||5,
      endHour: parseInt(document.getElementById('setEndHour')?.value)||23,
    };
    DB.saveSettings(s);
    // Apply
    document.documentElement.setAttribute('data-theme', s.theme);
    document.documentElement.style.setProperty('--primary', s.primaryColor);
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    if(nameEl) nameEl.textContent = s.name;
    if(avatarEl) avatarEl.textContent = s.avatar;
    Toast.show('Paramètres enregistrés','success');
    DashModule.render();
  },

  exportData() {
    const keys = ['events','tasks','subjects','lessons','habits','habitLogs','goals','notes','journal','settings','phrases','transactions'];
    const data = {};
    keys.forEach(k => { data[k] = DB.get(k); });
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lifeos-backup-${DB.todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
    Toast.show('Données exportées','success');
  },

  importData(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        const keys = ['events','tasks','subjects','lessons','habits','habitLogs','goals','notes','journal','settings','phrases','transactions'];
        keys.forEach(k => { if(data[k] !== undefined) DB.set(k, data[k]); });
        Toast.show('Données importées avec succès','success');
        location.reload();
      } catch { Toast.show('Fichier invalide','error'); }
    };
    reader.readAsText(file);
  },

  resetData() {
    if(confirm('⚠️ Supprimer TOUTES les données ? Cette action est irréversible.')) {
      ['events','tasks','subjects','lessons','habits','habitLogs','goals','notes','journal'].forEach(k => DB.remove(k));
      Toast.show('Données réinitialisées','info');
      location.reload();
    }
  }
};

// ════════════════════════════════════════════════════════
//  POMODORO MODULE
// ════════════════════════════════════════════════════════
const PomodoroModule = {

  // ── State ──
  isRunning: false,
  isPaused: false,
  timerInterval: null,
  timeLeft: 0,
  totalSeconds: 0,
  currentPhase: 'work',   // 'work' | 'shortBreak' | 'longBreak'
  currentCycle: 1,
  cyclesBeforeLong: 4,
  sessionStart: null,
  focusActive: false,
  particles: [],
  particleFrame: null,
  currentLinkedName: '',

  MOTIVATIONS_WORK: [
    "Restez concentré. Chaque minute compte.",
    "Vous êtes capable. Continuez.",
    "La discipline construit des champions.",
    "Un Pomodoro à la fois. Vous avancez.",
    "Focus total. Résultats exceptionnels.",
    "Votre futur vous remerciera.",
    "Chaque session vous rapproche du succès.",
    "Travaillez dur en silence. Le succès fera du bruit.",
  ],
  MOTIVATIONS_BREAK: [
    "Bien mérité ! Reposez votre esprit.",
    "Rechargez vos batteries. La prochaine session vous attend.",
    "Une pause saine = une concentration maximale.",
    "Respirez profondément. Hydratez-vous.",
    "Vous avancez parfaitement. Profitez de ce repos.",
  ],

  // ── Storage helpers ──
  getSettings() {
    return DB.get('pomodoroSettings') || {
      mode: 'classic', workTime: 25, shortBreak: 5, longBreak: 20,
      cyclesBeforeLong: 4, dailyGoal: 8,
      dayStart: '08:00', dayEnd: '22:00',
      fixedBreaks: [
        { id:'b1', name:'Déjeuner', start:'13:00', duration:60, emoji:'🍽️' },
        { id:'b2', name:'Pause marche', start:'16:00', duration:30, emoji:'🚶' },
      ],
      linkedType: '', linkedId: '',
    };
  },
  saveSettings(s) { DB.set('pomodoroSettings', s); },

  getTodaySessions() { return DB.get('pomo_' + DB.todayStr()) || []; },
  saveTodaySessions(sessions) { DB.set('pomo_' + DB.todayStr(), sessions); },
  addSession(session) {
    const sessions = this.getTodaySessions();
    sessions.push(session);
    this.saveTodaySessions(sessions);
  },

  getWorkSessions() { return this.getTodaySessions().filter(s => s.type === 'work'); },
  getDoneCount() { return this.getWorkSessions().filter(s => s.status === 'completed').length; },
  getTotalFocusMin() {
    return this.getWorkSessions()
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  },

  getModeConfig(mode) {
    const configs = {
      classic:      { work: 25, shortBreak: 5,  longBreak: 20, cycles: 4 },
      intermediate: { work: 50, shortBreak: 10, longBreak: 25, cycles: 3 },
      intensive:    { work: 60, shortBreak: 10, longBreak: 30, cycles: 2 },
    };
    return configs[mode] || configs.classic;
  },

  // ── Init ──
  init() {
    // Mode buttons
    document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const settings = this.getSettings();
        settings.mode = btn.dataset.mode;
        this.saveSettings(settings);
        const customCard = document.getElementById('pomoCustomSettings');
        if(customCard) customCard.style.display = btn.dataset.mode === 'custom' ? 'block' : 'none';
        this.applyMode(settings);
        this.updateMiniRing();
      });
    });

    // Fixed breaks
    document.getElementById('pomoFixedBreaks')?.addEventListener('click', e => {
      const removeBtn = e.target.closest('[data-remove-break]');
      if(removeBtn) this.removeFixedBreak(removeBtn.dataset.removeBreak);
    });

    // Link type
    document.getElementById('pomoLinkType')?.addEventListener('change', () => this.updateLinkOptions());

    // Time inputs for timeline
    ['pomoStartTime','pomoEndTime'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.buildTimeline());
    });

    const s = this.getSettings();
    this.applyMode(s);

    // Set active mode button
    const modeBtn = document.querySelector(`.pomo-mode-btn[data-mode="${s.mode}"]`);
    if(modeBtn) {
      document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.remove('active'));
      modeBtn.classList.add('active');
    }
    if(s.mode === 'custom') {
      const cc = document.getElementById('pomoCustomSettings');
      if(cc) cc.style.display = 'block';
    }

    // Day range
    const st = document.getElementById('pomoStartTime');
    const et = document.getElementById('pomoEndTime');
    if(st) st.value = s.dayStart || '08:00';
    if(et) et.value = s.dayEnd || '22:00';

    // Goal
    const gn = document.getElementById('pomoGoalNum');
    if(gn) gn.textContent = s.dailyGoal || 8;

    this.renderFixedBreaks();
    this.renderGoalDots();
    this.renderSessionHistory();
    this.updateHeaderStats();
    this.buildTimeline();
    this.updateLinkOptions();
  },

  applyMode(s) {
    if(s.mode !== 'custom') {
      const cfg = this.getModeConfig(s.mode);
      s.workTime = cfg.work;
      s.shortBreak = cfg.shortBreak;
      s.longBreak = cfg.longBreak;
      s.cyclesBeforeLong = cfg.cycles;
    } else {
      s.workTime = parseInt(document.getElementById('customWork')?.value) || 45;
      s.shortBreak = parseInt(document.getElementById('customShort')?.value) || 10;
      s.longBreak = parseInt(document.getElementById('customLong')?.value) || 20;
      s.cyclesBeforeLong = parseInt(document.getElementById('customCycles')?.value) || 4;
    }
    this.cyclesBeforeLong = s.cyclesBeforeLong;
    if(!this.isRunning) {
      this.currentPhase = 'work';
      this.timeLeft = s.workTime * 60;
      this.totalSeconds = this.timeLeft;
    }
    this.updateMiniDisplay();
  },

  // ── Timer core ──
  toggleTimer() {
    if(!this.isRunning) this.startTimer();
    else if(!this.isPaused) this.pauseTimer();
    else this.resumeTimer();
  },

  startTimer() {
    const s = this.getSettings();
    this.applyMode(s);
    if(s.mode === 'custom') {
      s.workTime = parseInt(document.getElementById('customWork')?.value)||45;
      s.shortBreak = parseInt(document.getElementById('customShort')?.value)||10;
      s.longBreak = parseInt(document.getElementById('customLong')?.value)||20;
      s.cyclesBeforeLong = parseInt(document.getElementById('customCycles')?.value)||4;
      this.saveSettings(s);
    }
    this.isRunning = true;
    this.isPaused = false;
    this.sessionStart = new Date();
    this.timeLeft = s.workTime * 60;
    this.totalSeconds = this.timeLeft;
    this.currentPhase = 'work';

    this.updatePlayButtons('pause');
    this.updatePhaseDisplay();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
    this.showFocusNotif('Session démarrée ! 🎯');
  },

  pauseTimer() {
    this.isPaused = true;
    clearInterval(this.timerInterval);
    this.updatePlayButtons('play');
    this.showFocusNotif('En pause ⏸');
  },

  resumeTimer() {
    this.isPaused = false;
    this.timerInterval = setInterval(() => this.tick(), 1000);
    this.updatePlayButtons('pause');
    this.showFocusNotif('Reprise ▶');
  },

  resetTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.isPaused = false;
    this.currentPhase = 'work';
    this.currentCycle = 1;
    const s = this.getSettings();
    this.applyMode(s);
    this.timeLeft = s.workTime * 60;
    this.totalSeconds = this.timeLeft;
    this.updatePlayButtons('play');
    this.updateMiniDisplay();
    this.updateFocusDisplay();
    this.updateMiniRing();
  },

  skipPhase() {
    clearInterval(this.timerInterval);
    const wasPaused = this.isPaused;
    this.timeLeft = 0;
    this.completePhase();
    if(wasPaused || !this.isRunning) {
      // Start next phase automatically
      this.timerInterval = setInterval(() => this.tick(), 1000);
      this.isRunning = true;
      this.isPaused = false;
      this.updatePlayButtons('pause');
    }
  },

  tick() {
    if(this.timeLeft <= 0) {
      this.completePhase();
      return;
    }
    this.timeLeft--;
    this.updateMiniDisplay();
    this.updateFocusDisplay();
    this.updateMiniRing();

    // Page title indicator
    document.title = `${this.formatTime(this.timeLeft)} — LifeOS`;
  },

  completePhase() {
    clearInterval(this.timerInterval);
    const s = this.getSettings();

    if(this.currentPhase === 'work') {
      // Record completed session
      const linkedType = document.getElementById('pomoLinkType')?.value || '';
      const linkedId = document.getElementById('pomoLinkId')?.value || '';
      let linkedName = '';
      if(linkedType === 'subject') {
        linkedName = DB.getSubjects().find(x => x.id === linkedId)?.name || '';
      } else if(linkedType === 'task') {
        linkedName = DB.getTasks().find(x => x.id === linkedId)?.title || '';
      }
      this.addSession({
        id: DB.generateId(),
        type: 'work',
        status: 'completed',
        startTime: this.sessionStart?.toISOString(),
        endTime: new Date().toISOString(),
        duration: s.workTime,
        linkedType, linkedId, linkedName,
        cycle: this.currentCycle,
        mode: s.mode,
      });
      this.renderSessionHistory();
      this.renderGoalDots();
      this.updateHeaderStats();
      this.updateFocusStats();

      const done = this.getDoneCount();
      const goal = s.dailyGoal || 8;
      if(done >= goal) {
        this.showFocusNotif('🎉 Objectif du jour atteint ! Bravo !');
        Toast.show('Objectif Pomodoro atteint ! 🎉','success');
      } else {
        this.showFocusNotif(`✅ Pomodoro ${done}/${goal} terminé ! Pause bien méritée.`);
      }
      this.changePhaseOverlay('break');

      // Decide break type
      if(this.currentCycle >= this.cyclesBeforeLong) {
        this.currentPhase = 'longBreak';
        this.timeLeft = s.longBreak * 60;
        this.totalSeconds = this.timeLeft;
        this.currentCycle = 1;
      } else {
        this.currentPhase = 'shortBreak';
        this.timeLeft = s.shortBreak * 60;
        this.totalSeconds = this.timeLeft;
        this.currentCycle++;
      }
    } else {
      // Break ended
      this.showFocusNotif('⏱ Pause terminée. Prêt pour la prochaine session ?');
      this.changePhaseOverlay('work');
      this.currentPhase = 'work';
      this.timeLeft = s.workTime * 60;
      this.totalSeconds = this.timeLeft;
      this.sessionStart = new Date();
    }

    this.updatePhaseDisplay();
    this.updateMiniDisplay();
    this.updateFocusDisplay();
    this.updateMiniRing();
    this.updateMotivation();

    // Auto-restart
    this.timerInterval = setInterval(() => this.tick(), 1000);
  },

  // ── Display updates ──
  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },

  updateMiniDisplay() {
    const el = document.getElementById('pomoMiniTime');
    if(el) el.textContent = this.formatTime(this.timeLeft);

    const phaseEl = document.getElementById('pomoPreviewPhase');
    if(phaseEl) {
      phaseEl.textContent = { work:'Concentration', shortBreak:'Pause courte', longBreak:'Grande pause' }[this.currentPhase] || '';
    }
    const cycleEl = document.getElementById('pomoPreviewCycle');
    if(cycleEl) cycleEl.textContent = `Cycle ${this.currentCycle} / ${this.cyclesBeforeLong}`;
  },

  updateMiniRing() {
    const ring = document.getElementById('miniRingProgress');
    if(!ring) return;
    const circumference = 2 * Math.PI * 50; // r=50
    const progress = this.totalSeconds > 0 ? this.timeLeft / this.totalSeconds : 1;
    ring.style.strokeDashoffset = circumference * (1 - progress);
    const colors = { work:'var(--primary)', shortBreak:'var(--success)', longBreak:'var(--info)' };
    ring.style.stroke = colors[this.currentPhase] || 'var(--primary)';
  },

  updateFocusDisplay() {
    const td = document.getElementById('focusTimeDisplay');
    if(td) td.textContent = this.formatTime(this.timeLeft);

    // Progress ring
    const ring = document.getElementById('focusRingProg');
    if(ring) {
      const circumference = 879.6; // 2*π*140
      const progress = this.totalSeconds > 0 ? this.timeLeft / this.totalSeconds : 1;
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }

    const cl = document.getElementById('focusCycleLabel');
    if(cl) cl.textContent = `Cycle ${this.currentCycle} / ${this.cyclesBeforeLong}`;
  },

  updatePhaseDisplay() {
    const labels = { work:'Concentration', shortBreak:'Pause courte', longBreak:'Grande pause' };
    const lbl = document.getElementById('focusPhaseLabel');
    if(lbl) lbl.textContent = labels[this.currentPhase] || '';
    const pill = document.getElementById('focusPhasePill');
    if(pill) pill.textContent = (labels[this.currentPhase] || '').toUpperCase();
    this.updateMiniDisplay();
  },

  updatePlayButtons(state) {
    const icons = {
      play: '<polygon points="5 3 19 12 5 21 5 3"/>',
      pause: '<line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/>',
    };
    const focusIcon = document.getElementById('focusPlayIcon');
    if(focusIcon) focusIcon.innerHTML = icons[state];
    const miniBtn = document.getElementById('pomoMiniPlayBtn');
    if(miniBtn) miniBtn.textContent = state === 'play' ? '▶ Démarrer' : '⏸ Pause';
  },

  changePhaseOverlay(phase) {
    const overlay = document.getElementById('focusOverlay');
    if(!overlay) return;
    if(phase === 'break') {
      overlay.classList.add('phase-break');
      // Update gradient colors
      const g1 = document.getElementById('gradStop1');
      const g2 = document.getElementById('gradStop2');
      if(g1) g1.setAttribute('stop-color','#86efac');
      if(g2) g2.setAttribute('stop-color','#22c55e');
    } else {
      overlay.classList.remove('phase-break');
      const g1 = document.getElementById('gradStop1');
      const g2 = document.getElementById('gradStop2');
      if(g1) g1.setAttribute('stop-color','#818cf8');
      if(g2) g2.setAttribute('stop-color','#6366f1');
    }
  },

  updateMotivation() {
    const el = document.getElementById('focusMotivation');
    if(!el) return;
    const arr = this.currentPhase === 'work' ? this.MOTIVATIONS_WORK : this.MOTIVATIONS_BREAK;
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'fadeMotiv 1s ease';
    el.textContent = arr[Math.floor(Math.random() * arr.length)];
  },

  // ── Focus full-screen ──
  launchFocus() {
    const overlay = document.getElementById('focusOverlay');
    if(!overlay) return;
    this.focusActive = true;
    overlay.classList.add('active','entering');
    setTimeout(() => overlay.classList.remove('entering'), 600);
    document.body.style.overflow = 'hidden';

    const s = this.getSettings();
    this.updateLinkedLabel();
    this.updateFocusStats();
    this.renderFocusDots();
    this.updateMotivation();

    if(!this.isRunning) {
      this.timeLeft = s.workTime * 60;
      this.totalSeconds = this.timeLeft;
      this.currentPhase = 'work';
    }
    this.updateFocusDisplay();
    this.updatePhaseDisplay();

    this.startParticles();
  },

  exitFocus() {
    const overlay = document.getElementById('focusOverlay');
    if(overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.classList.remove('phase-break'), 600);
    }
    this.focusActive = false;
    document.body.style.overflow = '';
    document.title = 'LifeOS — Mon Assistant Personnel';
    this.stopParticles();
    this.render();
  },

  updateLinkedLabel() {
    const linkedType = document.getElementById('pomoLinkType')?.value || '';
    const linkedId = document.getElementById('pomoLinkId')?.value || '';
    let name = '';
    if(linkedType === 'subject') {
      name = DB.getSubjects().find(x => x.id === linkedId)?.name || '';
    } else if(linkedType === 'task') {
      name = DB.getTasks().find(x => x.id === linkedId)?.title || '';
    }
    const el1 = document.getElementById('focusSubjectName');
    const el2 = document.getElementById('focusLinkedLabel');
    if(el1) el1.textContent = name;
    if(el2) el2.textContent = name ? `📖 ${name}` : '';
    this.currentLinkedName = name;
  },

  updateFocusStats() {
    const done = this.getDoneCount();
    const goal = this.getSettings().dailyGoal || 8;
    const totalMin = this.getTotalFocusMin();
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;

    const s = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    s('ftDone', done);
    s('ftGoal', goal);
    s('ftTime', `${h}h ${m}m`);
    s('focusBottomCount', `${done} / ${goal}`);
    this.renderFocusDots();
  },

  renderFocusDots() {
    const el = document.getElementById('focusDots');
    if(!el) return;
    const goal = this.getSettings().dailyGoal || 8;
    const done = this.getDoneCount();
    el.innerHTML = Array.from({length: goal}, (_,i) => {
      let cls = 'focus-dot-item';
      if(i < done) cls += ' done';
      else if(i === done && this.isRunning && this.currentPhase === 'work') cls += ' current';
      return `<div class="${cls}"></div>`;
    }).join('');
  },

  showFocusNotif(msg) {
    const existing = document.querySelector('.focus-notif');
    if(existing) existing.remove();
    if(!this.focusActive) {
      Toast.show(msg, 'info', 2500);
      return;
    }
    const el = document.createElement('div');
    el.className = 'focus-notif';
    el.textContent = msg;
    document.getElementById('focusOverlay')?.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.4s';
      setTimeout(() => el.remove(), 400);
    }, 2500);
  },

  // ── Particle system ──
  startParticles() {
    const canvas = document.getElementById('focusCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.particles = Array.from({length: 60}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.4 + 0.05,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isBreak = this.currentPhase !== 'work';
      const color = isBreak ? '34,197,94' : '99,102,241';

      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if(p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if(p.x < -5 || p.x > canvas.width + 5) p.x = Math.random() * canvas.width;
      });
      this.particleFrame = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  },

  stopParticles() {
    if(this.particleFrame) { cancelAnimationFrame(this.particleFrame); this.particleFrame = null; }
    const ctx = document.getElementById('focusCanvas')?.getContext('2d');
    if(ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  // ── Render page ──
  render() {
    this.renderGoalDots();
    this.renderFixedBreaks();
    this.renderSessionHistory();
    this.updateHeaderStats();
    this.buildTimeline();
    this.updateLinkOptions();
    this.updateMiniDisplay();
    this.updateMiniRing();

    const s = this.getSettings();
    const gn = document.getElementById('pomoGoalNum');
    if(gn) gn.textContent = s.dailyGoal || 8;
  },

  renderGoalDots() {
    const el = document.getElementById('pomoGoalDots');
    if(!el) return;
    const goal = this.getSettings().dailyGoal || 8;
    const done = this.getDoneCount();
    el.innerHTML = Array.from({length: goal}, (_,i) => {
      let cls = 'pomo-dot';
      if(i < done) cls += ' done';
      else if(i === done && this.isRunning && this.currentPhase === 'work') cls += ' current';
      else cls += ' pending';
      return `<div class="${cls}"></div>`;
    }).join('');
  },

  adjustGoal(delta) {
    const s = this.getSettings();
    s.dailyGoal = Math.max(1, Math.min(20, (s.dailyGoal||8) + delta));
    this.saveSettings(s);
    const el = document.getElementById('pomoGoalNum');
    if(el) el.textContent = s.dailyGoal;
    this.renderGoalDots();
    this.updateHeaderStats();
  },

  updateHeaderStats() {
    const done = this.getDoneCount();
    const goal = this.getSettings().dailyGoal || 8;
    const totalMin = this.getTotalFocusMin();
    const h = Math.floor(totalMin/60), m = totalMin%60;

    const s = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    s('hStatDone', done);
    s('hStatGoal', goal);
    s('hStatTime', `${h}h ${m}m`);
    s('ftDone', done);
    s('ftGoal', goal);
    s('ftTime', `${h}h ${m}m`);

    const sub = document.getElementById('pomoSubtitle');
    if(sub) {
      if(done === 0) sub.textContent = `Objectif : ${goal} Pomodoro aujourd'hui. Commençons !`;
      else if(done >= goal) sub.textContent = `🎉 Objectif atteint ! ${done}/${goal} Pomodoro complétés.`;
      else sub.textContent = `${done}/${goal} Pomodoro complétés. Continuez !`;
    }
  },

  renderFixedBreaks() {
    const el = document.getElementById('pomoFixedBreaks');
    if(!el) return;
    const s = this.getSettings();
    const breaks = s.fixedBreaks || [];
    if(breaks.length === 0) {
      el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);padding:8px 0">Aucune pause fixe. Cliquez sur "+ Ajouter".</div>`;
      return;
    }
    el.innerHTML = breaks.map(b => `
      <div class="pomo-break-item">
        <span class="pomo-break-emoji">${b.emoji||'⏰'}</span>
        <div class="pomo-break-info">
          <div class="pomo-break-name">${Utils.escHtml(b.name)}</div>
          <div class="pomo-break-time">${b.start} • ${b.duration} min</div>
        </div>
        <span class="pomo-break-remove" data-remove-break="${b.id}">×</span>
      </div>`).join('');
  },

  addFixedBreak() {
    const name = prompt('Nom de la pause (ex: Déjeuner, Sport, Marche):');
    if(!name?.trim()) return;
    const start = prompt('Heure de début (ex: 13:00):');
    if(!start) return;
    const duration = parseInt(prompt('Durée en minutes:') || '30');
    const emoji = prompt('Emoji (optionnel, ex: 🍽️):') || '⏰';
    const s = this.getSettings();
    s.fixedBreaks = s.fixedBreaks || [];
    s.fixedBreaks.push({ id: DB.generateId(), name: name.trim(), start, duration, emoji });
    this.saveSettings(s);
    this.renderFixedBreaks();
    this.buildTimeline();
    Toast.show('Pause ajoutée','success');
  },

  removeFixedBreak(id) {
    const s = this.getSettings();
    s.fixedBreaks = (s.fixedBreaks || []).filter(b => b.id !== id);
    this.saveSettings(s);
    this.renderFixedBreaks();
    this.buildTimeline();
  },

  // ── Timeline builder ──
  buildTimeline() {
    const el = document.getElementById('pomoTimeline');
    if(!el) return;
    const s = this.getSettings();
    const startTime = document.getElementById('pomoStartTime')?.value || s.dayStart || '08:00';
    const endTime = document.getElementById('pomoEndTime')?.value || s.dayEnd || '22:00';
    const startMin = Utils.timeToMinutes(startTime);
    const endMin = Utils.timeToMinutes(endTime);
    const totalMin = endMin - startMin;
    if(totalMin <= 0) return;

    // Build blocks
    const fixedBreaks = s.fixedBreaks || [];
    const workMin = s.workTime || 25;
    const shortMin = s.shortBreak || 5;
    const longMin = s.longBreak || 20;
    const cycles = s.cyclesBeforeLong || 4;

    // Create timeline array
    const blocks = [];
    let cursor = startMin;
    let cycle = 0;

    while(cursor + workMin <= endMin) {
      // Check if a fixed break starts during this work block
      const fixedInWork = fixedBreaks.find(b => {
        const bStart = Utils.timeToMinutes(b.start);
        return bStart >= cursor && bStart < cursor + workMin;
      });

      if(fixedInWork) {
        const bStart = Utils.timeToMinutes(fixedInWork.start);
        if(bStart > cursor) {
          blocks.push({ type:'work', start:cursor, end:bStart });
        }
        blocks.push({ type:'fixed', start:bStart, end:bStart+fixedInWork.duration, name:fixedInWork.name, emoji:fixedInWork.emoji });
        cursor = bStart + fixedInWork.duration;
        continue;
      }

      // Check if fixed break is upcoming right now
      const fixedNow = fixedBreaks.find(b => {
        const bStart = Utils.timeToMinutes(b.start);
        return bStart >= cursor && bStart < cursor + 5;
      });
      if(fixedNow) {
        const bStart = Utils.timeToMinutes(fixedNow.start);
        blocks.push({ type:'fixed', start:bStart, end:bStart+fixedNow.duration, name:fixedNow.name, emoji:fixedNow.emoji });
        cursor = bStart + fixedNow.duration;
        continue;
      }

      blocks.push({ type:'work', start:cursor, end:cursor+workMin });
      cursor += workMin;
      cycle++;

      if(cursor >= endMin) break;

      if(cycle % cycles === 0) {
        if(cursor + longMin <= endMin) {
          blocks.push({ type:'long', start:cursor, end:cursor+longMin });
          cursor += longMin;
        }
      } else {
        if(cursor + shortMin <= endMin) {
          blocks.push({ type:'short', start:cursor, end:cursor+shortMin });
          cursor += shortMin;
        }
      }
    }

    if(blocks.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>Configurez vos horaires pour voir la timeline.</p></div>';
      return;
    }

    const pxPerMin = 800 / totalMin; // target ~800px wide
    const tracks = blocks.map(b => {
      const w = Math.max((b.end - b.start) * pxPerMin, 20);
      const typeMap = { work:'tl-work', short:'tl-short', long:'tl-long', fixed:'tl-fixed' };
      const labels = { work:'🎯', short:'💨', long:'☕', fixed: b.emoji||'⏰' };
      const isNow = this.isCurrentBlock(b, startMin);
      return `<div class="pomo-tl-block ${typeMap[b.type]||''}" style="width:${w}px;${isNow?'border:2px solid white;':''}" title="${b.type==='fixed'?b.name:''} ${Utils.minutesToTime(b.start+0)} – ${Utils.minutesToTime(b.end)}">
        ${w > 30 ? `<span>${labels[b.type]||''}</span>` : ''}
      </div>`;
    }).join('');

    const labelStart = Utils.minutesToTime(startMin + 0);
    const labelMid = Utils.minutesToTime(startMin + Math.floor(totalMin/2));
    const labelEnd = Utils.minutesToTime(endMin);

    el.innerHTML = `
      <div class="pomo-tl-track">${tracks}</div>
      <div class="pomo-tl-label" style="width:${Math.max(800,blocks.length*40)}px">
        <span>${labelStart}</span><span>${labelMid}</span><span>${labelEnd}</span>
      </div>`;
  },

  isCurrentBlock(block, dayStartMin) {
    const now = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    const relNow = nowMin - dayStartMin;
    return relNow >= block.start - dayStartMin && relNow < block.end - dayStartMin;
  },

  // ── Session history ──
  renderSessionHistory() {
    const sessions = this.getTodaySessions().filter(s => s.type === 'work');
    const el = document.getElementById('pomoSessionHistory');
    const badge = document.getElementById('pomoSessionBadge');
    if(!el) return;
    if(badge) badge.textContent = `${sessions.length} session${sessions.length!==1?'s':''}`;
    if(sessions.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">🍅</div><p>Aucune session aujourd'hui. Lancez votre premier Pomodoro !</p></div>`;
      return;
    }
    el.innerHTML = [...sessions].reverse().map((s, i) => {
      const start = s.startTime ? new Date(s.startTime).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '';
      const end = s.endTime ? new Date(s.endTime).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '';
      const isInterrupted = s.status === 'interrupted';
      return `
        <div class="pomo-session-item">
          <div class="pomo-session-num ${isInterrupted?'interrupted':''}">${sessions.length - i}</div>
          <div class="pomo-session-info">
            <div class="pomo-session-name">${s.linkedName || s.linkedType || 'Session de travail'}</div>
            <div class="pomo-session-time">${start} → ${end} • ${s.duration || 0} min</div>
          </div>
          <span class="pomo-session-badge ${isInterrupted?'interrupted':''}">${isInterrupted?'Interrompue':'✓ Terminée'}</span>
        </div>`;
    }).join('');
  },

  // ── Link to subject/task ──
  updateLinkOptions() {
    const type = document.getElementById('pomoLinkType')?.value;
    const selectWrap = document.getElementById('pomoLinkSelect');
    const selectEl = document.getElementById('pomoLinkId');
    if(!selectWrap || !selectEl) return;

    if(!type) {
      selectWrap.style.display = 'none';
      return;
    }
    selectWrap.style.display = 'block';

    if(type === 'subject') {
      const subjects = DB.getSubjects();
      selectEl.innerHTML = subjects.length
        ? subjects.map(s => `<option value="${s.id}">${Utils.escHtml(s.name)}</option>`).join('')
        : '<option value="">Aucune matière</option>';
    } else if(type === 'task') {
      const tasks = DB.getTasks().filter(t => t.status !== 'done');
      selectEl.innerHTML = tasks.length
        ? tasks.map(t => `<option value="${t.id}">${Utils.escHtml(t.title)}</option>`).join('')
        : '<option value="">Aucune tâche active</option>';
    }
  },
};

// ════════════════════════════════════════════════════════
//  FINANCES MODULE
// ════════════════════════════════════════════════════════
const FinanceModule = {
  currentMonth: (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })(), // YYYY-MM
  chart: null,

  CAT_EXPENSE: {
    groceries:  { label: 'Courses',          icon: '🛒', color: '#10b981' },
    rent:       { label: 'Loyer',             icon: '🏠', color: '#6366f1' },
    leisure:    { label: 'Loisirs',           icon: '🎮', color: '#f59e0b' },
    transport:  { label: 'Transport',         icon: '🚌', color: '#0ea5e9' },
    personal:   { label: 'Achat personnel',   icon: '👕', color: '#8b5cf6' },
    other:      { label: 'Autre dépense',     icon: '📦', color: '#94a3b8' },
  },
  CAT_INCOME: {
    salary:       { label: 'Job étudiant',  icon: '💼', color: '#22c55e' },
    income_other: { label: 'Autre revenu',  icon: '💰', color: '#10b981' },
  },

  init() {
    document.getElementById('finSaveBtn')?.addEventListener('click', () => this.save());
    document.getElementById('finDeleteBtn')?.addEventListener('click', () => this.deleteTx());
    this.render();
  },

  render() {
    this.updateMonthLabel();
    this.renderSummary();
    this.renderBudgetBar();
    this.renderTransactions();
    this.renderChart();
  },

  updateMonthLabel() {
    const [y, m] = this.currentMonth.split('-');
    const d = new Date(+y, +m - 1, 1);
    const label = Utils.capitalize(d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    const el = document.getElementById('finMonthLabel');
    if (el) el.textContent = label;
  },

  navigateMonth(dir) {
    const [y, m] = this.currentMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    this.currentMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    this.render();
  },

  getMonthTx() {
    return DB.getTransactions().filter(t => t.date && t.date.startsWith(this.currentMonth));
  },

  renderSummary() {
    const el = document.getElementById('finSummaryGrid');
    if (!el) return;
    const txs = this.getMonthTx();
    const income   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings  = income - expenses;
    const savRate  = income > 0 ? Math.round((savings / income) * 100) : 0;

    const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';
    const savColor = savings >= 0 ? 'var(--success)' : 'var(--danger)';

    el.innerHTML = `
      <div class="fin-sum-card income">
        <div class="fin-sum-icon">💰</div>
        <div class="fin-sum-value">${fmt(income)}</div>
        <div class="fin-sum-label">Revenus du mois</div>
      </div>
      <div class="fin-sum-card expense">
        <div class="fin-sum-icon">💸</div>
        <div class="fin-sum-value">${fmt(expenses)}</div>
        <div class="fin-sum-label">Dépenses totales</div>
      </div>
      <div class="fin-sum-card remaining">
        <div class="fin-sum-icon">${savings >= 0 ? '🏦' : '⚠️'}</div>
        <div class="fin-sum-value" style="color:${savColor}">${fmt(savings)}</div>
        <div class="fin-sum-label">Épargne nette</div>
      </div>
      <div class="fin-sum-card rate">
        <div class="fin-sum-icon">📊</div>
        <div class="fin-sum-value" style="color:${savColor}">${savRate}%</div>
        <div class="fin-sum-label">Taux d'épargne</div>
      </div>`;
  },

  renderBudgetBar() {
    const el = document.getElementById('finBudgetCard');
    if (!el) return;
    const txs = this.getMonthTx();
    const income   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const pct = income > 0 ? Math.min(Math.round((expenses / income) * 100), 100) : (expenses > 0 ? 100 : 0);
    const over = expenses > income && income > 0;
    const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';

    let msg, msgColor;
    if (income === 0) { msg = 'Ajoutez vos revenus pour voir votre budget.'; msgColor = 'var(--text-muted)'; }
    else if (pct >= 100) { msg = '⚠️ Attention : vos dépenses dépassent vos revenus !'; msgColor = 'var(--danger)'; }
    else if (pct >= 80) { msg = '🔶 Prudence : vous avez dépensé ' + pct + '% de vos revenus.'; msgColor = '#f59e0b'; }
    else { msg = '✅ Bonne gestion : ' + (100 - pct) + '% de vos revenus sont épargnés.'; msgColor = 'var(--success)'; }

    el.innerHTML = `
      <div class="fin-budget-header">
        <span class="fin-budget-title">Budget du mois</span>
        <span class="fin-budget-nums">${fmt(expenses)} dépensé sur ${fmt(income)}</span>
      </div>
      <div class="fin-budget-track">
        <div class="fin-budget-fill${over ? ' over' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="fin-budget-msg" style="color:${msgColor}">${msg}</div>`;
  },

  renderTransactions() {
    const el = document.getElementById('finTransactionsList');
    if (!el) return;
    const typeFilter = document.getElementById('finFilterType')?.value || 'all';
    const catFilter  = document.getElementById('finFilterCat')?.value  || 'all';

    let txs = this.getMonthTx();
    if (typeFilter !== 'all') txs = txs.filter(t => t.type === typeFilter);
    if (catFilter  !== 'all') txs = txs.filter(t => t.category === catFilter);
    txs = txs.sort((a, b) => b.date.localeCompare(a.date));

    if (txs.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><p>Aucune transaction ce mois-ci.</p><button class="btn btn-primary" onclick="FinanceModule.openModal()">Ajouter une transaction</button></div>';
      return;
    }

    const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';
    const allCats = { ...this.CAT_EXPENSE, ...this.CAT_INCOME };

    el.innerHTML = txs.map(t => {
      const cat = allCats[t.category] || { label: t.category, icon: '💳', color: '#94a3b8' };
      const isIncome = t.type === 'income';
      const dateLabel = Utils.formatDateShort(t.date);
      return `
        <div class="fin-tx-item">
          <div class="fin-tx-icon" style="background:${cat.color}20;color:${cat.color}">${cat.icon}</div>
          <div class="fin-tx-body">
            <div class="fin-tx-cat">${cat.label}</div>
            <div class="fin-tx-meta">${dateLabel}${t.description ? ' · ' + Utils.escHtml(t.description) : ''}</div>
          </div>
          <div class="fin-tx-amount ${isIncome ? 'income' : 'expense'}">${isIncome ? '+' : '−'}${fmt(t.amount)}</div>
          <div class="fin-tx-actions">
            <button class="task-action-btn" onclick="FinanceModule.openModal('${t.id}')" title="Modifier">
              <svg viewBox="0 0 24 24" style="width:13px;height:13px"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="task-action-btn" style="color:var(--danger)" onclick="FinanceModule.removeTx('${t.id}')" title="Supprimer">
              <svg viewBox="0 0 24 24" style="width:13px;height:13px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');
  },

  renderChart() {
    const txs = this.getMonthTx().filter(t => t.type === 'expense');
    const breakdown = document.getElementById('finCatBreakdown');
    const wrap = document.getElementById('finChartWrap');

    if (this.chart) { this.chart.destroy(); this.chart = null; }

    const catTotals = {};
    txs.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });

    if (Object.keys(catTotals).length === 0) {
      if (wrap) wrap.innerHTML = '<div class="empty-state" style="padding:20px"><p>Aucune dépense ce mois-ci</p></div>';
      if (breakdown) breakdown.innerHTML = '';
      return;
    }

    // Restore canvas if replaced
    if (wrap && !wrap.querySelector('canvas')) {
      wrap.innerHTML = '<canvas id="finChartCanvas" height="220"></canvas>';
    }

    const canvas = document.getElementById('finChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = [], data = [], colors = [];
    Object.entries(catTotals).forEach(([cat, amt]) => {
      const cfg = this.CAT_EXPENSE[cat] || { label: cat, color: '#94a3b8' };
      labels.push(cfg.label);
      data.push(amt);
      colors.push(cfg.color);
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 3, borderColor: isDark ? '#020817' : '#eef2ff' }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ' ' + ctx.parsed.toFixed(2).replace('.', ',') + ' €'
            }
          }
        },
        cutout: '65%'
      }
    });

    const total = data.reduce((s, v) => s + v, 0);
    const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';
    if (breakdown) {
      breakdown.innerHTML = Object.entries(catTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => {
          const cfg = this.CAT_EXPENSE[cat] || { label: cat, color: '#94a3b8', icon: '📦' };
          const pct = Math.round((amt / total) * 100);
          return `
            <div class="fin-breakdown-row">
              <div class="fin-breakdown-dot" style="background:${cfg.color}"></div>
              <span class="fin-breakdown-label">${cfg.icon} ${cfg.label}</span>
              <span class="fin-breakdown-pct">${pct}%</span>
              <span class="fin-breakdown-amt">${fmt(amt)}</span>
            </div>`;
        }).join('');
    }
  },

  onTypeChange() {
    const type = document.getElementById('finTxType')?.value;
    const catSelect = document.getElementById('finTxCat');
    if (!catSelect) return;
    if (type === 'income') {
      catSelect.innerHTML = `
        <option value="salary">💼 Job étudiant</option>
        <option value="income_other">💰 Autre revenu</option>`;
    } else {
      catSelect.innerHTML = `
        <option value="groceries">🛒 Courses</option>
        <option value="rent">🏠 Loyer</option>
        <option value="leisure">🎮 Loisirs</option>
        <option value="transport">🚌 Transport</option>
        <option value="personal">👕 Achat personnel</option>
        <option value="other">📦 Autre dépense</option>`;
    }
  },

  openModal(id) {
    this.onTypeChange();
    if (id) {
      const t = DB.getTransactions().find(x => x.id === id);
      if (!t) return;
      document.getElementById('finModalTitle').textContent = 'Modifier la transaction';
      document.getElementById('finTxId').value    = t.id;
      document.getElementById('finTxType').value  = t.type;
      this.onTypeChange();
      document.getElementById('finTxCat').value   = t.category;
      document.getElementById('finTxAmount').value = t.amount;
      document.getElementById('finTxDate').value  = t.date;
      document.getElementById('finTxDesc').value  = t.description || '';
      document.getElementById('finDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('finModalTitle').textContent = 'Nouvelle transaction';
      document.getElementById('finTxId').value    = '';
      document.getElementById('finTxType').value  = 'expense';
      this.onTypeChange();
      document.getElementById('finTxAmount').value = '';
      document.getElementById('finTxDate').value  = DB.todayStr();
      document.getElementById('finTxDesc').value  = '';
      document.getElementById('finDeleteBtn').classList.add('hidden');
    }
    Modal.open('finModal');
  },

  save() {
    const amtRaw = parseFloat(document.getElementById('finTxAmount')?.value);
    if (!amtRaw || amtRaw <= 0) { Toast.show('Montant invalide', 'error'); return; }
    const date = document.getElementById('finTxDate')?.value;
    if (!date) { Toast.show('Date requise', 'error'); return; }
    const id = document.getElementById('finTxId')?.value;
    const t = {
      id:          id || DB.generateId(),
      type:        document.getElementById('finTxType')?.value || 'expense',
      category:    document.getElementById('finTxCat')?.value  || 'other',
      amount:      Math.round(amtRaw * 100) / 100,
      description: document.getElementById('finTxDesc')?.value || '',
      date,
    };
    if (id) DB.updateTransaction(t); else DB.addTransaction(t);
    Modal.close('finModal');
    Toast.show(id ? 'Transaction modifiée' : 'Transaction ajoutée ✅', 'success');
    this.render();
  },

  removeTx(id) {
    if (confirm('Supprimer cette transaction ?')) {
      DB.deleteTransaction(id);
      Toast.show('Transaction supprimée', 'info');
      this.render();
    }
  },

  deleteTx() {
    const id = document.getElementById('finTxId')?.value;
    if (!id) return;
    if (confirm('Supprimer cette transaction ?')) {
      DB.deleteTransaction(id);
      Modal.close('finModal');
      Toast.show('Transaction supprimée', 'info');
      this.render();
    }
  }
};

// ════════════════════════════════════════════════════════
//  LANGUAGES MODULE
// ════════════════════════════════════════════════════════
const LangModule = {
  currentLang: 'dutch',
  currentFilter: 'today',

  init() {
    document.querySelectorAll('.lang-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentLang = tab.dataset.lang;
        this.currentFilter = 'today';
        document.querySelectorAll('.lang-filter').forEach(f => f.classList.toggle('active', f.dataset.filter === 'today'));
        const sw = document.getElementById('langSearchWrap');
        if (sw) sw.classList.add('hidden');
        this.render();
      });
    });

    document.querySelectorAll('.lang-filter').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lang-filter').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.filter;
        const sw = document.getElementById('langSearchWrap');
        if (sw) sw.classList.toggle('hidden', this.currentFilter === 'today' || this.currentFilter === 'review');
        this.renderPhrases();
      });
    });

    document.getElementById('langSearch')?.addEventListener('input', () => this.renderPhrases());
    document.getElementById('langSaveBtn')?.addEventListener('click', () => this.save());
    document.getElementById('langDeleteBtn')?.addEventListener('click', () => this.deletePhrase());
    this.render();
  },

  render() {
    this.renderStats();
    this.renderDayProgress();
    this.renderPhrases();
  },

  renderStats() {
    const el = document.getElementById('langStatsGrid');
    if (!el) return;
    const today = DB.todayStr();
    const all = DB.getPhrases();
    const lang = all.filter(p => p.language === this.currentLang);
    const todayP = lang.filter(p => p.dateAdded === today);
    const learnedToday = todayP.filter(p => p.status === 'learned').length;
    const toReview = lang.filter(p => p.status === 'review').length;
    const totalLearned = lang.filter(p => p.status === 'learned').length;
    const streak = this.getStreak();

    el.innerHTML = `
      <div class="lang-stat-card">
        <div class="lang-stat-icon">📅</div>
        <div class="lang-stat-value">${todayP.length}<span class="lang-stat-goal">/10</span></div>
        <div class="lang-stat-label">Phrases aujourd'hui</div>
      </div>
      <div class="lang-stat-card">
        <div class="lang-stat-icon">✅</div>
        <div class="lang-stat-value">${learnedToday}</div>
        <div class="lang-stat-label">Apprises aujourd'hui</div>
      </div>
      <div class="lang-stat-card${toReview > 0 ? ' lang-stat-warn' : ''}">
        <div class="lang-stat-icon">⚠️</div>
        <div class="lang-stat-value">${toReview}</div>
        <div class="lang-stat-label">À revoir</div>
      </div>
      <div class="lang-stat-card">
        <div class="lang-stat-icon">🧠</div>
        <div class="lang-stat-value">${totalLearned}</div>
        <div class="lang-stat-label">Total appris</div>
      </div>
      <div class="lang-stat-card${streak >= 7 ? ' lang-stat-streak' : ''}">
        <div class="lang-stat-icon">🔥</div>
        <div class="lang-stat-value">${streak}</div>
        <div class="lang-stat-label">Jours consécutifs</div>
      </div>`;
  },

  renderDayProgress() {
    const el = document.getElementById('langDayCard');
    if (!el) return;
    const today = DB.todayStr();
    const phrases = DB.getPhrases().filter(p => p.language === this.currentLang && p.dateAdded === today);
    const goal = 10;
    const count = phrases.length;
    const learned = phrases.filter(p => p.status === 'learned').length;
    const inReview = phrases.filter(p => p.status === 'review').length;
    const pct = Math.min(Math.round((count / goal) * 100), 100);
    const langName = this.currentLang === 'dutch' ? '🇧🇪 Néerlandais' : '🇬🇧 Anglais';
    const remaining = Math.max(0, goal - count);

    el.innerHTML = `
      <div class="lang-day-header">
        <div>
          <div class="lang-day-title">${langName} — Objectif du jour</div>
          <div class="lang-day-sub">
            ${count}/${goal} phrases · ${learned} apprise${learned>1?'s':''} · ${inReview} à revoir
            ${remaining > 0 ? `<span class="lang-remaining">· encore ${remaining} à ajouter</span>` : '<span class="lang-remaining perfect">· Objectif atteint ! 🎉</span>'}
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="LangModule.openModal()">+ Phrase</button>
      </div>
      <div class="lang-progress-track">
        <div class="lang-progress-fill${pct >= 100 ? ' perfect' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="lang-progress-labels">
        ${Array.from({length: goal}, (_, i) => {
          const p = phrases[i];
          let cls = 'lang-dot-empty';
          if (p) {
            if (p.status === 'learned') cls = 'lang-dot-learned';
            else if (p.status === 'review') cls = 'lang-dot-review';
            else if (p.status === 'learning') cls = 'lang-dot-learning';
            else cls = 'lang-dot-new';
          }
          return '<div class="lang-dot ' + cls + '" title="' + (p ? Utils.escHtml(p.text) : 'Vide') + '"></div>';
        }).join('')}
      </div>`;
  },

  renderPhrases() {
    const el = document.getElementById('langPhrasesList');
    if (!el) return;
    const today = DB.todayStr();
    const query = document.getElementById('langSearch')?.value.toLowerCase() || '';
    let phrases = DB.getPhrases().filter(p => p.language === this.currentLang);

    if (this.currentFilter === 'today') phrases = phrases.filter(p => p.dateAdded === today);
    else if (this.currentFilter === 'review') phrases = phrases.filter(p => p.status === 'review');
    else if (this.currentFilter === 'learned') phrases = phrases.filter(p => p.status === 'learned');

    if (query) phrases = phrases.filter(p =>
      p.text.toLowerCase().includes(query) || p.translation.toLowerCase().includes(query) || (p.notes||'').toLowerCase().includes(query)
    );

    const sOrder = { review: 0, new: 1, learning: 2, learned: 3 };
    phrases.sort((a, b) => {
      if (sOrder[a.status] !== sOrder[b.status]) return sOrder[a.status] - sOrder[b.status];
      return b.dateAdded.localeCompare(a.dateAdded);
    });

    if (phrases.length === 0) {
      const msgs = {
        today: "Aucune phrase ajoutée aujourd'hui. Commence avec 10 phrases !",
        review: '✅ Aucune phrase à revoir. Excellent travail !',
        all: 'Aucune phrase trouvée.',
        learned: 'Aucune phrase apprise encore.',
      };
      el.innerHTML = '<div class="empty-state large"><div class="empty-icon">💬</div><p>' + msgs[this.currentFilter] + '</p>' + (this.currentFilter==='today'||this.currentFilter==='all' ? '<button class="btn btn-primary" onclick="LangModule.openModal()">Ajouter une phrase</button>' : '') + '</div>';
      return;
    }

    el.innerHTML = '<div class="lang-phrases-grid">' + phrases.map(p => this.renderCard(p)).join('') + '</div>';
  },

  renderCard(p) {
    const statusCfg = {
      new:      { label: 'Nouveau',  cls: 'lstatus-new' },
      learning: { label: 'En cours', cls: 'lstatus-learning' },
      learned:  { label: 'Appris',   cls: 'lstatus-learned' },
      review:   { label: 'À revoir', cls: 'lstatus-review' },
    };
    const sc = statusCfg[p.status] || statusCfg.new;
    return '<div class="lang-phrase-card lborder-' + p.status + '" id="lp-' + p.id + '">'
      + '<div class="lang-phrase-top">'
      + '<div class="lang-phrase-text">' + Utils.escHtml(p.text) + '</div>'
      + '<span class="lang-status-badge ' + sc.cls + '">' + sc.label + '</span>'
      + '</div>'
      + '<div class="lang-phrase-translation">🇫🇷 ' + Utils.escHtml(p.translation) + '</div>'
      + (p.notes ? '<div class="lang-phrase-notes">💡 ' + Utils.escHtml(p.notes) + '</div>' : '')
      + '<div class="lang-phrase-footer">'
      + '<span class="lang-phrase-date">' + Utils.formatDateShort(p.dateAdded) + '</span>'
      + '<div class="lang-phrase-actions">'
      + '<button class="lpbtn lpbtn-learned' + (p.status==='learned'?' active':'') + '" onclick="LangModule.setStatus(\'' + p.id + '\',\'learned\')" title="Appris">✅ Appris</button>'
      + '<button class="lpbtn lpbtn-learning' + (p.status==='learning'?' active':'') + '" onclick="LangModule.setStatus(\'' + p.id + '\',\'learning\')" title="En cours">📖</button>'
      + '<button class="lpbtn lpbtn-review' + (p.status==='review'?' active':'') + '" onclick="LangModule.setStatus(\'' + p.id + '\',\'review\')" title="À revoir">⚠️</button>'
      + '<button class="lpbtn lpbtn-edit" onclick="LangModule.openModal(\'' + p.id + '\')" title="Modifier">✏️</button>'
      + '<button class="lpbtn lpbtn-del" onclick="LangModule.removePhrase(\'' + p.id + '\')" title="Supprimer">🗑️</button>'
      + '</div></div></div>';
  },

  setStatus(id, status) {
    const p = DB.getPhrases().find(x => x.id === id);
    if (!p) return;
    const wasLearned = p.status === 'learned';
    p.status = (p.status === status) ? 'new' : status;
    p.reviewCount = (p.reviewCount || 0) + 1;
    DB.updatePhrase(p);
    this.render();
    if (!wasLearned && p.status === 'learned') {
      Celebration.show('Super ! 🎉', '"' + p.text.slice(0, 35) + '" est maintenant apprise !', false);
    }
  },

  getStreak() {
    const phrases = DB.getPhrases().filter(p => p.language === this.currentLang);
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const ds = Utils.dateStr(d);
      if (phrases.some(p => p.dateAdded === ds)) streak++;
      else if (i > 0) break;
    }
    return streak;
  },

  openModal(id) {
    if (id) {
      const p = DB.getPhrases().find(x => x.id === id);
      if (!p) return;
      document.getElementById('langModalTitle').textContent = 'Modifier la phrase';
      document.getElementById('langPhraseId').value = p.id;
      document.getElementById('langPhraseText').value = p.text;
      document.getElementById('langPhraseTranslation').value = p.translation;
      document.getElementById('langPhraseNotes').value = p.notes || '';
      document.getElementById('langPhraseLang').value = p.language;
      document.getElementById('langPhraseStatus').value = p.status;
      document.getElementById('langDeleteBtn').classList.remove('hidden');
    } else {
      document.getElementById('langModalTitle').textContent = 'Nouvelle phrase';
      document.getElementById('langPhraseId').value = '';
      document.getElementById('langPhraseText').value = '';
      document.getElementById('langPhraseTranslation').value = '';
      document.getElementById('langPhraseNotes').value = '';
      document.getElementById('langPhraseLang').value = this.currentLang;
      document.getElementById('langPhraseStatus').value = 'new';
      document.getElementById('langDeleteBtn').classList.add('hidden');
    }
    Modal.open('langModal');
  },

  save() {
    const text = document.getElementById('langPhraseText')?.value.trim();
    const translation = document.getElementById('langPhraseTranslation')?.value.trim();
    if (!text) { Toast.show('La phrase est requise', 'error'); return; }
    if (!translation) { Toast.show('La traduction est requise', 'error'); return; }
    const id = document.getElementById('langPhraseId')?.value;
    const existing = id ? DB.getPhrases().find(p => p.id === id) : null;
    const p = {
      id: id || DB.generateId(),
      language: document.getElementById('langPhraseLang')?.value || this.currentLang,
      text,
      translation,
      notes: document.getElementById('langPhraseNotes')?.value || '',
      status: document.getElementById('langPhraseStatus')?.value || 'new',
      dateAdded: existing?.dateAdded || DB.todayStr(),
      reviewCount: existing?.reviewCount || 0,
    };
    if (id) DB.updatePhrase(p); else DB.addPhrase(p);
    Modal.close('langModal');
    Toast.show(id ? 'Phrase modifiée' : 'Phrase ajoutée ✅', 'success');
    this.render();
  },

  removePhrase(id) {
    if (confirm('Supprimer cette phrase ?')) {
      DB.deletePhrase(id);
      Toast.show('Phrase supprimée', 'info');
      this.render();
    }
  },

  deletePhrase() {
    const id = document.getElementById('langPhraseId')?.value;
    if (!id) return;
    if (confirm('Supprimer cette phrase ?')) {
      DB.deletePhrase(id);
      Modal.close('langModal');
      Toast.show('Phrase supprimée', 'info');
      this.render();
    }
  }
};

// ════════════════════════════════════════════════════════
//  APP — MAIN CONTROLLER
// ════════════════════════════════════════════════════════
const App = {
  currentPage: 'dashboard',

  init() {
    // Apply saved settings
    const s = DB.getSettings();
    document.documentElement.setAttribute('data-theme', s.theme||'light');
    if(s.primaryColor) document.documentElement.style.setProperty('--primary', s.primaryColor);
    const sidebarName = document.getElementById('sidebarName');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if(sidebarName) sidebarName.textContent = s.name||'Badr';
    if(sidebarAvatar) sidebarAvatar.textContent = s.avatar||'B';

    // Init modules
    startClock();
    CalModule.init();
    TaskModule.init();
    LearningModule.init();
    HabitModule.init();
    GoalModule.init();
    NotesModule.init();
    StatsModule.init();
    SettingsModule.init();
    PomodoroModule.init();
    LangModule.init();
    FinanceModule.init();
    DashModule.render();

    // Navigation (sidebar + mobile bottom nav)
    document.querySelectorAll('.nav-item[data-page], .mob-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => {
        this.navigate(item.dataset.page);
        document.getElementById('sidebar').classList.remove('mobile-open');
      });
    });

    // Sidebar toggle
    document.getElementById('sidebarCollapseBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Mobile "Plus" button opens sidebar
    const mobMoreBtn = document.getElementById('mobMoreBtn');
    if(mobMoreBtn) mobMoreBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Close sidebar by tapping backdrop (mobile)
    document.getElementById('sidebar').addEventListener('click', (e) => {
      if(e.target === document.getElementById('sidebar')) {
        document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      if(sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== document.getElementById('menuBtn') && e.target !== mobMoreBtn) {
        sidebar.classList.remove('mobile-open');
      }
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      const icon = document.getElementById('themeIcon');
      if(icon) {
        icon.innerHTML = isDark
          ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
          : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
        const s = DB.getSettings(); s.theme = isDark?'light':'dark'; DB.saveSettings(s);
      }
      if(StatsModule.charts) StatsModule.render();
    });

    // Quick add button
    document.getElementById('addQuickBtn').addEventListener('click', () => this.openQuickAdd('event'));

    // Quick add tabs
    document.querySelectorAll('.qa-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        this.renderQuickAddContent(tab.dataset.qa);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape') Modal.closeAll();
    });

    this.navigate('dashboard');
    this.init3DTilt();
  },

  init3DTilt() {
    // Disable tilt entirely on touch devices
    if (window.matchMedia('(hover:none)').matches) return;
    const applyTilt = (el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    };
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.dash-card, .goal-card, .subject-card').forEach(el => {
        if(!el.dataset.tiltInit) { el.dataset.tiltInit='1'; applyTilt(el); }
      });
    });
    observer.observe(document.getElementById('content'), {childList:true, subtree:true});
    document.querySelectorAll('.dash-card, .goal-card, .subject-card').forEach(el => {
      el.dataset.tiltInit='1'; applyTilt(el);
    });
  },

  navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    // Show target
    const el = document.getElementById(`page-${page}`);
    if(el) el.classList.remove('hidden');
    // Update nav (sidebar + mobile bottom nav)
    document.querySelectorAll('.nav-item, .mob-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    // Update title
    const titles = {
      dashboard:'Tableau de bord', calendar:'Calendrier', tasks:'Tâches',
      learning:'Apprentissage', habits:'Habitudes', goals:'Objectifs',
      notes:'Notes & Journal', pomodoro:'Pomodoro Focus', stats:'Statistiques',
      settings:'Paramètres', languages:'Langues', finances:'Finances',
      about:'About Developer'
    };
    const titleEl = document.getElementById('pageTitle');
    if(titleEl) titleEl.textContent = titles[page]||page;

    this.currentPage = page;

    // Re-render page-specific content
    if(page === 'dashboard') DashModule.render();
    if(page === 'calendar') CalModule.render();
    if(page === 'tasks') TaskModule.render();
    if(page === 'learning') LearningModule.renderSubjectsList();
    if(page === 'habits') HabitModule.render();
    if(page === 'goals') GoalModule.render();
    if(page === 'notes') NotesModule.renderNotesList();
    if(page === 'pomodoro') PomodoroModule.render();
    if(page === 'stats') StatsModule.render();
    if(page === 'settings') SettingsModule.loadSettings();
    if(page === 'languages') LangModule.render();
    if(page === 'finances') FinanceModule.render();
  },

  openQuickAdd(type) {
    document.querySelectorAll('.qa-tab').forEach(t => t.classList.toggle('active', t.dataset.qa===type));
    this.renderQuickAddContent(type);
    Modal.open('quickAddModal');
  },

  renderQuickAddContent(type) {
    const el = document.getElementById('quickAddContent');
    if(!el) return;
    if(type === 'event') {
      el.innerHTML = `
        <div class="form-row"><label>Titre</label><input type="text" id="qTitle" class="form-input" placeholder="Titre de l'événement" autofocus></div>
        <div class="form-row two-col">
          <div><label>Date</label><input type="date" id="qDate" class="form-input" value="${DB.todayStr()}"></div>
          <div><label>Heure début</label><input type="time" id="qStart" class="form-input" value="09:00"></div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
          <button class="btn btn-secondary" onclick="Modal.close('quickAddModal')">Annuler</button>
          <button class="btn btn-primary" onclick="App.saveQuickEvent()">Ajouter</button>
        </div>`;
    } else if(type === 'task') {
      el.innerHTML = `
        <div class="form-row"><label>Titre</label><input type="text" id="qTaskTitle" class="form-input" placeholder="Titre de la tâche" autofocus></div>
        <div class="form-row two-col">
          <div><label>Date limite</label><input type="date" id="qDeadline" class="form-input" value="${DB.todayStr()}"></div>
          <div><label>Priorité</label><select id="qPriority" class="form-input"><option value="low">Basse</option><option value="medium" selected>Moyenne</option><option value="high">Haute</option></select></div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
          <button class="btn btn-secondary" onclick="Modal.close('quickAddModal')">Annuler</button>
          <button class="btn btn-primary" onclick="App.saveQuickTask()">Ajouter</button>
        </div>`;
    } else if(type === 'note') {
      el.innerHTML = `
        <div class="form-row"><label>Titre</label><input type="text" id="qNoteTitle" class="form-input" placeholder="Titre de la note" autofocus></div>
        <div class="form-row"><label>Contenu</label><textarea id="qNoteContent" class="form-textarea" rows="4" placeholder="Votre note..."></textarea></div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
          <button class="btn btn-secondary" onclick="Modal.close('quickAddModal')">Annuler</button>
          <button class="btn btn-primary" onclick="App.saveQuickNote()">Ajouter</button>
        </div>`;
    }
  },

  saveQuickEvent() {
    const title = document.getElementById('qTitle')?.value.trim();
    if(!title) { Toast.show('Titre requis','error'); return; }
    DB.addEvent({
      id: DB.generateId(), title,
      date: document.getElementById('qDate')?.value||DB.todayStr(),
      start: document.getElementById('qStart')?.value||'09:00',
      end: '', category:'work', color:'#6366f1', priority:'medium',
    });
    Modal.close('quickAddModal');
    Toast.show('Événement ajouté','success');
    DashModule.renderTimeline(DB.todayStr());
    if(this.currentPage==='calendar') CalModule.render();
  },

  saveQuickTask() {
    const title = document.getElementById('qTaskTitle')?.value.trim();
    if(!title) { Toast.show('Titre requis','error'); return; }
    DB.addTask({
      id: DB.generateId(), title,
      deadline: document.getElementById('qDeadline')?.value||DB.todayStr(),
      priority: document.getElementById('qPriority')?.value||'medium',
      category:'work', status:'todo', subtasks:[],
      createdAt: new Date().toISOString(),
    });
    Modal.close('quickAddModal');
    Toast.show('Tâche ajoutée','success');
    DashModule.renderTasks(DB.todayStr());
    if(this.currentPage==='tasks') TaskModule.render();
  },

  saveQuickNote() {
    const title = document.getElementById('qNoteTitle')?.value.trim()||'Note sans titre';
    const content = document.getElementById('qNoteContent')?.value||'';
    DB.addNote({ id:DB.generateId(), title, content, pinned:false, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
    Modal.close('quickAddModal');
    Toast.show('Note ajoutée','success');
    if(this.currentPage==='notes') NotesModule.renderNotesList();
  }
};

// ════════════════════════════════════════════════════════
//  BOOTSTRAP
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => App.init());
