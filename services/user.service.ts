import { prisma } from "@/lib/prisma";

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserProfile = async (id: string, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};