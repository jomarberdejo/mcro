import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


async function main() {
  console.log("🌱 Seeding database...");

  // Create single admin user for MCRO
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "MCRO Administrator",
      email: "mcro@lgucarigara.gov.ph",
      office: "MCRO",
    },
  });

  console.log("✅ MCRO Admin user created:", {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    office: admin.office,
  });

  console.log("\n📝 Login credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("MCRO Admin:");
  console.log("  Username: admin");
  console.log("  Password: admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
