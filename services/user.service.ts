import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

type UserProfileUpdateInput = {
  name?: string;
  phone?: string;
  image?: string;
  address?: string;
};

export const updateUserProfile = async (
  id: string,
  data: UserProfileUpdateInput,
) => {
  const updateData: Prisma.UserUpdateInput = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.address !== undefined) updateData.address = data.address;

  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};
