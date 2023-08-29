import { NextResponse } from 'next/server';
import Product from '@/models/product';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
    const { name } = await request.json();

    try {
        await connectDB(); // Asegúrate de usar await aquí

        const product = await Product.findOne({ name: name }); // Corregido

        if (!product) {
            return NextResponse.json({ error: 'Product does not exist' }, { status: 400 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);

        return NextResponse.json({ error: 'An error occurred while fetching products' }, { status: 500 });
    }
}