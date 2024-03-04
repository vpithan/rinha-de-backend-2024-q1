import { type TransacaoCreateBody, TipoTransacao, type Extrato } from "../prisma/schema.types"
import { prisma } from "../prisma/prisma"

export const salvaTransacao = (transacao: TransacaoCreateBody): Promise<Extrato> => {
  return prisma.$transaction(async (tx) => {
    const tx_transacao = tx.transacao.create({
      data: transacao
    })
    
    const saldo = tx.saldo.update({
      data: {
        valor: {
          increment: (transacao.tipo === TipoTransacao.d ? transacao.valor * -1 : transacao.valor)
        }
      },
      where: { idCliente: transacao.idCliente },
    })
    const cliente = tx.cliente.findFirst({
      where: {
        idCliente: transacao.idCliente
      }
    })
    if ((await saldo).valor < ((await cliente)!.limite * -1)) throw Error("Saldo negativo")
    await tx_transacao
    return { limite: (await cliente)!.limite, saldo: (await saldo).valor} as Extrato
  })
}

export const buscaExtrato = (idCliente: number) => {
  const where = { idCliente };
  return prisma.$transaction(async (tx) => {
    const saldo = tx.saldo.findFirst({ where })
    const cliente = tx.cliente.findFirst({ where })
    const transacoes = tx.transacao.findMany({
      select: {
        valor: true,
        tipo: true,
        descricao: true,
        realizadaEm: true,
      },
      where,
      orderBy: {
        realizadaEm: "desc"
      },
      take: 10
    })
    return {
      saldo: {
        total: (await saldo)!.valor,
        limite: (await cliente)!.limite,
        data_extrato: new Date()
      },
      ultimas_transacoes: await transacoes
    }
  })
}

export const ClienteRepository = {
  salvaTransacao,
  buscaExtrato
}

export default ClienteRepository