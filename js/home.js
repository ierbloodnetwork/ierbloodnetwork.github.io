document.addEventListener("DOMContentLoaded",()=>{
  let chosen="";
  const bloodWrap=document.getElementById("homeBlood");
  function renderBloods(){
    bloodWrap.innerHTML=IER.GROUPS.map(g=>`<button class="blood-btn ${chosen===g?"active":""}" data-g="${g}">${g}</button>`).join("");
    bloodWrap.querySelectorAll("button").forEach(b=>b.onclick=()=>{chosen=chosen===b.dataset.g?"":b.dataset.g;b.classList.add("pop");renderBloods()});
  }
  renderBloods();

  const area=document.getElementById("homeArea");
  area.innerHTML='<option value="">Any Dhaka area</option>'+IER.DHAKA.map(a=>`<option>${a}</option>`).join("");

  document.getElementById("homeSearch").onclick=()=>IER.navigateDonors({
    blood:chosen,area:area.value,availability:document.getElementById("homeAvail").value
  });

  function renderHome(){
    const state=IER.publicState?IER.publicState():"ready";
    const donors=IER.donors(),requests=IER.requests(),realDonors=IER.realDonors(),realRequests=IER.realRequests();
    if(state==="loading"&&!realDonors.length&&!realRequests.length){
      ["hTotal","hAvailable","hRequests","hAreas"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent="…"});
      const req=document.getElementById("homeRequests");if(req)req.innerHTML='<div class="loading-list"><div class="loading-card"></div><div class="loading-card"></div></div>';
      return;
    }
    const confirmedAvailable=realDonors.filter(d=>IER.effectiveAvailability(d)==="Available").length;
    IER.animateNumber(document.getElementById("hTotal"),realDonors.length);
    IER.animateNumber(document.getElementById("hAvailable"),confirmedAvailable);
    IER.animateNumber(document.getElementById("hRequests"),realRequests.filter(r=>IER.requestStatus(r)==="Open").length);
    IER.animateNumber(document.getElementById("hAreas"),new Set(realDonors.map(d=>IER.locationText(d))).size);

    const active=requests.filter(r=>IER.requestStatus(r)==="Open")
      .sort((a,b)=>(a.isDemo?1:0)-(b.isDemo?1:0)||(a.urgent===b.urgent?new Date(a.needed)-new Date(b.needed):(a.urgent?-1:1))).slice(0,4);
    document.getElementById("homeRequests").innerHTML=!active.length?'<div class="empty"><b>No open requests right now</b></div>':active.map((r,i)=>`
      <article class="request-card ${r.urgent?"urgent":""} stagger-in" style="animation-delay:${i*45}ms">
        <div class="request-top"><div class="request-blood">${IER.escapeHtml(r.blood)}</div><div>${r.isDemo?'<span class="sample-badge">Sample</span> ':''}<span class="status-pill open">Open</span></div></div>
        <div class="request-title">${r.units?`${IER.escapeHtml(r.units)} unit${Number(r.units)===1?"":"s"} · `:""}${IER.escapeHtml(r.hospital)}</div>
        <div class="request-meta">Needed: ${IER.escapeHtml(IER.formatDateTime(r.needed))}<br>Requester: ${IER.escapeHtml(r.batch)}<br>Posted ${IER.escapeHtml(IER.timeAgo(r.created))}</div>
        <div class="tags">${r.urgent?'<span class="tag urgent">Urgent</span>':""}<span class="tag countdown">${IER.escapeHtml(IER.countdown(r.needed))}</span></div>
        <div class="card-actions"><a class="btn primary" href="requests.html?id=${encodeURIComponent(r.id)}">View request</a></div>
      </article>`).join("");

    const groupWrap=document.getElementById("homeGroups");
    if(groupWrap){groupWrap.innerHTML=IER.GROUPS.map(g=>{
      const all=realDonors.filter(d=>d.blood===g),available=all.filter(d=>IER.effectiveAvailability(d)==="Available").length;
      const pct=all.length?Math.round(available/all.length*100):0;
      return `<div class="group-card" data-g="${g}"><div class="group-name">${g}</div><b>${all.length} donor${all.length===1?"":"s"}</b><small>${available} confirmed available</small><div class="mini-bar"><span style="width:${pct}%"></span></div></div>`;
    }).join("");
    groupWrap.querySelectorAll(".group-card").forEach(x=>x.onclick=()=>IER.navigateDonors({blood:x.dataset.g}));}
  }
  renderHome();
  window.addEventListener("ierDataChanged",renderHome);
});
