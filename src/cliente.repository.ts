import { type TransacaoCreateBody, TipoTransacao, type Extrato } from "../prisma/schema.types"
import { prisma } from "../prisma/prisma"

export const salvaTransacao = (transacao: TransacaoCreateBody): Promise<Extrato> => {
  return prisma.$transaction(async (tx) => {
    const saldo = await tx.saldo.update({
      data: {
        valor: {
          increment: (transacao.tipo === TipoTransacao.d ? transacao.valor * -1 : transacao.valor)
        }
      },
      where: { idCliente: transacao.idCliente },
      select: {
        valor: true,
        cliente: {
          select: {
            limite: true
          }
        }
      }
    })
    if (saldo.valor < (saldo.cliente.limite * -1)) throw Error("Saldo negativo")
    await tx.transacao.create({
      data: transacao
    })
    return { limite: saldo.cliente.limite, saldo: saldo.valor} as Extrato
  })
}

export const buscaExtrato = (idCliente: number) => {
  return prisma.$transaction(async (tx) => {
    const saldo = await tx.saldo.findFirst({ 
      where: {
        idCliente
      },
      select: {
        valor: true,
        cliente: {
          select: {
            limite: true,
            transacoes: {
              select: {
                valor: true,
                tipo: true,
                descricao: true,
                realizadaEm: true,
              },
              orderBy: {
                realizadaEm: "desc"
              },
              take: 10
            }
          }
        }
      }
    })
    
    return {
      saldo: {
        total: saldo!.valor,
        limite: saldo!.cliente.limite,
        data_extrato: new Date()
      },
      ultimas_transacoes: saldo!.cliente.transacoes
    }
  })
}

export const ClienteRepository = {
  salvaTransacao,
  buscaExtrato
}

export default ClienteRepository