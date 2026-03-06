import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding staff users...");

  const hashedPassword = await bcrypt.hash("@mcrostaff123", 10);

  const staffUsers = [
    {
      username: "mcro_staff1",
      name: "MCRO Staff 1",
      email: "mcrostaff1@lgucarigara.gov.ph",
    },
    {
      username: "mcro_staff2",
      name: "MCRO Staff 2",
      email: "mcrostaff2@lgucarigara.gov.ph",
    },
    {
      username: "mcro_staff3",
      name: "MCRO Staff 3",
      email: "mcrostaff3@lgucarigara.gov.ph",
    },
    {
      username: "mcro_staff4",
      name: "MCRO Staff 4",
      email: "mcrostaff4@lgucarigara.gov.ph",
    },
    {
      username: "mcro_staff5",
      name: "MCRO Staff 5",
      email: "mcrostaff5@lgucarigara.gov.ph",
    },
    {
      username: "mcro_staff6",
      name: "MCRO Staff 6",
      email: "mcrostaff6@lgucarigara.gov.ph",
    },
  ];

  for (const staff of staffUsers) {
    const user = await prisma.user.upsert({
      where: { username: staff.username },
      update: {
        username: staff.username,
        password: hashedPassword,
        name: staff.name,
      },
      create: {
        username: staff.username,
        password: hashedPassword,
        name: staff.name,
        email: staff.email,
        office: "MCRO",
        role: "STAFF",
      },
    });

    console.log(`✅ Staff user created: ${user.username} (${user.name})`);
  }

  console.log("\n📝 Staff Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  staffUsers.forEach((s, i) => {
    console.log(`Staff ${i + 1}:`);
    console.log(`  Username: ${s.username}`);
    console.log(`  Password: @mcrostaff123`);
    console.log("  ─────────────────────────────────");
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding staff users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Staff credentials (all share the same password):
// Usernames: mcro_staff1 → mcro_staff6
// Password:  @mcrostaff123