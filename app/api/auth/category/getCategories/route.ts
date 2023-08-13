import { NextResponse } from 'next/server';
import Category from '@/models/category';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await connectDB();

    const categories = await Category.find();

    if (!categories) {
      return NextResponse.json({ error: 'Categories do not exist' }, { status: 400 });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json({ error: 'An error occurred while fetching categories' }, { status: 500 });
  }
}