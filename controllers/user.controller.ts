import { getUserById, updateUserProfile } from "@/services/user.service";

export const getProfileController = async (userId: string) => {
  if (!userId) throw new Error("User ID missing");

  const user = await getUserById(userId);
  console.log("Fetched user in getProfileController:", user);

  if (!user) throw new Error("User not found");

  return user;
};

export const updateProfileController = async (userId: string, body: any) => {
  if (!userId) throw new Error("Unauthorized");

  return await updateUserProfile(userId, {
    name: body.name,
    phone: body.phone,
    image: body.image,
    bio: body.bio,
    address: body.address,
    dateOfBirth: body.dateOfBirth
      ? new Date(body.dateOfBirth)
      : null,
  });
};