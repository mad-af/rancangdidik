import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categories =
      searchParams.get('categories')?.split('.').filter(Boolean) || [];

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categories.length > 0) {
      where.category = { in: categories };
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      time: new Date().toISOString(),
      message: 'Products retrieved successfully',
      total_products: totalProducts,
      offset,
      limit,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, photo_url } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        photo_url: photo_url || null
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
