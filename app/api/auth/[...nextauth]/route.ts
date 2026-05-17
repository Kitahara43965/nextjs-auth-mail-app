import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import nodemailer from "nodemailer";
import { transporter } from "@/lib/mail";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isValid = verifyPassword(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            login_time_number: {
              increment: 1,
            },
          },
        });

        await transporter.sendMail({
          from: "no-reply@example.com",
          to: user.email,
          subject: "ログイン通知",
          text: `ログインしました: ${new Date().toISOString()}`,
        });

        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
