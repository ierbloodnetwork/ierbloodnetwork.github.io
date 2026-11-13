document.addEventListener("DOMContentLoaded",()=>{
  const blood=document.getElementById("requestBloodFilter"),status=document.getElementById("requestStatusFilter"),urgency=document.getElementById("requestUrgencyFilter");
  blood.innerHTML='<option value="">All blood groups</option>'+IER.GROUPS.map(g=>`<option>${g}</option>`).join("");
  document.getElementById("rDistrict").innerHTML='<option value="">Select district</option>'+IER.DISTRICTS.map(d=>`<option>${d}</option>`).join("");
  document.getElementById("rDhakaArea").innerHTML='<option value="">Select area (optional)</option>'+IER.DHAKA_CITY.map(a=>`<option value="${IER.escapeAttr(a)}">${IER.escapeHtml(a)}</option>`).join("")+'<optgroup label="Dhaka district upazilas">'+IER.DHAKA_UPAZILAS.map(a=>`<option value="${IER.escapeAttr(a)}">${IER.escapeHtml(a)}</option>`).join("")+'</optgroup><option>Other Dhaka District</option>';
  document.getElementById("rNeededHour").innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${String(i+1).padStart(2,"0")}</option>`).join("");
  document.getElementById("rNeededMinute").innerHTML=Array.from({length:60},(_,i)=>`<option value="${i}">${String(i).padStart(2,"0")}</option>`).join("");

  function refreshRequestArea(){
    const district=document.getElementById("rDistrict").value;
    document.getElementById("rDhakaAreaWrap").hidden=district!=="Dhaka";
    document.getElementById("rOtherAreaWrap").hidden=!district||district==="Dhaka";
    document.getElementById("rDhakaArea").value="";
    document.getElementById("rOtherArea").value="";
  }
  document.getElementById("rDistrict").addEventListener("change",refreshRequestArea);
  function requestArea(){
    return document.getElementById("rDistrict").value==="Dhaka"?document.getElementById("rDhakaArea").value:document.getElementById("rOtherArea").value.trim();
  }
  // Construct an explicit Bangladesh (+06:00) timestamp, independent of the visitor's device timezone.
  function neededByTimestamp(){
    const date=document.getElementById("rNeededDate").value;
    const hour=Number(document.getElementById("rNeededHour").value);
    const minute=Number(document.getElementById("rNeededMinute").value);
    const period=document.getElementById("rNeededPeriod").value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(hour)||hour<1||hour>12||!Number.isInteger(minute)||minute<0||minute>59||!["AM","PM"].includes(period))return "";
    const hour24=hour%12+(period==="PM"?12:0);
    const iso=`${date}T${String(hour24).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00+06:00`;
    const test=new Date(iso);
    // Reject invalid dates such as 31 February even if entered programmatically.
    if(Number.isNaN(test.getTime())||new Date(test.getTime()+6*3600000).toISOString().slice(0,10)!==date)return "";
    return iso;
  }
  function defaultNeededBy(){
    const dhaka=new Date(Date.now()+4*3600000+6*3600000);
    const date=dhaka.toISOString().slice(0,10);
    const hour24=dhaka.getUTCHours();
    document.getElementById("rNeededDate").value=date;
    document.getElementById("rNeededHour").value=String(hour24%12||12);
    document.getElementById("rNeededMinute").value=String(dhaka.getUTCMinutes());
    document.getElementById("rNeededPeriod").value=hour24>=12?"PM":"AM";
  }
  const q=IER.query();blood.value=q.get("blood")||"";status.value=q.get("status")||"Open";urgency.value=q.get("urgent")||"";

  function render(){
    const state=IER.publicState?IER.publicState():"ready";
    if(state==="loading"&&!IER.realRequests().length){
      document.getElementById("requestCount").textContent="Loading requests";
      document.getElementById("requestGrid").innerHTML='<div class="loading-list"><div class="loading-card"></div><div class="loading-card"></div></div>';
      return;
    }
    let list=IER.requests().filter(r=>(!blood.value||r.blood===blood.value)&&(!status.value||IER.requestStatus(r)===status.value)&&(!urgency.value||(urgency.value==="yes"?r.urgent:!r.urgent)));
    const rank={Open:0,"Fulfilment Reported":1,Expired:2};
    list.sort((a,b)=>(a.isDemo?1:0)-(b.isDemo?1:0)||rank[IER.requestStatus(a)]-rank[IER.requestStatus(b)]||(a.urgent===b.urgent?new Date(a.needed)-new Date(b.needed):(a.urgent?-1:1)));
    const realCount=list.filter(r=>!r.isDemo).length,sampleCount=list.filter(r=>r.isDemo).length;
    document.getElementById("requestCount").textContent=sampleCount?`${realCount} request${realCount===1?"":"s"} + ${sampleCount} sample${sampleCount===1?"":"s"}`:`${realCount} request${realCount===1?"":"s"}`;
    const grid=document.getElementById("requestGrid");
    grid.innerHTML=list.length?list.map((r,i)=>{
      const st=IER.requestStatus(r),units=r.units?`${IER.escapeHtml(r.units)} unit${Number(r.units)===1?"":"s"} · `:"";
      const statusClass=st==="Fulfilment Reported"?"reported":st.toLowerCase();
      const location=[r.area,r.district].filter(Boolean).join(", ");
      const pendingNote=r.memberReportPending?'<span class="tag">Community fulfilment report awaiting confirmation</span>':"";
      return `<article class="request-card ${r.urgent&&st==="Open"?"urgent":""} stagger-in" style="animation-delay:${Math.min(i,8)*35}ms">
        <div class="request-top"><div class="request-blood">${IER.escapeHtml(r.blood)}</div><div>${r.isDemo?'<span class="sample-badge">Sample</span> ':''}<span class="status-pill ${statusClass}">${IER.escapeHtml(st)}</span></div></div>
        <div class="request-title">${units}${IER.escapeHtml(r.hospital)}</div>
        <div class="request-meta">${location?`Location: ${IER.escapeHtml(location)}<br>`:""}Needed: ${IER.escapeHtml(IER.formatDateTime(r.needed))}<br>Requester: ${IER.escapeHtml(r.name)} · ${IER.escapeHtml(r.batch)}<br>Posted ${IER.escapeHtml(IER.timeAgo(r.created))}</div>
        <div class="tags">${pendingNote}${r.urgent?'<span class="tag urgent">Urgent</span>':""}${st==="Open"?`<span class="tag countdown">${IER.escapeHtml(IER.countdown(r.needed))}</span>`:""}</div>
        <div class="card-actions"><button class="btn primary request-view-btn" data-request-id="${IER.escapeAttr(r.id)}">View</button>${st==="Open"&&!r.isDemo?`<button class="btn request-fulfill-btn" data-request-id="${IER.escapeAttr(r.id)}">Report fulfilment</button>`:""}</div>
      </article>`;
    }).join(""):'<div class="empty"><b>No matching requests</b><p>Change the filters or open a new blood request.</p></div>';
    grid.querySelectorAll(".request-view-btn").forEach(btn=>btn.addEventListener("click",()=>window.openRequestDetail(btn.dataset.requestId)));
    grid.querySelectorAll(".request-fulfill-btn").forEach(btn=>btn.addEventListener("click",()=>window.openFulfill(btn.dataset.requestId)));
  }

  [blood,status,urgency].forEach(x=>x.addEventListener("change",render));

  let pendingSubmissionKey="";
  function submissionKey(){
    if(pendingSubmissionKey)return pendingSubmissionKey;
    if(!window.crypto||!crypto.getRandomValues)throw new Error("Secure browser required for submitting requests.");
    const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
    pendingSubmissionKey=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
    return pendingSubmissionKey;
  }
  function openCreate(){
    pendingSubmissionKey="";
    document.getElementById("requestError").style.display="none";
    document.getElementById("rBlood").innerHTML=IER.GROUPS.map(g=>`<option>${g}</option>`).join("");
    ["rUnits","rHospital","rName","rBatch","rPhone","rEmail","rNote"].forEach(id=>document.getElementById(id).value="");
    document.getElementById("rDistrict").value="";
    document.getElementById("rSharePhonePoster").checked=false;
    refreshRequestArea();
    defaultNeededBy();
    IER.openModal("requestCreateModal");
    IER.initTurnstile("requestTurnstile","create_blood_request").catch(()=>{});
  }
  window.openBloodRequest=openCreate;
  document.getElementById("openRequestBtn").onclick=openCreate;

  window.submitBloodRequest=async()=>{
    const err=document.getElementById("requestError");err.style.display="none";
    const vals=["rHospital","rDistrict","rNeededDate","rName","rBatch","rPhone"].map(id=>document.getElementById(id).value.trim());
    if(vals.some(v=>!v)){err.textContent="Please complete hospital, district, needed time, requester name, IER batch and phone number.";err.style.display="block";return}
    const batchValue=document.getElementById("rBatch").value.trim();
    if(!/^\d{1,3}$/.test(batchValue)){err.textContent="Enter only the requester batch number.";err.style.display="block";return}
    if(!IER.isValidPhone(document.getElementById("rPhone").value)){err.textContent="Enter a valid Bangladesh phone number.";err.style.display="block";return}
    const neededBy=neededByTimestamp();
    const need=new Date(neededBy);if(!neededBy||Number.isNaN(need.getTime())||need<=new Date()){err.textContent="Select a valid future date and time in Bangladesh time (AM/PM).";err.style.display="block";return}
    const unitsValue=document.getElementById("rUnits").value;
    if(unitsValue&&(!Number.isInteger(Number(unitsValue))||Number(unitsValue)<1||Number(unitsValue)>99)){err.textContent="Units must be a whole number from 1 to 99.";err.style.display="block";return}
    const turnstileToken=IER.getTurnstileToken("requestTurnstile");
    if(IER.turnstileEnabled()&&!turnstileToken&&!pendingSubmissionKey){err.textContent="Complete the verification challenge before publishing.";err.style.display="block";return}
    const btn=document.querySelector('#requestCreateModal .btn.red.full');btn.disabled=true;btn.textContent="Publishing...";
    try{
      const result=await IER.apiPost("createBloodRequest",{
        bloodGroup:document.getElementById("rBlood").value,
        units:unitsValue?Number(unitsValue):"",
        hospital:document.getElementById("rHospital").value.trim(),
        district:document.getElementById("rDistrict").value,
        area:requestArea(),
        neededBy:neededBy,
        requesterName:document.getElementById("rName").value.trim(),
        requesterBatch:batchValue,
        requesterPhone:document.getElementById("rPhone").value.trim(),
        sharePhoneInPoster:document.getElementById("rSharePhonePoster").checked,
        requesterEmail:document.getElementById("rEmail").value.trim(),
        urgent:document.getElementById("rUrgent").value==="yes",
        note:document.getElementById("rNote").value.trim(),
        turnstileToken,
        submissionKey:submissionKey()
      });
      if(!result.ok){err.textContent=result.message||"Could not publish the request.";err.style.display="block";return}
      if(!result.requestId)throw new Error("Missing request ID");
      pendingSubmissionKey="";
      IER.closeModal("requestCreateModal");
      const manageWrap=document.getElementById("publishedManageWrap");
      manageWrap.classList.toggle("hidden",!result.managementToken);
      if(result.managementToken){
        const manageLink=new URL("requests.html",location.href);
        manageLink.searchParams.set("id",result.requestId);
        manageLink.hash="manage="+result.managementToken;
        document.getElementById("copyManageLink").onclick=()=>IER.copyText(manageLink.href,"Private link copied. Save it somewhere safe.");
        try{sessionStorage.setItem("ier_request_manage_"+result.requestId,result.managementToken)}catch(e){}
      }
      const publicLink=location.protocol==="file:"?"":new URL("requests.html?id="+encodeURIComponent(result.requestId),location.href).href;
      document.getElementById("copyPublishedLink").onclick=()=>publicLink?IER.copyText(publicLink,"Request link copied."):IER.showToast("The link is available after website publication.");
      document.getElementById("sharePublishedRequest").onclick=()=>{
        if(IER.requests().some(x=>x.id===result.requestId)){IER.closeModal("requestPublishedModal");window.openRequestDetail(result.requestId);}
        else IER.showToast("Still loading. Open the request from the board to share it.");
      };
      document.getElementById("publishedRequestId").textContent=result.requestId;
      document.getElementById("copyPublishedRequestId").onclick=()=>IER.copyText(result.requestId,"Request ID copied.");
      IER.openModal("requestPublishedModal");
      try{localStorage.removeItem("ier_v25_public_cache")}catch(e){}
      try{await IER.reloadPublicData();render();}catch(refreshError){IER.showToast("Request published. Refresh the board to see it.");}
    }catch(e){err.textContent="We couldn't confirm whether your request was published. Check the request board first. If it's missing, tap Publish Request again; the system will recognize the original submission.";err.style.display="block";}
    finally{btn.disabled=false;btn.textContent="Publish Request";if(IER.turnstileEnabled())IER.resetTurnstile("requestTurnstile");}
  };

  window.openRequestDetail=id=>{
    const r=IER.requests().find(x=>x.id===id);if(!r)return;
    const s=IER.requestStatus(r);
    document.getElementById("rdTitle").textContent=`${r.blood} blood request`;
    document.getElementById("rdSub").textContent=`${r.hospital} · ${s}`;
    const requestLocation=[r.area,r.district].filter(Boolean).join(", ")||"Not specified";
    const details=[
      ["Blood group",r.blood],["Units",r.units||"Not specified"],["District / area",requestLocation],["Needed by",IER.formatDateTime(r.needed)],["Requester batch",r.batch],
      ["Requester",r.name],["Urgency",r.urgent?"Urgent":"Standard"],["Posted",IER.timeAgo(r.created)],["Note",r.note||"No additional note"]
    ];
    if(r.memberReportPending)details.push(["Community report","Fulfilment reported by a community member. Awaiting requester confirmation; this request remains Open."]);
    if(s==="Fulfilment Reported")details.push(["Fulfilment status",`${r.reportedByType||"Someone"} reported fulfilment${r.fulfilmentReportedAt?` · ${IER.friendlyDateTime(r.fulfilmentReportedAt)}`:""}`]);
    document.getElementById("rdDetails").innerHTML=details.map(x=>`<div class="detail"><small>${IER.escapeHtml(x[0])}</small><b>${IER.escapeHtml(x[1])}</b></div>`).join("");
    const requesterContact=document.getElementById("rdContact");
    if(r.isDemo){requesterContact.innerHTML=`<button class="btn" disabled>Sample request</button>`;}
    else if(s==="Expired"){requesterContact.innerHTML=`<button class="btn" disabled>Request expired</button>`;}
    else {
      requesterContact.innerHTML='<button class="btn red full" id="revealRequesterContact">Show contact options</button>';
      document.getElementById("revealRequesterContact").onclick=()=>{
        requesterContact.innerHTML='<button class="btn" disabled>Verify member to view contact...</button>';
        IER.getVerifiedRequesterContact(r.id,phone=>{
          requesterContact.innerHTML=`<a class="btn red" href="tel:${IER.escapeAttr(phone)}">Call requester</a><a class="btn" target="_blank" rel="noopener" href="https://wa.me/88${IER.escapeAttr(phone)}">Try WhatsApp</a>`;
        });
      };
    }
    const reportBtn=document.getElementById("rdReportRequest");reportBtn.disabled=!!r.isDemo;reportBtn.onclick=r.isDemo?null:()=>IER.reportBloodRequest(r);
    const existingNotice=document.getElementById("rdFulfilmentNotice");if(existingNotice)existingNotice.remove();
    if(s==="Fulfilment Reported"){
      const notice=document.createElement("div");notice.id="rdFulfilmentNotice";notice.className="note";notice.style.margin="12px 0";
      notice.textContent="Fulfilment has been reported. The request remains visible, and you can still contact the requester if you want to confirm before responding.";
      document.getElementById("rdContact").closest(".contact").insertAdjacentElement("afterend",notice);
    }

    const includePhone=document.getElementById("shareIncludePhone");
    let sharePhone="";
    includePhone.checked=false;
    const phoneSharingAllowed=r.sharePhoneInPoster===true;
    includePhone.disabled=!phoneSharingAllowed || !!r.isDemo || s!=="Open";
    includePhone.parentElement.classList.toggle("muted",includePhone.disabled);
    includePhone.parentElement.classList.toggle("hidden",!phoneSharingAllowed);
    const postEl=document.getElementById("sharePostText");
    const preview=document.getElementById("sharePreviewWrap");
    preview.classList.add("hidden");

    const requestUrl=()=>{if(location.protocol==="file:")return "";const u=new URL("requests.html",location.href);u.searchParams.set("id",r.id);return u.href;};
    const postText=()=>{
      const phoneLine=includePhone.checked&&sharePhone?`\nContact: ${sharePhone}`:`\nContact through request page`;
      return `${r.isDemo?"SAMPLE REQUEST - FOR DEMONSTRATION ONLY\n\n":""}🩸 ${r.urgent?"URGENT ":""}BLOOD NEEDED

Blood Group: ${r.blood}
${r.units?`Units: ${r.units}\n`:""}Hospital: ${r.hospital}
Needed by: ${IER.formatDateTime(r.needed)}
Requester: ${r.name} · ${r.batch}${phoneLine}

If you are able to donate, please contact the requester.

Request details: ${requestUrl()||"Link available after website publication"}`;
    };
    const refreshShareText=()=>{postEl.textContent=postText();};
    includePhone.onchange=()=>{
      preview.classList.add("hidden");
      if(!includePhone.checked){refreshShareText();return;}
      if(!phoneSharingAllowed){includePhone.checked=false;refreshShareText();return;}
      if(sharePhone){refreshShareText();return;}
      includePhone.disabled=true;
      IER.getVerifiedRequesterContact(r.id,phone=>{
        sharePhone=phone;
        includePhone.checked=true;
        includePhone.disabled=!phoneSharingAllowed || !!r.isDemo || s!=="Open";
        refreshShareText();
      });
      // If verification is cancelled, the phone remains excluded from the share text.
      includePhone.checked=false;
      refreshShareText();
      includePhone.disabled=!phoneSharingAllowed || !!r.isDemo || s!=="Open";
    };
    refreshShareText();

    const copyDisabled=r.isDemo||s!=="Open",imageDisabled=s!=="Open";
    document.getElementById("copySharePost").disabled=copyDisabled;
    document.getElementById("copyRequestLink").disabled=copyDisabled;
    document.getElementById("generateShareImage").disabled=imageDisabled;
    document.getElementById("downloadShareImage").disabled=imageDisabled;
    document.getElementById("copySharePost").onclick=copyDisabled?null:()=>IER.copyText(postText(),"Facebook post copied.");
    document.getElementById("copyRequestLink").onclick=copyDisabled?null:()=>IER.copyText(requestUrl(),"Request link copied.");
    const shareNote=document.querySelector("#requestDetailModal .share-panel .note");
    if(shareNote)shareNote.textContent=s!=="Open"?"Sharing is disabled because this request is no longer open.":r.isDemo?"You can preview the generated image. It is clearly marked as a sample.":"Use the copied post or generated image wherever you want to share the request.";
    const nativeShare=document.getElementById("nativeShareRequest");
    if(navigator.share&&!copyDisabled){
      nativeShare.classList.remove("hidden");
      nativeShare.onclick=()=>navigator.share({title:`${r.blood} blood needed`,text:postText(),url:requestUrl()}).catch(()=>{});
    }else{
      nativeShare.classList.add("hidden");
      nativeShare.onclick=null;
    }

    async function drawCard(){
      const canvas=document.getElementById("shareCanvas");
      const contactText=includePhone.checked && phoneSharingAllowed && sharePhone ? sharePhone : "Open the request page to contact the requester";
      await IERPoster24.render(canvas,{
        group:r.blood,units:r.units?`${r.units} UNIT${Number(r.units)===1?"":"S"}`:"UNITS NOT SPECIFIED",
        hospital:r.hospital,date:IER.formatDateTime(r.needed),requester:r.name,batch:r.batch,
        contact:contactText,url:requestUrl(),urgent:r.urgent,sample:r.isDemo
      });
      preview.classList.remove("hidden");
    }

    document.getElementById("generateShareImage").onclick=imageDisabled?null:async()=>{
      try{await drawCard();}catch(e){console.error(e);IER.showToast("Could not generate the share image.");}
    };
    document.getElementById("downloadShareImage").onclick=imageDisabled?null:async()=>{
      try{
        await drawCard();
        const a=document.createElement("a");
        a.download=`IER-${r.id}-${r.blood.replace("+","plus").replace("-","minus")}.png`;
        a.href=document.getElementById("shareCanvas").toDataURL("image/png");
        a.click();
      }catch(e){console.error(e);IER.showToast("Could not download the share image.");}
    };
    IER.openModal("requestDetailModal");
  };

  function syncFulfilmentReporterMode(){
    const member=document.getElementById("fulfillAsMember").checked;
    document.getElementById("fulfillRequesterFields").classList.toggle("hidden",member);
    document.getElementById("fulfillMemberFields").classList.toggle("hidden",!member);
    document.getElementById("fulfillError").style.display="none";
  }
  document.querySelectorAll('input[name="fulfillReporterMode"]').forEach(x=>x.addEventListener("change",syncFulfilmentReporterMode));

  function privateTokenFor(id){
    const match=location.hash.match(/^#manage=([a-f0-9]{64})$/);
    if(match && new URLSearchParams(location.search).get("id")===id)return match[1];
    try{return sessionStorage.getItem("ier_request_manage_"+id)||""}catch(e){return ""}
  }
  window.openFulfill=id=>{
    document.getElementById("fulfillId").value=id;
    const token=privateTokenFor(id);
    document.getElementById("fulfillLinkMode").classList.toggle("hidden",!token);
    document.getElementById("fulfillEmailMode").classList.toggle("hidden",!!token);
    document.getElementById("fulfillAsRequester").checked=true;
    document.getElementById("fulfillMemberReason").value="confirmed";
    document.getElementById("fulfillError").style.display="none";
    syncFulfilmentReporterMode();
    IER.openModal("fulfillModal");
  };
  window.sendRequesterCode=async()=>{
    const requestId=document.getElementById("fulfillId").value;
    const email=document.getElementById("fulfillRequesterEmail").value.trim();
    const err=document.getElementById("fulfillError");
    const btn=document.getElementById("fulfillSendCode");err.style.display="none";
    if(!email){err.textContent="Enter the email you supplied when you posted the request.";err.style.display="block";return}
    btn.disabled=true;btn.textContent="Sending...";
    try{const r=await IER.apiPost("requestRequesterEmailCode",{requestId,email});IER.showToast(r.message||"Check your email.");if(!r.ok){err.textContent=r.message;err.style.display="block"}}
    catch(e){err.textContent="Unable to send code right now.";err.style.display="block"}
    finally{btn.disabled=false;btn.textContent="Email me a code"}
  };
  window.confirmFulfilmentReport=async()=>{
    const requestId=document.getElementById("fulfillId").value;
    const err=document.getElementById("fulfillError");err.style.display="none";
    const btn=document.getElementById("fulfillSubmitBtn");btn.disabled=true;btn.textContent="Reporting...";
    try{
      let result;
      if(document.getElementById("fulfillAsRequester").checked){
        const token=privateTokenFor(requestId);
        if(token){
          result=await IER.apiPost("manageRequestByPrivateLink",{requestId,managementToken:token,decision:document.getElementById("fulfillRequesterDecision").value});
        }else{
          const email=document.getElementById("fulfillRequesterEmail").value.trim(),code=document.getElementById("fulfillRequesterCode").value.trim();
          if(!email||!/\d{6}$/.test(code)){err.textContent="Enter your request email and the 6-digit code.";err.style.display="block";return}
          result=await IER.apiPost("confirmRequesterEmailCode",{requestId,email,code,decision:document.getElementById("fulfillRequesterDecision").value});
        }
      }else{
        const reason=document.getElementById("fulfillMemberReason").value;
        IER.closeModal("fulfillModal");
        await IER.reportTrustedMemberFulfilment(requestId,reason,render);
        return;
      }
      if(!result.ok){err.textContent=result.message||"Could not report fulfilment.";err.style.display="block";return}
      IER.closeModal("fulfillModal");IER.showToast(result.message||"Fulfilment reported.");
      try{localStorage.removeItem("ier_v25_public_cache")}catch(e){}
      await IER.reloadPublicData();render();
    }catch(e){err.textContent="Could not report fulfilment. Please try again.";err.style.display="block";}
    finally{btn.disabled=false;btn.textContent="Report fulfilment";}
  };

  render();

  const id=q.get("id");
  let linkHandled=!id;
  function tryOpenSharedRequest(){
    if(linkHandled || IER.publicState()==="loading")return;
    linkHandled=true;
    if(IER.requests().some(r=>r.id===id)){
      if(privateTokenFor(id))window.openFulfill(id);
      else window.openRequestDetail(id);
    }
    else IER.showToast("This request is no longer available.");
  }
  window.addEventListener("ierDataChanged",()=>{render();tryOpenSharedRequest();});
  tryOpenSharedRequest();
  if(location.hash==="#open")setTimeout(openCreate,50);
});
