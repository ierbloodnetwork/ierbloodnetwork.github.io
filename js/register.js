document.addEventListener("DOMContentLoaded",()=>{
  const $=id=>document.getElementById(id);

  $("regStream").innerHTML='<option value="">Select stream</option>'+IER.STREAMS.map(x=>`<option>${x}</option>`).join("");
  $("regBlood").innerHTML='<option value="">Select blood group</option>'+IER.GROUPS.map(x=>`<option>${x}</option>`).join("")+'<option value="Unknown">I don\'t know my blood group</option>';
  $("regDhakaArea").innerHTML='<option value="">Select current area</option>'+
    '<optgroup label="Dhaka city areas">'+IER.DHAKA_CITY.map(x=>`<option>${x}</option>`).join("")+'</optgroup>'+
    '<optgroup label="Dhaka district upazilas">'+IER.DHAKA_UPAZILAS.map(x=>`<option>${x}</option>`).join("")+'</optgroup>'+
    '<option>Other Dhaka District</option>';
  $("regDistrict").innerHTML='<option value="">Select district</option>'+IER.DISTRICTS.map(x=>`<option>${x}</option>`).join("");

  $("regDonated").addEventListener("change",()=>{
    const yes=$("regDonated").value==="yes";
    $("regLastWrap").classList.toggle("hidden",!yes);
    if(!yes) $("regLast").value="";
  });

  function syncLocation(){
    const v=$("regDhakaCity").value;
    const inDhaka=v==="yes";
    const outside=v==="no";
    $("regDhakaAreaWrap").classList.toggle("hidden",!inDhaka);
    $("regDistrictWrap").classList.toggle("hidden",!outside);
    $("regOutsideAreaWrap").classList.toggle("hidden",!outside);
    $("regOtherDhakaWrap").classList.toggle("hidden",!(inDhaka && $("regDhakaArea").value==="Other Dhaka District"));
    if(inDhaka){$("regDistrict").value="";$("regOutsideArea").value=""}
    if(outside){$("regDhakaArea").value="";$("regOtherDhaka").value=""}
  }
  $("regDhakaCity").addEventListener("change",syncLocation);
  $("regDhakaArea").addEventListener("change",syncLocation);

  function syncContact(){
    const route=$("regRoute").value;
    $("regFacebookLabel").textContent="Facebook profile link"+((route==="facebook"||route==="both")?" *":"");
    $("regFacebookWrap").classList.toggle("hidden",!isDonor());
  }
  const isDonor=()=>$("regDonorChoice").value==="yes";
  function syncDonor(){
    const donor=isDonor();
    document.querySelectorAll(".donor-only").forEach(el=>el.classList.toggle("hidden",!donor));
    $("regFacebookWrap").classList.toggle("hidden",!donor);
    $("regDonorChoice").setAttribute("aria-expanded",String(donor));
    $("registrationError").style.display="none";
    if(donor && $("regBlood").value==="Unknown") fail("A known blood group is needed to register as a donor.",$("regBlood"));
  }
  $("regDonorChoice").addEventListener("change",syncDonor);
  $("regBlood").addEventListener("change",()=>{if(isDonor() && $("regBlood").value==="Unknown") fail("A known blood group is needed to register as a donor.",$("regBlood"));else $("registrationError").style.display="none"});
  $("regRoute").addEventListener("change",syncContact);
  syncDonor();
  IER.initTurnstile("registerTurnstile","register_donor").catch(()=>{});

  function fail(message,el){
    const box=$("registrationError");
    box.textContent=message;
    box.style.display="block";
    $("registrationStatus").textContent="";
    if(el){el.focus();el.scrollIntoView({behavior:"smooth",block:"center"})}
  }

  function setSubmitting(active){
    const btn=$("registerSubmitBtn");
    btn.disabled=active;
    btn.textContent=active?"Sending code...":"Continue to email verification";
    $("registrationStatus").textContent=active?"Submitting registration...":"";
  }

  $("registrationForm").addEventListener("submit",async e=>{
    e.preventDefault();
    if(!$("regVerification").classList.contains("hidden")) {
      $("registrationForm").querySelectorAll("input,select").forEach(el=>el.disabled=false);
    }
    $("registrationError").style.display="none";
    $("registrationStatus").textContent="";

    const required=[
      ["regName","Enter your full name."],["regBatch","Enter your IER batch number."],["regStream","Select your stream."],
      ["regBlood","Select your blood group."],
      ["regPhone","Enter your phone number."],["regEmail","Enter your email address."]
    ];
    if(isDonor()) required.push(
      ["regDonated","Select your donation history."],["regAvailability","Select your current availability."],
      ["regDhakaCity","Select whether you are currently in Dhaka District."],
      ["regRoute","Select a contact method."],["regAlerts","Select whether you want blood request alerts."]);
    for(const [id,msg] of required){if(!$(id).value.trim()) return fail(msg,$(id));}

    if(!/^\d+$/.test($("regBatch").value.trim())) return fail("Enter only the batch number.",$("regBatch"));
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("regEmail").value.trim())) return fail("Enter a valid email address.",$("regEmail"));

    if(isDonor() && $("regBlood").value==="Unknown") return fail("A known blood group is required to register as a donor.",$("regBlood"));
    const donatedBefore=$("regDonated").value==="yes";
    if(isDonor() && donatedBefore){
      if(!$("regLast").value) return fail("Enter your last donation date.",$("regLast"));
      if(new Date($("regLast").value+"T00:00:00")>new Date()) return fail("Last donation date cannot be in the future.",$("regLast"));
    }

    const inDhakaDistrict=$("regDhakaCity").value==="yes";
    let district="Dhaka",area="";
    if(isDonor() && inDhakaDistrict){
      if(!$("regDhakaArea").value) return fail("Select your current area in Dhaka District.",$("regDhakaArea"));
      area=$("regDhakaArea").value;
      if(area==="Other Dhaka District"){
        if(!$("regOtherDhaka").value.trim()) return fail("Enter your current area.",$("regOtherDhaka"));
        area=$("regOtherDhaka").value.trim();
      }
    }else if(isDonor()){
      if(!$("regDistrict").value) return fail("Select your current district.",$("regDistrict"));
      district=$("regDistrict").value;
      area=$("regOutsideArea").value.trim();
    }

    const route=$("regRoute").value;
    const contactPreference=route==="facebook"?"Facebook":route==="both"?"Both":"Phone / WhatsApp";
    const phone=$("regPhone").value.trim();
    const facebookLink=$("regFacebook").value.trim();
    const facebookRequired=route==="facebook"||route==="both";

    if(!phone) return fail("Enter your phone number.",$("regPhone"));
    if(!IER.isValidPhone(phone)) return fail("Enter a valid Bangladesh phone number.",$("regPhone"));
    if(isDonor() && facebookRequired&&!facebookLink) return fail("Enter your Facebook profile link for the selected contact method.",$("regFacebook"));
    if(isDonor() && facebookLink&&!IER.safeFacebookUrl(facebookLink)) return fail("Enter a valid Facebook profile link.",$("regFacebook"));

    if(isDonor() && !$("regConsent").checked) return fail("Please confirm the consent statement before registering.",$("regConsent"));
    const turnstileToken=IER.getTurnstileToken("registerTurnstile");
    if(IER.turnstileEnabled()&&!turnstileToken) return fail("Complete the verification challenge before registering.");
    const donorProfile={
        fullName:$("regName").value.trim(),
        ierId:$("regIerId").value.trim(),
        batchNumber:$("regBatch").value.trim(),
        stream:$("regStream").value,
        bloodGroup:$("regBlood").value,
        donatedBefore,
        lastDonationDate:donatedBefore?$("regLast").value:"",
        availability:$("regAvailability").value,
        inDhakaDistrict,
        district,
        area,
        phone:$("regPhone").value.trim(),
        email:$("regEmail").value.trim(),
        contactPreference,
        facebookLink,
        receiveRequestAlerts:$('regAlerts').value==="yes",
        consent:true,
        turnstileToken
    };

    const payload={registration:true,becomeDonor:isDonor(),bloodGroup:$("regBlood").value,
      fullName:$("regName").value.trim(),batch:$("regBatch").value.trim(),
      stream:$("regStream").value,phone,email:$("regEmail").value.trim(),
      donorProfile:isDonor()?donorProfile:null,turnstileToken};
    setSubmitting(true);
    try{
      const result=await IER.apiPost("requestMemberEmailCode",payload);
      if(!result.ok){fail(result.message||"Registration could not be completed.");return;}

      $("registrationForm").querySelectorAll("input,select").forEach(el=>{if(el.id!=="regCode")el.disabled=true});
      $("registerSubmitBtn").disabled=true;
      $("regVerification").classList.remove("hidden");
      $("regCode").focus();
      $("registrationStatus").textContent="Enter the six-digit code sent to your email.";
    }catch(error){
      console.error(error);
      fail("Could not send the verification code. Please try again.");
    }finally{
      setSubmitting(false);
      if(!$("regVerification").classList.contains("hidden")) {
        $("registerSubmitBtn").disabled=false;
        $("registerSubmitBtn").textContent="Resend code";
        $("registrationStatus").textContent="Enter the six-digit code sent to your email.";
      }
      if(IER.turnstileEnabled())IER.resetTurnstile("registerTurnstile");
    }
  });
  $("regCode").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("regVerifyBtn").click()}});
  $("regVerifyBtn").addEventListener("click",async()=>{
    const code=$("regCode").value.trim();
    if(!/^\d{6}$/.test(code)) return fail("Enter the six-digit email code.",$("regCode"));
    $("regVerifyBtn").disabled=true;
    $("registrationError").style.display="none";
    try{
      const result=await IER.apiPost("confirmMemberEmailCode",{email:$("regEmail").value.trim(),code});
      if(!result.ok) return fail(result.message||"Code could not be verified.",$("regCode"));
      $("registrationStatus").textContent="";
      IER.acceptVerifiedMember(result);
      IER.openModal("registrationSuccessModal");
    }catch(error){fail("Could not verify the code. Check your connection and try again.")}
    finally{$("regVerifyBtn").disabled=false}
  });

});
