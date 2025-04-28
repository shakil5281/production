import { NextResponse } from "next/server";
import { PDFDocument, rgb, degrees } from "pdf-lib"; // Ensure degrees is imported
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch production reports data
    const productionReports = await prisma.productionReport.findMany({
      include: { productionOrder: true },
      orderBy: {
        lineNo: 'asc', // Sort by lineNo ascending
      },
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

    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([792, 612]); // A4 size in landscape orientation
    page.setRotation(degrees(90)); // Rotate the page

    // Load a font for the PDF
    const fontPath = path.resolve("./assets/fonts/Arial-Regular.ttf");
    if (!fs.existsSync(fontPath)) {
      throw new Error("Font file not found at " + fontPath);
    }
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    const title = 'Daily Production Report';
    const date = `Date: ${new Date().toLocaleDateString('en-GB')}`;

    // Draw the title and date at the top of the page
    page.drawText(title, {
      x: 40,
      y: 750,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(date, {
      x: 40,
      y: 730,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // Set the column headers
    const headers = [
      "Line", "P/Cod", "Buyer", "Style No", "Order Qty", "Item", "Daily Target",
      "Daily Production", "Unit Price", "Total Price", "%", "Dollar", "Total Amount"
    ];

    const headerY = 700; // Start drawing headers below the title
    let xPos = 40; // Starting position for headers

    // Draw the column headers
    headers.forEach((header) => {
      page.drawText(header, {
        x: xPos,
        y: headerY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      xPos += 45; // Increase x position for next column
    });

    // Draw the rows of data
    let yPos = headerY - 20; // Start drawing data below the headers

    productionReports.forEach((report) => {
      xPos = 40; // Reset the x position for each row
      const row = [
        report.lineNo, report.productionOrder.programCode, report.productionOrder.buyer,
        report.productionOrder.styleNo, report.productionOrder.orderQty,
        report.productionOrder.item, 500, report.dailyProduction,
        report.productionOrder.unitPrice.toFixed(2), report.totalPrice.toFixed(2),
        report.productionOrder.percentage, report.dollar.toFixed(2),
        report.totalAmount.toFixed(0),
      ];

      row.forEach((value) => {
        page.drawText(String(value), {
          x: xPos,
          y: yPos,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
        xPos += 45; // Move to the next column
      });

      yPos -= 20; // Move down to the next row
    });

    // Draw the total row at the bottom
    xPos = 40; // Reset the x position for the totals row
    const totalsRow = [
      "Total", "", "", "", totals.dailyProduction, "", "", totals.dailyProduction, "",
      totals.totalPrice.toFixed(2), "", totals.dollar.toFixed(2), totals.totalAmount.toFixed(0)
    ];

    totalsRow.forEach((value) => {
      page.drawText(String(value), {
        x: xPos,
        y: yPos,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      xPos += 45; // Move to the next column
    });

    // Save the document
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to export to PDF" }, { status: 500 });
  }
}