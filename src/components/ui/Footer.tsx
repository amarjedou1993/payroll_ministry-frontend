import { ReactNode } from "react";

interface FooterProps {
  children: ReactNode;
  className?: string;
}

export const Footer = ({ children, className }: FooterProps) => {
  return <footer className={className}>{children}</footer>;
};
