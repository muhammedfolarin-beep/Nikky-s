import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendLoginConfirmationEmail } from "@/lib/mail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase().trim(),
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name || user.email?.split("@")[0] || "Client",
          email: user.email,
          image: user.image,
          role: user.role || "USER",
        };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
              },
            },
            profile(profile) {
              // Extract best name from Google profile or fallback to Gmail username before @
              const cleanEmail = profile.email?.toLowerCase().trim() || "";
              const derivedName = profile.name || 
                (profile.given_name ? `${profile.given_name} ${profile.family_name || ""}`.trim() : "") || 
                (cleanEmail ? cleanEmail.split("@")[0] : "Client");

              return {
                id: profile.sub,
                name: derivedName,
                email: cleanEmail,
                image: profile.picture,
                role: "USER",
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || "USER";
        token.email = user.email?.toLowerCase().trim() || token.email;
        token.name = user.name || (token.email ? token.email.split("@")[0] : "Client");
        token.picture = user.image || (profile as any)?.picture || token.picture;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role || "USER";
        session.user.name = (token.name as string) || (session.user.email ? session.user.email.split("@")[0] : "Client");
        session.user.email = (token.email as string) || session.user.email;
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      if (user?.email) {
        const cleanEmail = user.email.toLowerCase().trim();
        const googleName = user.name || (profile as any)?.name || cleanEmail.split("@")[0];
        const googleImage = user.image || (profile as any)?.picture;

        // Ensure database record has the user's Google name and photo
        if (account?.provider === "google") {
          try {
            await prisma.user.updateMany({
              where: { email: cleanEmail },
              data: {
                name: googleName,
                ...(googleImage ? { image: googleImage } : {}),
              },
            });
          } catch (err) {
            console.warn("[Auth] Syncing Google user name error:", err);
          }
        }

        // Send email confirmation & security notice to the exact Gmail used for sign in
        sendLoginConfirmationEmail({
          to: cleanEmail,
          name: googleName,
          timestamp: new Date(),
        }).catch((err) => {
          console.warn("[Auth] Login confirmation email error:", err);
        });
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "f63c0a4e7e8b91c2d5a3f4e1b8c7d6a5e2f1b0c9d8a7b6c5d4e3f2a1b0c9d8e7",
};
