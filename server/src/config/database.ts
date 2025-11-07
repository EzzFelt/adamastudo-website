import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Banco de dados conectado com sucesso');
  } catch (error) {
    console.error('Falha ao conectar o banco de dados:', error);
    process.exit(1);
  }
};