import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



// PATCH: Update existing order
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();

        const {
          programCode,
          buyer,
          item,
          styleNo,
          orderQty,
          percentage,
          unitPrice,
          status,
        } = body;
    
        if (!id) {
          return NextResponse.json({ error: "ID is required to update the record" }, { status: 400 });
        }
    
        const updatedProductionOrder = await prisma.productionOrder.update({
          where: { id },
          data: {
            programCode,
            buyer,
            item,
            styleNo,
            orderQty,
            percentage,
            unitPrice,
            status,
          },
        });

        return NextResponse.json(updatedProductionOrder, { status: 200 });
    } catch (err) {
        console.error("[PATCH_ERROR]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



// DELETE: Delete a production order by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID is required to delete the record" }, { status: 400 });
    }

    const deletedOrder = await prisma.productionOrder.delete({
      where: { id },
    });

    return NextResponse.json(deletedOrder, { status: 200 });
  } catch (error) {
    console.error("[DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
