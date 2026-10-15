// Ask for a 0–10 rating in the shared dialog. Resolves with the number, or undefined if skipped.
export function ask(question: string, start = 5): Promise<number | undefined> {
  const box = document.getElementById('rate') as HTMLDialogElement;
  const v = document.getElementById('rate-v') as HTMLInputElement;
  const out = document.getElementById('rate-out')!;
  document.getElementById('rate-q')!.textContent = question;
  v.value = String(start); out.textContent = v.value;
  v.oninput = () => (out.textContent = v.value);
  box.showModal();
  return new Promise((res) => { box.onclose = () => res(box.returnValue === 'ok' ? Number(v.value) : undefined); });
}
