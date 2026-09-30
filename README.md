# Desenho Assinado

Página que recebe um número inteiro entre 1 e 100 e devolve uma figura em SVG, assinada com o e-mail da conta Google autenticada.

A figura é gerada no servidor a partir de 240 pontos igualmente espaçados numa circunferência, com cada ponto ligado ao ponto `(k * i) mod 240`, em que `k = número + 1`.

## Estrutura final

public/
  index.html
  style.css
  script.js

lib/
  desenho.js

functions/
  api/
    desenho.js

evidencias/
  exemplo.svg

## Autenticação

O usuário realiza login com o Google utilizando Google Identity Services.

O servidor recebe o ID token no cabeçalho:

Authorization: Bearer <id_token>

O servidor valida o token através do endpoint tokeninfo do Google, verifica o `aud` com o `GOOGLE_CLIENT_ID` e verifica se o e-mail está confirmado.

O e-mail utilizado na assinatura do desenho é obtido diretamente do token validado no servidor.

## API

POST /api/desenho

A API recebe:

{"numero": 32}

e retorna o SVG correspondente ao número informado.

## Publicação no Cloudflare Pages

Framework preset: None.

Build command: vazio.

Build output directory: public.

## Identificação

Nome: Kauan dos Santos Engel
RA: 2024003232
URL: https://2bim-avalia1.pages.dev
