import { Menu } from "@headlessui/react";

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`w-full px-3 py-2 text-sm text-left rounded-md transition ${
            active ? "bg-gray-100" : ""
          } ${className}`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

export default DropdownMenuItem;
