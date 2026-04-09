// ── Supabase Init ──
const SUPABASE_URL = 'https://opjovtqepkrjkcxdzkrg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wam92dHFlcGtyamtjeGR6a3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mzg4OTQsImV4cCI6MjA5MTMxNDg5NH0.Ol_W6CwyUfDO9YoBxf30y7Qv9cmBb1hFEgKIfH6aHjQ';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Training Plan Data ──
const PHASE_1 = {
  name: 'Fáze 1: Základ (duben–květen)',
  days: {
    1: {
      name: 'Posilovna',
      exercises: [
        { id: 'p1d1e1', name: 'Bench press', detail: '3 × 10, střední váha' },
        { id: 'p1d1e2', name: 'Shyby nadhmatem', detail: '3 × 6–8, plný rozsah' },
        { id: 'p1d1e3', name: 'Seated cable row', detail: '3 × 10–12, uvolněné břicho' },
        { id: 'p1d1e4', name: 'Overhead press', detail: '3 × 10–12, lehčí váha' },
        { id: 'p1d1e5', name: 'Klik na bradlech', detail: '3 × 8–10, bez zadržování dechu' },
        { id: 'p1d1e6', name: 'Lateral raise', detail: '3 × 12–15' },
        { id: 'p1d1e7', name: 'Face pull', detail: '3 × 15' },
        { id: 'p1d1e8', name: 'Dead bug', detail: '3 × 10 každá strana' },
        { id: 'p1d1e9', name: 'Pallof press', detail: '3 × 12' },
        { id: 'p1d1e10', name: 'Plank', detail: '3 × max 45 sec, volně dýchat' }
      ]
    },
    2: {
      name: 'Lezení',
      exercises: [
        { id: 'p1d2e1', name: 'Lezení slab/vertikála', detail: '60–90 min, bez převisů' },
        { id: 'p1d2e2', name: 'Lezení technické cesty', detail: 'Footwork a balans' },
        { id: 'p1d2e3', name: 'Bird-dog', detail: '3 × 10 každá strana' },
        { id: 'p1d2e4', name: 'Antagonisté prstů', detail: '3 × 10' }
      ]
    }
  }
};

const PHASE_2 = {
  name: 'Fáze 2: Progrese (červen–srpen)',
  days: {
    1: {
      name: 'Posilovna',
      exercises: [
        { id: 'p2d1e1', name: 'Bench press', detail: '4 × 6–8, progrese váhy' },
        { id: 'p2d1e2', name: 'Weighted pull-ups', detail: '4 × 5–6' },
        { id: 'p2d1e3', name: 'Chest-supported row', detail: '4 × 8–10' },
        { id: 'p2d1e4', name: 'Overhead press', detail: '3 × 8–10, progrese váhy' },
        { id: 'p2d1e5', name: 'Dips', detail: '3 × 8–10' },
        { id: 'p2d1e6', name: 'Lateral raise', detail: '3 × 12–15' },
        { id: 'p2d1e7', name: 'Face pull', detail: '3 × 15' },
        { id: 'p2d1e8', name: 'Dead bug s váhou', detail: '3 × 12 každá strana' },
        { id: 'p2d1e9', name: 'Pallof press těžší', detail: '3 × 10' },
        { id: 'p2d1e10', name: 'Copenhagen plank', detail: '3 × 20 sec, vynechat při bolesti' }
      ]
    },
    2: {
      name: 'Lezení',
      exercises: [
        { id: 'p2d2e1', name: 'Technika pohybu', detail: '60 min, footwork a balans' },
        { id: 'p2d2e2', name: 'Slab a vertikála', detail: '30 min' },
        { id: 'p2d2e3', name: 'Antagonisté prstů', detail: '3 × 10' },
        { id: 'p2d2e4', name: 'Bird-dog', detail: '3 × 10 každá strana' }
      ]
    }
  }
};

const STRETCHING = {
  morning: {
    name: 'Ranní strečink',
    stretches: [
      { id: 'sm1', name: 'Hip flexor stretch', detail: '3 × 30–45 sec každá strana' },
      { id: 'sm2', name: 'Adduktor stretch', detail: '2–3 × 45–60 sec' },
      { id: 'sm3', name: '90/90 stretch', detail: '2 × 60 sec každá strana' }
    ]
  },
  post_workout: {
    name: 'Strečink po tréninku',
    stretches: [
      { id: 'sp1', name: 'Piriformis stretch', detail: '2 × 45 sec každá strana' },
      { id: 'sp2', name: 'Kvadriceps stretch', detail: '2 × 30–45 sec každá strana' },
      { id: 'sp3', name: 'Couch stretch', detail: '2 × 60–90 sec každá strana, začít opatrně' }
    ]
  }
};

const PAIN_LABELS = {
  1: 'žádná',
  2: 'mírná',
  3: 'střední',
  4: 'silná',
  5: 'velmi silná'
};

// ── State ──
let selectedPain = null;
let selectedDay = null; // null = rest/stretch only, 1/2/3 = training day
let calendarYear, calendarMonth;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  calendarYear = now.getFullYear();
  calendarMonth = now.getMonth();
  renderTodayHeader();
  renderDaySelector();
  renderPlan();
  renderPainSelector();
  loadTodayData();
});

// ── Utilities ──
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const CZECH_DAYS = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
const CZECH_DAYS_SHORT = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
const CZECH_MONTHS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

function getPhase(date) {
  return date < new Date(2026, 5, 1) ? 1 : 2;
}

function getPhaseData(phase) {
  return phase === 1 ? PHASE_1 : PHASE_2;
}

// ── Tab Switching ──
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
  if (tabName === 'progress') renderProgress();
}

// ── Dnes Tab ──
function renderTodayHeader() {
  const now = new Date();
  const phaseData = getPhaseData(getPhase(now));
  document.getElementById('today-title').textContent =
    `${CZECH_DAYS[now.getDay()]} ${now.getDate()}. ${CZECH_MONTHS[now.getMonth()].toLowerCase()}`;
  document.getElementById('today-phase').textContent = phaseData.name;
}

function renderDaySelector() {
  const now = new Date();
  const phaseData = getPhaseData(getPhase(now));
  const container = document.getElementById('day-selector');

  const options = [
    { value: null, label: 'Jen strečink' },
    { value: 1, label: phaseData.days[1].name },
    { value: 2, label: phaseData.days[2].name }
  ];

  container.innerHTML = options.map(opt =>
    `<button class="day-btn${selectedDay === opt.value ? ' active' : ''}" data-day="${opt.value}">${opt.label}</button>`
  ).join('');

  container.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.day === 'null' ? null : parseInt(btn.dataset.day);
      selectDay(val);
    });
  });

  renderDayContent();
}

function selectDay(dayNum) {
  selectedDay = dayNum;
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.day-btn[data-day="${dayNum}"]`).classList.add('active');
  renderDayContent();
}

function renderDayContent() {
  const now = new Date();
  const phaseData = getPhaseData(getPhase(now));

  if (selectedDay) {
    document.getElementById('training-section').style.display = '';
    document.getElementById('post-stretch-section').style.display = '';
    document.getElementById('rest-day-msg').style.display = 'none';
    document.getElementById('training-title').textContent = phaseData.days[selectedDay].name;
    renderExercises(phaseData, selectedDay);
    renderStretches('morning-stretch-list', STRETCHING.morning.stretches);
    renderStretches('post-stretch-list', STRETCHING.post_workout.stretches);
  } else {
    document.getElementById('training-section').style.display = 'none';
    document.getElementById('post-stretch-section').style.display = 'none';
    document.getElementById('rest-day-msg').style.display = '';
    renderStretches('morning-stretch-list', STRETCHING.morning.stretches);
  }
}

function renderExercises(phaseData, dayNum) {
  const day = phaseData.days[dayNum];
  const container = document.getElementById('exercise-list');
  container.innerHTML = `<p style="font-weight:600;margin-bottom:8px">${day.name}</p>`;
  day.exercises.forEach(ex => {
    container.innerHTML += createCheckboxCard(ex.id, ex.name, ex.detail);
  });
  attachCardListeners(container);
}

function renderStretches(containerId, stretches) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  stretches.forEach(s => {
    container.innerHTML += createCheckboxCard(s.id, s.name, s.detail);
  });
  attachCardListeners(container);
}

function createCheckboxCard(id, name, detail) {
  return `<label class="exercise-card" for="cb-${id}">
    <input type="checkbox" id="cb-${id}" value="${id}">
    <div class="exercise-info">
      <div class="exercise-name">${name}</div>
      <div class="exercise-detail">${detail}</div>
    </div>
  </label>`;
}

function attachCardListeners(container) {
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.exercise-card').classList.toggle('checked', cb.checked);
    });
  });
}

function renderPainSelector() {
  const container = document.getElementById('pain-selector');
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.className = 'pain-btn';
    btn.innerHTML = `${i}<span class="pain-label">${PAIN_LABELS[i]}</span>`;
    btn.addEventListener('click', () => {
      selectedPain = i;
      container.querySelectorAll('.pain-btn').forEach(b => b.className = 'pain-btn');
      btn.classList.add(`selected-${i}`);
    });
    container.appendChild(btn);
  }
}

// ── Save / Load ──
async function handleSave() {
  const btn = document.getElementById('save-btn');
  const status = document.getElementById('save-status');
  btn.disabled = true;
  status.textContent = 'Ukládám...';
  status.style.color = 'var(--text-muted)';

  try {
    const now = new Date();
    const today = formatDate(now);
    const phase = getPhase(now);
    const dayNum = selectedDay;

    const checkedExercises = [...document.querySelectorAll('#exercise-list input:checked')].map(cb => cb.value);
    const morningStretches = [...document.querySelectorAll('#morning-stretch-list input:checked')].map(cb => cb.value);
    const postStretches = [...document.querySelectorAll('#post-stretch-list input:checked')].map(cb => cb.value);
    const notes = document.getElementById('notes').value;

    const promises = [];

    if (dayNum !== null) {
      promises.push(
        db.from('workout_logs').upsert({
          date: today,
          phase: phase,
          day_number: dayNum,
          exercises_completed: checkedExercises,
          notes: notes,
          pain_level: selectedPain
        }, { onConflict: 'date' })
      );
    }

    if (morningStretches.length > 0) {
      promises.push(
        db.from('stretch_logs').upsert({
          date: today,
          session_type: 'morning',
          stretches_completed: morningStretches
        }, { onConflict: 'date,session_type' })
      );
    }

    if (postStretches.length > 0) {
      promises.push(
        db.from('stretch_logs').upsert({
          date: today,
          session_type: 'post_workout',
          stretches_completed: postStretches
        }, { onConflict: 'date,session_type' })
      );
    }

    const results = await Promise.all(promises);
    const hasError = results.some(r => r.error);
    if (hasError) {
      const err = results.find(r => r.error).error;
      throw new Error(err.message);
    }

    status.textContent = 'Uloženo ✓';
    status.style.color = 'var(--success)';
  } catch (e) {
    status.textContent = 'Chyba: ' + e.message;
    status.style.color = 'var(--danger)';
  } finally {
    btn.disabled = false;
    setTimeout(() => { status.textContent = ''; }, 3000);
  }
}

async function loadTodayData() {
  const today = formatDate(new Date());

  const [workoutRes, stretchRes] = await Promise.all([
    db.from('workout_logs').select('*').eq('date', today).maybeSingle(),
    db.from('stretch_logs').select('*').eq('date', today)
  ]);

  if (workoutRes.data) {
    // Restore selected day from saved data
    selectDay(workoutRes.data.day_number);

    (workoutRes.data.exercises_completed || []).forEach(id => {
      const cb = document.getElementById(`cb-${id}`);
      if (cb) {
        cb.checked = true;
        cb.closest('.exercise-card').classList.add('checked');
      }
    });
    if (workoutRes.data.pain_level) {
      selectedPain = workoutRes.data.pain_level;
      const btns = document.querySelectorAll('.pain-btn');
      btns[selectedPain - 1].classList.add(`selected-${selectedPain}`);
    }
    document.getElementById('notes').value = workoutRes.data.notes || '';
  }

  if (stretchRes.data) {
    stretchRes.data.forEach(log => {
      (log.stretches_completed || []).forEach(id => {
        const cb = document.getElementById(`cb-${id}`);
        if (cb) {
          cb.checked = true;
          cb.closest('.exercise-card').classList.add('checked');
        }
      });
    });
  }
}

// ── Plán Tab ──
function renderPlan() {
  const container = document.getElementById('plan-content');
  container.innerHTML = '';
  [PHASE_1, PHASE_2].forEach(phase => {
    let html = `<div class="plan-phase"><div class="plan-phase-title">${phase.name}</div>`;
    for (const [dayNum, day] of Object.entries(phase.days)) {
      html += `<div class="plan-day" onclick="this.classList.toggle('open')">
        <div class="plan-day-header">${day.name} <span class="chevron">▼</span></div>
        <div class="plan-day-body">`;
      day.exercises.forEach(ex => {
        html += `<div class="plan-exercise">
          <span class="plan-exercise-name">${ex.name}</span>
          <span class="plan-exercise-detail">${ex.detail}</span>
        </div>`;
      });
      html += '</div></div>';
    }
    html += '</div>';
    container.innerHTML += html;
  });

  // Stretching section
  let stretchHtml = '<div class="plan-phase"><div class="plan-phase-title">Strečink</div>';
  [STRETCHING.morning, STRETCHING.post_workout].forEach(section => {
    stretchHtml += `<div class="plan-day" onclick="this.classList.toggle('open')">
      <div class="plan-day-header">${section.name} <span class="chevron">▼</span></div>
      <div class="plan-day-body">`;
    section.stretches.forEach(s => {
      stretchHtml += `<div class="plan-exercise">
        <span class="plan-exercise-name">${s.name}</span>
        <span class="plan-exercise-detail">${s.detail}</span>
      </div>`;
    });
    stretchHtml += '</div></div>';
  });
  stretchHtml += '</div>';
  container.innerHTML += stretchHtml;
}

// ── Přehled Tab ──
async function renderProgress() {
  await Promise.all([renderStreaks(), renderCalendar(), renderPainChartData()]);
}

async function renderStreaks() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);

  const [workouts, stretches] = await Promise.all([
    db.from('workout_logs').select('date').gte('date', formatDate(thirtyDaysAgo)).order('date', { ascending: false }),
    db.from('stretch_logs').select('date,session_type').eq('session_type', 'morning').gte('date', formatDate(thirtyDaysAgo)).order('date', { ascending: false })
  ]);

  const workoutDates = new Set((workouts.data || []).map(w => w.date));
  const stretchDates = new Set((stretches.data || []).map(s => s.date));

  // Training streak: count consecutive workout logs going backwards
  let trainingStreak = 0;
  const sortedWorkouts = [...workoutDates].sort().reverse();
  for (let i = 0; i < sortedWorkouts.length; i++) {
    if (i === 0) {
      // Most recent workout must be today or yesterday to count
      const diff = (today - new Date(sortedWorkouts[i])) / (1000 * 60 * 60 * 24);
      if (diff > 1) break;
    } else {
      // Each subsequent workout must be within 3 days of the previous (allow rest days)
      const prev = new Date(sortedWorkouts[i - 1]);
      const curr = new Date(sortedWorkouts[i]);
      const gap = (prev - curr) / (1000 * 60 * 60 * 24);
      if (gap > 3) break;
    }
    trainingStreak++;
  }

  // Morning stretch streak: consecutive days
  let stretchStreak = 0;
  const d2 = new Date(today);
  for (let i = 0; i < 90; i++) {
    if (stretchDates.has(formatDate(d2))) {
      stretchStreak++;
    } else {
      break;
    }
    d2.setDate(d2.getDate() - 1);
  }

  document.getElementById('streaks').innerHTML = `
    <div class="streaks-container">
      <div class="streak-card">
        <div class="streak-number">${trainingStreak}</div>
        <div class="streak-label">Tréninky v řadě</div>
      </div>
      <div class="streak-card">
        <div class="streak-number">${stretchStreak}</div>
        <div class="streak-label">Ranní strečink v řadě</div>
      </div>
    </div>`;
}

async function renderCalendar() {
  const year = calendarYear;
  const month = calendarMonth;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = formatDate(firstDay);
  const endDate = formatDate(lastDay);

  const [workouts, stretches] = await Promise.all([
    db.from('workout_logs').select('date,exercises_completed,pain_level,phase,day_number').gte('date', startDate).lte('date', endDate),
    db.from('stretch_logs').select('date,stretches_completed,session_type').gte('date', startDate).lte('date', endDate)
  ]);

  const workoutMap = {};
  (workouts.data || []).forEach(w => { workoutMap[w.date] = w; });
  const stretchMap = {};
  (stretches.data || []).forEach(s => {
    if (!stretchMap[s.date]) stretchMap[s.date] = [];
    stretchMap[s.date].push(s);
  });

  // Build calendar HTML
  let html = `<div class="calendar-nav">
    <button onclick="changeMonth(-1)">‹</button>
    <span class="calendar-month">${CZECH_MONTHS[month]} ${year}</span>
    <button onclick="changeMonth(1)">›</button>
  </div>
  <div class="calendar-grid">`;

  // Day name headers (starting Monday)
  const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
  dayOrder.forEach(i => {
    html += `<div class="calendar-day-name">${CZECH_DAYS_SHORT[i]}</div>`;
  });

  // Empty cells before first day
  let firstDow = firstDay.getDay(); // 0=Sun
  const offset = firstDow === 0 ? 6 : firstDow - 1; // Monday-based
  for (let i = 0; i < offset; i++) {
    html += '<div class="calendar-day"></div>';
  }

  const today = formatDate(new Date());

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(year, month, day);
    const workout = workoutMap[dateStr];
    const stretch = stretchMap[dateStr];

    let cls = 'calendar-day';
    if (dateStr === today) cls += ' today';

    if (workout && workout.pain_level >= 4) {
      cls += ' pain-high';
    } else if (workout) {
      const phaseData = getPhaseData(getPhase(dateObj));
      const dayData = phaseData.days[workout.day_number];
      if (dayData) {
        const expected = dayData.exercises.length;
        const done = (workout.exercises_completed || []).length;
        cls += done >= expected ? ' full' : ' partial';
      } else {
        cls += ' partial';
      }
    } else if (stretch) {
      cls += ' full';
    }

    html += `<div class="${cls}">${day}</div>`;
  }

  html += '</div>';
  document.getElementById('calendar-container').innerHTML = html;
}

function changeMonth(delta) {
  calendarMonth += delta;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  renderCalendar();
}

async function renderPainChartData() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await db.from('workout_logs')
    .select('date,pain_level')
    .gte('date', formatDate(thirtyDaysAgo))
    .order('date', { ascending: true });

  const painMap = {};
  (data || []).forEach(d => { painMap[d.date] = d.pain_level; });

  let barsHtml = '';
  let labelsHtml = '';
  const d = new Date(thirtyDaysAgo);
  for (let i = 0; i < 30; i++) {
    if (i > 0) d.setDate(d.getDate() + 1);
    const dateStr = formatDate(d);
    const level = painMap[dateStr] || 0;
    const height = level > 0 ? (level / 5) * 100 : 0;
    barsHtml += `<div class="pain-bar level-${level}" style="height:${height}%" title="${dateStr}: ${level}"></div>`;
    labelsHtml += `<span>${d.getDate()}</span>`;
  }

  document.getElementById('pain-chart').innerHTML = `
    <div class="pain-chart">${barsHtml}</div>
    <div class="pain-chart-labels">${labelsHtml}</div>`;

  // Warnings
  renderWarnings(data || []);
}

function renderWarnings(logs) {
  const container = document.getElementById('warnings');
  const warnings = [];

  // Warning: pain 4+ three times in last 30 days
  const highPainCount = logs.filter(l => l.pain_level >= 4).length;
  if (highPainCount >= 3) {
    warnings.push({ text: `Bolest 4+ celkem ${highPainCount}× za posledních 30 dní — zvažte konzultaci s fyzioterapeutem`, danger: true });
  }

  // Warning: consecutive days with pain >= 3
  for (let i = 1; i < logs.length; i++) {
    if (logs[i].pain_level >= 3 && logs[i - 1].pain_level >= 3) {
      const d1 = new Date(logs[i - 1].date);
      const d2 = new Date(logs[i].date);
      const diffDays = (d2 - d1) / (1000 * 60 * 60 * 24);
      if (diffDays <= 3) {
        warnings.push({ text: 'Bolest 3+ dva tréninky po sobě — přidejte den volna navíc', danger: false });
        break;
      }
    }
  }

  // Warning: no training in last 7 days
  if (logs.length > 0) {
    const lastDate = new Date(logs[logs.length - 1].date);
    const daysSince = (new Date() - lastDate) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      warnings.push({ text: `Poslední trénink před ${Math.floor(daysSince)} dny — nezapomeňte na pravidelnost`, danger: false });
    }
  }

  if (warnings.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = '<h2>Upozornění</h2>' +
    warnings.map(w => `<div class="warning-card${w.danger ? ' danger' : ''}">${w.text}</div>`).join('');
}
