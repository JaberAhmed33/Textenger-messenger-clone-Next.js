"use client";

import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  icon: any;
  href: string;
  onclick?: () => void;
  active?: boolean;
}

const MobileItem: React.FC<MobileItemProps> = ({
  icon: Icon,
  href,
  onclick,
  active,
}) => {
  const handleClick = () => onclick && onclick();

  return (
    <Link href={href} onClick={handleClick}
    className={clsx(`
    group
    flex
    gap-x-3
    p-4
    text-sm
    leading-6
    font-semibold
    w-full
    justify-center
    text-gray-500
    hover:text-black
    hover:bg-gray-100
    `,
    active && 'bg-gray-100 text-black'
    )}
    >
        <Icon className='h-6 w-6'/>

    </Link>
  );
};

export default MobileItem;

