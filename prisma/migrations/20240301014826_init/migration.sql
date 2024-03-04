-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('c', 'd');

-- CreateTable
CREATE TABLE "clientes" (
    "idCliente" SERIAL NOT NULL,
    "nome" VARCHAR(256) NOT NULL,
    "limite" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,
    "realizada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saldos" (
    "id_cliente" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,

    CONSTRAINT "saldos_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateIndex
CREATE UNIQUE INDEX "saldos_id_cliente_key" ON "saldos"("id_cliente");

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldos" ADD CONSTRAINT "saldos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;
