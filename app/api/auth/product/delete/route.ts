import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';


export async function DELETE(request: Request) {
  const { id } = await request.json();

  await connectDB()
  const productFound = await Product.findOne({_id: id })

  if (!productFound) {
    return NextResponse.json({ error: 'Product doesnt exist' }, { status: 400 })
  }
 
  try {
    await productFound.deleteOne()
    return NextResponse.json({ message: "product deleted" }, { status: 200 })
  }
  catch {
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 })
  }
} 