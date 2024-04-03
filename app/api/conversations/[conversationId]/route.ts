import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        },
      },
    });

        // Update all users that had the deleted conversation
  

    for (const user of existingConversation.users) {

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          conversations: {
            disconnect: {
              id: conversationId
            }
          },
          conversationIds: {
            set: user.conversationIds.filter(id => id !== conversationId)
          }
        }
      });

      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:delete', existingConversation);
      }
    }

    // existingConversation.users.forEach((user) => {
    //   if (user.email) {
    //     pusherServer.trigger(user.email, 'conversation:delete', existingConversation);
    //   }
    // });

    return NextResponse.json(deletedConversation)
  } catch (error) {
    return NextResponse.json(null);
  }
}