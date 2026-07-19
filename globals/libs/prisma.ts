import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Fail fast: a silent ":memory:" fallback would make a misconfigured
  // deployment look functional while losing every write on restart.
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Add it to .env (e.g. DATABASE_URL=\"file:./dev.db\")."
    );
  }

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}