export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); // Parse query parameters
    const status = searchParams.get("status");

    if (!status) {
      return NextResponse.json(
        { error: "Status query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch production orders based on the provided status
    const productionOrders = await prisma.productionOrder.findMany({
      where: { status: status as OrderStatus },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(productionOrders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching production orders:", error);
    return NextResponse.json(
      { error: "Failed to get production order status", message: error.message },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, newStatus } = body;

    // Validate inputs
    if (!id || !newStatus) {
      return NextResponse.json(
        { error: "Both 'id' and 'newStatus' are required." },
        { status: 400 }
      );
    }

    // Update status in DB
    const updatedOrder = await prisma.productionOrder.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating production order status:", error);
    return NextResponse.json(
      { error: "Failed to update production order status", message: error.message },
      { status: 500 }
    );
  }
}
