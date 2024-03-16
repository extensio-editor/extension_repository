import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/../lib/prisma';
import type { Adapter } from 'next-auth/adapters';

const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma) as Adapter,
}

export default authOptions;
