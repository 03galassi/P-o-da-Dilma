# Pão da Dilma

Aplicativo web mobile para cadastro de clientes, vendas, entregas e contas a receber.

## Backup Google Drive
A versão com backup usa a API Google Drive. Antes de publicar, configure no arquivo `drive.js` o seu OAuth Client ID no campo `GOOGLE_CLIENT_ID`/`DRIVE_CONFIG.CLIENT_ID`.

Use uma credencial OAuth 2.0 do tipo **Aplicativo da Web**, com a origem JavaScript do GitHub Pages, por exemplo:
`https://03galassi.github.io`

O app solicita somente o escopo `drive.file`, para limitar o acesso aos arquivos usados pelo aplicativo. Após conectar, ele mantém os dados locais e atualiza automaticamente o arquivo `pao-da-dilma-dados.json` no Drive. Também há botões para backup manual e restauração.
