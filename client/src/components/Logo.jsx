import { Link } from "react-router-dom";
import logo1 from "../assets/img/logo.png";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-1.5">
      <img src={logo1} alt="Mantios"/>
      <span className="text-[26px] leading-none tracking-tight">Mantios</span>
    </Link>
  );
}
