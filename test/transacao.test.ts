import { expect, test } from "bun:test";
import {Extrato, TransacaoCreateBody} from "../prisma/schema.types"

test("Cliente inexistente não deve ser aceito", async() => {
  const transacao: TransacaoCreateBody = { 
    valor: 1000,
    tipo: "c",
    descricao: "descricao",
    idCliente: 123
  }

  const text = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/123/transacoes`,
    {
        method: "POST",
        body: JSON.stringify(transacao)
    }
  ).then((resp) => resp.text());
  expect(text).toBe('Error: Cliente não existe');
});

test("Saldo não deve ser menor que o limite", async() => {
  const transacao: TransacaoCreateBody = { 
    valor: 10000000,
    tipo: "d",
    descricao: "descricao",
    idCliente: 1
  }

  const text = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/${transacao.idCliente}/transacoes`,
    {
        method: "POST",
        body: JSON.stringify(transacao)
    }
  ).then((resp) => resp.status);
  expect(text).toBe(422);
});

test("Extrato deve ser -50000", async() => {
  const transacao: TransacaoCreateBody = { 
    valor: 50000,
    tipo: "d",
    descricao: "descricao",
    idCliente: 1
  }

  const extrato = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/${transacao.idCliente}/transacoes`,
    {
        method: "POST",
        body: JSON.stringify(transacao)
    }
  ).then((resp) => {
    return resp.json()
  });
  expect(extrato.saldo).toBe(-50000);
});

test("Deve retornar extrato", async() => {
  const extrato = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/1/extrato`,
  ).then((resp) => {
    return resp.json()
  });
  expect(extrato.saldo.total).toBeInteger();
  expect(extrato.ultimas_transacoes).toBeDefined()
});

test("Deve retornar 404 para extrato", async() => {
  const statusCode = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/1111/extrato`,
  ).then((resp) => {
    return resp.status
  });
  expect(statusCode).toBe(404)
});

test("422 sem descricao", async() => {
  const transacao: TransacaoCreateBody = { 
    valor: 50000,
    tipo: "d",
    descricao: "",
    idCliente: 1
  }

  const statusCode = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/${transacao.idCliente}/transacoes`,
    {
        method: "POST",
        body: JSON.stringify(transacao)
    }
  ).then((resp) => {
    return resp.status
  });
  expect(statusCode).toBe(422)
});

test("422 tipo diferente", async() => {
  const transacao = { 
    valor: 50000,
    tipo: "f",
    descricao: "teste 12",
    idCliente: 1
  }

  const statusCode = await fetch(
    `localhost:${process.env.NODE_PORT ?? 3000}/clientes/${transacao.idCliente}/transacoes`,
    {
        method: "POST",
        body: JSON.stringify(transacao)
    }
  ).then((resp) => {
    return resp.status
  });
  expect(statusCode).toBe(422)
});