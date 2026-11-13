import test from 'node:test';
import assert from 'node:assert/strict';
import { availableSlots, readBookings, localDate } from '../src/booking.mjs';
test('bloqueia sobreposição e preserva horário imediatamente após atendimento',()=>{
  const slots=availableSlots('2027-01-02',40,[{date:'2027-01-02',time:'09:00',minutes:70}],new Date('2027-01-01T12:00:00'));
  assert.ok(!slots.includes('09:00')); assert.ok(!slots.includes('10:00')); assert.ok(slots.includes('10:30')); assert.ok(!slots.includes('17:30'));
});
test('não oferece horários passados',()=>{ const slots=availableSlots('2027-01-02',30,[],new Date('2027-01-02T10:01:00')); assert.ok(!slots.includes('10:00')); assert.ok(slots.includes('10:30')); });
test('recusa armazenamento corrompido sem apagá-lo',()=>{assert.throws(()=>readBookings({getItem:()=>'{'}));assert.throws(()=>readBookings({getItem:()=>'{"x":1}'}));assert.deepEqual(readBookings({getItem:()=>null}),[]);});
test('data usa calendário local',()=>assert.equal(localDate(new Date(2027,0,2,23,59)),'2027-01-02'));
