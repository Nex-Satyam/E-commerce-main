import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getProfileController,
  updateProfileController,
} from "@/controllers/user.controller";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in GET /api/user/profile:", session);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getProfileController(session.user.id);

    return Response.json(user);
  } catch (error: unknown) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Received profile update request for user:", session);

    const body = await req.json();

    const updatedUser = await updateProfileController(
      session.user.id,
      body
    );
    return Response.json(updatedUser);
  } catch (error: unknown) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
