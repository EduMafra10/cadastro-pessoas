const formularioBusca = document.querySelector("#formulario-busca");
const campoCpf = document.querySelector("#cpf");
const botaoBuscar = document.querySelector("#botao-buscar");
const resultados = document.querySelector("#resultados");
const mensagem = document.querySelector("#mensagem");

let emRequisicao = false;

function exibirMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function definirCarregamento(carregando) {
  emRequisicao = carregando;
  botaoBuscar.disabled = carregando;

  const botoesExcluir = resultados.querySelectorAll("button");

  for (const botao of botoesExcluir) {
    botao.disabled = carregando;
  }
}

function mostrarPessoas(pessoas) {
  for (const pessoa of pessoas) {
    const cartao = document.createElement("article");
    cartao.className = "formulario";

    const titulo = document.createElement("h2");
    titulo.textContent = `${pessoa.nome} ${pessoa.sobrenome}`;

    cartao.appendChild(titulo);

    const detalhes = [
      `ID: ${pessoa.id}`,
      `CPF: ${pessoa.cpf}`,
      `E-mail: ${pessoa.email}`
    ];

    for (const detalhe of detalhes) {
      const paragrafo = document.createElement("p");
      paragrafo.textContent = detalhe;
      cartao.appendChild(paragrafo);
    }

    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao botao-perigo";
    botaoExcluir.textContent = "Excluir cadastro";

    botaoExcluir.addEventListener("click", function () {
      excluirPessoa(pessoa, cartao);
    });

    acoes.appendChild(botaoExcluir);
    cartao.appendChild(acoes);
    resultados.appendChild(cartao);
  }
}

formularioBusca.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  if (emRequisicao) {
    return;
  }

  const cpf = campoCpf.value.trim();

  resultados.replaceChildren();
  definirCarregamento(true);
  exibirMensagem("Buscando pessoa...");

  try {
    const resposta = await fetch(
      `/api/pessoas?cpf=${encodeURIComponent(cpf)}`
    );

    if (!resposta.ok) {
      throw new Error("O servidor não conseguiu consultar o cadastro.");
    }

    const pessoas = await resposta.json();

    if (pessoas.length === 0) {
      exibirMensagem("Nenhuma pessoa encontrada com esse CPF.");
      return;
    }

    mostrarPessoas(pessoas);
    exibirMensagem("Confira os dados antes de excluir um cadastro.");
  } catch (erro) {
    exibirMensagem(
      "Não foi possível buscar. Verifique a conexão com o servidor e tente novamente.",
      "erro"
    );

    console.error("Erro ao buscar pessoa:", erro);
  } finally {
    definirCarregamento(false);
  }
});

async function excluirPessoa(pessoa, cartao) {
  if (emRequisicao) {
    return;
  }

  const confirmou = window.confirm(
    `Deseja excluir ${pessoa.nome} ${pessoa.sobrenome}?\n` +
    `ID: ${pessoa.id} | CPF: ${pessoa.cpf}\n\n` +
    "Esta ação não pode ser desfeita."
  );

  if (!confirmou) {
    return;
  }

  definirCarregamento(true);
  exibirMensagem("Excluindo cadastro...");

  try {
    const resposta = await fetch(
      `/api/pessoas/${encodeURIComponent(pessoa.id)}`,
      {
        method: "DELETE"
      }
    );

    if (resposta.status === 404) {
      cartao.remove();

      exibirMensagem(
        "Esse cadastro já não existe. Faça uma nova busca para atualizar os resultados."
      );
      return;
    }

    if (!resposta.ok) {
      throw new Error("O servidor não conseguiu excluir o cadastro.");
    }

    cartao.remove();
    exibirMensagem("Cadastro excluído com sucesso!", "sucesso");
  } catch (erro) {
    exibirMensagem(
      "Não foi possível excluir. Verifique a conexão com o servidor e tente novamente.",
      "erro"
    );

    console.error("Erro ao excluir pessoa:", erro);
  } finally {
    definirCarregamento(false);
  }
}