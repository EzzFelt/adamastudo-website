import type { Response } from 'express';
import { prisma } from '../config/database.js';
import type { AuthRequest } from '../middleware/auth.js';

// Validar disponibilidade de horário
const isTimeSlotAvailable = async (
  scheduledDate: Date,
  serviceDuration: number,
  excludeBookingId?: string
): Promise<boolean> => {
  const startTime = new Date(scheduledDate);
  const endTime = new Date(startTime.getTime() + (serviceDuration + 40) * 60000); // duração + 40min intervalo

  const conflictingBookings = await prisma.booking.findMany({
    where: {
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      scheduledDate: {
        gte: new Date(startTime.getTime() - 24 * 60 * 60 * 1000), // 1 dia antes
        lte: new Date(startTime.getTime() + 24 * 60 * 60 * 1000), // 1 dia depois
      },
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
    include: {
      service: true,
    },
  });

  for (const booking of conflictingBookings) {
    const bookingStart = new Date(booking.scheduledDate);
    const bookingEnd = new Date(
      bookingStart.getTime() + (booking.service.duration + 40) * 60000
    );

    // Verificar sobreposição
    if (
      (startTime >= bookingStart && startTime < bookingEnd) ||
      (endTime > bookingStart && endTime <= bookingEnd) ||
      (startTime <= bookingStart && endTime >= bookingEnd)
    ) {
      return false;
    }
  }

  return true;
};

// Validar limite diário de horas
const validateDailyLimit = async (scheduledDate: Date, serviceDuration: number): Promise<boolean> => {
  const dayOfWeek = scheduledDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Domingo ou Sábado
  const maxMinutes = isWeekend ? 4 * 60 : 11 * 60; // 4h ou 11h

  const startOfDay = new Date(scheduledDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(scheduledDate);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      scheduledDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
    include: {
      service: true,
    },
  });

  const totalMinutes = bookings.reduce((acc: number, booking: any) => {
    return acc + booking.service.duration + 40; // duração + intervalo
  }, 0);

  return (totalMinutes + serviceDuration + 40) <= maxMinutes;
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, scheduledDate, address, notes } = req.body;
    const userId = req.user!.userId;

    // Buscar serviço
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const bookingDate = new Date(scheduledDate);

    // Validar disponibilidade
    const isAvailable = await isTimeSlotAvailable(bookingDate, service.duration);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Horário não disponível' });
    }

    // Validar limite diário
    const withinLimit = await validateDailyLimit(bookingDate, service.duration);
    if (!withinLimit) {
      return res.status(400).json({ error: 'Limite diário de horas atingido' });
    }

    // Criar agendamento
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        userId,
        scheduledDate: bookingDate,
        address,
        notes,
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      booking,
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
      },
      orderBy: { scheduledDate: 'asc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

export const getWeeklySchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const bookings = await prisma.booking.findMany({
      where: {
        scheduledDate: {
          gte: start,
          lt: end,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar cronograma:', error);
    res.status(500).json({ error: 'Erro ao buscar cronograma' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduledDate, address, notes, status, modificationNote } = req.body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Se alterar data, validar novamente
    if (scheduledDate) {
      const newDate = new Date(scheduledDate);
      const isAvailable = await isTimeSlotAvailable(
        newDate,
        existingBooking.service.duration,
        id
      );
      
      if (!isAvailable) {
        return res.status(400).json({ error: 'Novo horário não disponível' });
      }

      const withinLimit = await validateDailyLimit(newDate, existingBooking.service.duration);
      if (!withinLimit) {
        return res.status(400).json({ error: 'Limite diário de horas atingido' });
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        address,
        notes,
        status,
        wasModified: true,
        modificationNote,
        clientNotified: false, // Resetar para mostrar pop-up
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.json({
      message: 'Agendamento atualizado com sucesso',
      booking,
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Cliente só pode cancelar seus próprios agendamentos
    if (!isAdmin && booking.userId !== userId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    // Cliente só pode cancelar com 24h de antecedência
    if (!isAdmin) {
      const now = new Date();
      const scheduledDate = new Date(booking.scheduledDate);
      const hoursDifference = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        return res.status(400).json({ 
          error: 'Cancelamento deve ser feito com pelo menos 24h de antecedência' 
        });
      }
    }

    await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason,
      },
    });

    res.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};

export const markAsNotified = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.booking.update({
      where: { id },
      data: { clientNotified: true },
    });

    res.json({ message: 'Marcado como notificado' });
  } catch (error) {
    console.error('Erro ao marcar como notificado:', error);
    res.status(500).json({ error: 'Erro ao marcar como notificado' });
  }
};

export const getModifiedBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        wasModified: true,
        clientNotified: false,
      },
      include: {
        service: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar modificações:', error);
    res.status(500).json({ error: 'Erro ao buscar modificações' });
  }
};

export const getAllBookingsHistory = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};