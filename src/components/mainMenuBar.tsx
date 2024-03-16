"use client";

import Image from "next/image";
import { useState } from "react";

export function MainMenuBar() {
    const [isHamburgerActive, setHamburgerActive] = useState(false);

    const toggleHamburger = () => {
        setHamburgerActive(!isHamburgerActive);
    }

    return (<>
    <a href="/">
      <Image
        src="/extensio+repo+dark.svg"
        alt="Extension repository"
        className="hidden sm:block"
        width={75}
        height={24}
        priority
      />
    </a>
    <nav className="space-x-10 flex-grow hidden md:flex">
      <a href="/browse" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Browse extensions</a>
      <a href="/new" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Register new extension</a>
      <a href="https://docs.extensio.xyz/extensions" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Documentation</a>
    </nav>
    <div className="block md:hidden cursor-pointer">
        <Image
            src="/hamburger.png"
            alt="Extension repository"
            className="dark:invert"
            width={40}
            height={24}
            priority
            onClick={toggleHamburger}
        />
        <div id="onScreenMenu" className={isHamburgerActive ? "flex flex-col" : "hidden"}>
            <div className="w-screen h-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black" onClick={toggleHamburger}>
                <nav className="flex-grow flex-col md:flex text-center space-y-20 w-max h-max bg-slate-500 dark:bg-[#2a1f31] p-5 rounded-xl z-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <a href="/" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Home</a>
                    <br /><br />
                    <a href="/browse" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Browse extensions</a>
                    <br /><br />
                    <a href="/new" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Register new extension</a>
                    <br /><br />
                    <a href="https://docs.extensio.xyz/extensions" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Documentation</a>
                </nav>
            </div>
        </div>
    </div>
    <form action="/search" method="get">
      <input type="text" name="q" placeholder="Search" className="p-1 pl-2 rounded-xl opacity-70 self-end dark:bg-slate-700" autoComplete="off" autoCorrect="off" autoCapitalize="off"/>
    </form>
    </>);
}