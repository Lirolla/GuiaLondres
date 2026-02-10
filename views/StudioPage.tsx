
import React, { useState, useMemo } from 'react';
import { AppState, TimeSlot, Booking } from '../types';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const StudioPage: React.FC<Props> = ({ state, updateState }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState<'calendar' | 'form' | 'payment'>('calendar');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];

    // Padding inicial
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  // Verificar se um dia tem disponibilidade
  const isDayAvailable = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const dayOfWeek = date.getDay();
    const dayConfig = state.studioConfig.daysAvailability.find(d => d.dayOfWeek === dayOfWeek);
    return dayConfig?.enabled && dayConfig.timeSlots.length > 0 || false;
  };

  // Obter slots disponíveis para uma data
  const getAvailableSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const dayConfig = state.studioConfig.daysAvailability.find(d => d.dayOfWeek === dayOfWeek);
    if (!dayConfig || !dayConfig.enabled) return [];

    const dateStr = date.toISOString().split('T')[0];
    const bookedSlots = state.bookings
      .filter(b => b.date === dateStr && b.paid)
      .map(b => b.timeSlot.id);

    return dayConfig.timeSlots.filter(slot => !bookedSlots.includes(slot.id));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setStep('payment');
  };

  const handlePayment = () => {
    if (!selectedDate || !selectedSlot) return;

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedSlot,
      price: state.studioConfig.sessionPrice,
      paid: true, // Simulado - integrar Stripe depois
      stripePaymentId: `sim_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    updateState({ bookings: [...state.bookings, newBooking] });
    
    alert('Agendamento confirmado! Você receberá um email de confirmação.');
    setStep('calendar');
    setSelectedDate(null);
    setSelectedSlot(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-awards gold-gradient mb-4">
            ESTÚDIO FOTOGRÁFICO
          </h1>
          <p className="text-xl text-zinc-400">
            Agende sua sessão de fotos profissional
          </p>
          <p className="text-3xl font-bold text-amber-400 mt-6">
            £{state.studioConfig.sessionPrice} • {state.studioConfig.sessionDuration} minutos
          </p>
        </div>

        {step === 'calendar' && (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Calendário */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-zinc-800 rounded-lg"
                >
                  ←
                </button>
                <h3 className="text-xl font-bold">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-zinc-800 rounded-lg"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="text-center text-xs text-zinc-500 font-bold">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, idx) => {
                  const available = isDayAvailable(date);
                  const isSelected = date && selectedDate && 
                    date.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={idx}
                      disabled={!available}
                      onClick={() => date && available && handleDateSelect(date)}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${!date ? 'invisible' : ''}
                        ${!available ? 'text-zinc-700 cursor-not-allowed' : ''}
                        ${available && !isSelected ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : ''}
                        ${isSelected ? 'bg-amber-500 text-zinc-950 font-bold' : ''}
                      `}
                    >
                      {date?.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horários Disponíveis */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">
                {selectedDate ? (
                  <>Horários para {selectedDate.toLocaleDateString('pt-BR')}</>
                ) : (
                  'Selecione uma data'
                )}
              </h3>

              {selectedDate && availableSlots.length === 0 && (
                <p className="text-zinc-500 text-center py-8">Nenhum horário disponível</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className="bg-zinc-800 hover:bg-amber-600 border border-zinc-700 hover:border-amber-500 rounded-xl p-4 text-center transition-all"
                  >
                    <div className="font-bold">{slot.startTime}</div>
                    <div className="text-xs text-zinc-400">até {slot.endTime}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Telefone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100"
                />
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold mb-2">Resumo do Agendamento</h3>
                <p className="text-sm text-zinc-400">
                  Data: {selectedDate?.toLocaleDateString('pt-BR')}<br />
                  Horário: {selectedSlot?.startTime} - {selectedSlot?.endTime}<br />
                  Valor: £{state.studioConfig.sessionPrice}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('calendar')}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold"
                >
                  Continuar para Pagamento
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-6">Pagamento</h2>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 mb-6">
              <p className="text-4xl font-bold text-amber-400 mb-4">
                £{state.studioConfig.sessionPrice}
              </p>
              <p className="text-zinc-400">
                {formData.name}<br />
                {selectedDate?.toLocaleDateString('pt-BR')} • {selectedSlot?.startTime}
              </p>
            </div>
            
            <p className="text-sm text-zinc-500 mb-6">
              Integração com Stripe será ativada em breve.<br />
              Por enquanto, o agendamento é confirmado automaticamente.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold"
              >
                Voltar
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioPage;
