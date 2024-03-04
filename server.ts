import ClienteService from './src/cliente.service'
import initDB from './prisma/init-db'
import { type TransacaoCreateBody } from "./prisma/schema.types"


const POST_CLIENTE = /\/clientes\/(\d+)\/transacoes/;
const EXTRATO_PATH = /\/clientes\/(\d+)\/extrato/;

initDB();

function salvaTransacao(req: Request, url: URL): Response | Promise< Response > {
  return req.json().then((transacao: TransacaoCreateBody) => {
    transacao.idCliente = +(url.pathname.match(POST_CLIENTE) || [])[1];
    return ClienteService.salvaTransacao(transacao)
      .then((data) => new Response(JSON.stringify(data)))
      .catch(e => {
        if (["Saldo negativo", "Inconsistencia"].includes(e.message) ) {
          return new Response(e, { status: 422 })
        }
        console.error(e)
        return new Response(e, { status: 500 });
      });
  });
}

function buscaExtrato(req: Request, url: URL): Response | Promise< Response > {
  const idCliente = +(url.pathname.match(EXTRATO_PATH) || [])[1];
   
    return ClienteService.buscaExtrato(idCliente)
      .then((data) => new Response(JSON.stringify(data)))
      .catch(e => {
        if (e.message === "Cliente não encontrado") return new Response(e, { status: 404 });
        return new Response(e, { status: 500 });
      });
}

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (req.method === "POST" && POST_CLIENTE.test(url.pathname)) {
      return salvaTransacao(req, url)
    }
    if (req.method === "GET" && EXTRATO_PATH.test(url.pathname)) {
      return buscaExtrato(req, url)
    }
    return new Response("404!");
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});
