"use server";

import { getServerSession } from "next-auth/next"
import authOptions from "@/../lib/auth";

export async function AccountButton() {
    const session = await getServerSession(authOptions);
    const signedIn = !!session as boolean;

    if (signedIn) {
        return <a href="/api/auth/signout" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Sign out</a>
    } else {
        return <a href="/api/auth/signin" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Sign in</a>
    }
}