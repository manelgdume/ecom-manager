import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
    const { id } = await request.json();

    await connectDB()
    try {
        console.log(id)
        const productFound = await Product.findOne({ _id: id })
        console.log(productFound)
        if (productFound) {
            return NextResponse.json({ productFound}, { status: 200 })
        }

        else {
            return NextResponse.json({ message: "Product not found" }, { status: 200 })

        }
    } catch (e) {
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 })

    }
} 