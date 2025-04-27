import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // তোমার prisma client


export async function GET(req: NextRequest) {
    try {
      const overTimes = await prisma.dailyOverTime.findMany({
        orderBy: {
          date: "desc", // লেটেস্ট তারিখ আগে দেখাবে
        },
      });
  
      return NextResponse.json(overTimes, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
  }


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { date,designation, worker, OT } = body
        // Calculate TotalOT
        const TotalOT = OT * worker;

        // Save to database
        const newOverTime = await prisma.dailyOverTime.create({
            data: {
                date: new Date(date),
                designation,
                worker,
                OT,
                TotalOT,
            },
        });

        return NextResponse.json(newOverTime, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
