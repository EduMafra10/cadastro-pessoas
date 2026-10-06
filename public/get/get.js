const formularioBusca = document.querySelector("#formulario-busca");
const campoCpf = document.querySelector("#cpf");
const botaoBuscar = document.querySelector("#botao-buscar");
const botaoListar = document.querySelector("#botao-listar");
const corpoTabela = document.querySelector("#corpo-tabela");
const mensagem = document.querySelector("#mensagem");


const campos = [
  "id",
  "nome",
  "sobrenome",
  "email",
  "idade",
  "cpf",
  "rg",
  "telefone",
  "rua",
  "bairro",
  "cidade",
  "estado"
];

function mostrarPessoas(pessoas) {
  for (const pessoa of pessoas) {
    const linha = document.createElement("tr");

    for (const campo of campos) {
      const celula = document.createElement("td");

      celula.textContent = pessoa[campo] ?? "";
      linha.appendChild(celula);
    }

    corpoTabela.appendChild(linha);
  }
}

async function carregarPessoas(cpf = "") {
  corpoTabela.replaceChildren();

  mensagem.textContent = "Carregando cadastros...";
  mensagem.className = "mensagem";

  botaoBuscar.disabled = true;
  botaoListar.disabled = true;

  try {
    let endereco = "/api/pessoas";

    if (cpf !== "") {
      endereco += `?cpf=${encodeURIComponent(cpf)}`;
    }

    const resposta = await fetch(endereco);

    if (!resposta.ok) {
      throw new Error("O servidor não conseguiu consultar os cadastros.");
    }

    const pessoas = await resposta.json();

    if (pessoas.length === 0) {
      mensagem.textContent = cpf
        ? "Nenhuma pessoa encontrada com esse CPF."
        : "Nenhuma pessoa cadastrada.";

      return;
    }

    mostrarPessoas(pessoas);

    mensagem.textContent = pessoas.length === 1
      ? "1 cadastro encontrado."
      : `${pessoas.length} cadastros encontrados.`;
  } catch (erro) {
    mensagem.textContent =
      "Não foi possível consultar. Verifique a conexão com o servidor e tente novamente.";

    mensagem.className = "mensagem erro";

    console.error("Erro ao consultar pessoas:", erro);
  } finally {
    botaoBuscar.disabled = false;
    botaoListar.disabled = false;
  }
}

formularioBusca.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const cpf = campoCpf.value.trim();
  carregarPessoas(cpf);
});

botaoListar.addEventListener("click", function () {
  formularioBusca.reset();
  carregarPessoas();
});

// exibe os cadastros
carregarPessoas();