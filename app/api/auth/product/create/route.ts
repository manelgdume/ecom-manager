import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
  const { name, price, images, category, stock, description } = await request.json();

  await connectDB()
  const productFound = await Product.findOne({ name })

  if (productFound) {
    return NextResponse.json({ error: 'Product already exist' }, { status: 400 })
  }

  const product = new Product({
    name,
    price,
    images,
    category,
    stock,
    description
  })

  try {
    await product.save()
    return NextResponse.json({ message: "product created" }, { status: 200 })
  }
  catch {
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 })
  }
} 