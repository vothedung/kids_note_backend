/**
 * Local dev seed script. Run with `npm run prisma:seed` against a live
 * Postgres instance. Currently a no-op placeholder — extend with fixture
 * data (a demo family, child, and a few records) as needed.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed: no fixtures defined yet.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
