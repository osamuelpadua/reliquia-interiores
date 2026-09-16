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

## Animações

Os blocos marcados com `data-reveal` no HTML entram uma única vez ao aparecer na tela. O valor do atributo escolhe o efeito, definido na seção "Entrance motion" do `style.css` (`title`, `quote`, `image`, `stagger`, `gallery` etc.). Ao terminar, o atributo é removido e a página volta exatamente ao layout estático.

O conteúdo só é ocultado para animar quando o visitante não pediu movimento reduzido e o `script.js` carregou. Se o JavaScript falhar, por exemplo por um erro de digitação em `site.config.js`, tudo aparece normalmente.
- `site.config.js`: destino do WhatsApp e links externos.
- `assets/img` e `assets/svg`: todos os 24 arquivos originais fornecidos, preservados.
- `assets/fonts`: Fahkwang e Public Sans, pesos 300–700, com suas licenças OFL.
- `assets/reference`: fotos dos depoimentos e textura extraídas do próprio PDF.
- `scripts/`: servidor local e build, usando somente módulos nativos do Node.js.
- `docs/design-reference.md`: correspondência entre o PDF e os assets.

## Contato pendente

Conforme combinado, `whatsappNumber` está vazio em `site.config.js`. Enquanto não houver número real, os CTAs navegam para o contato da página. Ao preencher o número com país e DDD, somente dígitos, os CTAs passam automaticamente a abrir o WhatsApp.

O telefone fixo e o endereço do rodapé são os dados reais da loja e ficam no `index.html`: o telefone é um link `tel:` e não muda quando o WhatsApp é configurado. O endereço abre no Google Maps pelo `mapsUrl` de `site.config.js`.

Facebook e X também aceitam URLs em `site.config.js`; seus destinos não constam no PDF. Os ícones sem destino configurado permanecem decorativos. O Instagram usa o perfil que aparece na referência.

Os três depoimentos em latim, nomes, localidades, CNPJ e a indicação de 41 anos foram mantidos como apresentados no PDF. São conteúdos da referência, não depoimentos ou dados comerciais verificados. Substitua-os pelos dados reais quando disponíveis.

## Verificação

A implementação foi executada em Chromium e inspecionada em 1920, 1440, 1024, 768, 390 e 320 px. Foram conferidos carregamento de fontes/imagens, ausência de rolagem horizontal, navegação por âncoras, menu, carrossel e galeria com teclado/Escape. O desktop mantém a altura de 7995 px da referência.

Os scripts e capturas de análise local ficam em `.reference/`, ignorada pelo Git e excluída do build. Utilizaram ferramentas já instaladas no ambiente, sem adicionar dependências ao site.

O PDF só contém o desktop: tablet/mobile são adaptações responsivas. Pequenas diferenças de rasterização de fontes e detalhes dos ícones utilitários podem ocorrer entre o PDF e o navegador.
