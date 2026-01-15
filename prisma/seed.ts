import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      name: "MCR Admin",
      username: "mcr_admin",
      password: "MCR_ADMIN_2026",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
