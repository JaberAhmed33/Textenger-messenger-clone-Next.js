import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await request.json();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });

    return NextResponse.json({
      msg: "updated done!",
      status: 201,
      updatedUser,
    });
  } catch (error: any) {
    console.log("delete conversation control", error);
    return new NextResponse("Internal Error in delete conversation control", {
      status: 500,
    });
  }
}
