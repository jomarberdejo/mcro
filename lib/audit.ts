import { prisma } from "./prisma";

//////////////////////
// TYPES
//////////////////////

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "LOGIN"
  | "LOGOUT";

export type AuditModule =
  | "Birth Certificate"
  | "Death Certificate"
  | "Marriage Certificate"
  | "AML"
  | "Auth";

interface LogParams {
  userId: string;
  action: AuditAction;
  module: AuditModule;
  description?: string;
}

interface GetAuditTrailsParams {
  take?: number;
  skip?: number;
  userId?: string;
  module?: AuditModule;
  action?: AuditAction;
}

//////////////////////
// LOG ACTIVITY
//////////////////////

export const logActivity = async ({
  userId,
  action,
  module,
  description,
}: LogParams) => {
  try {
    await prisma.auditTrail.create({
      data: {
        userId,
        action,
        module,
        description,
      },
    });
  } catch (error) {
    // Never let audit logging break the main flow
    console.error("[AuditTrail] Failed to log activity:", error);
  }
};

//////////////////////
// QUERIES
//////////////////////

export const getAllAuditTrails = async ({
  take = 500,
  skip = 0,
  userId,
  module,
  action,
}: GetAuditTrailsParams = {}) => {
  return prisma.auditTrail.findMany({
    where: {
      ...(userId && { userId }),
      ...(module && { module }),
      ...(action && { action }),
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          office: true,
          role: true,
        },
      },
    },
  });
};

export const countAuditTrails = async ({
  userId,
  module,
  action,
}: Omit<GetAuditTrailsParams, "take" | "skip"> = {}) => {
  return prisma.auditTrail.count({
    where: {
      ...(userId && { userId }),
      ...(module && { module }),
      ...(action && { action }),
    },
  });
};

export const getAuditTrailsByUser = async (userId: string, take = 100) => {
  return prisma.auditTrail.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          office: true,
          role: true,
        },
      },
    },
  });
};
