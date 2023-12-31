import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
    const { name } = await request.json();

    await connectDB()
    try {
        const productFound = await Product.findOne({ name })

        if (productFound) {
            return NextResponse.json({ message: 'Product already exist' }, { status: 200 })
        }

        else {
            return NextResponse.json({ message: "Product not found" }, { status: 200 })

        }
    } catch (e) {
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 })

    }
} 