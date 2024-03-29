import React from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
}) => {
  
  return (
    <button
      disabled={disabled}
      className={`inline-flex
       justify-center
        w-full
         rounded-md
          bg-white
           px-4
            py-2
             text-gray-500
              shadow-sm
              ring-1
              ring-inset
              ring-gray-300
              hover:bg-gray-50
              focus:outline-offset-0
              ${disabled && "cursor-not-allowed"}
              `}
      type="button"
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
