const IER = (() => {
  const NOW = new Date();
  const DONOR_KEY = "ier_v17_demo_donors";
  const REQUEST_KEY = "ier_v17_demo_requests";
  const PUBLIC_CACHE_KEY = "ier_v27_public_cache";
  const CLIENT_ID_KEY = "ier_client_id_v1";
  const GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
  const STREAMS = ["Language Education","Social Science Education","Special Education","Science, Mathematics and Technology Education (SMTE)"];
  const DISTRICTS = ["Dhaka","Faridpur","Gazipur","Gopalganj","Kishoreganj","Madaripur","Manikganj","Munshiganj","Narayanganj","Narsingdi","Rajbari","Shariatpur","Tangail","Chattogram","Cox's Bazar","Cumilla","Feni","Brahmanbaria","Rangamati","Noakhali","Chandpur","Lakshmipur","Khagrachhari","Bandarban","Rajshahi","Sirajganj","Pabna","Bogura","Natore","Joypurhat","Chapainawabganj","Naogaon","Khulna","Jashore","Satkhira","Meherpur","Narail","Chuadanga","Kushtia","Magura","Bagerhat","Jhenaidah","Barishal","Jhalokati","Patuakhali","Pirojpur","Bhola","Barguna","Sylhet","Moulvibazar","Habiganj","Sunamganj","Rangpur","Panchagarh","Dinajpur","Lalmonirhat","Nilphamari","Gaibandha","Thakurgaon","Kurigram","Mymensingh","Sherpur","Jamalpur","Netrokona"];
  const CONTACT_EMAIL = "ierbloodnetwork@gmail.com";
  const DHAKA_CITY = ["In Campus","Shahbag","Dhanmondi","Kalabagan","New Market / Nilkhet","Azimpur","Lalbagh","Hazaribagh","Mohammadpur","Shyamoli / Adabor","Farmgate","Tejgaon","Agargaon","Mirpur","Pallabi","Kafrul / Kazipara / Shewrapara","Cantonment / Kochukhet","Mohakhali","Banani","Gulshan","Baridhara / Niketan","Badda","Bashundhara R/A","Kuril / Khilkhet / Nikunja","Uttara","Dakshinkhan / Airport / Ashkona","Uttarkhan","Rampura","Banasree","Khilgaon","Basabo","Malibagh","Moghbazar","Shantinagar / Kakrail","Motijheel","Paltan","Wari","Old Dhaka","Gendaria","Jatrabari","Mugda / Manda","Sabujbagh","Demra","Shyampur / Kadamtali","Kamrangirchar"];
  const DHAKA_UPAZILAS = ["Savar","Dhamrai","Keraniganj","Nawabganj","Dohar"];
  const DHAKA = [...DHAKA_CITY, ...DHAKA_UPAZILAS, "Other Dhaka District"];
  function isoDayOffset(days){const d=new Date(NOW);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
  function isoMonthOffset(months){const d=new Date(NOW);d.setMonth(d.getMonth()+months);return d.toISOString().slice(0,10)}
  function isoHourOffset(hours){return new Date(NOW.getTime()+hours*3600000).toISOString()}


  const donorSeed = [
    {id:"demo-d1",isDemo:true,name:"Sample Donor 01",batch:"Sample batch",stream:"Language Education",blood:"O+",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-80),availability:"Available",route:"direct",updated:isoDayOffset(-5),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d2",isDemo:true,name:"Sample Donor 02",batch:"Sample batch",stream:"Social Science Education",blood:"A+",city:"Dhaka",area:"Sample area",other:"",donated:false,last:"",availability:"Available",route:"facebook",facebook:"",updated:isoDayOffset(-18),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d3",isDemo:true,name:"Sample Donor 03",batch:"Sample batch",stream:"Special Education",blood:"B+",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-120),availability:"Emergency only",route:"direct",updated:isoDayOffset(-35),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d4",isDemo:true,name:"Sample Donor 04",batch:"Sample batch",stream:"Science, Mathematics and Technology Education (SMTE)",blood:"AB+",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-160),availability:"Available",route:"facebook",facebook:"",updated:isoDayOffset(-70),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d5",isDemo:true,name:"Sample Donor 05",batch:"Sample batch",stream:"Language Education",blood:"O-",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-55),availability:"Available",route:"direct",updated:isoMonthOffset(-7),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d6",isDemo:true,name:"Sample Donor 06",batch:"Sample batch",stream:"Social Science Education",blood:"A-",city:"Dhaka",area:"Sample area",other:"",donated:false,last:"",availability:"Available",route:"direct",updated:isoDayOffset(-10),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d7",isDemo:true,name:"Sample Donor 07",batch:"Sample batch",stream:"Science, Mathematics and Technology Education (SMTE)",blood:"B-",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-120),availability:"Available",route:"direct",updated:isoDayOffset(-22),communityAvailability:null,availabilityHistory:[]},
    {id:"demo-d8",isDemo:true,name:"Sample Donor 08",batch:"Sample batch",stream:"Special Education",blood:"AB-",city:"Dhaka",area:"Sample area",other:"",donated:true,last:isoDayOffset(-190),availability:"Emergency only",route:"facebook",facebook:"",updated:isoMonthOffset(-7),communityAvailability:null,availabilityHistory:[]}
  ];

  const requestSeed = [
    {id:"DEMO-R1",isDemo:true,blood:"O+",units:2,hospital:"Sample Hospital",district:"Dhaka",area:"Sample area",needed:isoHourOffset(4),name:"Sample Requester",batch:"Sample batch",urgent:true,note:"Sample request for demonstration only.",created:isoHourOffset(-1),status:"Open",fulfilmentReportedAt:"",reportedByType:"",reportedReason:""},
    {id:"DEMO-R2",isDemo:true,blood:"B+",units:1,hospital:"Sample Hospital",district:"Dhaka",area:"Sample area",needed:isoHourOffset(14),name:"Sample Requester",batch:"Sample batch",urgent:false,note:"Sample request for demonstration only.",created:isoHourOffset(-3),status:"Open",fulfilmentReportedAt:"",reportedByType:"",reportedReason:""},
    {id:"DEMO-R3",isDemo:true,blood:"A-",units:1,hospital:"Sample Hospital",district:"Dhaka",area:"Sample area",needed:isoHourOffset(2),name:"Sample Requester",batch:"Sample batch",urgent:true,note:"Sample request for demonstration only.",created:isoHourOffset(-0.5),status:"Open",fulfilmentReportedAt:"",reportedByType:"",reportedReason:""}
  ];

  function loadDemo(key,seed){
    try{const parsed=JSON.parse(localStorage.getItem(key));return Array.isArray(parsed)?parsed:structuredClone(seed)}catch(e){return structuredClone(seed)}
  }
  let demoDonors=loadDemo(DONOR_KEY,donorSeed),demoRequests=loadDemo(REQUEST_KEY,requestSeed);
  let realDonors=[],realRequests=[],donors=[],requests=[];
  let publicState="loading",hasCachedPublicData=false;

  function persist(){
    localStorage.setItem(DONOR_KEY,JSON.stringify(demoDonors));
    localStorage.setItem(REQUEST_KEY,JSON.stringify(demoRequests));
  }
  function resetDemo(){
    demoDonors=structuredClone(donorSeed);demoRequests=structuredClone(requestSeed);persist();refreshCombinedData();window.dispatchEvent(new CustomEvent("ierDataChanged"));
  }
  function realOpenRequestCount(){return realRequests.filter(r=>requestStatus(r)==="Open").length}
  function canUseSamples(){return publicState!=="loading"||hasCachedPublicData}
  function useDemoDonors(){return canUseSamples()&&realDonors.length<20}
  function useDemoRequests(){return canUseSamples()&&realOpenRequestCount()<2}
  function refreshCombinedData(){donors=[...realDonors,...(useDemoDonors()?demoDonors:[])];requests=[...realRequests,...(useDemoRequests()?demoRequests:[])]}

  function apiUrl(){return (window.IER_CONFIG&&window.IER_CONFIG.API_URL)||""}
  function clientId(){
    try{
      let id=localStorage.getItem(CLIENT_ID_KEY);
      if(!id){id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():`c_${Date.now()}_${Math.random().toString(36).slice(2)}`;localStorage.setItem(CLIENT_ID_KEY,id)}
      return id;
    }catch(e){return `session_${Date.now()}`}
  }
  async function apiPost(action,data={}){
    const url=apiUrl();if(!url)throw new Error("API is not configured.");
    const response=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,data,clientId:clientId()}),redirect:"follow"});
    const text=await response.text();let result;try{result=JSON.parse(text)}catch(e){throw new Error("Unreadable server response.")};return result;
  }
  let memberSessionToken="";
  let currentMember=null;
  // Per-tab storage survives navigation between standalone HTML pages.
  try {const saved=JSON.parse(sessionStorage.getItem("ier_member_session")||"null");
    if(saved && /^[a-f0-9]{64}$/i.test(saved.token||"")){
      memberSessionToken=saved.token;currentMember=saved.member||null;
    }
  }catch(ignored){}
  function saveMemberSession(){try{sessionStorage.setItem("ier_member_session",JSON.stringify({token:memberSessionToken,member:currentMember}));}catch(ignored){}updateAccountUI();}
  function clearMemberSession(){memberSessionToken="";currentMember=null;try{sessionStorage.removeItem("ier_member_session")}catch(ignored){}updateAccountUI();}
  function handleMemberAuthFailure(result,retry){
    if(result && !result.ok && /sign in|session|expired|not authenticated/i.test(result.message||"")){
      clearMemberSession();showMemberModal(retry);return true;
    }return false;
  }
  function updateAccountUI(){
    if(!document.body)return;
    const signedIn=Boolean(memberSessionToken&&currentMember);
    document.body.classList.toggle("is-member-signed-in",signedIn);
  }
  function openAccountPanel(){
    if(!memberSessionToken||!currentMember){showMemberModal(()=>openAccountPanel());return}
    let overlay=document.getElementById("accountPanelModal");
    if(!overlay){
      overlay=document.createElement("div");overlay.className="modal";overlay.id="accountPanelModal";
      overlay.setAttribute("onclick","IER.bgClose(event,'accountPanelModal')");
      overlay.innerHTML=`<div class="modal-card account-panel-card"><div class="modal-head"><h2 style="margin:0">My account</h2><button type="button" class="close" aria-label="Close account menu" onclick="IER.closeModal('accountPanelModal')">×</button></div>
       <div class="account-panel-identity" id="accountPanelName"></div>
       <div class="account-panel-actions">
       <button type="button" class="btn" id="accountProfileBtn">Update donor information</button>
       <button type="button" class="btn" id="accountHistoryBtn">Contact access history</button>
       <a class="btn" href="faq.html">Help and FAQ</a>
       <button type="button" class="btn" id="accountLogoutBtn">Sign out</button>
       </div></div>`;
      document.body.appendChild(overlay);
      overlay.querySelector("#accountProfileBtn").onclick=()=>{closeModal("accountPanelModal");openLogin()};
      overlay.querySelector("#accountHistoryBtn").onclick=()=>{closeModal("accountPanelModal");showMyContactViews()};
      overlay.querySelector("#accountLogoutBtn").onclick=()=>{closeModal("accountPanelModal");clearMemberSession();showToast("Signed out.")};
    }
    const donor=Boolean(currentMember.donorId);
    overlay.querySelector("#accountPanelName").textContent=currentMember.name||"Member";
    overlay.querySelector("#accountProfileBtn").hidden=!donor;
    overlay.querySelector("#accountHistoryBtn").hidden=!donor;
    openModal("accountPanelModal");
  }
  let memberContactAfterLogin=null;
  function showMemberModal(onSuccess){
    injectSharedModals();
    memberContactAfterLogin=typeof onSuccess==="function"?onSuccess:null;
    // Never stack account verification behind the donor details window.
    closeModal("donorDetailModal");
    closeModal("myContactViewsModal");
    document.getElementById("memberEmailCodeSection").classList.add("hidden");
    document.getElementById("memberAuthError").textContent="";
    setMemberAuthMode("signin");
    openModal("memberAuthModal");
  }
  function setMemberAuthMode(mode){
    const register=mode==="register";
    const section=document.getElementById("memberRegistrationFields");
    if(!section)return;
    section.classList.toggle("hidden",!register);
    document.getElementById("memberAuthHeading").textContent=register?"Create a member account":"Sign in to view donor contact";
    document.getElementById("memberAuthNote").textContent=register
      ?"You do not need to become a blood donor. Register with your name, batch, stream, phone and email."
      :"Already registered? Enter your email and we'll send a sign-in code.";
    document.getElementById("memberAuthError").textContent="";
    document.getElementById("memberEmailCodeSection").classList.add("hidden");
    document.getElementById("memberSignInTab").setAttribute("aria-pressed",String(!register));
    document.getElementById("memberRegisterTab").setAttribute("aria-pressed",String(register));
  }
  async function requestMemberCode(){
    const error=document.getElementById("memberAuthError");error.textContent="";
    const email=document.getElementById("memberEmail").value.trim();
    const data={email,fullName:document.getElementById("memberName").value.trim(),batch:document.getElementById("memberBatch").value.trim(),stream:document.getElementById("memberStream").value,phone:document.getElementById("memberPhone").value.trim()};
    const button=document.getElementById("memberRequestCodeBtn");button.disabled=true;
    try{
      const result=await apiPost("requestMemberEmailCode",data);
      if(!result.ok){error.textContent=result.message==="Invalid action."?"Account sign-in is not available on the connected backend yet. This development copy cannot be used with the older deployed backend.":(result.message||"Could not send code.");return}
      document.getElementById("memberEmailCodeSection").classList.remove("hidden");

    }catch(e){error.textContent="Could not connect to the server."}finally{button.disabled=false}
  }
  async function confirmMemberCode(){
    const error=document.getElementById("memberAuthError");error.textContent="";
    const button=document.getElementById("memberConfirmCodeBtn");button.disabled=true;
    try{
      const result=await apiPost("confirmMemberEmailCode",{email:document.getElementById("memberEmail").value.trim(),code:document.getElementById("memberCode").value.trim()});
      if(!result.ok){error.textContent=result.message||"Could not verify.";return}
      memberSessionToken=result.sessionToken;currentMember=result.member;saveMemberSession();
      closeModal("memberAuthModal");showToast("Signed in as "+result.member.name);
      if(memberContactAfterLogin){const fn=memberContactAfterLogin;memberContactAfterLogin=null;fn()}
    }catch(e){error.textContent="Could not verify your account."}finally{button.disabled=false}
  }
  async function showMyContactViews(){
    if(!memberSessionToken){showMemberModal(()=>showMyContactViews());return}
    try{
      const result=await apiPost("getMyContactAccess",{sessionToken:memberSessionToken});
      if(!result.ok){if(!handleMemberAuthFailure(result,()=>showMyContactViews()))showToast(result.message||"Please sign in again.");return}
      const list=document.getElementById("myContactViewsList");
      list.innerHTML=result.entries.length?result.entries.map(x=>`<div class="detail" style="margin-bottom:8px"><b>${escapeHtml(x.name)}</b><div>${escapeHtml(x.batch)} · ${escapeHtml(x.stream)}</div><small>${escapeHtml(x.method)} · ${escapeHtml(friendlyDateTime(x.at))}</small></div>`).join(""):"No one has viewed your contact details yet, or your donor profile is not linked to this account.";
      openModal("myContactViewsModal");
    }catch(e){showToast("Could not load contact history.")}
  }
  function acceptVerifiedMember(result){
    if (!result || !result.ok || !/^[a-f0-9]{64}$/i.test(String(result.sessionToken||""))) return false;
    memberSessionToken=result.sessionToken;
    currentMember=result.member;
    saveMemberSession();
    return true;
  }
  function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]))}
  function escapeAttr(value){return escapeHtml(value)}
  function safeFacebookUrl(value){
    try{const u=new URL(String(value||""));if(!/^https?:$/.test(u.protocol)||!/(^|\.)facebook\.com$/i.test(u.hostname))return "";return u.href}catch(e){return ""}
  }
  const turnstileState={};
  let turnstileScriptPromise=null;
  function turnstileSiteKey(){return String((window.IER_CONFIG&&window.IER_CONFIG.TURNSTILE_SITE_KEY)||"").trim()}
  function turnstileEnabled(){return Boolean(turnstileSiteKey())&&/^https?:$/.test(location.protocol)}
  function loadTurnstile(){
    if(!turnstileEnabled())return Promise.resolve(false);
    if(window.turnstile)return Promise.resolve(true);
    if(turnstileScriptPromise)return turnstileScriptPromise;
    turnstileScriptPromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async=true;script.defer=true;
      script.onload=()=>resolve(true);script.onerror=()=>reject(new Error("Could not load verification challenge."));
      document.head.appendChild(script);
    });
    return turnstileScriptPromise;
  }
  async function initTurnstile(containerId,action){
    const el=document.getElementById(containerId);if(!el)return false;
    if(!turnstileEnabled()){el.classList.add("hidden");return false}
    await loadTurnstile();el.classList.remove("hidden");
    if(turnstileState[containerId]&&turnstileState[containerId].widgetId!=null)return true;
    const state={widgetId:null,token:""};turnstileState[containerId]=state;
    state.widgetId=window.turnstile.render(el,{
      sitekey:turnstileSiteKey(),theme:"auto",size:"flexible",appearance:"interaction-only",action,
      callback:token=>{state.token=token||""},
      "expired-callback":()=>{state.token=""},
      "error-callback":()=>{state.token=""}
    });
    return true;
  }
  function getTurnstileToken(containerId){return turnstileState[containerId]?.token||""}
  function resetTurnstile(containerId){
    const state=turnstileState[containerId];if(!state)return;state.token="";
    try{if(window.turnstile&&state.widgetId!=null)window.turnstile.reset(state.widgetId)}catch(e){}
  }
  function toIsoDay(value){if(!value)return "";const d=new Date(value);return Number.isNaN(d.getTime())?String(value).slice(0,10):d.toISOString().slice(0,10)}
  function mapPublicDonor(x){
    const community=x.communityAvailability?{
      status:String(x.communityAvailability.status||""),
      updatedByName:String(x.communityAvailability.updatedByName||""),
      updatedByBatch:String(x.communityAvailability.updatedByBatch||""),
      reason:String(x.communityAvailability.reason||""),
      updatedAt:String(x.communityAvailability.updatedAt||""),
      expiresAt:String(x.communityAvailability.expiresAt||"")
    }:null;
    const history=Array.isArray(x.availabilityHistory)?x.availabilityHistory.map(h=>({
      type:"community",status:String(h.status||""),updatedByName:String(h.updatedByName||""),updatedByBatch:String(h.updatedByBatch||""),reason:String(h.reason||""),updatedAt:String(h.updatedAt||""),expiresAt:String(h.expiresAt||""),state:String(h.state||"")
    })):[];
    return {id:String(x.id||""),isDemo:false,name:String(x.name||""),batch:batchLabel(x.batchNumber||""),stream:String(x.stream||""),blood:String(x.bloodGroup||""),city:String(x.district||""),area:String(x.area||""),other:"",donated:String(x.donatedBefore||"").toLowerCase()==="yes",last:toIsoDay(x.lastDonationDate),availability:String(x.availability||"Available"),route:String(x.contactPreference||"")==="Facebook"?"facebook":String(x.contactPreference||"")==="Both"?"both":"direct",facebook:"",updated:toIsoDay(x.lastUpdated),communityAvailability:community,availabilityHistory:history}
  }
  function mapPublicRequest(x){return {id:String(x.id||""),isDemo:false,blood:String(x.bloodGroup||""),units:x.units?Number(x.units):null,hospital:String(x.hospital||""),district:String(x.district||""),area:String(x.area||""),needed:String(x.neededBy||""),name:String(x.requesterName||""),batch:batchLabel(x.requesterBatch||""),sharePhoneInPoster:x.sharePhoneInPoster===true,urgent:String(x.urgent||"").toLowerCase()==="yes",note:String(x.note||""),created:String(x.createdAt||""),status:String(x.status||"Open"),fulfilmentReportedAt:String(x.fulfilmentReportedAt||""),reportedByType:String(x.reportedByType||""),reportedReason:String(x.reportedReason||""),memberReportPending:x.memberReportPending===true,memberReportAt:String(x.memberReportAt||"")}}
  function loadPublicCache(){
    try{
      const cached=JSON.parse(localStorage.getItem(PUBLIC_CACHE_KEY)||"null");
      if(!cached||!Array.isArray(cached.donors)||!Array.isArray(cached.requests))return false;
      if(cached.savedAt&&Date.now()-Number(cached.savedAt)>86400000)return false;
      realDonors=cached.donors.map(mapPublicDonor);
      realRequests=cached.requests.map(mapPublicRequest);
      hasCachedPublicData=true;publicState="refreshing";refreshCombinedData();
      return true;
    }catch(e){return false}
  }
  function savePublicCache(donorsRaw,requestsRaw){
    try{localStorage.setItem(PUBLIC_CACHE_KEY,JSON.stringify({savedAt:Date.now(),donors:donorsRaw,requests:requestsRaw}))}catch(e){}
  }
  loadPublicCache();
  refreshCombinedData();
  function jsonpGet(action){
    return new Promise((resolve,reject)=>{
      const base=apiUrl();
      if(!base){reject(new Error("API is not configured."));return}
      const cb="ierJsonp_"+Date.now()+"_"+Math.random().toString(36).slice(2);
      const script=document.createElement("script");
      const timer=setTimeout(()=>{cleanup();reject(new Error("Live data request timed out."));},8000);
      function cleanup(){clearTimeout(timer);delete window[cb];script.remove();}
      window[cb]=(data)=>{cleanup();resolve(data)};
      script.onerror=()=>{cleanup();reject(new Error("Could not load live data."));};
      script.src=base+(base.includes("?")?"&":"?")+"action="+encodeURIComponent(action)+"&callback="+encodeURIComponent(cb)+"&_="+Date.now();
      document.head.appendChild(script);
    });
  }
  async function fetchPublic(action,attempts=1){
    for(let attempt=0;attempt<attempts;attempt++){
      try{return await jsonpGet(action)}catch(error){
        if(attempt===attempts-1)throw error;
        await new Promise(resolve=>setTimeout(resolve,350*Math.pow(2,attempt)+Math.random()*300));
      }
    }
  }

  async function reloadPublicData(){
    const url=apiUrl();
    if(!url){publicState="error";refreshCombinedData();window.dispatchEvent(new CustomEvent("ierDataChanged"));return false}
    if(hasCachedPublicData)publicState="refreshing";else publicState="loading";
    refreshCombinedData();window.dispatchEvent(new CustomEvent("ierDataChanged"));
    let changed=false;
    try{
      const combined=await fetchPublic("getPublicData");
      if(combined&&combined.ok&&Array.isArray(combined.donors)&&Array.isArray(combined.requests)){
        realDonors=combined.donors.map(mapPublicDonor);
        realRequests=combined.requests.map(mapPublicRequest);
        savePublicCache(combined.donors,combined.requests);
        hasCachedPublicData=true;publicState="ready";changed=true;
      }else{throw new Error("Invalid live data response.")}
    }catch(combinedError){
      console.warn("Combined live-data request failed; trying separate endpoints.",combinedError);
      const [donorResult,requestResult]=await Promise.allSettled([fetchPublic("getPublicDonors"),fetchPublic("getPublicRequests")]);
      let donorsRaw=null,requestsRaw=null;
      if(donorResult.status==="fulfilled"&&donorResult.value&&donorResult.value.ok&&Array.isArray(donorResult.value.donors)){donorsRaw=donorResult.value.donors;realDonors=donorsRaw.map(mapPublicDonor);changed=true}
      if(requestResult.status==="fulfilled"&&requestResult.value&&requestResult.value.ok&&Array.isArray(requestResult.value.requests)){requestsRaw=requestResult.value.requests;realRequests=requestsRaw.map(mapPublicRequest);changed=true}
      if(changed){
        if(donorsRaw&&requestsRaw)savePublicCache(donorsRaw,requestsRaw);
        hasCachedPublicData=hasCachedPublicData||Boolean(donorsRaw&&requestsRaw);publicState="ready";
      }else publicState=hasCachedPublicData?"cached":"error";
    }
    refreshCombinedData();window.dispatchEvent(new CustomEvent("ierDataChanged"));return changed;
  }
  function normPhone(v){
    let x=(v||"").replace(/[^\d]/g,"");
    if(x.startsWith("880")) x="0"+x.slice(3);
    return x;
  }
  function isValidPhone(v){return /^01\d{9}$/.test(normPhone(v))}
  function batchLabel(v){
    const n=Number(String(v).trim());if(!Number.isInteger(n)||n<1)return String(v).trim();
    const mod100=n%100,mod10=n%10;let suffix="th";
    if(mod100<11||mod100>13){if(mod10===1)suffix="st";else if(mod10===2)suffix="nd";else if(mod10===3)suffix="rd"}
    return `${n}${suffix} Batch`;
  }
  function findDuplicateDonor(data){
    const phone=normPhone(data.phone),email=(data.email||"").trim().toLowerCase(),ier=(data.ierId||"").trim().toLowerCase();
    const d=donors.find(x=>(phone&&normPhone(x.phone)===phone)||(email&&(x.email||"").toLowerCase()===email)||(ier&&(x.ierId||"").toLowerCase()===ier));
    if(!d)return null;
    if(phone&&normPhone(d.phone)===phone)return {donor:d,field:"regPhone"};
    if(email&&(d.email||"").toLowerCase()===email)return {donor:d,field:"regEmail"};
    return {donor:d,field:"regIerId"};
  }
  function addDonor(data){
    const d={id:`u${Date.now()}`,...data,updated:new Date().toISOString().slice(0,10),communityAvailability:null,availabilityHistory:[]};
    donors.push(d);persist();window.dispatchEvent(new CustomEvent("ierDataChanged"));return d;
  }
  function currentTime(){return new Date()}
  function cutoffDate(){
    const c=currentTime();
    c.setMonth(c.getMonth()-6);
    return c;
  }
  function isConfirmed(d){
    const u=new Date(d.updated+"T00:00:00+06:00");
    return u>cutoffDate();
  }
  function activeCommunityAvailability(d){
    const c=d.communityAvailability;
    if(!c)return null;
    const exp=new Date(c.expiresAt);
    return exp>currentTime()?c:null;
  }
  function effectiveAvailability(d){
    if(!isConfirmed(d))return "Needs confirmation";
    const c=activeCommunityAvailability(d);
    return c?c.status:d.availability;
  }
  function availabilitySource(d){
    if(!isConfirmed(d))return {type:"stale",label:"Needs confirmation"};
    const c=activeCommunityAvailability(d);
    if(c)return {type:"community",label:`Updated by ${c.updatedByName} (${c.updatedByBatch})`,data:c};
    return {type:"donor",label:`Last updated by ${d.name} (${d.batch})`};
  }
  function communityExpiryText(d){
    const c=activeCommunityAvailability(d);
    if(!c)return "";
    const ms=new Date(c.expiresAt)-currentTime();
    if(ms<=0)return "Expired";
    const days=Math.ceil(ms/86400000);
    return `Community update expires in ${days} day${days===1?"":"s"}`;
  }
  function monthAge(d){
    const u=new Date(d.updated+"T00:00:00+06:00"),now=currentTime();
    let months=(now.getFullYear()-u.getFullYear())*12+(now.getMonth()-u.getMonth());
    if(now.getDate()<u.getDate())months--;
    return Math.max(0,months);
  }
  function freshnessText(d){
    const now=currentTime();
    if(!isConfirmed(d)){
      const m=monthAge(d);
      return `Last confirmed ${m||6} month${m===1?"":"s"} ago`;
    }
    const days=Math.floor((now-new Date(d.updated+"T00:00:00+06:00"))/86400000);
    if(days<=0)return "Updated today";
    if(days<30)return `Updated ${days} day${days===1?"":"s"} ago`;
    const m=Math.max(1,Math.floor(days/30));
    return `Updated ${m} month${m===1?"":"s"} ago`;
  }
  function locationText(d){
    const area=(d.area||d.other||"").trim();
    if(area && d.city) return `${area}, ${d.city}`;
    return area||d.city||"Location not specified";
  }
  function donationText(d){
    if(!d.donated) return "First-time donor";
    if(!d.last) return "Previous donor";
    return "Last donated: "+new Date(d.last+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
  }
  function communityReasonLabel(reason){
    const map={contacted:"Contacted donor directly",told:"Donor told me directly",donated:"Donor just donated",other:"Other"};
    return map[reason]||reason||"Not specified";
  }
  function friendlyDateTime(v){
    return new Date(v).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"});
  }
  function requestStatus(r){
    if(r.status==="Fulfilment Reported"||r.status==="Fulfilled")return "Fulfilment Reported";
    if(r.status==="Expired")return "Expired";
    if(new Date(r.needed)<=currentTime())return "Expired";
    return "Open";
  }
  function requestFulfilmentReasonLabel(reason){
    const map={requester:"Reported by requester",confirmed:"Verified member confirmed with requester",donated:"Verified member donated for this request",requester_told:"Requester told a verified member it was fulfilled"};
    return map[reason]||"Fulfilment reported";
  }
  function formatDateTime(v){
    return new Date(v).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
  }
  function timeAgo(v){
    const min=Math.max(0,Math.floor((currentTime()-new Date(v))/60000));
    if(min<60) return `${min} min ago`;
    const h=Math.floor(min/60);
    if(h<24) return `${h} hr${h===1?"":"s"} ago`;
    const d=Math.floor(h/24);
    return `${d} day${d===1?"":"s"} ago`;
  }
  function countdown(v){
    const ms=new Date(v)-currentTime();
    if(ms<=0) return "Deadline passed";
    const totalMin=Math.floor(ms/60000), days=Math.floor(totalMin/1440), hrs=Math.floor((totalMin%1440)/60), mins=totalMin%60;
    if(days>0) return `Needed in ${days}d ${hrs}h`;
    if(hrs>0) return `Needed in ${hrs}h ${mins}m`;
    return `Needed in ${mins}m`;
  }
  function openMail(subject, body){
    const url=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href=url;
  }
  function reportProblem(){
    openMail("IER Blood Donor Network: Problem report",`Hello,\n\nI found a problem on the IER Blood Donor Network website.\n\nPage: ${location.href}\n\nPlease describe the problem below:\n\n\n`);
  }
  function sendFeedback(){
    openMail("IER Blood Donor Network: Feedback",`Hello,\n\nI would like to share feedback about the IER Blood Donor Network.\n\nPage: ${location.href}\n\nFeedback:\n\n\n`);
  }
  function reportDonorInfo(d){
    if(!d||d.isDemo)return;
    openMail("IER Blood Donor Network: Incorrect donor information",`Hello,

I found information that may be incorrect.

Donor: ${d.name}
Batch: ${d.batch}
Blood Group: ${d.blood}

Please describe what seems incorrect below:


`);
  }
  function reportBloodRequest(r){
    if(!r||r.isDemo)return;
    openMail("IER Blood Donor Network: Report blood request",`Hello,

I would like to report a blood request.

Request ID: ${r.id}
Blood Group: ${r.blood}
Hospital / Location: ${r.hospital}
Needed by: ${formatDateTime(r.needed)}
Page: ${location.href}

Please describe the issue below:


`);
  }

  function showToast(text){
    let el=document.getElementById("globalToast");
    if(!el){
      el=document.createElement("div");el.id="globalToast";el.className="toast";document.body.appendChild(el);
    }
    el.textContent=text;el.classList.add("show");
    setTimeout(()=>el.classList.remove("show"),2600);
  }
  let modalReturnFocus=null;
  function openModal(id){
    const modal=document.getElementById(id);if(!modal)return;
    if(!document.querySelector(".modal.show"))modalReturnFocus=document.activeElement;
    modal.classList.add("show");document.body.style.overflow="hidden";
    const card=modal.querySelector(".modal-card")||modal;
    card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");card.tabIndex=-1;card.focus();
  }
  function closeModal(id){
    document.getElementById(id)?.classList.remove("show");
    if(!document.querySelector(".modal.show")){
      document.body.style.overflow="";if(modalReturnFocus?.isConnected)modalReturnFocus.focus();modalReturnFocus=null;
    }
  }
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"){
      const modals=[...document.querySelectorAll(".modal.show")];
      if(modals.length){event.preventDefault();closeModal(modals[modals.length-1].id)}
    }
  });
  function bgClose(e,id){if(e.target.id===id) closeModal(id)}
  function shareText(title,text,url){
    if(navigator.share){
      navigator.share({title,text,url}).catch(()=>{});
    }else{
      navigator.clipboard?.writeText(`${text}\n${url}`).then(()=>showToast("Share text copied."));
    }
  }
  function copyText(text,success="Copied."){
    if(navigator.clipboard && window.isSecureContext){navigator.clipboard.writeText(text).then(()=>showToast(success)).catch(()=>fallbackCopy(text,success));return}
    fallbackCopy(text,success);
  }
  function fallbackCopy(text,success){
    const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy");showToast(success)}catch(e){showToast("Copy this text manually.")}
    ta.remove();
  }
  function copyCurrentUrl(){copyText(location.href,"Link copied.")}
  function setupReveal(){
    const els=[...document.querySelectorAll(".reveal")];
    if(!("IntersectionObserver" in window)){els.forEach(x=>x.classList.add("visible"));return}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});
    els.forEach(x=>io.observe(x));
  }
  function animateNumber(el,target){
    if(!el) return;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=target;return}
    let start=0,frames=26;
    const tick=()=>{start++;el.textContent=Math.round(target*(start/frames));if(start<frames)requestAnimationFrame(tick)};
    tick();
  }
  function query(){return new URLSearchParams(location.search)}
  function navigateDonors(params={}){
    const p=new URLSearchParams();
    Object.entries(params).forEach(([k,v])=>{if(v)p.set(k,v)});
    location.href="donors.html"+(p.toString()?`?${p}`:"");
  }

  function injectSharedModals(){
    if(document.getElementById("loginModal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" id="memberAuthModal" onclick="IER.bgClose(event,'memberAuthModal')"><div class="modal-card" style="max-width:510px">
        <div class="modal-head"><div><h2 id="memberAuthHeading">Sign in to view donor contact</h2><p class="sub">Email verification protects donor contact details</p></div><button class="close" onclick="IER.closeModal('memberAuthModal')">×</button></div>
        <div class="member-auth-tabs" role="group" aria-label="Member account options"><button type="button" id="memberSignInTab" aria-pressed="true" onclick="IER.setMemberAuthMode('signin')">Sign in</button><button type="button" id="memberRegisterTab" aria-pressed="false" onclick="IER.setMemberAuthMode('register')">Create account</button></div>
        <p id="memberAuthNote" class="note"></p>
        <div class="form-group"><label for="memberEmail">Email address</label><input class="field" id="memberEmail" type="email" placeholder="name@example.com" autocomplete="email"></div>
        <div id="memberRegistrationFields" class="hidden">
          <div class="form-group"><label for="memberName">Full name</label><input class="field" id="memberName" maxlength="100"></div>
          <div class="form-group"><label for="memberBatch">Batch</label><input class="field" id="memberBatch" maxlength="3" inputmode="numeric"></div>
          <div class="form-group"><label for="memberStream">Stream</label><select class="field" id="memberStream"><option value="">Select</option>${STREAMS.map(x=>`<option value="${escapeAttr(x)}">${escapeHtml(x)}</option>`).join("")}</select></div>
          <div class="form-group"><label for="memberPhone">Phone</label><input class="field" id="memberPhone" placeholder="01XXXXXXXXX" inputmode="tel"></div>
        </div>
        <p class="note">By requesting contact details, you agree that the donor can privately view your name, batch, stream, contact method and access time.</p>
        <button class="btn primary full" id="memberRequestCodeBtn" onclick="IER.requestMemberCode()">Email me a code</button>
        <div id="memberEmailCodeSection" class="hidden"><div class="form-group"><label>6-digit email code</label><input id="memberCode" class="field" inputmode="numeric" maxlength="6"></div><button class="btn primary full" id="memberConfirmCodeBtn" onclick="IER.confirmMemberCode()">Verify and continue</button></div>
        <div class="err" id="memberAuthError"></div>
      </div></div>
      <div class="modal" id="myContactViewsModal" onclick="IER.bgClose(event,'myContactViewsModal')"><div class="modal-card"><div class="modal-head"><h2>Who viewed my contact?</h2><button class="close" onclick="IER.closeModal('myContactViewsModal')">×</button></div><div id="myContactViewsList"></div></div></div>
      <div class="modal" id="donorDetailModal" onclick="IER.bgClose(event,'donorDetailModal')">
        <div class="modal-card">
          <div class="modal-head">
            <div class="profile"><div class="blood-badge" id="mdBlood"></div><div><h2 id="mdName" style="margin:0"></h2><div class="sub" id="mdBasic"></div><div class="chips" id="mdChips"></div></div></div>
            <button class="close" onclick="IER.closeModal('donorDetailModal')">×</button>
          </div>
          <div class="detail-grid" id="mdDetails"></div>
          <div class="availability-history">
            <h3>Availability history</h3>
            <div id="mdAvailabilityHistory"></div>
          </div>
          <div class="community-box">
            <h3>Know this donor's current availability?</h3>
            <p>Verified IER members can temporarily update availability only. Other profile information remains under the donor's control.</p>
            <button class="btn soft" id="mdCommunityUpdateBtn">Update availability</button>
          </div>
          <div class="contact"><b>Contact donor</b><div class="contact-actions" id="mdContact"></div><div class="note" id="mdNote"></div></div>
          <div style="margin-top:12px"><button class="link-btn" id="mdReportInfo">Report incorrect information</button></div>
        </div>
      </div>

      <div class="modal" id="communityAvailabilityModal" onclick="IER.bgClose(event,'communityAvailabilityModal')">
        <div class="modal-card" style="max-width:520px">
          <div class="modal-head"><div><h2 style="margin:0">Update donor availability</h2><div class="sub" id="communityAvailabilitySub"></div></div><button class="close" onclick="IER.closeModal('communityAvailabilityModal')">×</button></div>
          <input type="hidden" id="communityUpdaterId">
          <input type="hidden" id="communityAvailabilityTargetId">
          <div class="form-group"><label>Availability</label>
            <select class="field" id="communityStatus"><option>Available</option><option>Emergency only</option><option>Temporarily unavailable</option></select>
          </div>
          <div class="form-group"><label>Reason</label>
            <select class="field" id="communityReason">
              <option value="contacted">I contacted the donor directly</option>
              <option value="told">Donor told me directly</option>
              <option value="donated">Donor just donated</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group"><label>How long should this update apply?</label>
            <select class="field" id="communityDuration"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select>
          </div>
          <div class="note">A community availability update does not count as the donor's own profile confirmation.</div>
          <button class="btn primary full" style="margin-top:13px" onclick="IER.saveCommunityAvailability()">Save availability update</button>
        </div>
      </div>

      <div class="modal" id="loginModal" onclick="IER.bgClose(event,'loginModal')">
        <div class="modal-card" style="max-width:480px">
          <div class="modal-head"><div><h2 style="margin:0">Update my information</h2><div class="sub">Use your registered phone with your IER ID or registered email.</div></div><button class="close" onclick="IER.closeModal('loginModal')">×</button></div>
          <div class="form-group"><label>Registered phone number</label><input class="field" id="loginPhone" inputmode="tel" placeholder="01XXXXXXXXX"></div>
          <div class="verify-options">
            <div class="verify-option"><input type="radio" name="verifyMode" id="verifyId" value="id" checked><label for="verifyId">I know my IER ID</label></div>
            <div class="verify-option"><input type="radio" name="verifyMode" id="verifyEmail" value="email"><label for="verifyEmail">I don’t remember my IER ID</label></div>
          </div>
          <div class="form-group"><label id="identifierLabel">IER ID</label><input class="field" id="loginIdentifier" placeholder="Enter IER ID"></div>
          <button class="btn primary full" id="loginContinueBtn" style="margin-top:13px" onclick="IER.verifyDonor()">Continue</button>
          <div class="note" id="loginHint">Your phone is used for verification even when Facebook is your public contact method.</div>
          <div class="err" id="loginError">Could not verify the information provided.</div>
        </div>
      </div>

      <div class="modal" id="editorModal" onclick="IER.bgClose(event,'editorModal')">
        <div class="modal-card">
          <div class="modal-head"><div><h2 style="margin:0" id="editTitle">Update donor</h2><div class="sub">Saving updates reconfirms your profile.</div></div><button class="close" onclick="IER.closeModal('editorModal')">×</button></div>
          <input type="hidden" id="editId"><input type="hidden" id="editToken">
          <div class="divider"><h3>Member record</h3><div class="form-grid">
            <div class="form-group"><label>Name</label><input class="field readonly" id="editName" readonly></div>
            <div class="form-group"><label>Blood group</label><input class="field readonly" id="editBlood" readonly></div>
            <div class="form-group"><label>Batch</label><input class="field readonly" id="editBatch" readonly></div>
            <div class="form-group"><label>Stream</label><input class="field readonly" id="editStream" readonly></div>
          </div></div>
          <div class="divider"><h3>Location</h3><div class="form-grid">
            <div class="form-group"><label>In Dhaka District?</label><select class="field" id="editDhakaCity"><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div class="form-group hidden" id="editDistrictWrap"><label>Current district</label><select class="field" id="editDistrict"></select></div>
            <div class="form-group" id="editDhakaAreaWrap"><label>Current area</label><select class="field" id="editArea"></select></div>
            <div class="form-group hidden" id="editOtherWrap"><label>Current area / locality (optional)</label><input class="field" id="editOther" placeholder="Enter current area"></div>
          </div></div>
          <div class="divider"><h3>Donation and availability</h3><div class="form-grid">
            <div class="form-group"><label>Have you donated before?</label><select class="field" id="editDonated"><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div class="form-group" id="editDateWrap"><label>Last donation date</label><input class="field" type="date" id="editDate"></div>
          </div>
          <div class="status-choices" style="margin-top:10px">
            <div><input id="eav1" name="eav" type="radio" value="Available"><label for="eav1">Available</label></div>
            <div><input id="eav2" name="eav" type="radio" value="Emergency only"><label for="eav2">Emergency only</label></div>
            <div><input id="eav3" name="eav" type="radio" value="Temporarily unavailable"><label for="eav3">Temporarily unavailable</label></div>
          </div></div>
          <div class="divider"><h3>Contact and notifications</h3><div class="form-grid">
            <div class="form-group"><label>Email address</label><input class="field" id="editEmail" type="email"><small class="field-help">Used for profile verification and recovery. It is not public.</small></div>
            <div class="form-group"><label>Phone number</label><input class="field" id="editPhone"></div>
            <div class="form-group"><label>Public contact route</label><select class="field" id="editRoute"><option value="direct">Phone / WhatsApp</option><option value="facebook">Facebook</option><option value="both">Both</option></select></div>
            <div class="form-group" id="editFacebookWrap"><label>Facebook profile link</label><input class="field" id="editFacebook"></div>
            <div class="form-group"><label>Receive matching blood request emails?</label><select class="field" id="editAlerts"><option value="yes">Yes</option><option value="no">No</option></select><small class="field-help">Emails are sent only for matching blood group and district when your current availability qualifies.</small></div>
          </div></div>
          <div style="display:flex;gap:8px;margin-top:17px"><button class="btn" style="flex:1" onclick="IER.closeModal('editorModal')">Cancel</button><button class="btn primary" style="flex:1" onclick="IER.saveDonor()">Save & reconfirm</button></div>
          <div class="ok" id="editOk">Profile updated and reconfirmed.</div>
        </div>
      </div>
    `);

    document.querySelectorAll('input[name="verifyMode"]').forEach(x=>x.addEventListener("change",()=>{
      const byEmail=document.getElementById("verifyEmail").checked;
      document.getElementById("identifierLabel").textContent=byEmail?"Registered email":"IER ID";
      document.getElementById("loginIdentifier").placeholder=byEmail?"name@example.com":"Enter IER ID";
      document.getElementById("loginError").style.display="none";
    }));
    document.getElementById("editDhakaCity").addEventListener("change",refreshEditArea);
    document.getElementById("editArea").addEventListener("change",toggleEditOther);
    document.getElementById("editDistrict").innerHTML=DISTRICTS.map(x=>`<option>${x}</option>`).join("");
    document.getElementById("editDonated").addEventListener("change",()=>document.getElementById("editDateWrap").classList.toggle("hidden",document.getElementById("editDonated").value==="no"));
    document.getElementById("editRoute").addEventListener("change",()=>{
      document.getElementById("editFacebookWrap").classList.remove("hidden");
    });
  }

  function setButtonBusy(id,busy,busyText,normalText){
    const btn=document.getElementById(id);if(!btn)return;btn.disabled=busy;btn.textContent=busy?busyText:normalText;
  }
  function routeFromServer(value){return value==="Facebook"?"facebook":value==="Both"?"both":"direct"}
  function routeToServer(value){return value==="facebook"?"Facebook":value==="both"?"Both":"Phone / WhatsApp"}

  function openLogin(){
    injectSharedModals();
    if (!memberSessionToken) {
      showMemberModal(()=>openLogin());
      return;
    }
    verifyDonor();
  }
  async function verifyDonor(){
    if (!memberSessionToken){showMemberModal(()=>openLogin());return;}
    try {
      const result=await apiPost("verifyDonorForUpdate",{sessionToken:memberSessionToken});
      if (!result.ok || !result.profile){if(handleMemberAuthFailure(result,()=>verifyDonor()))return;showToast(result.message||"Unable to open donor profile.");return;}
      loadEditor(result.profile,memberSessionToken);
    } catch(e){showToast("Unable to retrieve your donor profile. Please try again.");}
  }
  function dhakaOptionsHtml(){
    return '<option value="">Select current area</option>'+
      '<optgroup label="Dhaka city areas">'+DHAKA_CITY.map(a=>`<option>${a}</option>`).join("")+'</optgroup>'+
      '<optgroup label="Dhaka district upazilas">'+DHAKA_UPAZILAS.map(a=>`<option>${a}</option>`).join("")+'</optgroup>'+
      '<option>Other Dhaka District</option>';
  }
  function refreshEditArea(){
    const inDhaka=document.getElementById("editDhakaCity").value==="yes";
    document.getElementById("editDhakaAreaWrap").classList.toggle("hidden",!inDhaka);
    document.getElementById("editDistrictWrap").classList.toggle("hidden",inDhaka);
    document.getElementById("editArea").innerHTML=dhakaOptionsHtml();
    toggleEditOther();
  }
  function toggleEditOther(){
    const inDhaka=document.getElementById("editDhakaCity").value==="yes";
    const otherNeeded=inDhaka ? document.getElementById("editArea").value==="Other Dhaka District" : true;
    document.getElementById("editOtherWrap").classList.toggle("hidden",!otherNeeded);
  }
  function loadEditor(p,token){
    document.getElementById("editId").value=p.id||"";
    document.getElementById("editToken").value=token||"";
    document.getElementById("editTitle").textContent=`Update ${p.fullName||"profile"}`;
    document.getElementById("editName").value=p.fullName||"";
    document.getElementById("editBlood").value=p.bloodGroup||"";
    document.getElementById("editBatch").value=batchLabel(p.batchNumber||"");
    document.getElementById("editStream").value=p.stream||"";
    document.getElementById("editDhakaCity").value=p.inDhakaDistrict?"yes":"no";
    refreshEditArea();
    if(p.inDhakaDistrict){
      document.getElementById("editArea").value=DHAKA.includes(p.area)?p.area:"Other Dhaka District";
      document.getElementById("editOther").value=DHAKA.includes(p.area)?"":(p.area||"");
    }else{
      document.getElementById("editDistrict").value=DISTRICTS.includes(p.district)?p.district:"Dhaka";
      document.getElementById("editOther").value=p.area||"";
    }
    toggleEditOther();
    document.getElementById("editDonated").value=p.donatedBefore?"yes":"no";
    document.getElementById("editDate").value=p.lastDonationDate||"";
    document.getElementById("editDateWrap").classList.toggle("hidden",!p.donatedBefore);
    document.querySelectorAll('input[name="eav"]').forEach(x=>x.checked=x.value===(p.availability||"Available"));
    document.getElementById("editEmail").value=p.email||"";
    document.getElementById("editEmail").readOnly=true;
    document.getElementById("editPhone").value=p.phone||"";
    document.getElementById("editRoute").value=routeFromServer(p.contactPreference||"");
    document.getElementById("editFacebook").value=p.facebookLink||"";
    document.getElementById("editAlerts").value=p.receiveRequestAlerts?"yes":"no";
    document.getElementById("editOk").style.display="none";
    openModal("editorModal");
  }
  async function saveDonor(){
    const donorId=document.getElementById("editId").value;
    const token=document.getElementById("editToken").value;
    if(!donorId||!token){showToast("Verification expired. Please verify again.");return}
    const email=document.getElementById("editEmail").value.trim();
    const route=document.getElementById("editRoute").value;
    const phone=document.getElementById("editPhone").value.trim();
    const facebook=document.getElementById("editFacebook").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast("Enter a valid email address.");return}
    if(!phone){showToast("Phone number is required for profile verification.");return}
    if(!isValidPhone(phone)){showToast("Enter a valid Bangladesh phone number.");return}
    if((route==="facebook"||route==="both")&&!facebook){showToast("Facebook profile link is required for the selected contact method.");return}
    if(facebook&&!safeFacebookUrl(facebook)){showToast("Enter a valid Facebook profile link.");return}

    const donated=document.getElementById("editDonated").value==="yes";
    const lastDate=document.getElementById("editDate").value;
    if(donated&&!lastDate){showToast("Enter your last donation date.");return}
    if(lastDate&&new Date(lastDate+"T00:00:00")>new Date()){showToast("Last donation date cannot be in the future.");return}
    const inDhaka=document.getElementById("editDhakaCity").value==="yes";
    let district=inDhaka?"Dhaka":document.getElementById("editDistrict").value;
    let area=inDhaka?(document.getElementById("editArea").value==="Other Dhaka District"?document.getElementById("editOther").value.trim():document.getElementById("editArea").value):document.getElementById("editOther").value.trim();
    if(inDhaka&&!area){showToast("Select or enter your current area in Dhaka District.");return}
    if(!inDhaka&&!district){showToast("Select your current district.");return}
    const av=document.querySelector('input[name="eav"]:checked');
    const profile={
      donatedBefore:donated,lastDonationDate:donated?lastDate:"",availability:av?av.value:"Available",
      inDhakaDistrict:inDhaka,district,area,phone,email,contactPreference:routeToServer(route),facebookLink:facebook,
      receiveRequestAlerts:document.getElementById("editAlerts").value==="yes"
    };
    const saveBtn=document.querySelector('#editorModal .btn.primary');if(saveBtn){saveBtn.disabled=true;saveBtn.textContent="Saving..."}
    try{
      const result=await apiPost("updateDonorProfile",{donorId,sessionToken:memberSessionToken,profile});
      if(!result.ok){showToast(result.message||"Profile could not be updated.");return}
      document.getElementById("editOk").style.display="block";showToast("Profile updated and reconfirmed.");
      document.getElementById("editToken").value="";
      try{localStorage.removeItem(PUBLIC_CACHE_KEY)}catch(e){}
      await reloadPublicData();
    }catch(e){showToast("Could not save the profile. Please try again.");}
    finally{if(saveBtn){saveBtn.disabled=false;saveBtn.textContent="Save & reconfirm"}}
  }

  function openDonorDetail(id){
    injectSharedModals();
    const d=donors.find(x=>x.id===id);if(!d)return;
    const confirmed=isConfirmed(d),eff=effectiveAvailability(d);
    document.getElementById("mdBlood").textContent=d.blood;
    document.getElementById("mdName").textContent=d.name;
    document.getElementById("mdBasic").textContent=`${d.batch} · ${d.stream}`;
    const avClass=eff==="Available"?"available":eff==="Emergency only"?"emergency":eff==="Needs confirmation"?"stale":"unavailable";
    document.getElementById("mdChips").innerHTML=`<span class="chip ${avClass}">${escapeHtml(eff)}</span><span class="chip ${confirmed?"confirmed":"stale"}">${escapeHtml(freshnessText(d))}</span>`;
    document.getElementById("mdDetails").innerHTML=[
      ["Current location",locationText(d)],["Donation history",donationText(d)],
      ["Freshness",confirmed?"Recently confirmed":"Needs confirmation"]
    ].map(x=>`<div class="detail"><small>${escapeHtml(x[0])}</small><b>${escapeHtml(x[1])}</b></div>`).join("");

    const history=document.getElementById("mdAvailabilityHistory");
    const source=availabilitySource(d),rows=[];
    if(source.type==="community"){
      rows.push(`<div class="history-item community-active"><div class="history-dot"></div><div class="history-main"><b>${escapeHtml(source.data.status)}</b><div class="history-meta">Updated by ${escapeHtml(source.data.updatedByName)} (${escapeHtml(source.data.updatedByBatch)}) · ${escapeHtml(friendlyDateTime(source.data.updatedAt))}<br>Reason: ${escapeHtml(communityReasonLabel(source.data.reason))} · ${escapeHtml(communityExpiryText(d))}</div></div></div>`);
    }
    rows.push(`<div class="history-item"><div class="history-dot"></div><div class="history-main"><b>${escapeHtml(d.availability)}</b><div class="history-meta">Last donor-set availability · ${escapeHtml(d.name)} (${escapeHtml(d.batch)}) · ${escapeHtml(freshnessText(d))}</div></div></div>`);
    (d.availabilityHistory||[]).slice(0,2).forEach(h=>{
      if(h.type==="community"&&source.type==="community"&&h.updatedAt===source.data.updatedAt)return;
      const meta=h.type==="community"?`Updated by ${escapeHtml(h.updatedByName)} (${escapeHtml(h.updatedByBatch)}) · Reason: ${escapeHtml(communityReasonLabel(h.reason))}`:"Updated by donor";
      rows.push(`<div class="history-item"><div class="history-dot"></div><div class="history-main"><b>${escapeHtml(h.status)}</b><div class="history-meta">${meta} · ${escapeHtml(friendlyDateTime(h.updatedAt))}</div></div></div>`);
    });
    history.innerHTML=rows.join("");

    const communityBtn=document.getElementById("mdCommunityUpdateBtn"),reportBtn=document.getElementById("mdReportInfo");
    const contact=document.getElementById("mdContact"),note=document.getElementById("mdNote");
    if(d.isDemo){
      communityBtn.disabled=true;communityBtn.onclick=null;reportBtn.disabled=true;reportBtn.onclick=null;
      contact.innerHTML='<button class="btn" disabled>Sample profile</button>';
      note.textContent="This is sample data shown while the real donor directory is being populated.";
    }else{
      communityBtn.disabled=false;communityBtn.onclick=()=>openCommunityVerify(d.id);reportBtn.disabled=false;reportBtn.onclick=()=>reportDonorInfo(d);
      if(!confirmed){contact.innerHTML='<button class="btn" disabled>Contact paused</button>';note.textContent="This profile needs confirmation.";}
      else{
        let html="";
        if(d.route==="facebook"||d.route==="both")html+='<button class="btn" id="viewDonorFacebookBtn">Facebook</button>';
        if(d.route==="direct"||d.route==="both")html+='<button class="btn primary" id="revealDonorPhoneBtn">Phone / WhatsApp</button>';
        contact.innerHTML=html||'<button class="btn" disabled>Contact unavailable</button>';
        const ph=document.getElementById("revealDonorPhoneBtn"),fb=document.getElementById("viewDonorFacebookBtn");
        if(ph)ph.onclick=()=>revealDonorContact(d.id,"phone");
        if(fb)fb.onclick=()=>revealDonorContact(d.id,"facebook");
        note.textContent="Sign in with a verified email to view contact details. The donor can privately see who accessed their contact.";
      }
    }
    openModal("donorDetailModal");
  }

  async function revealDonorContact(id,method="phone"){
    const d=donors.find(x=>x.id===id);if(!d||d.isDemo)return;
    if(!memberSessionToken){showMemberModal(()=>{openDonorDetail(id);revealDonorContact(id,method)});return}
    const contact=document.getElementById("mdContact"),note=document.getElementById("mdNote");
    contact.innerHTML='<button class="btn" disabled>Loading contact...</button>';
    try{
      const result=await apiPost("getDonorContact",{donorId:id,method,sessionToken:memberSessionToken});
      if(!result.ok){if(handleMemberAuthFailure(result,()=>{openDonorDetail(id);revealDonorContact(id,method)}))return;note.textContent=result.message||"Contact is unavailable.";openDonorDetail(id);showToast(result.message||"Contact unavailable.");return}
      if(method==="facebook"){
        const url=safeFacebookUrl(result.facebookLink);
        if(!url)throw new Error("Invalid Facebook URL");
        contact.innerHTML=`<a class="btn primary full" href="${escapeAttr(url)}" target="_blank" rel="noopener">Open Facebook profile</a>`;
      }else{
        const phone=normPhone(String(result.phone||""));if(!isValidPhone(phone))throw new Error("Invalid phone");
        contact.innerHTML=`<a class="btn primary" href="tel:${escapeAttr(phone)}">Call</a><a class="btn" target="_blank" rel="noopener" href="https://wa.me/88${escapeAttr(phone)}">WhatsApp</a>`;
      }
      note.textContent="Your contact-viewing activity has been recorded and is visible to this donor.";
    }catch(e){contact.innerHTML='<button class="btn" disabled>Contact unavailable</button>';note.textContent="Please try again."}
  }


  function openCommunityVerify(targetId){
    const target=donors.find(x=>x.id===targetId);
    if(!target||target.isDemo){showToast("Sample profiles cannot be updated.");return}
    if(!memberSessionToken){showMemberModal(()=>openCommunityVerify(targetId));return}
    injectSharedModals();
    document.getElementById("communityAvailabilityTargetId").value=targetId;
    document.getElementById("communityAvailabilitySub").textContent=`Updating availability for ${target.name}. Only approved community reporters can save changes.`;
    document.getElementById("communityStatus").value=target.availability;
    document.getElementById("communityReason").value="contacted";
    document.getElementById("communityDuration").value="7";
    closeModal("donorDetailModal");openModal("communityAvailabilityModal");
  }
  async function saveCommunityAvailability(){
    const targetId=document.getElementById("communityAvailabilityTargetId").value;
    const status=document.getElementById("communityStatus").value;
    const reason=document.getElementById("communityReason").value;
    const days=Number(document.getElementById("communityDuration").value);
    if(!memberSessionToken){showMemberModal(()=>openCommunityVerify(targetId));return}
    const btn=document.querySelector('#communityAvailabilityModal .btn.primary');
    if(btn){btn.disabled=true;btn.textContent="Saving..."}
    try{
      const result=await apiPost("saveCommunityAvailability",{sessionToken:memberSessionToken,targetDonorId:targetId,status,reason,days});
      if(!result.ok){showToast(result.message||"Availability could not be updated.");return}
      closeModal("communityAvailabilityModal");showToast("Availability reported.");
      try{localStorage.removeItem(PUBLIC_CACHE_KEY)}catch(e){}
      await reloadPublicData();openDonorDetail(targetId);
    }catch(e){showToast("Could not save availability. Please try again.")}
    finally{if(btn){btn.disabled=false;btn.textContent="Save availability update"}}
  }
  async function getVerifiedRequesterContact(requestId,onSuccess){
    if(!memberSessionToken){showMemberModal(()=>getVerifiedRequesterContact(requestId,onSuccess));return}
    try{
      const result=await apiPost("getRequestContact",{requestId,sessionToken:memberSessionToken});
      if(!result.ok){
        if(handleMemberAuthFailure(result,()=>getVerifiedRequesterContact(requestId,onSuccess)))return;
        showToast(result.message||"Contact unavailable.");return;
      }
      const phone=normPhone(String(result.phone||""));
      if(!isValidPhone(phone))throw new Error("Invalid phone");
      if(typeof onSuccess==="function")onSuccess(phone);
    }catch(error){showToast("Could not load requester contact. Please try again.")}
  }
  async function reportTrustedMemberFulfilment(requestId,reason,onSuccess){
    if(!memberSessionToken){showMemberModal(()=>reportTrustedMemberFulfilment(requestId,reason,onSuccess));return}
    try{
      const result=await apiPost("reportRequestFulfilmentByMember",{sessionToken:memberSessionToken,requestId,reason});
      showToast(result.message||"Could not report fulfilment.");
      if(result.ok){try{localStorage.removeItem(PUBLIC_CACHE_KEY)}catch(e){}await reloadPublicData();if(onSuccess)onSuccess()}
    }catch(e){showToast("Could not submit report. Please try again.")}
  }


  return {
    NOW,GROUPS,DHAKA,DHAKA_CITY,DHAKA_UPAZILAS,STREAMS,DISTRICTS,
    donors:()=>donors,requests:()=>requests,realDonors:()=>realDonors,realRequests:()=>realRequests,useDemoDonors,useDemoRequests,realOpenRequestCount,reloadPublicData,publicState:()=>publicState,apiPost,
    persist,resetDemo,addDonor,findDuplicateDonor,batchLabel,isValidPhone,isConfirmed,effectiveAvailability,availabilitySource,communityExpiryText,freshnessText,locationText,donationText,
    requestStatus,requestFulfilmentReasonLabel,formatDateTime,timeAgo,countdown,normPhone,communityReasonLabel,friendlyDateTime,showToast,openModal,closeModal,bgClose,shareText,copyText,copyCurrentUrl,setupReveal,animateNumber,query,navigateDonors,
    reportProblem,sendFeedback,reportDonorInfo,reportBloodRequest,escapeHtml,escapeAttr,safeFacebookUrl,turnstileEnabled,initTurnstile,getTurnstileToken,resetTurnstile,injectSharedModals,openLogin,verifyDonor,saveDonor,openDonorDetail,revealDonorContact,showMemberModal,setMemberAuthMode,requestMemberCode,confirmMemberCode,acceptVerifiedMember,showMyContactViews,openAccountPanel,openCommunityVerify,saveCommunityAvailability,reportTrustedMemberFulfilment,getVerifiedRequesterContact
  };
})();

document.addEventListener("DOMContentLoaded",()=>{
  IER.injectSharedModals();
  document.body.classList.toggle("is-member-signed-in",Boolean(sessionStorage.getItem("ier_member_session")));
  IER.setupReveal();
  IER.reloadPublicData();
});
