import { gerarDesenho } from "../../lib/desenho.js";

export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. Método já é POST; outros métodos serão tratados abaixo.

    // 2. Ler e validar o corpo
    let dados;

    try {
        dados = await request.json();
    } catch {
        return new Response("JSON inválido", {
            status: 400
        });
    }

    if (
        !dados ||
        !Object.prototype.hasOwnProperty.call(dados, "numero") ||
        !Number.isInteger(dados.numero) ||
        dados.numero < 1 ||
        dados.numero > 100
    ) {
        return new Response("Número inválido", {
            status: 400
        });
    }

    // 3. Verificar o token
    const authorization = request.headers.get("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    const token = authorization.substring(7).trim();

    if (!token) {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    const tokenInfoUrl =
        "https://oauth2.googleapis.com/tokeninfo?id_token=" +
        encodeURIComponent(token);

    let respostaGoogle;

    try {
        respostaGoogle = await fetch(tokenInfoUrl);
    } catch {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    if (!respostaGoogle.ok) {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    let tokenInfo;

    try {
        tokenInfo = await respostaGoogle.json();
    } catch {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    // Conferir Client ID
    if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    // Conferir e-mail
    if (tokenInfo.email_verified !== "true") {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    if (!tokenInfo.email) {
        return new Response("Não autorizado", {
            status: 401
        });
    }

    // Gerar o desenho usando o e-mail verificado pelo Google
    const svg = gerarDesenho(
        dados.numero,
        tokenInfo.email
    );

    return new Response(svg, {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml; charset=utf-8"
        }
    });
}

export async function onRequest(context) {
    if (context.request.method !== "POST") {
        return new Response("Método não permitido", {
            status: 405
        });
    }

    return onRequestPost(context);
}
