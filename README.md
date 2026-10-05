# Pão da Dilma — V6

Versão responsiva para celular/tablet, com:

- imagens do pão e pão doce incluídas no pacote;
- fallback visual caso uma imagem não carregue;
- botão **NOVA VENDA** abrindo sempre o fluxo de venda; se não houver cliente, o app explica e oferece o cadastro;
- interface adaptável a diferentes tamanhos de tela, incluindo iPhone pequeno;
- ícone personalizado para instalação na tela inicial (iOS e Android/PWA);
- controle de **custos de matéria-prima** com data, item, quantidade, fornecedor, valor e observação;
- backup local + integração com Google Drive da V5;
- restauração dos dados pelo Google Drive.

## Importante ao publicar no GitHub Pages

Envie **todos os arquivos e a pasta `assets`**, mantendo a estrutura:

```text
index.html
app.js
styles.css
drive.js
manifest.json
sw.js
assets/
  hero.jpg
  pao.jpg
  pao_doce.jpg
  icon-180.png
  icon-192.png
  icon-512.png
```

Depois de publicar, se o navegador mostrar uma versão antiga, faça uma atualização forçada ou remova o atalho antigo da tela inicial e crie novamente depois que a nova versão carregar.

O Google Drive continua dependendo do Client ID OAuth configurado no `drive.js`.
