import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Facebook,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // Allow any non-empty email/password for "Open" access
                const email = credentials.email as string;
                const password = credentials.password as string;

                if (email && password && password.length > 0) {
                    // Generate a consistent user profile based on email
                    const name = email.split('@')[0];
                    // Use a consistent avatar based on the name/email
                    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

                    return {
                        id: email, // Use email as ID for simplicity
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        email: email,
                        image: avatar
                    };
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
})
