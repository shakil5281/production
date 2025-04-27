-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyExpense" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "operatorGeneral" INTEGER NOT NULL DEFAULT 0,
    "operatorOvertime" INTEGER NOT NULL DEFAULT 0,
    "helperGeneral" INTEGER NOT NULL DEFAULT 0,
    "helperOvertime" INTEGER NOT NULL DEFAULT 0,
    "cuttingGeneral" INTEGER NOT NULL DEFAULT 0,
    "cuttingOvertime" INTEGER NOT NULL DEFAULT 0,
    "finishingGeneral" INTEGER NOT NULL DEFAULT 0,
    "finishingOvertime" INTEGER NOT NULL DEFAULT 0,
    "qualityGeneral" INTEGER NOT NULL DEFAULT 0,
    "qualityOvertime" INTEGER NOT NULL DEFAULT 0,
    "staff" INTEGER NOT NULL DEFAULT 0,
    "cleaner" INTEGER NOT NULL DEFAULT 0,
    "loader" INTEGER NOT NULL DEFAULT 0,
    "ironInput" INTEGER NOT NULL DEFAULT 0,
    "totalExpense" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyExpenseRate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operatorGeneral" INTEGER NOT NULL DEFAULT 0,
    "operatorOvertime" INTEGER NOT NULL DEFAULT 0,
    "helperGeneral" INTEGER NOT NULL DEFAULT 0,
    "helperOvertime" INTEGER NOT NULL DEFAULT 0,
    "cuttingGeneral" INTEGER NOT NULL DEFAULT 0,
    "cuttingOvertime" INTEGER NOT NULL DEFAULT 0,
    "finishingGeneral" INTEGER NOT NULL DEFAULT 0,
    "finishingOvertime" INTEGER NOT NULL DEFAULT 0,
    "qualityGeneral" INTEGER NOT NULL DEFAULT 0,
    "qualityOvertime" INTEGER NOT NULL DEFAULT 0,
    "staff" INTEGER NOT NULL DEFAULT 0,
    "cleaner" INTEGER NOT NULL DEFAULT 0,
    "loader" INTEGER NOT NULL DEFAULT 0,
    "ironInput" INTEGER NOT NULL DEFAULT 0,
    "totalExpense" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyExpenseRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manpower" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staff" INTEGER NOT NULL DEFAULT 0,
    "operator" INTEGER NOT NULL DEFAULT 0,
    "helper" INTEGER NOT NULL DEFAULT 0,
    "ironInput" INTEGER NOT NULL DEFAULT 0,
    "cutting" INTEGER NOT NULL DEFAULT 0,
    "finishing" INTEGER NOT NULL DEFAULT 0,
    "quality" INTEGER NOT NULL DEFAULT 0,
    "cleaner" INTEGER NOT NULL DEFAULT 0,
    "loader" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manpower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" TEXT NOT NULL,
    "programCode" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "styleNo" TEXT NOT NULL,
    "orderQty" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReport" (
    "id" TEXT NOT NULL,
    "productionOrderId" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "lineNo" INTEGER NOT NULL,
    "dailyProduction" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "dollar" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfitLoss" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "earning" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,
    "variation" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfitLoss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashbook" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cashbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyExpense_date_key" ON "DailyExpense"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyExpenseRate_date_key" ON "DailyExpenseRate"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Manpower_date_key" ON "Manpower"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_styleNo_key" ON "ProductionOrder"("styleNo");

-- CreateIndex
CREATE INDEX "ProductionOrder_buyer_idx" ON "ProductionOrder"("buyer");

-- CreateIndex
CREATE INDEX "ProductionOrder_status_idx" ON "ProductionOrder"("status");

-- CreateIndex
CREATE INDEX "ProductionReport_productionOrderId_idx" ON "ProductionReport"("productionOrderId");

-- AddForeignKey
ALTER TABLE "ProductionReport" ADD CONSTRAINT "ProductionReport_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
