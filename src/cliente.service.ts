import { type TransacaoCreateBody } from "../prisma/schema.types"
import ClienteRepository from "./cliente.repository"

export const salvaTransacao = async (transacao: TransacaoCreateBody): Promise<any> => {
    if (!transacao.descricao
        || transacao.descricao.length < 1
        || transacao.descricao.length > 10
        || !["d" , "c"].includes(transacao.tipo)
        || !Number.isInteger(transacao.valor)
        || transacao.valor < 0
    ) {
        throw Error("Inconsistencia")
    }
    if (!transacao.idCliente || transacao.idCliente > 5) {
        throw Error("Cliente não encontrado")
    }
    return ClienteRepository.salvaTransacao(transacao);
}

export const buscaExtrato = async (idCliente: number) => {
    if (!idCliente || idCliente > 5) {
        throw Error("Cliente não encontrado")
    }
    return ClienteRepository.buscaExtrato(idCliente);
}

export const ClienteService = {
    salvaTransacao,
    buscaExtrato,
}
export default ClienteService