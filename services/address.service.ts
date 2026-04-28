import { prisma } from "@/lib/prisma";

export const addAddress = async ({
  userId,
  fullName,
  phone,
  line1,
  line2,
  city,
  state,
  pincode,
  label,
  isDefault,
}: {
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
  isDefault?: boolean;
}) => {
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }
  console.log("Adding address for user:", userId, { fullName, phone, line1, line2, city, state, pincode, label, isDefault });
  return await prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      label: label || "Home",
      isDefault: isDefault || false,
    },
  });
};

export const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });
};
