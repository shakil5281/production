import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date');

  try {
    let whereClause = {};

    if (dateParam) {
      const inputDate = new Date(dateParam);
      const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

      whereClause = {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    }

    const productionReports = await prisma.productionReport.findMany({
      where: whereClause,
      include: { productionOrder: true },
    });

    // Calculate totals
    const totals = productionReports.reduce(
      (acc, report) => {
        acc.dailyProduction += report.dailyProduction || 0;
        acc.totalPrice += report.totalPrice || 0;
        acc.dollar += report.dollar || 0;
        acc.totalAmount += report.totalAmount || 0;
        return acc;
      },
      {
        dailyProduction: 0,
        totalPrice: 0,
        dollar: 0,
        totalAmount: 0,
      }
    );

    return NextResponse.json(
      {
        data: productionReports,
        totals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching production reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production reports' },
      { status: 500 }
    );
  }
}




// POST: Create a new production report
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productionOrderId, dailyProduction, lineNo, date } = body;

    if (!productionOrderId || !dailyProduction) {
      return NextResponse.json({ error: "ProductionOrderId and dailyProduction are required" }, { status: 400 });
    }

    // Fetch related ProductionOrder to access unitPrice and percentage
    const productionOrder = await prisma.productionOrder.findUnique({
      where: { id: productionOrderId },
    });

    if (!productionOrder) {
      return NextResponse.json({ error: "ProductionOrder not found" }, { status: 404 });
    }

    // Calculate values
    const totalPrice = dailyProduction * productionOrder.unitPrice;
    const dollar = totalPrice * (productionOrder.percentage / 100);
    const totalAmount = dollar * 115;

    // Create ProductionReport
    const newProductionReport = await prisma.productionReport.create({
      data: {
        date,
        lineNo,
        productionOrderId,
        dailyProduction,
        totalPrice,
        dollar,
        totalAmount,
      },
    });

    return NextResponse.json(newProductionReport, { status: 201 });
  } catch (error) {
    console.error("Error creating production report:", error);
    return NextResponse.json({ error: "Failed to create production report" }, { status: 500 });
  }
}

