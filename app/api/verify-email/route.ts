import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  try{
    const {searchParams}=new URL(req.url);
    const token=searchParams.get("token");

    if(!token){
      return NextResponse.json({message:"token is required"},{status:400});
    }
    const user=await prisma.user.findFirst({
      where:{verificationToken:token},

    });
    if(!user){
      return NextResponse.json({message:"Invalid token"},{status:400});
    }
    await prisma.user.update({
      where:{id:user.id},
      data:{
        isVerified:true,
        verificationToken:null,

      }

    });
    return NextResponse.json({message:"Email verified successfully"},{status:200});
  } catch (error) {
    return NextResponse.json({message:"Internal server error"},{status:500});

  }
}