const formulario = document.querySelector("#formulario-cadastro");
const botaoSalvar = document.querySelector("#botao-salvar");
const mensagem = document.querySelector("#mensagem");

formulario.addEventListener("submit", async function (evento) {
  // Evita que o navegador recarregue a página ao enviar o formulário.
  evento.preventDefault();

  const dados = new FormData(formulario);

  const pessoa = {
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

  mensagem.textContent = "";
  mensagem.className = "mensagem";

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Salvando...";

  try {
    const resposta = await fetch("/api/pessoas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pessoa)
    });

    if (!resposta.ok) {
      throw new Error("O servidor não conseguiu salvar o cadastro.");
    }

    mensagem.textContent = "Pessoa cadastrada com sucesso!";
    mensagem.className = "mensagem sucesso";

    formulario.reset();
  } catch (erro) {
    mensagem.textContent =
      "Não foi possível cadastrar. Verifique a conexão com o servidor e tente novamente.";

    mensagem.className = "mensagem erro";

    console.error("Erro ao cadastrar pessoa:", erro);
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = "Salvar cadastro";
  }
});