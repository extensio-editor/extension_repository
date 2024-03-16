"use server";

import { AccountButton } from "@/components/accountButton";
import { useState } from "react";
import { MainMenuBar } from "./mainMenuBar";

export async function MenuBar() {
    return (<div className="flex flex-row content-center items-center space-x-5">
        <MainMenuBar />
        <AccountButton />
    </div>);
}