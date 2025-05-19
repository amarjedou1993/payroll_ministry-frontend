import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
}) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={`absolute left-0 mt-2 w-56 bg-white shadow-md rounded-md border focus:outline-none ${className}`}
      >
        {children}
      </Menu.Items>
    </Transition>
  );
};

export default DropdownMenuContent;
