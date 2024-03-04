import Prisma, { prisma } from "./prisma";

export const initDB = async () => {
    await prisma.$executeRawUnsafe("TRUNCATE TABLE clientes CASCADE;")
    await prisma.$executeRawUnsafe("TRUNCATE TABLE saldos CASCADE;")
    await prisma.$executeRawUnsafe("TRUNCATE TABLE transacoes CASCADE;")
    await prisma.cliente.createMany({
        data: [
            { idCliente: 1, nome: 'o barato sai caro', limite: 100000 },
            { idCliente: 2, nome: 'zan corp ltda', limite: 80000 },
            { idCliente: 3, nome: 'les cruders', limite: 1000000 },
            { idCliente: 4, nome: 'padaria joia de cocaia', limite: 10000000 },
            { idCliente: 5, nome: 'kid mais', limite: 500000 }
        ],
        skipDuplicates: true,
    })
    await prisma.saldo.createMany({
        data: [
            { idCliente: 1, valor: 0 },
            { idCliente: 2, valor: 0 },
            { idCliente: 3, valor: 0 },
            { idCliente: 4, valor: 0 },
            { idCliente: 5, valor: 0 }
        ],
        skipDuplicates: true,
    })
    await prisma.$executeRawUnsafe("TRUNCATE TABLE transacoes CASCADE;")
}
export default initDB;