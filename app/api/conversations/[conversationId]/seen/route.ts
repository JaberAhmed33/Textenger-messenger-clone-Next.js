import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;
    
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid id", {
        status: 400,
      });
    }

    const lastMessage = conversation.messages[conversation.messages.length -1 ];

    if (!lastMessage) {
      return NextResponse.json({msg: 'done!', status: 200, conversation})
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        seen: true,
        sender: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    })   
    
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json({msg: 'done!', status: 200, conversation})
    }

    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return  NextResponse.json({msg: 'updated message!', status: 200, updatedMessage});

  } catch (error: any) {
    console.log("Error from conversation by id seen route", error);
    return new NextResponse(
      "Internal Error in conversation by id seen control",
      {
        status: 500,
      }
    );
  }
}