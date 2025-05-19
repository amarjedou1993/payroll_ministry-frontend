import { Menu } from "@headlessui/react";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {children}
    </Menu>
  );
};

export default DropdownMenu;
