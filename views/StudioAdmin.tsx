
import React, { useState } from 'react';
import { AppState, DayAvailability, TimeSlot } from '../types';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const StudioAdmin: React.FC<Props> = ({ state, updateState }) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('10:00');

  const updateStudioConfig = (updates: Partial<typeof state.studioConfig>) => {
    updateState({
      studioConfig: { ...state.studioConfig, ...updates }
    });
  };

  const toggleDay = (dayOfWeek: number) => {
    const updatedDays = state.studioConfig.daysAvailability.map(day =>
      day.dayOfWeek === dayOfWeek ? { ...day, enabled: !day.enabled } : day
    );
    updateStudioConfig({ daysAvailability: updatedDays });
  };

  const addTimeSlot = (dayOfWeek: number) => {
    const updatedDays = state.studioConfig.daysAvailability.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        const newSlot: TimeSlot = {
          id: `t${Date.now()}`,
          startTime: newSlotStart,
          endTime: newSlotEnd
        };
        return { ...day, timeSlots: [...day.timeSlots, newSlot] };
      }
      return day;
    });
    updateStudioConfig({ daysAvailability: updatedDays });
    setEditingDay(null);
  };

  const removeTimeSlot = (dayOfWeek: number, slotId: string) => {
    if (!confirm('Remover este horário?')) return;
    const updatedDays = state.studioConfig.daysAvailability.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        return { ...day, timeSlots: day.timeSlots.filter(s => s.id !== slotId) };
      }
      return day;
    });
    updateStudioConfig({ daysAvailability: updatedDays });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Configurações Gerais */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8">
        <h3 className="text-xl font-bold text-amber-200 mb-6 font-awards">Configurações Gerais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Preço da Sessão (£)</label>
            <input
              type="number"
              value={state.studioConfig.sessionPrice}
              onChange={(e) => updateStudioConfig({ sessionPrice: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Duração da Sessão (minutos)</label>
            <input
              type="number"
              value={state.studioConfig.sessionDuration}
              onChange={(e) => updateStudioConfig({ sessionDuration: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Intervalo entre Sessões (min)</label>
            <input
              type="number"
              value={state.studioConfig.slotInterval}
              onChange={(e) => updateStudioConfig({ slotInterval: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm text-zinc-400 mb-2">Chave Pública Stripe</label>
          <input
            type="text"
            value={state.studioConfig.stripePublicKey}
            onChange={(e) => updateStudioConfig({ stripePublicKey: e.target.value })}
            placeholder="pk_test_..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100"
          />
        </div>
      </div>

      {/* Disponibilidade por Dia */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8">
        <h3 className="text-xl font-bold text-amber-200 mb-6 font-awards">Disponibilidade Semanal</h3>
        
        <div className="space-y-4">
          {state.studioConfig.daysAvailability.map(day => (
            <div key={day.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleDay(day.dayOfWeek)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      day.enabled ? 'bg-amber-500' : 'bg-zinc-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      day.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                  <span className="text-lg font-medium text-zinc-100">{DAYS_OF_WEEK[day.dayOfWeek]}</span>
                </div>
                
                {day.enabled && (
                  <button
                    onClick={() => setEditingDay(editingDay === day.dayOfWeek ? null : day.dayOfWeek)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-bold uppercase"
                  >
                    + Adicionar Horário
                  </button>
                )}
              </div>

              {day.enabled && editingDay === day.dayOfWeek && (
                <div className="bg-zinc-950 p-4 rounded-lg mb-4 flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-400 mb-1">Início</label>
                    <input
                      type="time"
                      value={newSlotStart}
                      onChange={(e) => setNewSlotStart(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-400 mb-1">Fim</label>
                    <input
                      type="time"
                      value={newSlotEnd}
                      onChange={(e) => setNewSlotEnd(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100"
                    />
                  </div>
                  <button
                    onClick={() => addTimeSlot(day.dayOfWeek)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold"
                  >
                    Salvar
                  </button>
                </div>
              )}

              {day.enabled && day.timeSlots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {day.timeSlots.map(slot => (
                    <div key={slot.id} className="bg-zinc-950 p-3 rounded-lg flex items-center justify-between group">
                      <span className="text-sm text-zinc-300">{slot.startTime} - {slot.endTime}</span>
                      <button
                        onClick={() => removeTimeSlot(day.dayOfWeek, slot.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agendamentos */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8">
        <h3 className="text-xl font-bold text-amber-200 mb-6 font-awards">Agendamentos Recentes</h3>
        
        {state.bookings.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">Nenhum agendamento ainda</p>
        ) : (
          <div className="space-y-3">
            {state.bookings.slice(-10).reverse().map(booking => (
              <div key={booking.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-zinc-100">{booking.clientName}</p>
                  <p className="text-sm text-zinc-400">{booking.clientEmail} • {booking.clientPhone}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(booking.date).toLocaleDateString('pt-BR')} • {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400">£{booking.price}</p>
                  <p className={`text-xs ${booking.paid ? 'text-green-500' : 'text-red-500'}`}>
                    {booking.paid ? '✓ Pago' : '✗ Pendente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioAdmin;
