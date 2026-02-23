import { prisma } from "./prisma";

interface LogParams {
  userId: string;
  action: string;
  module: string;
  description?: string;
}

export const logActivity = async ({
  userId,
  action,
  module,
  description,
}: LogParams) => {
  await prisma.auditTrail.create({
    data: {
      userId,
      action,
      module,
      description,
    },
  });
};
