import { getUserById, updateUserProfile } from "@/services/user.service";

type ProfileUpdateBody = {
  name?: unknown;
  phone?: unknown;
  image?: unknown;
  address?: unknown;
};

export const getProfileController = async (userId: string) => {
  if (!userId) throw new Error("User ID missing");

  const user = await getUserById(userId);
  console.log("Fetched user in getProfileController:", user);

  if (!user) throw new Error("User not found");

  return user;
};

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

export const updateProfileController = async (
  userId: string,
  body: ProfileUpdateBody,
) => {
  if (!userId) throw new Error("Unauthorized");

  return await updateUserProfile(userId, {
    name: optionalString(body.name),
    phone: optionalString(body.phone),
    image: optionalString(body.image),
    address: optionalString(body.address),
  });
};
