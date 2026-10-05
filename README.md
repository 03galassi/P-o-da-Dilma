# Pão na Porta

Aplicativo web responsivo para vendas e entregas de pão.

## Primeira versão
- Clientes: nome, telefone e endereço.
- Vendas: com açúcar/sem açúcar, quantidade, valor, data da venda, data da entrega, casa/trabalho e à vista/a prazo.
- Contas a prazo agrupadas por cliente e mês de vencimento.
- Contas vencidas com mensagem pronta no WhatsApp.
- Entregas do dia e abertura no Google Maps.
- PWA para adicionar à tela inicial do celular/tablet.

## Importante
Esta versão inicial usa `localStorage` para funcionar imediatamente como protótipo. Para uso compartilhado entre vários celulares, conecte o projeto a um banco online (recomendação: Supabase Free) e substitua as funções de leitura/gravação do `app.js` por chamadas ao banco.
