"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import NavLink from "react-bootstrap/esm/NavLink";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.includes(href) ? "active" : "";

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link}
          href={`/Account/${link}`}
          id={`wd-account-nav-${link}`}
          className={`list-group-item text-danger border-0 ${isActive(`/Account/${link}`)}`}
        >
          {link}
        </Link>
      ))}
           {currentUser && currentUser.role === "ADMIN" && (
       <NavLink as={Link} href={`/Account/Users`}  active={pathname.endsWith('Users')}> Users </NavLink> )}
      </div>
    );
  }
