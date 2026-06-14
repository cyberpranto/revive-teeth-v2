/* ===================================================================
   REVIVE TEETH, PRODUCT PAGE v8 SCRIPT
   =================================================================== */

/* ============== CONFIG STATE ============== */
// const CONFIGS = {
//     upper: {label:"Upper Arch", price:1297, pay:432},
//     lower: {label:"Lower Arch", price:1297, pay:432},
//     both:  {label:"Both Arches", price:1994, pay:665}
//   };
//   let current = "both";
//   function fmt(n){return "$"+n.toLocaleString("en-US")}
  
//   function applyConfig(key){
//     current = key;
//     const c = CONFIGS[key];
//     document.querySelectorAll(".opt").forEach(o=>{
//       const sel = o.dataset.key === key;
//       o.classList.toggle("selected", sel);
//       o.setAttribute("aria-checked", sel?"true":"false");
//     });
//     document.getElementById("priceNow").textContent = fmt(c.price);
//     document.getElementById("pricePay").textContent = "$"+c.pay.toLocaleString("en-US");
//     document.getElementById("sbL1").textContent = `Revive Veneers Â· ${c.label} Â· ${fmt(c.price)}`;
//     const payTxt = `or 3 payments of $${c.pay.toLocaleString("en-US")}, interest-free`;
//     document.getElementById("sbL2").textContent = payTxt;
//     document.getElementById("sbPay").textContent = payTxt;
//   }
//   document.querySelectorAll(".opt").forEach(o=>{
//     o.addEventListener("click",()=>applyConfig(o.dataset.key));
//   });
//   applyConfig("both");
  
  /* ============== GALLERY ============== */
  // const thumbs = document.querySelectorAll(".thumb");
  // const galMain = document.getElementById("galMain");
  // thumbs.forEach((t)=>{
  //   t.addEventListener("click",()=>{
  //     thumbs.forEach(x=>x.classList.remove("active"));
  //     t.classList.add("active");
  //     galMain.classList.add("fade");
  //     setTimeout(()=>{
  //       const tImg = t.querySelector("img");
  //       const src = (tImg && tImg.src) || "";
  //       const alt = t.dataset.alt || "Revive Veneers";
  //       galMain.innerHTML = `<img id="galImg" src="${src}" alt="Revive Veneers Â· ${alt}" />`;
  //       galMain.classList.remove("fade");
  //     },220);
  //   });
  // });
  
  /* ============== BELOW-CTA DROPDOWNS ============== */
  const drops = document.querySelectorAll("#drops .drop");
  drops.forEach(d=>{
    const q = d.querySelector(".drop-q");
    q.addEventListener("click",()=>{
      const open = d.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true":"false");
    });
  });
  function openDrop(index){
    const d = drops[index];
    if(!d) return;
    if(!d.classList.contains("open")){
      d.classList.add("open");
      d.querySelector(".drop-q").setAttribute("aria-expanded","true");
    }
    d.scrollIntoView({behavior:"smooth", block:"center"});
  }
  
  /* ============== 7-POINT PROTOCOL (INTERACTIVE) ============== */
  
  
  /* ============== SECTION CTAs ============== */
  function scrollToBuy(){
    document.querySelector("#top").scrollIntoView({behavior:"smooth"});
    setTimeout(()=>{
      // const cta = document.getElementById("cta");
      cta.classList.remove("pulsing"); void cta.offsetWidth; cta.classList.add("pulsing");
    },600);
  }
  document.querySelectorAll(".scroll-buy").forEach(b=>b.addEventListener("click", scrollToBuy));
  // document.getElementById("protoCta").addEventListener("click",()=>{
  //   document.querySelector("#top").scrollIntoView({behavior:"smooth"});
  //   setTimeout(()=>openDrop(2), 650); // open "How to Start"
  // });
  var bridgeCta = document.getElementById("bridgeCta");
  if(bridgeCta) bridgeCta.addEventListener("click",()=>{
    document.querySelector("#top").scrollIntoView({behavior:"smooth"});
    setTimeout(()=>openDrop(2), 650);
  });
  /* ============== FOUNDER VIDEO ============== */
  (function(){
    const v = document.getElementById("founderVideo");
    const overlay = document.getElementById("fvOverlay");
    if(!v || !overlay) return;
    overlay.addEventListener("click", ()=>{ v.play(); });
    v.addEventListener("click", ()=>{ if(!v.paused) v.pause(); });
    v.addEventListener("play",  ()=> overlay.classList.add("hidden"));
    v.addEventListener("pause", ()=> overlay.classList.remove("hidden"));
    v.addEventListener("ended", ()=>{ overlay.classList.remove("hidden"); v.currentTime = 0; });
  })();
  
  /* ============== CART ============== */
  // function bumpCart(){
  //   const el = document.getElementById("cartCount");
  //   el.textContent = (parseInt(el.textContent||"0",10)+1).toString();
  // }
  // document.getElementById("cta").addEventListener("click", bumpCart);
  // document.getElementById("sbCta").addEventListener("click",()=>{
  //   const config = document.getElementById("config");
  //   const y = config.getBoundingClientRect().top + window.scrollY - 96;
  //   window.scrollTo({ top: y, behavior: "smooth" });
  //   const cta = document.getElementById("cta");
  //   setTimeout(()=>{ cta.classList.remove("pulsing"); void cta.offsetWidth; cta.classList.add("pulsing"); }, 650);
  // });
  // document.getElementById("sbInfo").addEventListener("click",()=>{
  //   document.querySelector("#top").scrollIntoView({behavior:"smooth"});
  // });
  
  /* ============== NAV SCROLL ============== */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll",()=>{
    if(window.scrollY > 100) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
  
  /* ============== FAQ ============== */
  document.querySelectorAll(".faq-item").forEach(item=>{
    item.querySelector(".faq-q").addEventListener("click",()=>{
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(x=>x.classList.remove("open"));
      if(!open) item.classList.add("open");
    });
  });
  
  /* ============== STICKY BAR VISIBILITY ============== */
  const sticky = document.getElementById("stickyBar");
  // const cta = document.getElementById("cta");
  const footer = document.getElementById("footer");
  let ctaBottom = 0, footerTop = 0;
  function calcOffsets(){
    ctaBottom = cta.getBoundingClientRect().bottom + window.scrollY;
    footerTop = footer.getBoundingClientRect().top + window.scrollY;
  }
  calcOffsets();
  window.addEventListener("resize",calcOffsets);
  window.addEventListener("scroll",()=>{
    const y = window.scrollY;
    const viewportBottom = y + window.innerHeight;
    const past = y > ctaBottom;          // only after hero CTA scrolled out of view
    const beforeFooter = viewportBottom < footerTop + 100;
    if(past && beforeFooter){
      sticky.classList.add("show");
      document.body.classList.add("pad-sticky");
    } else {
      sticky.classList.remove("show");
      document.body.classList.remove("pad-sticky");
    }
  });
  
  /* ============== MODAL HELPERS ============== */
  function openModal(id){document.getElementById(id).classList.add("show");document.body.style.overflow="hidden"}
  function closeModal(id){document.getElementById(id).classList.remove("show");document.body.style.overflow=""}
  document.querySelectorAll("[data-close]").forEach(b=>{
    b.addEventListener("click",e=>{closeModal(e.target.closest(".modal-bg").id)});
  });
  document.querySelectorAll(".modal-bg").forEach(m=>{
    m.addEventListener("click",e=>{if(e.target===m) closeModal(m.id)});
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){document.querySelectorAll(".modal-bg.show").forEach(m=>closeModal(m.id))}
  });
  
  /* ============== SMILE QUIZ ============== */
  const QUIZ = [
    {q:"How would you describe the current condition of your teeth?", sub:"Choose the option that best matches your current dental health.", opts:[
      {t:"Generally healthy, just want to improve appearance", s:"ideal"},
      {t:"Some staining, gaps, or worn edges", s:"ideal"},
      {t:"Multiple cavities or recent dental work", s:"consult"},
      {t:"Missing one or two teeth in the middle of the arch", s:"good"},
      {t:"Missing three or more teeth, or any teeth at the end of the arch", s:"not"}
    ]},
    {q:"Do you have any of the following?", sub:"Be honest, this helps us determine whether Revive Veneers are right for you.", opts:[
      {t:"None of the below", s:"ideal"},
      {t:"Mild gum recession", s:"good"},
      {t:"Active gum disease or significant gum recession", s:"consult"},
      {t:"Currently wearing full dentures", s:"not"}
    ]},
    {q:"How would you describe your bite?", sub:"", opts:[
      {t:"Normal or slight overbite/underbite", s:"ideal"},
      {t:"Moderate overbite or underbite", s:"good"},
      {t:"Severe crossbite or alignment issues", s:"consult"}
    ]},
    {q:"Have you had major dental work in the past 3 months?", sub:"", opts:[
      {t:"No", s:"ideal"},
      {t:"Cleaning or whitening only", s:"ideal"},
      {t:"Fillings or crowns", s:"good"},
      {t:"Extractions, implants, or orthodontics", s:"consult"}
    ]},
    {q:"How many teeth are you missing in the arch you want covered?", sub:"", opts:[
      {t:"None", s:"ideal"},
      {t:"One or two, not at the end of the arch", s:"good"},
      {t:"One or two at the end of the arch", s:"consult"},
      {t:"Three or more", s:"not"}
    ]},
    {q:"Which best describes your goal?", sub:"", opts:[
      {t:"I want my teeth to look better in photos and in person", s:"ideal"},
      {t:"I want a temporary upgrade for a specific event", s:"ideal"},
      {t:"I want to fix dental issues that affect my health", s:"consult"}
    ]}
  ];
  
  const RESULTS = {
    ideal: {tagClass:"result-ideal", tagLabel:"Ideal candidate", title:"You're an ideal candidate.",
      body:"Based on your answers, Revive Veneers should work well for you. Most ideal candidates see results within the standard 2â€“3 week production timeline.",
      primary:{label:"Add to Cart", action:"buy"}, secondary:null},
    good: {tagClass:"result-good", tagLabel:"Good candidate Â· extended timeline", title:"You're a good candidate. Your case may take a bit longer.",
      body:"Your situation is workable, but we may request additional photos or extend the production timeline to make sure the fit is right. You can continue to purchase, or send photos for a fit check first.",
      primary:{label:"Add to Cart", action:"buy"}, secondary:{label:"Send us photos for a fit check", action:"photos"}},
    consult: {tagClass:"result-consult", tagLabel:"Consult before ordering", title:"We recommend consulting a local dentist first.",
      body:"Based on your answers, you have a dental situation that should be reviewed by a licensed dentist before ordering a cosmetic appliance. We recommend consulting your own dentist first. Snap-on veneers do not treat dental conditions.",
      primary:{label:"Send us photos for a fit check", action:"photos"}, secondary:{label:"Add to Cart anyway", action:"buy"}},
    not: {tagClass:"result-not", tagLabel:"Not a candidate", title:"Revive Veneers aren't the right solution for you.",
      body:"Snap-on veneers sit over your existing teeth, so they aren't right for full dentures or when most teeth are missing. We recommend consulting a local dentist about implants, bridges, or full restorations.",
      primary:{label:"Browse alternatives guide", action:"close"}, secondary:null}
  };
  
  const PRIORITY = {not:4, consult:3, good:2, ideal:1};
  let answers = [];
  let qIndex = 0;
  
  function renderQuestion(){
    const item = QUIZ[qIndex];
    document.getElementById("qFill").style.width = (((qIndex)/QUIZ.length)*100 + 16)+"%";
    document.getElementById("qMeta").textContent = `Question ${qIndex+1} of ${QUIZ.length}`;
    document.getElementById("qTitle").textContent = item.q;
    document.getElementById("qSub").textContent = item.sub || "";
    document.getElementById("qSub").style.display = item.sub ? "block":"none";
    document.getElementById("qBack").style.display = qIndex>0 ? "inline-block":"none";
    const opts = document.getElementById("qOpts");
    opts.innerHTML = "";
    item.opts.forEach(o=>{
      const b = document.createElement("button");
      b.className = "q-opt";
      b.textContent = o.t;
      b.addEventListener("click",()=>{
        answers[qIndex] = o.s;
        if(qIndex < QUIZ.length-1){ qIndex++; renderQuestion(); }
        else { renderResult(); }
      });
      opts.appendChild(b);
    });
  }
  
  function renderResult(){
    let worst = "ideal";
    answers.forEach(s=>{ if(PRIORITY[s] > PRIORITY[worst]) worst = s; });
    const r = RESULTS[worst];
    document.getElementById("qFill").style.width = "100%";
    document.getElementById("qMeta").textContent = "Your result";
    document.getElementById("qTitle").innerHTML = r.title;
    document.getElementById("qSub").style.display = "none";
    document.getElementById("qBack").style.display = "none";
    const opts = document.getElementById("qOpts");
    opts.innerHTML = `
      <div class="result-tag ${r.tagClass}"><span class="cdot"></span>${r.tagLabel}</div>
      <p class="result-body">${r.body}</p>
      <div class="result-actions">
        <button class="cta" id="resPrimary">${r.primary.label}</button>
        ${r.secondary ? `<button class="btn-outline" style="justify-content:center" id="resSecondary">${r.secondary.label}</button>`:""}
        <button class="modal-back" id="resRetake" style="border:0;background:none;cursor:pointer">Retake the quiz</button>
      </div>`;
    document.getElementById("resPrimary").addEventListener("click",()=>handleAction(r.primary.action));
    if(r.secondary) document.getElementById("resSecondary").addEventListener("click",()=>handleAction(r.secondary.action));
    document.getElementById("resRetake").addEventListener("click",()=>{ qIndex=0; answers=[]; renderQuestion(); });
  }
  
  function handleAction(a){
    closeModal("quizModal");
    if(a==="buy"){ scrollToBuy(); }
    else if(a==="photos"){
      window.location.href = "mailto:hello@reviveteeth.com?subject=Fit%20check%20for%20Revive%20Veneers&body=Hi%20Revive%20Team%2C%0A%0AI%27d%20like%20a%20fit%20check%20on%20my%20photos%20before%20I%20order.%20Please%20find%20attached%3A%0A%0A1.%20A%20front-facing%20smile%20photo%0A2.%20A%20close-up%20of%20my%20teeth%20%28lips%20pulled%20back%29%0A3.%20A%20side%20profile%20of%20my%20smile%0A%0AMy%20specific%20concerns%3A%20%5Bplease%20describe%5D%0A%0AThank%20you.";
    }
  }
  
  document.getElementById("qBack").addEventListener("click",e=>{
    e.preventDefault();
    if(qIndex>0){ qIndex--; renderQuestion(); }
  });
  function startQuiz(){ qIndex = 0; answers = []; renderQuestion(); openModal("quizModal"); }
  document.getElementById("openQuiz").addEventListener("click", startQuiz);
  document.getElementById("exitTakeQuiz").addEventListener("click",()=>{ closeModal("exitModal"); startQuiz(); });
  
  /* ============== EXIT INTENT ============== */
  let exitShown = false;
  function maybeShowExit(){
    if(exitShown) return;
    if(sessionStorage.getItem("reviveExit")==="1") return;
    exitShown = true;
    sessionStorage.setItem("reviveExit","1");
    openModal("exitModal");
  }
  document.addEventListener("mouseout", (e)=>{
    if(!e.relatedTarget && e.clientY < 10){ maybeShowExit(); }
  });
  setTimeout(()=>{ if(!exitShown && window.scrollY > window.innerHeight) maybeShowExit(); }, 60000);