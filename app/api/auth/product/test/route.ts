import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';


export async function POST(request: Request) {
    const { name } = await request.json();

    return NextResponse.json({ message: "test", name: name }, { status: 200 })

}