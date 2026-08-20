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
    // Bulk roster imports (2,000+ upserts in one array-form transaction) run
    // far longer than Prisma's default 5s timeout / 2s maxWait. The
    // synchronous better-sqlite3 adapter blocks the event loop, so the engine's
    // 5s timer cannot fire mid-batch — but the 2s maxWait CAN fail a second
    // concurrent import with P2028 ("Unable to start a transaction in the
    // given time."). Set generous defaults here (the one place that governs
    // batch transaction options) so a full-roster import, and any import that
    // has to queue behind one, completes instead of erroring.
    transactionOptions: {
      timeout: 120_000,
      maxWait: 30_000,
    },
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}