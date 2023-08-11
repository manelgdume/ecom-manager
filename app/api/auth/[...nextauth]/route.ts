import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcrypt"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',

            credentials: {
                email: { label: "Email", type: "email    ", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },

            async authorize(credentials,req){
                await connectDB();
                const userFound = await User.findOne({email:credentials?.email});

                if(!userFound) throw new Error("Invalid Credentials")

                const passwdMatch = await bcrypt.compare(credentials!.password,userFound.password);

                if(!passwdMatch) {
                    throw new Error("Invalid Credentials")
                }
                
                return userFound;
            }
        })
    ],
    
    callbacks:{
        jwt({account, token,user,profile,session}){
            if(user) token.user=user;
            console.log(token)
            return token
        },
        session({session, token}){
            session.user =  token.user as any ;
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/api/auth/error',
      }
})

export { handler as GET, handler as POST }