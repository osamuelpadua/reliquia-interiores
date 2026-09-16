# Mapeamento da referência visual

Referência: `D:\@Samuel\Reliquia Interiores\reliquiainteriores.pdf`, página única, 1920 × 7995 px. Assets: `D:\@Samuel\Reliquia Interiores\assets`.

Todos os 11 arquivos de imagem e 13 SVGs foram inventariados e visualizados antes da implementação. Não havia aplicação, configuração ou arquivos existentes na pasta de trabalho.

## Seções e assets

| Seção | Arquivos correspondentes | Implementação |
| --- | --- | --- |
| Header | `svg/logo.svg` | Logo original, navegação e CTA; menu recolhido em telas menores. |
| Hero | `img/bg-hero.jpg` | Fundo original já escurecido; enquadramento ajustado à referência. |
| Benefícios | `svg/icon-beneficios0.svg` a `icon-beneficios3.svg` | Quatro SVGs em sua ordem original. |
| Posicionamento | `img/img-posicionamento.jpg`, `svg/bg-posicionamento.svg` | Foto 507 × 634 px no desktop, símbolo translúcido ao fundo e legenda sobreposta. |
| Escolhas que transformam | `img/img-escolhas-que-transformam.jpg` | Foto original com o símbolo da marca já integrado; legenda vermelha. |
| Diferenciais | `img/img-diferenciais.jpg`, `svg/stamp-txt.svg`, `svg/iso.svg`, quatro `svg/-icon-diferenciais_*.svg` | Banner 1120 × 424 px, texto do selo girando conforme a rolagem, símbolo central fixo, quatro linhas e divisores. |
| CTA vermelho | `svg/iso.svg` | Símbolo original ampliado, recortado e translúcido ao fundo. |
| Showroom | `img/img-showroom0.jpg` a `img-showroom4.jpg` | Cinco imagens de 460 × 460 px no desktop, com 20 px entre elas; rolagem horizontal e ampliação. |
| Depoimentos | — | Avaliações reais do Google com iniciais no lugar dos retratos da referência, carrossel paginado e link para o perfil no Google. |
| Nossa história | `img/img-nossa-historia.jpg` | A foto já inclui o logo branco, mantido sem sobreposição duplicada. |
| CTA final e footer | `svg/logo.svg`, textura incorporada no PDF | Fundo escuro texturizado, painel contornado e ícone do WhatsApp. |

`img/img-posicionamento.png` é uma versão alternativa, de menor resolução, da mesma foto em JPG; foi preservada sem duplicar a imagem na interface. `svg/stamp-full.svg` foi preservado como versão estática do selo; a composição usa `stamp-txt.svg` e `iso.svg` separados para girar apenas o texto com a rolagem. O movimento respeita a preferência por animação reduzida. O arquivo `bg-posicionamento.jpg` citado como exemplo na solicitação não estava na pasta fornecida; o fundo correspondente é o SVG utilizado.

A textura veio do recurso incorporado `img_p0_32` do PDF. Os recortes foram salvos em `assets/reference`; os assets fornecidos permaneceram intactos. Nenhum SVG fornecido foi convertido em PNG para a implementação.

## Medidas e tipografia

- Largura central: 1120 px; margens de 400 px no frame desktop de 1920 px.
- Header: 87 px, sobre a Hero. Hero: 778 px. Faixa de benefícios: 102 px.
- Posicionamento: início em y=880, altura 924 px.
- Escolhas: início em y=1804. Banner de diferenciais: aproximadamente y=2732.
- CTA vermelho: aproximadamente y=3849. Showroom: aproximadamente y=4252.
- Depoimentos: aproximadamente y=5117. História: aproximadamente y=5885.
- Bloco final: aproximadamente y=6862. Footer: aproximadamente y=7573.
- Vermelho da marca: `#C62A3D`; fundo de posicionamento: `#F2EEEB`; depoimentos: `#F5F5F5`.
- Fahkwang: títulos, subtítulos dos diferenciais e legendas editoriais. Public Sans: textos, navegação e controles.
- Fontes locais com os pesos fornecidos oficialmente pelo Google Fonts e licenças incluídas.

## Limites da referência

O PDF tem apenas uma composição desktop. As versões responsivas preservam as imagens, hierarquia, cores e ordem das seções, adaptando colunas, tamanhos e navegação.

Não há SVGs de WhatsApp, telefone, localização, redes sociais ou setas na pasta fornecida. Esses controles usam um conjunto vetorial pequeno, incluído no HTML, com proporções ajustadas visualmente ao PDF. Aspas e fundos usam CSS; a textura é extraída do PDF.

Os depoimentos da referência (textos em latim, retratos e cidades) foram substituídos por avaliações reais do Google. Os indicadores do carrossel passaram a corresponder às páginas de depoimentos, em vez das cinco posições fixas da referência.
