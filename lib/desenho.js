function numeroValido(numero) {
    return Number.isInteger(numero) && numero >= 1 && numero <= 100;
}

function escaparXml(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function gerarDesenho(numero, email) {
    if (!numeroValido(numero)) {
        throw new Error("Número inválido");
    }

    const pontos = 240;
    const raio = 200;
    const centro = 250;
    const k = numero + 1;

    let linhas = "";

    for (let i = 0; i < pontos; i++) {
        const destino = (k * i) % pontos;

        const angulo1 = (2 * Math.PI * i) / pontos;
        const angulo2 = (2 * Math.PI * destino) / pontos;

        const x1 = centro + raio * Math.cos(angulo1);
        const y1 = centro + raio * Math.sin(angulo1);

        const x2 = centro + raio * Math.cos(angulo2);
        const y2 = centro + raio * Math.sin(angulo2);

        linhas += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
    <rect width="500" height="500" fill="white"/>
    <g stroke="black" stroke-width="0.5">
        ${linhas}
    </g>
    <text x="250" y="480" text-anchor="middle" font-family="Arial" font-size="14">
        Assinado por: ${escaparXml(email)}
    </text>
</svg>`;
}

export {
    numeroValido,
    escaparXml,
    gerarDesenho
};
