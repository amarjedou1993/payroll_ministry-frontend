import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  children?: JSX.Element;
}

const Logo = ({ className, children }: LogoProps) => {
  return (
    <Link to="/dashboard" className={className}>
      {/* <img src={img} alt="Logo" /> */}
      {children}
    </Link>
  );
};

export default Logo;
