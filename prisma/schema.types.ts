import Prisma, { prisma } from "./prisma";

export { type TipoTransacao as TipoTransacaoType } from "@prisma/client";
export { TipoTransacao } from "@prisma/client";
export type TransacaoCreateBody = Prisma.Args<typeof prisma.transacao, 'create'>['data']
export type SaldoWhereUniqueInput = Prisma.Args<typeof prisma.saldo, 'update'>['where']
export type Extrato = {
    saldo: number
    limite: number
}
