# Pão da Dilma — V7

Versão responsiva para celular/tablet com vendas, clientes, entregas, contas a receber, custos de matéria-prima e backup no Google Drive.

## Google Drive
O Client ID OAuth já está configurado nesta versão. A conta Google usada no aplicativo precisa estar cadastrada como **usuário de teste** na tela de consentimento OAuth enquanto o app estiver em teste.

A permissão usada é `drive.file`. O aplicativo mantém os dados localmente e atualiza uma cópia JSON no Google Drive quando autorizado.

## Imagens e ícone
As imagens de Pão e Pão Doce usadas na interface principal estão embutidas no `app.js` para evitar problemas de caminho no GitHub Pages. Os ícones PWA também estão na raiz do projeto.

## Publicação
Envie **todos os arquivos desta pasta para a raiz do repositório** do GitHub Pages. Não envie a pasta `pao_v5` como uma pasta dentro do repositório.
