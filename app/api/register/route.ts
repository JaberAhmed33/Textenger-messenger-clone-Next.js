import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, name, password } = body;

  if (!email || !name || !password) {
    return new NextResponse("please fill all fields", { status: 400 });
  }

  try {

    const isUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    
      if (isUser) {
        return new NextResponse("user is already exists", { status: 400 });
      }
    
      const hashedPassword = await bcrypt.hash(password, 12);
    
      const user = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
      });
    
      console.log(user);
      
    
      return NextResponse.json({msg: "new user done!", status: 201, user });
    
  } catch (error: any) {
    console.log("REGISTRATION_ERROR" ,error);
    return new NextResponse("Internal Error", {status: 500} );
  }
}
