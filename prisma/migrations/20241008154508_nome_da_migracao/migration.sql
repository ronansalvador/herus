-- AlterTable
ALTER TABLE "StockChange" ADD COLUMN     "servicoId" INTEGER;

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockChange" ADD CONSTRAINT "StockChange_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
