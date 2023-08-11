import { NextResponse } from 'next/server';
import User from '@/models/user';
import bcrypt from "bcrypt"
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
 
  const {name} = await request.json();
 
  await connectDB()
  const userFound = await User.findOne({ email })

  if (userFound) {
    return NextResponse.json({ error: 'User already exist' }, { status: 400 })
  }
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({
    email,
    name,
    password: hashedPassword
  })

  await user.save()

  return NextResponse.json({ message: "signup complete" }, { status: 200 })
}