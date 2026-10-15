// Everything is kept in this browser's localStorage under one key. Nothing leaves the device.
export interface Checkin { date: string; mood: number; sleep?: number; note?: string }
export interface Check { date: string; score: number; answers: number[]; triggers: string[] }
export interface Session { date: string; tool: string; before?: number; after?: number }
export interface Data { name?: string; checkins: Checkin[]; checks: Check[]; sessions: Session[] }

const KEY = 'calmdesk-v1';
const empty = (): Data => ({ checkins: [], checks: [], sessions: [] });

export function load(): Data {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return d && Array.isArray(d.checkins) ? { ...empty(), ...d } : empty();
  } catch { return empty(); }
}
export function save(d: Data) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage blocked */ } }
export function update(fn: (d: Data) => void) { const d = load(); fn(d); save(d); return d; }
export function clearAll() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

export function streak(d: Data) {
  const days = new Set(d.checkins.map((c) => c.date));
  let n = 0; const day = new Date();
  if (!days.has(today())) day.setDate(day.getDate() - 1); // a streak is not broken until the day ends
  while (days.has(day.toLocaleDateString('en-CA'))) { n++; day.setDate(day.getDate() - 1); }
  return n;
}

export type Level = 'low' | 'moderate' | 'high';
export const level = (score: number): Level => (score <= 13 ? 'low' : score <= 26 ? 'moderate' : 'high');

export function pssScore(answers: number[], reverse: number[]) {
  return answers.reduce((s, a, i) => s + (reverse.includes(i) ? 4 - a : a), 0);
}

export const lang = () => (document.documentElement.lang === 'si' ? 'si' : 'en') as 'en' | 'si';
