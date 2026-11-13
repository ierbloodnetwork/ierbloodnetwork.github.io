document.addEventListener("DOMContentLoaded",()=>{
  const faqs=[
    {cat:"finding",q:"How do I find a blood donor?",a:"Choose the blood group and location. You can also filter by availability or stream."},
    {cat:"finding",q:"What does Available mean?",a:"The donor is currently listed as available for donation."},
    {cat:"finding",q:"What does Emergency only mean?",a:"The donor prefers to be contacted only when the need is urgent."},
    {cat:"finding",q:"What does Needs confirmation mean?",a:"The donor has not confirmed their profile recently. Their current availability may have changed."},
    {cat:"finding",q:"Should I contact a donor before going to the hospital?",a:"Yes. Always confirm directly with the donor before making arrangements."},
    {cat:"profile",q:"How do I register as a donor?",a:"Use the Register button and complete the registration form on this website."},
    {cat:"profile",q:"I forgot my IER ID. Can I still update my profile?",a:"Yes. Use your registered phone together with your registered email. Email OTP will be added later."},
    {cat:"profile",q:"How do I update my information?",a:"Select Update info, enter your registered phone, then verify with your IER ID or registered email."},
    {cat:"profile",q:"Who can change my personal information?",a:"Your own profile information can only be changed through your verified update flow."},
    {cat:"profile",q:"Can someone else change my phone number or location?",a:"No. Other verified IER members can only update your availability."},
    {cat:"availability",q:"Can another IER member update my availability?",a:"Yes, but only availability. They must verify themselves first, and their name and batch will be shown with the update."},
    {cat:"availability",q:"How long does a community availability update last?",a:"It can be set for 7, 14 or 30 days."},
    {cat:"availability",q:"Who updated my availability?",a:"Open your donor details. The updater's name, batch, time and reason are shown there."},
    {cat:"availability",q:"What happens if I update my own profile?",a:"Your own update takes priority and any temporary community availability update is cleared."},
    {cat:"requests",q:"How do I post a blood request?",a:"Open Blood Requests, select Open Blood Request, and provide the blood group, district, hospital or location, needed time, your batch and contact number."},
    {cat:"requests",q:"Who can see my blood request?",a:"Anyone using the website can see open requests. Requests with fulfilment reported also remain visible so people can still confirm with the requester if needed."},
    {cat:"requests",q:"How long does a request stay active?",a:"It stays open until the needed-by time passes. If fulfilment is reported earlier, the request remains visible with a Fulfilment Reported status."},
    {cat:"requests",q:"How is fulfilment reported?",a:"The requester can report fulfilment using the phone number used to post the request. A verified IER member can also report fulfilment after verifying their own donor profile. The request remains visible after the report."},
    {cat:"requests",q:"Who receives matching blood request email alerts?",a:"Only donors who chose to receive alerts are considered. Blood group and district must match. Available donors can receive regular matching alerts, while Emergency only donors are included only for urgent requests. Temporarily unavailable or profiles needing confirmation are not emailed."},
    {cat:"profile",q:"Can I change whether I receive blood request emails?",a:"Yes. Open Update info and change the matching blood request email preference at any time."},
    {cat:"sharing",q:"How do I share a blood request on Facebook?",a:"Open the request and use Copy Facebook Post. Then paste it into Facebook, Messenger or another group."},
    {cat:"sharing",q:"Can I create an image for sharing?",a:"Yes. Use Generate Share Image, then download the generated request card."},
    {cat:"sharing",q:"Why do I not always see a Share button?",a:"The Share button only appears on browsers or devices that support system sharing. Copy Post, Copy Link and Generate Share Image still work."},
    {cat:"sharing",q:"Can I hide my phone number from the shared post or image?",a:"Yes. Turn off Include requester phone number before copying the post or generating the image."},
    {cat:"privacy",q:"Is my IER ID public?",a:"No. IER ID is used for verification and is not shown publicly."},
    {cat:"privacy",q:"Is my email public if I receive request alerts?",a:"No. Your email stays private. It is used by the system to send matching request alerts only when you have chosen to receive them."},
    {cat:"privacy",q:"Will my phone number always be visible?",a:"No. Donors choose their public contact route. Blood requesters can also hide their phone number from generated sharing content."},
    {cat:"privacy",q:"Is all donor information guaranteed to be current?",a:"No. Always confirm important details directly with the donor before making arrangements."},
    {cat:"privacy",q:"How do I report incorrect donor information?",a:"Open the donor's details and select Report incorrect information. This opens a pre-filled email."},
    {cat:"privacy",q:"How do I report a blood request?",a:"Open the request and select Report this blood request. This opens a pre-filled email with the request ID."}
  ];
  let activeCat="all";
  const list=document.getElementById("faqList"),search=document.getElementById("faqSearch");
  function render(){
    const term=search.value.trim().toLowerCase();
    const filtered=faqs.filter(x=>(activeCat==="all"||x.cat===activeCat)&&(!term||`${x.q} ${x.a}`.toLowerCase().includes(term)));
    list.innerHTML=filtered.length?filtered.map(x=>`<div class="faq-item"><button class="faq-question"><span>${x.q}</span><span class="faq-chevron">⌄</span></button><div class="faq-answer">${x.a}</div></div>`).join(""):`<div class="empty"><b>No matching answer found</b><p>Try a different word or use Report a problem / Feedback below.</p></div>`;
    list.querySelectorAll(".faq-question").forEach(btn=>btn.onclick=()=>btn.parentElement.classList.toggle("open"));
  }
  document.querySelectorAll(".faq-cat").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".faq-cat").forEach(x=>x.classList.remove("active"));btn.classList.add("active");activeCat=btn.dataset.cat;render();});
  search.addEventListener("input",render);render();
});