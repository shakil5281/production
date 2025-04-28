import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
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
      orderBy: {
        lineNo: 'asc',
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Production Report');

    worksheet.columns = [
      { header: 'Line No', key: 'lineNo', width: 15 },
      { header: 'P/Cod', key: 'programCode', width: 20 },
      { header: 'Buyer', key: 'buyer', width: 25 },
      { header: 'Style No', key: 'styleNo', width: 25 },
      { header: 'Order Qty', key: 'orderQty', width: 15 },
      { header: 'Item', key: 'item', width: 15 },
      { header: 'Daily Target', key: 'dailyTarget', width: 20 },
      { header: 'Daily Production', key: 'dailyProduction', width: 20 },
      { header: 'Unit Price', key: 'unitPrice', width: 20 },
      { header: 'Total Price', key: 'totalPrice', width: 20 },
      { header: '%', key: 'percentage', width: 10 },
      { header: 'Dollar', key: 'dollar', width: 20 },
      { header: 'Total Amount', key: 'totalAmount', width: 20 },
    ];

    productionReports.forEach((report) => {
      worksheet.addRow({
        lineNo: report.lineNo,
        programCode: report.productionOrder.programCode,
        buyer: report.productionOrder.buyer,
        styleNo: report.productionOrder.styleNo,
        orderQty: report.productionOrder.orderQty,
        item: report.productionOrder.item,
        dailyTarget: 500, // replace with actual data if needed
        dailyProduction: report.dailyProduction,
        unitPrice: report.productionOrder.unitPrice,
        totalPrice: report.totalPrice,
        percentage: report.productionOrder.percentage,
        dollar: report.dollar,
        totalAmount: report.totalAmount,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=production_report.xlsx',
      },
    });
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return NextResponse.json({ error: 'Failed to export to Excel' }, { status: 500 });
  }
}
