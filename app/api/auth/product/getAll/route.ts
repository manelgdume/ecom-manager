import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await connectDB();

    const products = await Product.find();

    if (!products) {
      return NextResponse.json({ error: 'Products do not exist' }, { status: 400 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json({ error: 'An error occurred while fetching categories' }, { status: 500 });
  }
}