-- CreateTable
CREATE TABLE "DailyOverTime" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "designation" TEXT NOT NULL,
    "worker" INTEGER NOT NULL,
    "OT" INTEGER NOT NULL,
    "TotalOT" INTEGER NOT NULL,

    CONSTRAINT "DailyOverTime_pkey" PRIMARY KEY ("id")
);
