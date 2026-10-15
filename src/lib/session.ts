// Before/after ratings around a relief exercise. The result is saved as a session and shown in the tool's card.
import { ask } from './rate';
import { update, today } from './store';
import { ui } from '../data/i18n';

const L = () => (document.documentElement.lang === 'si' ? 'si' : 'en');
const before: Record<string, number | undefined> = {};
const open = new Set<string>();

export async function begin(tool: string) {
  before[tool] = await ask(ui[L()].before, 5);
  open.add(tool);
}

export const isOpen = (tool: string) => open.has(tool);

export async function end(tool: string) {
  if (!open.has(tool)) return;
  open.delete(tool);
  const b = before[tool];
  const a = await ask(ui[L()].after, b ?? 5);
  update((d) => { d.sessions.push({ date: today(), tool, before: b, after: a }); });
  const out = document.querySelector<HTMLElement>(`#${tool} [data-result]`);
  if (out && b != null && a != null) { out.textContent = ui[L()].change(b, a); out.hidden = false; }
}
