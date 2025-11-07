import type { Response } from 'express';
import { prisma } from '../config/database';
import type { AuthRequest } from '../middleware/auth';

export const getAllServices = async (_req: AuthRequest, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, duration, warranty, includes, image } = req.body;

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price,
        duration: parseInt(duration),
        warranty,
        includes,
        image,
      },
    });

    res.status(201).json({
      message: 'Serviço criado com sucesso',
      service,
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, warranty, includes, image } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        price,
        duration: parseInt(duration),
        warranty,
        includes,
        image,
      },
    });

    res.json({
      message: 'Serviço atualizado com sucesso',
      service,
    });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
};