"use client";

import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useConversation from "./../../hooks/useConversation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialConversations: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialConversations,
  users,
}) => {
  const session = useSession();
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { isOpen, conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return
    }

    pusherClient.subscribe(pusherKey);
    
    
    const newHandler = (conversation: FullConversationType) => {
      
      console.log("hi new");
      setConversations((prev) => {
        if (find(prev, {id: conversation.id})) {
          return prev;
        }

        return [...prev, conversation]
      })
    }   
    
    const updateHandler = (conversation: FullConversationType) => {
      console.log("hi update");

      setConversations((prev) => prev.map((prevConversation) => {
        if (prevConversation.id === conversation.id) {
          return {...prevConversation, messages: conversation.messages};
        }

        return prevConversation;
      }))
    }

    const deleteHandler = (conversation: FullConversationType) => {
      console.log("hi delete");

      setConversations((prev) => prev.filter((prevConversation) => {
        if (prevConversation.id !== conversation.id) {
          return prevConversation;
        }
      }))

      if (conversation.id === conversationId) {
        router.push('/conversations');
      }

    }

    pusherClient.bind("conversation:new", newHandler)
    pusherClient.bind("conversation:update", updateHandler)
    pusherClient.bind("conversation:delete", deleteHandler)

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler)
      pusherClient.unbind("conversation:update", updateHandler)
      pusherClient.unbind("conversation:delete", deleteHandler)
    }
  }, [pusherKey, conversationId, router])
  

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />

      <aside
        className={clsx(
          `
      fixed 
      inset-y-0 
      pb-20
      lg:pb-0
      lg:left-20 
      lg:w-80 
      lg:block
      overflow-y-auto 
      border-r 
      border-gray-200 
    `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div
            className="flex justify-between mb-4 pt-4"
            onClick={() => true}
          >
            <div className="text-2xl font-bold text-neutral-800">Messages</div>

            <div className="rounded-full p-2 bg-gray-300 cursor-pointer hover:opacity-75 transition" onClick={() => setIsModalOpen(true)}>
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversations.map((conversation) => (
            <ConversationBox
              key={conversation.id}
              data={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
