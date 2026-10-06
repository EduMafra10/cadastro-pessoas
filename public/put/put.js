const formularioBusca = document.querySelector("#formulario-busca");
const formularioEdicao = document.querySelector("#formulario-edicao");
const campoCpfBusca = document.querySelector("#cpf-busca");
const botaoBuscar = document.querySelector("#botao-buscar");
const botaoSalvar = document.querySelector("#botao-salvar");
const mensagem = document.querySelector("#mensagem");

let idPessoa = null;

const campos = [
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

function exibirMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

formularioBusca.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const cpf = campoCpfBusca.value.trim();

  
  idPessoa = null;
  formularioEdicao.hidden = true;
  formularioEdicao.reset();

  botaoBuscar.disabled = true;
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

    if (pessoas.length > 1) {
      exibirMensagem(
        "Há mais de um cadastro com esse CPF. A edição não foi aberta para evitar alterar a pessoa errada.",
        "erro"
      );
      return;
    }

    const pessoa = pessoas[0];
    idPessoa = pessoa.id;

    
    for (const campo of campos) {
      formularioEdicao.elements.namedItem(campo).value =
        pessoa[campo] ?? "";
    }

    formularioEdicao.hidden = false;
    exibirMensagem("Cadastro encontrado. Altere os campos desejados.");
  } catch (erro) {
    exibirMensagem(
      "Não foi possível buscar. Verifique a conexão com o servidor e tente novamente.",
      "erro"
    );

    console.error("Erro ao buscar pessoa:", erro);
  } finally {
    botaoBuscar.disabled = false;
  }
});

formularioEdicao.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  if (idPessoa === null) {
    return;
  }

  const dados = new FormData(formularioEdicao);

  const pessoaAtualizada = {
    id: idPessoa,
    nome: dados.get("nome").trim(),
    sobrenome: dados.get("sobrenome").trim(),
    email: dados.get("email").trim(),
    idade: Number(dados.get("idade")),
    cpf: dados.get("cpf").trim(),
    rg: dados.get("rg").trim(),
    telefone: dados.get("telefone").trim(),
    rua: dados.get("rua").trim(),
    bairro: dados.get("bairro").trim(),
    cidade: dados.get("cidade").trim(),
    estado: dados.get("estado")
  };

  botaoSalvar.disabled = true;
  botaoBuscar.disabled = true;
  botaoSalvar.textContent = "Salvando...";

  exibirMensagem("Salvando alterações...");

  try {
    const resposta = await fetch(
      `/api/pessoas/${encodeURIComponent(idPessoa)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pessoaAtualizada)
      }
    );

    if (resposta.status === 404) {
      idPessoa = null;
      formularioEdicao.hidden = true;

      exibirMensagem(
        "Esse cadastro não existe mais. Faça uma nova busca.",
        "erro"
      );
      return;
    }

    if (!resposta.ok) {
      throw new Error("O servidor não conseguiu atualizar o cadastro.");
    }

    formularioEdicao.reset();
    formularioEdicao.hidden = true;
    formularioBusca.reset();
    idPessoa = null;

    exibirMensagem("Cadastro atualizado com sucesso!", "sucesso");
  } catch (erro) {
    exibirMensagem(
      "Não foi possível atualizar. Verifique a conexão com o servidor e tente novamente.",
      "erro"
    );

    console.error("Erro ao atualizar pessoa:", erro);
  } finally {
    botaoSalvar.disabled = false;
    botaoBuscar.disabled = false;
    botaoSalvar.textContent = "Salvar alterações";
  }
});