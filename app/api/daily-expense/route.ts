import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Expense rates
const RATES = {
  operatorGeneral: 487,
  operatorOvertime: 80,
  helperGeneral: 355,
  helperOvertime: 57,
  cuttingGeneral: 410,
  cuttingOvertime: 66,
  finishingGeneral: 420,
  finishingOvertime: 69,
  qualityGeneral: 410,
  qualityOvertime: 66,
  staff: 500, // Example rate for staff
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Extract values from the request body
    const {
      operatorGeneral = 0,
      operatorOvertime = 0,
      helperGeneral = 0,
      helperOvertime = 0,
      cuttingGeneral = 0,
      cuttingOvertime = 0,
      finishingGeneral = 0,
      finishingOvertime = 0,
      qualityGeneral = 0,
      qualityOvertime = 0,
      staff = 0,
    } = body;

    // Calculate total expense
    const totalExpense =
      operatorGeneral * RATES.operatorGeneral +
      operatorOvertime * RATES.operatorOvertime +
      helperGeneral * RATES.helperGeneral +
      helperOvertime * RATES.helperOvertime +
      cuttingGeneral * RATES.cuttingGeneral +
      cuttingOvertime * RATES.cuttingOvertime +
      finishingGeneral * RATES.finishingGeneral +
      finishingOvertime * RATES.finishingOvertime +
      qualityGeneral * RATES.qualityGeneral +
      qualityOvertime * RATES.qualityOvertime +
      staff * RATES.staff;

    // Create or update daily expense record
    const dailyExpense = await prisma.dailyExpense.upsert({
      where: { date: new Date(body.date) },
      update: {
        operatorGeneral,
        operatorOvertime,
        helperGeneral,
        helperOvertime,
        cuttingGeneral,
        cuttingOvertime,
        finishingGeneral,
        finishingOvertime,
        qualityGeneral,
        qualityOvertime,
        staff,
        totalExpense,
      },
      create: {
        date: new Date(body.date),
        operatorGeneral,
        operatorOvertime,
        helperGeneral,
        helperOvertime,
        cuttingGeneral,
        cuttingOvertime,
        finishingGeneral,
        finishingOvertime,
        qualityGeneral,
        qualityOvertime,
        staff,
        totalExpense,
      },
    });

    return NextResponse.json(dailyExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating daily expense:', error);
    return NextResponse.json({ error: 'Failed to create daily expense' }, { status: 500 });
  }
}





export async function GET() {
  try {
    const dailyExpenses = await prisma.dailyExpense.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(dailyExpenses, { status: 200 });
  } catch (error) {
    console.error('Error fetching daily expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch daily expenses' }, { status: 500 });
  }
}
