# Relíquia Interiores

Landing page implementada a partir do PDF oficial `reliquiainteriores.pdf` (1920 × 7995 px). A pasta de trabalho estava vazia; a implementação usa HTML semântico, CSS e JavaScript nativo, sem dependências de execução ou instalação de pacotes.

## Executar

Requer Node.js 20 ou superior.

```sh
npm run dev
```

Abra `http://localhost:4173`. Para escolher outra porta: `npm run dev -- --port 3000`.

```sh
npm run check
npm run build
npm run preview
```

O build copia os arquivos de publicação para `dist/`. Essa pasta pode ser servida por qualquer hospedagem de sites estáticos. Use um servidor HTTP para carregar os módulos JavaScript; não abra o HTML diretamente via `file://`.

## Arquivos

- `index.html`: conteúdo completo, seções semânticas e ícones utilitários em SVG.
- `style.css`: tipografia local, medidas do desktop e adaptações para tablet/mobile.
- `script.js`: menu, cabeçalho flutuante, animações de entrada, navegação da galeria, visualização ampliada, carrossel de depoimentos e contatos.
- `site.config.js`: destino do WhatsApp e links externos.
- `assets/img` e `assets/svg`: todos os 24 arquivos originais fornecidos, preservados.
- `assets/img/optimized`: versões AVIF e WebP das fotos, usadas pelo site.
- `assets/fonts`: Fahkwang e Public Sans em WOFF2 (subconjuntos latinos do Google Fonts), pesos 300–700, com suas licenças OFL.
- `assets/reference`: textura extraída do próprio PDF.
- `scripts/`: servidor local e build, usando somente módulos nativos do Node.js.
- `docs/design-reference.md`: correspondência entre o PDF e os assets.

## Animações

Os blocos marcados com `data-reveal` no HTML entram uma única vez ao aparecer na tela. O valor do atributo escolhe o efeito, definido na seção "Entrance motion" do `style.css` (`title`, `quote`, `image`, `stagger`, `gallery` etc.). Ao terminar, o atributo é removido e a página volta exatamente ao layout estático.

O conteúdo só é ocultado para animar quando o visitante não pediu movimento reduzido e o `script.js` carregou. Se o JavaScript falhar, por exemplo por um erro de digitação em `site.config.js`, tudo aparece normalmente.

## Desempenho

As fotos são servidas com `<picture>` (ou `image-set()` nos fundos em CSS): AVIF, com WebP e o arquivo original como alternativas. As variantes ficam em `assets/img/optimized` e foram geradas a partir dos originais com AVIF qualidade 75 e WebP qualidade 88. A foto do hero tem versões de 1680, 2160 e 2880 px para telas maiores e um recorte vertical para celular (até 699 px), que contém exatamente a área visível com `object-position: 61% center`. As fotos editoriais têm versões de 640 px e no tamanho original. Ao trocar uma foto, gere as variantes com as mesmas configurações e mantenha os nomes.

A foto do hero não anima a opacidade: ela só faz o zoom, e um véu escuro por cima some. O Chrome só considera pintado um elemento que surge de opacidade 0 quando a animação termina, o que atrasaria a métrica de LCP.

## Contato

O `whatsappNumber` em `site.config.js` usa o telefone fixo da loja, (33) 3271-5363, no formato país + DDD + número, somente dígitos. Com ele preenchido, os CTAs abrem uma conversa no WhatsApp com a mensagem de `whatsappMessage`. Se o campo ficar vazio, os CTAs voltam a levar ao contato da própria página.

O telefone fixo e o endereço do rodapé são os dados reais da loja e ficam no `index.html`: o telefone é um link `tel:` e não muda quando o WhatsApp é configurado. O endereço abre no Google Maps pelo `mapsUrl` de `site.config.js`.

O Instagram usa o perfil que aparece na referência. A barra final do rodapé traz, no lugar dos ícones de redes sociais, o crédito "Design e Desenvolvimento" com a logo de Samuel Pádua (`assets/svg/logo-samuel.svg`), em opacidade reduzida.

Os depoimentos são avaliações reais do Google Meu Negócio da loja, transcritas sem alterações. Foram selecionadas 12 avaliações positivas; ficaram de fora reclamações, comentários sobre preço, a avaliação de uma funcionária e uma pergunta. O botão "Ver todas as avaliações no Google" leva ao perfil completo. Para trocar ou incluir depoimentos, edite os `article.testimonial-card` no `index.html`: o carrossel calcula as páginas e os pontos sozinho.

A indicação de 41 anos foi mantida como apresentada no PDF e não é um dado verificado. Substitua-a pelo dado real quando disponível.

## Verificação

A implementação foi executada em Chromium e inspecionada em 1920, 1440, 1024, 768, 390 e 320 px. Foram conferidos carregamento de fontes/imagens, ausência de rolagem horizontal, navegação por âncoras, menu, carrossel e galeria com teclado/Escape. O desktop mantém a altura de 7995 px da referência.

Os scripts e capturas de análise local ficam em `.reference/`, ignorada pelo Git e excluída do build. Utilizaram ferramentas já instaladas no ambiente, sem adicionar dependências ao site.

O PDF só contém o desktop: tablet/mobile são adaptações responsivas. Pequenas diferenças de rasterização de fontes e detalhes dos ícones utilitários podem ocorrer entre o PDF e o navegador.
