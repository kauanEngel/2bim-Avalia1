let idToken = null;

const CLIENT_ID = "274567233092-ckjs91f7qd6vcdjstrhbqv9dqb8asjbo.apps.googleusercontent.com";

function iniciarGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) {
        setTimeout(iniciarGoogle, 500);
        return;
    }

    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login"),
        {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular"
        }
    );
}

function handleCredentialResponse(response) {
    idToken = response.credential;

    document.getElementById("desenho-area").hidden = false;

    document.getElementById("mensagem").textContent =
        "Login realizado com sucesso. Agora informe um número de 1 a 100.";
}

async function gerarDesenho() {
    const numeroInput = document.getElementById("numero");
    const mensagem = document.getElementById("mensagem");
    const resultado = document.getElementById("resultado");

    const numero = Number(numeroInput.value);

    mensagem.textContent = "";
    resultado.innerHTML = "";

    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
        mensagem.textContent =
            "Informe um número inteiro entre 1 e 100.";
        return;
    }

    if (!idToken) {
        mensagem.textContent =
            "Faça login com o Google antes de gerar o desenho.";
        return;
    }

    try {
        const resposta = await fetch("/api/desenho", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            },
            body: JSON.stringify({
                numero: numero
            })
        });

        const svg = await resposta.text();

        if (resposta.status === 400) {
            mensagem.textContent =
                "Erro 400: dados inválidos.";
            return;
        }

        if (resposta.status === 401) {
            mensagem.textContent =
                "Erro 401: autenticação inválida ou não autorizada.";
            return;
        }

        if (!resposta.ok) {
            mensagem.textContent =
                `Erro ${resposta.status}: não foi possível gerar o desenho.`;
            return;
        }

        resultado.innerHTML = svg;

        mensagem.textContent =
            "Desenho gerado com sucesso.";
    } catch (erro) {
        console.error(erro);

        mensagem.textContent =
            "Erro de comunicação com o servidor.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("gerar")
        .addEventListener("click", gerarDesenho);

    iniciarGoogle();
});
