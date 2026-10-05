const KEY="pao_da_dilma_v3";
const state=JSON.parse(localStorage.getItem(KEY)||'{"clients":[],"sales":[]}');
const $=s=>document.querySelector(s);
const money=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(v||0));
const today=()=>new Date().toISOString().slice(0,10);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function openModal(html){$("#modalBody").innerHTML=html;$("#modal").classList.remove("hidden")}
function closeModal(){$("#modal").classList.add("hidden")}
$("#closeModal").onclick=closeModal; $("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function toast(t){let x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),2200)}
function wa(phone,msg){let p=String(phone||"").replace(/\D/g,"");if(p.length===10)p="55"+p;if(p.length===11)p="55"+p;location.href=`https://wa.me/${p}?text=${encodeURIComponent(msg)}`}
function maps(addr){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(addr)}

function renderHome(){
 const sales=state.sales.filter(s=>s.date===today());
 const total=sales.reduce((a,s)=>a+Number(s.total),0);
 const due=state.sales.filter(s=>s.payment==="prazo"&&s.paid!==true);
 const deliveries=sales.filter(s=>!s.delivered).length;
 $("#content").innerHTML=`
 <section class="hero"><img src="assets/hero.jpg"><div class="heroOverlay"><h1>PÃO<br><span class="gold">DA DILMA</span></h1><p>🚚 ENTREGA RÁPIDA &nbsp; ★ QUALIDADE SEMPRE &nbsp; ♥ CLIENTES SATISFEITOS</p></div></section>
 <section class="stats">
  <div class="stat"><div class="ico">🛒</div><small>Vendas hoje</small><strong>${money(total)}</strong><small>${sales.length} vendas</small></div>
  <div class="stat"><div class="ico">🚚</div><small>Entregas hoje</small><strong>${deliveries}</strong><small>a realizar</small></div>
  <div class="stat"><div class="ico">👥</div><small>Clientes</small><strong>${state.clients.length}</strong><small>cadastrados</small></div>
  <div class="stat"><div class="ico">💰</div><small>A receber</small><strong>${money(due.reduce((a,s)=>a+Number(s.total),0))}</strong><small>${new Set(due.map(s=>s.clientId)).size} clientes</small></div>
 </section>
 <section class="actions"><button class="action sale" onclick="newSale()">🛒 NOVA VENDA ›</button><button class="action client" onclick="newClient()">👤 NOVO CLIENTE ›</button></section>
 <section class="products">
  <div class="product" onclick="newSale('pao')"><img src="assets/pao.jpg"><h3>PÃO</h3></div>
  <div class="product" onclick="newSale('doce')"><img src="assets/pao_doce.jpg"><h3>PÃO DOCE</h3></div>
 </section>
 <section class="panel"><div class="panelTitle">◷ Últimas vendas <button class="btn" onclick="navigate('sales')">Ver todas ›</button></div>
 ${sales.slice(-3).reverse().map(s=>saleRow(s)).join("") || '<div class="empty">Nenhuma venda registrada hoje.</div>'}</section>`;
 updateBadges();
}
function saleRow(s){
 const c=state.clients.find(x=>x.id===s.clientId)||{name:"Cliente"};
 return `<div class="listRow"><div class="avatar">${esc(c.name.split(" ").map(x=>x[0]).slice(0,2).join(""))}</div><div><b>${esc(c.name)}</b><div class="muted">${s.time||""}</div></div><div class="details muted">${s.qty} ${s.type==="pao"?"pães":"pães doces"} · ${s.sugar==="acucar"?"açucarado":"sem açúcar"}</div><div class="amount"><span class="pill ${s.delivered?"ok":"wait"}">${s.delivered?"Entregue":"A entregar"}</span><br><b>${money(s.total)}</b></div></div>`
}
function renderClients(filter=""){
 const list=state.clients.filter(c=>(c.name+" "+c.phone+" "+c.address).toLowerCase().includes(filter.toLowerCase()));
 $("#content").innerHTML=`<h2 class="screenTitle">Clientes</h2><div class="toolbar"><button class="btn primary" onclick="newClient()">+ Novo cliente</button></div><section class="panel">${list.map(c=>`<div class="listRow"><div class="avatar">${esc(c.name.split(" ").map(x=>x[0]).slice(0,2).join(""))}</div><div><b>${esc(c.name)}</b><div class="muted">${esc(c.phone)} · ${esc(c.address)}</div></div><a class="mapBtn" href="${maps(c.address)}" target="_blank">📍</a><button class="btn" onclick="editClient('${c.id}')">Editar</button></div>`).join("")||'<div class="empty">Nenhum cliente encontrado.</div>'}</section>`;
}
function renderSales(){
 const list=[...state.sales].reverse();
 $("#content").innerHTML=`<h2 class="screenTitle">Vendas</h2><div class="toolbar"><button class="btn primary" onclick="newSale()">+ Nova venda</button></div><section class="panel">${list.map(s=>saleRow(s)).join("")||'<div class="empty">Nenhuma venda registrada.</div>'}</section>`;
}
function renderDeliveries(){
 const list=state.sales.filter(s=>s.date===today()&&!s.delivered).map(s=>({...s,c:state.clients.find(c=>c.id===s.clientId)}));
 $("#content").innerHTML=`<h2 class="screenTitle">Entregas de hoje</h2><section class="panel">${list.map(s=>`<div class="listRow"><div class="avatar">🚚</div><div><b>${esc(s.c?.name||"Cliente")}</b><div class="muted">${s.where==="trabalho"?"🏢 Trabalho":"🏠 Casa"} · ${esc(s.c?.address||"")}</div></div><a class="mapBtn" href="${maps(s.c?.address||"")}" target="_blank">🗺️</a><button class="btn primary" onclick="deliver('${s.id}')">Entregue</button></div>`).join("")||'<div class="empty">Nenhuma entrega pendente hoje.</div>'}<div class="toolbar"><button class="btn gold" onclick="openRoute()">🗺️ Abrir endereços no Maps</button></div></section>`;
}
function renderReceivables(){
 const due=state.sales.filter(s=>s.payment==="prazo"&&!s.paid);
 const groups={};
 due.forEach(s=>{const c=state.clients.find(c=>c.id===s.clientId);const month=s.payDate?.slice(0,7)||s.date.slice(0,7);const k=s.clientId+"_"+month;(groups[k]??={client:c,month,total:0,sales:[]});groups[k].total+=Number(s.total);groups[k].sales.push(s)});
 $("#content").innerHTML=`<h2 class="screenTitle">A receber</h2><section class="panel">${Object.entries(groups).map(([k,g])=>`<div class="listRow"><div class="avatar">💰</div><div><b>${esc(g.client?.name||"Cliente")}</b><div class="muted">${g.month} · ${g.sales.length} venda(s)</div></div><div><b>${money(g.total)}</b><div class="muted ${g.sales.some(s=>s.payDate<today())?'danger':''}">${g.sales.some(s=>s.payDate<today())?'VENCIDO':'A vencer'}</div></div><div><button class="btn gold" onclick="payGroup('${k}')">Recebido</button>${g.sales.some(s=>s.payDate<today())?`<button class="btn" onclick="charge('${g.client.id}','${g.total}')">WhatsApp</button>`:""}</div></div>`).join("")||'<div class="empty">Nenhuma conta em aberto.</div>'}</section>`;
}
function renderMore(){ $("#content").innerHTML=`<h2 class="screenTitle">Mais</h2><section class="panel"><button class="btn" onclick="if(confirm('Apagar todos os dados deste aparelho?')){localStorage.removeItem(KEY);location.reload()}">Limpar dados</button></section>`}
function navigate(screen){document.querySelectorAll(".bottomNav button").forEach(b=>b.classList.toggle("active",b.dataset.screen===screen)); if(screen==="home")renderHome();if(screen==="clients")renderClients($("#globalSearch").value);if(screen==="sales")renderSales();if(screen==="deliveries")renderDeliveries();if(screen==="receivables")renderReceivables();if(screen==="more")renderMore()}
document.querySelectorAll(".bottomNav button").forEach(b=>b.onclick=()=>navigate(b.dataset.screen));
$("#globalSearch").oninput=e=>{if(document.querySelector(".bottomNav button.active")?.dataset.screen==="clients")renderClients(e.target.value)};
function newClient(existing=null){
 openModal(`<h2>${existing?"Editar":"Novo"} cliente</h2><form class="form" id="clientForm">
 <label>Nome<input name="name" required value="${esc(existing?.name||"")}"></label>
 <label>Telefone<input name="phone" required placeholder="(00) 00000-0000" value="${esc(existing?.phone||"")}"></label>
 <label>Endereço de entrega<input name="address" required value="${esc(existing?.address||"")}"></label>
 <button class="btn primary" type="submit">Salvar cliente</button></form>`);
 $("#clientForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const c=existing||{id:crypto.randomUUID()};c.name=f.get("name");c.phone=f.get("phone");c.address=f.get("address");if(!existing)state.clients.push(c);save();closeModal();toast("Cliente salvo!");navigate("clients")};
}
function editClient(id){newClient(state.clients.find(c=>c.id===id))}
function newSale(pref="pao"){
 if(!state.clients.length){toast("Cadastre um cliente primeiro.");newClient();return}
 openModal(`<h2>Nova venda</h2><form class="form" id="saleForm">
 <label>Cliente<select name="client" required>${state.clients.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
 <div class="formGrid"><label>Tipo<select name="type"><option value="pao" ${pref==="pao"?"selected":""}>Pão</option><option value="doce" ${pref==="doce"?"selected":""}>Pão doce</option></select></label>
 <label>Quantidade<input name="qty" type="number" min="1" value="10" required></label></div>
 <div class="formGrid"><label>Tipo do pão<select name="sugar"><option value="sem">Sem açúcar</option><option value="acucar">Açucarado por cima</option></select></label>
 <label>Valor total<input name="total" type="number" step="0.01" min="0" required></label></div>
 <div class="formGrid"><label>Pagamento<select name="payment" id="pay"><option value="avista">À vista</option><option value="prazo">A prazo</option></select></label>
 <label>Data da entrega<input name="date" type="date" value="${today()}" required></label></div>
 <div id="payDateBox" class="hidden"><label>Data para pagamento<input name="payDate" type="date"></label></div>
 <label>Onde entregar<select name="where"><option value="casa">🏠 Casa</option><option value="trabalho">🏢 Trabalho</option></select></label>
 <button class="btn primary" type="submit">Registrar venda</button></form>`);
 $("#pay").onchange=e=>$("#payDateBox").classList.toggle("hidden",e.target.value!=="prazo");
 $("#saleForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const s={id:crypto.randomUUID(),clientId:f.get("client"),type:f.get("type"),qty:Number(f.get("qty")),sugar:f.get("sugar"),total:Number(f.get("total")),payment:f.get("payment"),payDate:f.get("payDate")||null,date:f.get("date"),where:f.get("where"),delivered:false,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})};state.sales.push(s);save();closeModal();toast("Venda registrada!");navigate("sales")};
}
function deliver(id){const s=state.sales.find(x=>x.id===id);if(s){s.delivered=true;save();renderDeliveries();toast("Entrega marcada como concluída!")}}
function payGroup(k){const [cid,month]=k.split("_");state.sales.filter(s=>s.clientId===cid&&(s.payDate||s.date).slice(0,7)===month&&!s.paid).forEach(s=>s.paid=true);save();renderReceivables();toast("Recebimento registrado!")}
function charge(cid,total){const c=state.clients.find(x=>x.id===cid);if(!c)return;wa(c.phone,`Tudo bem ${c.name}, tem uma notinha sua aqui, são ${money(total)}. Consegue mandar pix pra mim?`)}
function openRoute(){const list=state.sales.filter(s=>s.date===today()&&!s.delivered).map(s=>state.clients.find(c=>c.id===s.clientId)?.address).filter(Boolean);if(!list.length)return toast("Não há entregas pendentes.");window.open(maps(list.join(" | ")),"_blank")}
function updateBadges(){const pending=state.sales.filter(s=>s.date===today()&&!s.delivered).length;$("#deliveryBadge").textContent=pending;$("#notifyCount").textContent=state.sales.filter(s=>s.payment==="prazo"&&!s.paid&&s.payDate<today()).length}
$("#notifyBtn").onclick=()=>navigate("receivables");
renderHome();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
