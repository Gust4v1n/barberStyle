export const services = [
  { id: 'corte', name: 'Corte de cabelo', detail: 'Tesoura ou máquina, do seu jeito.', minutes: 40, price: 45 },
  { id: 'barba', name: 'Barba & acabamento', detail: 'Desenho, contorno e finalização.', minutes: 30, price: 35 },
  { id: 'combo', name: 'Corte + barba', detail: 'Um horário para cuidar dos dois.', minutes: 70, price: 70 },
  { id: 'sobrancelha', name: 'Design de sobrancelhas', detail: 'Alinhamento e cuidado nos detalhes.', minutes: 20, price: 25 }
];
export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function availableSlots(date, duration, bookings, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const slots = [];
  for (let start = 9*60; start + duration <= 18*60; start += 30) {
    const time = `${String(Math.floor(start/60)).padStart(2,'0')}:${String(start%60).padStart(2,'0')}`;
    if (new Date(`${date}T${time}:00`) <= now) continue;
    const occupied = bookings.some(b => { const [h,m] = b.time.split(':').map(Number); const other = h*60+m; return b.date === date && start < other+b.minutes && start+duration > other; });
    if (!occupied) slots.push(time);
  }
  return slots;
}
export function readBookings(storage) {
  const data = JSON.parse(storage.getItem('barberstyle.bookings') || '[]');
  if (!Array.isArray(data) || data.some(b => !b || typeof b.id !== 'string' || typeof b.name !== 'string' || !services.some(s=>s.id===b.serviceId) || !/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !/^\d{2}:\d{2}$/.test(b.time) || !Number.isFinite(b.minutes))) throw new Error('Dados locais inválidos.');
  return data;
}
