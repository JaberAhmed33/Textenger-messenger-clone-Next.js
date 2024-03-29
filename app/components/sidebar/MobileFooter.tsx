"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

export default function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }
  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t lg:hidden">
      {routes.map((e) => (
        <MobileItem
          key={e.label}
          href={e.href}
          icon={e.icon}
          active={e.active}
          onclick={e.onClick}
        />
      ))}
    </div>
  );
}
