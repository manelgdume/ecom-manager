import { NextResponse } from 'next/server';
import Category from '@/models/category';
import bcrypt from "bcrypt"
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    await connectDB()
    const categoryFound = await Category.findOne({ name })

    if (categoryFound) {
      return NextResponse.json({ message: 'Category already exist' }, { status: 200 })
    }

    const category = new Category({
      name: name,
    })

    await category.save()

    return NextResponse.json({ message: "Category added" }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ error: "Unknown error: " }, { status: 400 })

  }
}
