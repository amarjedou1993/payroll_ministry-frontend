import { Menu } from "@headlessui/react";

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  className,
}) => {
  return (
    <Menu.Button className={`flex items-center gap-2 ${className}`}>
      {children}
    </Menu.Button>
  );
};

export default DropdownMenuTrigger;
