import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { services, money, localDate, availableSlots, readBookings } from './booking.mjs';
import './style.css';

type Booking = { id: string; serviceId: string; name: string; date: string; time: string; minutes: number };
function App() {
  const [tab, setTab] = useState('reserve');
  const [selected, setSelected] = useState('corte');
  const [date, setDate] = useState(localDate());
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState('');
  const service = services.find(s=>s.id===selected)!;
  const slots = availableSlots(date, service.minutes, bookings);
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate()+60);
  function load() { setLoading(true); try { setBookings(readBookings(localStorage)); setStorageError(false); setError(''); } catch { setStorageError(true); setError('Não foi possível ler as reservas deste aparelho. Verifique o armazenamento e tente novamente.'); } finally { setLoading(false); } }
  useEffect(()=>{ load(); const listener = () => load(); window.addEventListener('storage', listener); return ()=>window.removeEventListener('storage',listener); },[]);
  function persist(next: Booking[]) { localStorage.setItem('barberstyle.bookings',JSON.stringify(next)); setBookings(next); }
  function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    try {
      const current: Booking[] = readBookings(localStorage);
      if (!name.trim()) { setError('Informe seu nome para identificar a reserva.'); return; }
      if (date < localDate() || date > localDate(maxDate) || !availableSlots(date,service.minutes,current).includes(time)) { setBookings(current); setTime(''); setError('Escolha um horário disponível e uma data nos próximos 60 dias.'); return; }
      persist([...current,{id:crypto.randomUUID(),serviceId:selected,name:name.trim(),date,time,minutes:service.minutes}]);
      setMessage('Reserva demonstrativa salva neste aparelho. Nenhuma barbearia foi notificada.'); setTime(''); setTab('bookings');
    } catch { setError('Não foi possível salvar. Permita o armazenamento local e tente novamente.'); }
  }
  function cancel(id: string) { try { persist(readBookings(localStorage).filter((b: Booking)=>b.id!==id)); setMessage('Reserva cancelada neste aparelho.'); } catch { setError('Não foi possível cancelar. Tente novamente.'); } }
  return <><a className="skip" href="#main">Pular para o conteúdo</a>
    <header className="header"><div className="header-inner"><a className="brand" href="#main" aria-label="BarberStyle, início"><span className="monogram" aria-hidden="true">BS</span><span>BarberStyle<small>Barbearia & estética</small></span></a><span className="edition">Projeto SENAI · Aluno 12</span></div></header>
    <main id="main"><div className="intro"><div><p className="kicker">Seu próximo cuidado</p><h1>Bom estilo começa<br/>com hora marcada.</h1><p className="lead">Escolha o serviço. Encontre seu horário.<br/>Reserve um tempo para você.</p></div><div className="intro-note"><span className="note-number">12</span><p>BarberStyle<br/><span>Reserva de horários</span></p></div></div>
    <nav className="tabs" aria-label="Agenda"><button className={tab==='reserve'?'active':''} aria-pressed={tab==='reserve'} onClick={()=>{setTab('reserve');setMessage('');}}>Agendar horário</button><button className={tab==='bookings'?'active':''} aria-pressed={tab==='bookings'} onClick={()=>setTab('bookings')}>Minhas reservas <span className="count">{bookings.length}</span></button></nav>
    <p className="demo-note">Versão demonstrativa · Serviços, valores e agenda de exemplo. Reservas salvas somente neste aparelho.</p>
    <div aria-live="polite">{message && <p className="notice success">{message}</p>}{error && <div className="notice error" role="alert">{error}{storageError && <button className="text-button" onClick={load}>Tentar novamente</button>}</div>}</div>
    {loading ? <p role="status">Carregando suas reservas…</p> : tab==='reserve' ? <div className="booking-layout"><section aria-labelledby="services-title"><div className="section-title"><span>01</span><h2 id="services-title">O que vamos fazer?</h2></div><p className="section-description">Selecione um serviço para começar.</p><div className="services">{services.map((s,index)=><button key={s.id} className={`service ${selected===s.id?'selected':''}`} aria-pressed={selected===s.id} onClick={()=>{setSelected(s.id);setTime('');setMessage('');}}><span className="service-index">0{index+1}</span><span className="service-copy"><strong>{s.name}</strong><span>{s.detail}</span><small>{s.minutes} minutos</small></span><span className="service-price">{money(s.price)}<span aria-hidden="true" className="radio">{selected===s.id?'●':''}</span></span></button>)}</div><p className="catalog-note">Valores ilustrativos para a atividade. Sem cobrança no aplicativo.</p></section>
    <form className="reservation" onSubmit={submit}><div className="section-title"><span>02</span><h2>Escolha seu momento</h2></div><label htmlFor="date">Data do atendimento</label><input id="date" type="date" required min={localDate()} max={localDate(maxDate)} value={date} onChange={e=>{setDate(e.target.value);setTime('');}}/><fieldset><legend>Horários disponíveis</legend><div className="slots">{slots.map((slot:string)=><button type="button" key={slot} aria-pressed={time===slot} className={time===slot?'chosen':''} onClick={()=>setTime(slot)}>{slot}</button>)}</div>{slots.length===0 && <p className="empty-slots">Sem horários nesta data. Escolha outro dia.</p>}</fieldset><label htmlFor="name">Como podemos chamar você?</label><input id="name" autoComplete="given-name" maxLength={70} placeholder="Seu nome" value={name} required onChange={e=>setName(e.target.value)}/><div className="summary"><span>{service.name}<small>{service.minutes} min{time ? ` · ${time}` : ' · Selecione um horário'}</small></span><strong>{money(service.price)}</strong></div><button className="primary" disabled={!time || storageError}>Reservar horário</button><p className="form-note">Você pode cancelar em Minhas reservas.</p></form></div> : <section className="reservations-list"><div className="section-title"><span>Agenda</span><h2>Seus horários, organizados.</h2></div>{bookings.length===0 ? <div className="empty"><h3>Sua agenda está livre.</h3><p>Quando você reservar um horário, ele aparece aqui.</p><button className="primary" onClick={()=>setTab('reserve')}>Agendar meu primeiro horário</button></div> : [...bookings].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(b=><article className="booking" key={b.id}><div className="date-stamp"><strong>{b.date.slice(8)}</strong><span>{new Date(b.date+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'})}</span></div><div className="booking-copy"><h3>{services.find(s=>s.id===b.serviceId)?.name}</h3><p>{new Date(b.date+'T12:00:00').toLocaleDateString('pt-BR')} às {b.time} · {b.minutes} min</p><p>Reserva de {b.name}</p></div><button className="text-button" onClick={()=>{if(window.confirm('Cancelar esta reserva demonstrativa?')) cancel(b.id);}}>Cancelar reserva</button></article>)}</section>}
    </main><footer><span className="footer-brand">BarberStyle</span><span>Identidade clássica. Seu tempo em primeiro lugar.</span><span>Atividade 16 · SENAI</span></footer></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
