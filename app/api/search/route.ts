import { NextRequest } from "next/server";
import { handleSearch } from "@/controllers/search.controller";

export async function GET(req: NextRequest) {
  return handleSearch(req);
}
