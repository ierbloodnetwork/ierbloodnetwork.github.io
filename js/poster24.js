/* Blood Request Poster #24 (Future Aid). Browser-only canvas, no external assets. */
const IERPoster24=(()=>{
  const W=900,H=1125;
  const t={bg:'#edf3eb',ink:'#253c30',accent:'#b02d37',soft:'#d9e8d5',contrast:'#fff'};
  function box(c,x,y,w,h,color,r=0){c.fillStyle=color;c.beginPath();r?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);c.fill()}
  function text(c,value,x,y,size,color=t.ink,weight=700,align='left'){
    c.fillStyle=color;c.font=`${weight} ${size}px Arial,Helvetica,sans-serif`;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(String(value??''),x,y);
  }
  function fit(c,value,x,y,maxWidth,size,minSize,color=t.ink,weight=700,align='left'){
    let n=size;const v=String(value??'');
    while(n>minSize){c.font=`${weight} ${n}px Arial,Helvetica,sans-serif`;if(c.measureText(v).width<=maxWidth)break;n-=2;}
    text(c,v,x,y,n,color,weight,align);
  }
  function lines(c,value,maxWidth,size,weight=700){
    c.font=`${weight} ${size}px Arial,Helvetica,sans-serif`;
    const out=[];let cur='';
    for(const word of String(value??'').trim().split(/\s+/)){
      const nxt=cur?`${cur} ${word}`:word;
      if(cur&&c.measureText(nxt).width>maxWidth){out.push(cur);cur=word;}else cur=nxt;
    }
    if(cur)out.push(cur);
    return out;
  }
  function block(c,value,x,y,width,size,color=t.ink,weight=750,limit=2,step=30){
    let font=size,ls=lines(c,value,width,font,weight);
    while(font>17&&ls.length>limit){font-=2;ls=lines(c,value,width,font,weight);}
    for(let i=0;i<Math.min(limit,ls.length);i++)fit(c,ls[i],x,y+i*step,width,font,16,color,weight);
  }
  function label(c,value,x,y){text(c,value.toUpperCase(),x,y,16,t.accent,800)}
  function safeUrl(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.host+u.pathname+u.search:''}catch{return ''}}
  async function render(canvas,d){
    canvas.width=W*2;canvas.height=H*2;
    const c=canvas.getContext('2d');if(!c)throw Error('Canvas unavailable');
    c.setTransform(2,0,0,2,0,0);
    box(c,0,0,W,H,t.bg);
    text(c,'IER BLOOD DONOR NETWORK',57,75,27,t.ink,900);
    text(c,'INSTITUTE OF EDUCATION AND RESEARCH · UNIVERSITY OF DHAKA',57,107,13,t.ink,600);
    box(c,0,121,900,401,t.soft);
    for(let i=0;i<10;i++){
      c.save();c.translate(100+i*76,338);c.rotate(-.32);
      box(c,-5,-180,18,365,i%2?t.bg:t.accent);c.restore();
    }
    box(c,56,177,789,280,t.ink,30);
    text(c,'BLOOD',85,295,113,t.bg,900);
    text(c,'NEEDED',85,410,113,t.bg,900);
    box(c,59,551,780,158,t.accent,25);
    fit(c,d.group,91,667,400,107,63,t.contrast,900);
    fit(c,d.units,793,645,345,34,19,t.contrast,900,'right');
    // Two-column details, sized to preserve the distinct design while fitting user data.
    label(c,'Hospital / Location',65,755);
    block(c,d.hospital,65,794,357,29,t.ink,800,2,34);
    label(c,'Needed by',462,755);
    block(c,d.date,462,794,361,28,t.ink,800,2,35);
    box(c,65,855,765,2,t.soft);
    label(c,'Requester',65,890);
    block(c,`${d.requester} · ${d.batch}`,65,929,353,26,t.ink,750,2,32);
    label(c,'Contact',462,890);
    block(c,d.contact,462,929,353,23,t.ink,700,2,29);
    box(c,0,991,900,134,t.ink);
    text(c,d.contact.startsWith('01')?'CONTACT REQUESTER':'OPEN REQUEST PAGE TO CONTACT',54,1028,19,t.bg,900);
    if(d.contact.startsWith('01'))fit(c,d.contact,54,1068,790,29,18,t.bg,800);
    const url=safeUrl(d.url);
    if(url){block(c,url,54,d.contact.startsWith('01')?1099:1078,795,18,t.bg,600,2,23);}
    else text(c,'Shareable link appears after website publication',54,1090,19,t.bg,600);
    if(d.sample){c.save();c.translate(450,590);c.rotate(-.24);c.globalAlpha=.11;text(c,'SAMPLE',0,0,140,t.accent,900,'center');c.restore();}
  }
  return {render};
})();
