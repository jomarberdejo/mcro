// import { prisma } from "./prisma";

// interface LogParams {
//   userId: string;
//   action: string;
//   module: string;
//   description?: string;
// }

// export const logActivity = async ({
//   userId,
//   action,
//   module,
//   description,
// }: LogParams) => {
//   await prisma.auditTrail.create({
//     data: {
//       userId,
//       action,
//       module,
//       description,
//     },
//   });
// };

// export const getAuditTrails = async (userId: string) => {
//   return await prisma.auditTrail.findMany({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//   });
// }
