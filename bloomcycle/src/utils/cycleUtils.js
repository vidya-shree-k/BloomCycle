// Cycle utilities and constants
export const CYCLE_LENGTH = 28;

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d;
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

export function getCycleDay(periodStart) {
  if (!periodStart) return null;
  const diff = daysBetween(periodStart, todayStr());
  if (diff < 0) return null;
  return (diff % CYCLE_LENGTH) + 1;
}

export function getPhase(day) {
  if (!day) return { name: 'Unknown', desc: 'Start logging to track your cycle', emoji: '🌸', color: 'rgba(244,114,182,0.2)' };
  if (day <= 5)  return { name: 'Menstrual',  desc: 'Your body needs rest & warmth today. Be gentle with yourself.',       emoji: '🔴', color: 'rgba(251,113,133,0.18)' };
  if (day <= 13) return { name: 'Follicular', desc: 'Energy is building! A great time to start new things.',               emoji: '🌱', color: 'rgba(110,231,183,0.18)' };
  if (day === 14)return { name: 'Ovulation',  desc: "You're at peak energy and confidence today!",                         emoji: '✨', color: 'rgba(252,211,77,0.18)'  };
  return           { name: 'Luteal',      desc: 'Wind down and rest more. Some PMS may appear — that\'s okay.',        emoji: '🍂', color: 'rgba(251,146,60,0.18)'  };
}

export function getNextPeriod(periodStart) {
  if (!periodStart) return 'Set period start in Cycle tab';
  const daysLeft = CYCLE_LENGTH - (daysBetween(periodStart, todayStr()) % CYCLE_LENGTH);
  const next = addDays(todayStr(), daysLeft);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export const TIPS = [
  'Chamomile tea has anti-inflammatory properties that may help ease cramps.',
  'A warm heating pad on your lower abdomen relaxes uterine muscles.',
  'Light walking or yoga releases endorphins — your body\'s natural pain relievers.',
  'Dark chocolate (70%+) is rich in magnesium, which may ease PMS symptoms.',
  'Staying hydrated reduces bloating and supports your body throughout your cycle.',
  'Tracking your cycle helps you understand your body\'s unique rhythms.',
  'Rest is productive! Your body does important hormonal work during your period.',
];
