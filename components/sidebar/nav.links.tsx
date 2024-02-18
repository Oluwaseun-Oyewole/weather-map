"use client";
import Logo from "@/assets/Logo.svg";
import Logout from "@/assets/SignOff Icon.svg";
import Plus from "@/assets/plus.svg";
import { motion, stagger, useAnimate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { IRoutesType } from "./routes";

const staggerMenuItems = stagger(0.25, { startDelay: 0.4 });
function useMenuAnimation() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      ".fade",
      { opacity: [0, 0.5, 0.6, 0.8, 1] },
      {
        duration: 0.4,
        delay: staggerMenuItems,
      }
    );
  }, []);
  return scope;
}

type MenuProps = {
  linkArray: Array<IRoutesType>;
};

export const NavLink = ({ linkArray }: MenuProps) => {
  const scope = useMenuAnimation();

  return (
    <>
      <nav
        ref={scope}
        className="pt-5 max-w-[70%] mx-auto h-screen sticky left-0 top-0 flex items-center flex-col justify-between"
      >
        <div className="h-[55%] flex items-center flex-col justify-between">
          <ul>
            <motion.li whileHover={{ scale: 1.2 }} className="fade">
              <Link href="">
                <Image src={Logo} alt="icon" className="w-5" />
              </Link>
            </motion.li>
          </ul>

          <ul className="flex gap-10 flex-col ">
            {linkArray?.map(({ path, id, icon }: IRoutesType) => {
              return (
                <motion.li
                  key={`navLink${id}`}
                  whileHover={{ scale: 1.2 }}
                  className="fade"
                >
                  <Link href={path}>
                    <Image src={icon} alt="icon" className="w-5" />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="pb-10 flex items-center justify-center flex-col gap-8">
          <div className="bg-primary flex items-center justify-center p-3 rounded-full fade">
            <Image src={Plus} alt="icon" className="w-8 " />
          </div>
          <ul className="div">
            <motion.li whileHover={{ scale: 1.2 }} className="fade">
              <Link href="">
                <Image src={Logout} alt="icon" className="w-5" />
              </Link>
            </motion.li>
          </ul>
        </div>
      </nav>
    </>
  );
};