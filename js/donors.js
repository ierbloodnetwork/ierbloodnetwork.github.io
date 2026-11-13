document.addEventListener("DOMContentLoaded",()=>{
  const q=IER.query();
  const blood=document.getElementById("bloodFilter"),city=document.getElementById("cityFilter"),area=document.getElementById("areaFilter");
  const availability=document.getElementById("availabilityFilter"),stream=document.getElementById("streamFilter"),fresh=document.getElementById("freshFilter");
  const text=document.getElementById("q");

  blood.innerHTML='<option value="">All blood groups</option>'+IER.GROUPS.map(g=>`<option>${IER.escapeHtml(g)}</option>`).join("");
  city.innerHTML='<option value="">All districts</option>'+IER.DISTRICTS.map(x=>`<option>${IER.escapeHtml(x)}</option>`).join("");

  function areaOptions(){
    const current=area.value;
    const donorAreas=[...new Set(IER.donors().filter(d=>!city.value||d.city===city.value).map(d=>d.area).filter(Boolean))];
    const options=(!city.value||city.value==="Dhaka")?[...new Set([...IER.DHAKA,...donorAreas])]:donorAreas;
    area.innerHTML='<option value="">All areas</option>'+options.map(a=>`<option>${IER.escapeHtml(a)}</option>`).join("");
    if([...area.options].some(o=>o.value===current))area.value=current;
  }
  areaOptions();

  blood.value=q.get("blood")||"";city.value=q.get("city")||"";areaOptions();area.value=q.get("area")||"";
  availability.value=q.get("availability")||"";stream.value=q.get("stream")||"";fresh.value=q.get("freshness")||"";text.value=q.get("q")||"";

  const PAGE_SIZE=40;
  let visibleCount=PAGE_SIZE;
  let previousFilterKey="";
  function render(){
    const state=IER.publicState?IER.publicState():"ready";
    const liveStatus=document.getElementById("liveDataStatus");
    if(state==="loading"&&!IER.realDonors().length){
      document.getElementById("resultCount").textContent="Loading donors";
      if(liveStatus)liveStatus.textContent="Loading donor information...";
      document.getElementById("donorGrid").innerHTML='<div class="loading-list"><div class="loading-card"></div><div class="loading-card"></div><div class="loading-card"></div></div>';
      return;
    }
    const s=text.value.trim().toLowerCase(),b=blood.value,c=city.value,a=area.value,av=availability.value,st=stream.value,fr=fresh.value;
    let list=IER.donors().filter(d=>{
      const hay=`${d.name} ${d.batch} ${d.stream} ${IER.locationText(d)}`.toLowerCase();
      const eff=IER.effectiveAvailability(d);
      return (!s||hay.includes(s))&&(!b||d.blood===b)&&(!c||d.city===c)&&(!a||d.area===a)&&(!st||d.stream===st)
        &&(!fr||(fr==="confirmed"?IER.isConfirmed(d):!IER.isConfirmed(d)))
        &&(!av||(av==="Available"?eff==="Available":av==="Emergency only"?eff==="Emergency only":av==="Temporarily unavailable"?eff==="Temporarily unavailable":true));
    });
    const order={"Available":0,"Emergency only":1,"Temporarily unavailable":2,"Needs confirmation":3};
    list.sort((x,y)=>(x.isDemo?1:0)-(y.isDemo?1:0)||order[IER.effectiveAvailability(x)]-order[IER.effectiveAvailability(y)]||new Date(y.updated)-new Date(x.updated));

    const params=new URLSearchParams();
    if(b)params.set("blood",b);if(c)params.set("city",c);if(a)params.set("area",a);if(av)params.set("availability",av);if(st)params.set("stream",st);if(fr)params.set("freshness",fr);if(s)params.set("q",text.value.trim());
    history.replaceState(null,"","donors.html"+(params.toString()?`?${params}`:""));

    const realCount=list.filter(d=>!d.isDemo).length,sampleCount=list.filter(d=>d.isDemo).length;
    document.getElementById("resultCount").textContent=sampleCount?`${realCount} donor${realCount===1?"":"s"} + ${sampleCount} sample profile${sampleCount===1?"":"s"}`:`${realCount} matching donor${realCount===1?"":"s"}`;
    if(liveStatus){
      if(state==="refreshing")liveStatus.textContent="Updating donor information...";
      else if(state==="cached")liveStatus.textContent="Showing recently loaded donor information.";
      else if(state==="error")liveStatus.textContent=IER.realDonors().length?"Could not refresh donor information.":"Could not load donor information. Please try again.";
      else liveStatus.textContent="";
    }
    const summary=[b,a,av,st,fr==="confirmed"?"Recently confirmed":fr==="stale"?"Needs confirmation":""].filter(Boolean).join(" · ")||"All donors";
    document.getElementById("filterSummary").textContent=summary;

    const grid=document.getElementById("donorGrid");
    if(!list.length){
      grid.innerHTML='<div class="empty"><b>No matching donor found</b><p>Try removing the area or availability filter. You can also open a blood request if you still cannot find a suitable donor.</p><div class="card-actions"><button class="btn" id="broadenSearchBtn">Broaden search</button><a class="btn red" href="requests.html#open">Open Blood Request</a></div></div>';
      document.getElementById("broadenSearchBtn").onclick=()=>{area.value="";availability.value="";render()};
      return;
    }

    const filterKey=JSON.stringify([s,b,c,a,av,st,fr]);
    if(filterKey!==previousFilterKey){visibleCount=PAGE_SIZE;previousFilterKey=filterKey;}
    const visible=list.slice(0,visibleCount);
    grid.innerHTML=visible.map((d,i)=>{
      const eff=IER.effectiveAvailability(d),confirmed=IER.isConfirmed(d);
      const cls=eff==="Available"?"available":eff==="Emergency only"?"emergency":eff==="Needs confirmation"?"stale":"unavailable";
      return `<article class="donor-card ${confirmed?"":"stale-card"} ${d.isDemo?"sample-card":""} stagger-in" style="animation-delay:${Math.min(i,8)*35}ms">
        <div class="blood-badge">${IER.escapeHtml(d.blood)}</div><div>
          <div class="donor-top"><div><div class="donor-name">${IER.escapeHtml(d.name)}${d.isDemo?' <span class="sample-badge">Sample</span>':''}</div><div class="sub">${IER.escapeHtml(d.batch)} · ${IER.escapeHtml(d.stream)}<br>${IER.escapeHtml(IER.locationText(d))}<br>${IER.escapeHtml(IER.donationText(d))}</div></div><button class="link-btn donor-detail-btn" data-donor-id="${IER.escapeAttr(d.id)}">View details</button></div>
          <div class="chips"><span class="chip ${cls}">${IER.escapeHtml(eff)}${!confirmed?'<span class="mini-info" title="This donor has not confirmed their profile recently.">i</span>':""}</span><span class="chip ${confirmed?"confirmed":"stale"}">${IER.escapeHtml(IER.freshnessText(d))}</span></div>
        </div></article>`;
    }).join("");
    if(visible.length<list.length){
      const more=document.createElement("button");
      more.type="button";more.className="btn soft donor-load-more";
      more.textContent=`Show more (${visible.length} of ${list.length})`;
      more.addEventListener("click",()=>{visibleCount+=PAGE_SIZE;render();});
      grid.appendChild(more);
    }
    grid.querySelectorAll(".donor-detail-btn").forEach(btn=>btn.addEventListener("click",()=>IER.openDonorDetail(btn.dataset.donorId)));
  }
  window.renderDonors=render;

  let searchDelay;
  [text,blood,city,area,availability,stream,fresh].forEach(el=>el.addEventListener(el===text?"input":"change",()=>{
    if(el===city)areaOptions();
    if(el===text){clearTimeout(searchDelay);searchDelay=setTimeout(render,180);}
    else {clearTimeout(searchDelay);render();}
  }));
  document.getElementById("clearFilters").onclick=()=>{text.value="";blood.value="";city.value="";areaOptions();area.value="";availability.value="";stream.value="";fresh.value="";render()};
  render();
  window.addEventListener("ierDataChanged",()=>{areaOptions();render()});
});
