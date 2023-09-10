import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
  const { id, name, price, images, category, stock, description } = await request.json();
  console.log(description)
  await connectDB()
 
  const filter = { _id: id};
  const update = {
    price: price,
    images: images,
    category: category,
    stock: stock,
    description: description,

  };

  try {
    await Product.findOneAndUpdate(filter, update);
    return NextResponse.json({ message: "Product created" }, { status: 200 })
  }
  catch {
    return NextResponse.json({ error: 'Unknown error: There has been a problem with your request.' }, { status: 400 })
  }
} 