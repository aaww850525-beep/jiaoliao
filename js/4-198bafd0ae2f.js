
(function(){
"use strict";
// ---------- storage ----------
const KEY="jiaoliao_v1";
let mem=null;
function load(){try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return mem}
function persist(){mem=S;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const addDays=(s,n)=>{const d=new Date(s+"T00:00:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const COMPANIES=["聖和工程有限公司","紘誠水電工程行","澧育有限公司","白鐵工程行"];
const DOCS=["保固書","測試報告","進口證明及銷售證明","中文操作說明","竣工圖","出廠證明","產地證明","其它"];
function defSettings(){return{company:COMPANIES[0],title:"材料叫料單",vendor:"",vendorContact:"",vendorTel:"",vendorFax:"",contact:"",contactTel:"",discount:1}}
function newOrder(p){const st=S.settings;const d=today();return{id:uid(),no:"",created:Date.now(),status:"draft",company:siteCo(p.name)||(COMPANIES.includes(st.company)?st.company:COMPANIES[0]),project:p.name,orderDate:d,dueDate:addDays(d,1),mode:"工地",addr:p.addr||"",contact:(sitePpl(p.name)[0]||[st.contact])[0],contactTel:(sitePpl(p.name)[0]||[0,st.contactTel])[1],docs:[],docOther:"",vendor:st.vendor,vendorContact:st.vendorContact,vendorTel:st.vendorTel,vendorFax:st.vendorFax,discount:st.discount,note:"",lines:[]}}
let S=load();
const PRESET_SITES=["南海段","內湖緯創","A21","微星科技","宜蘭山河飯店"];
if(!S||!S.projects){S={settings:defSettings(),projects:[],cur:null}}
if(!S.presetSites1){
  S.projects=S.projects.filter(p=>!(p.name==="我的工地"&&!p.orders.length&&!(p.draft&&p.draft.lines.length)));
  PRESET_SITES.forEach(n=>{if(!S.projects.find(p=>p.name===n))S.projects.push({id:uid(),name:n,addr:"",orders:[],draft:null})});
  const pos=n=>{const i=PRESET_SITES.indexOf(n);return i<0?99:i};S.projects.sort((x,y)=>pos(x.name)-pos(y.name));
  S.presetSites1=true;
}
const SITE_LIST=[["公司", "新北市新莊區民安路398號"], ["五股倉庫", "新北市五股區民義路一段312號-16B"], ["宜蘭山河", "宜蘭縣五結鄉親河路一段228巷26號旁工地"], ["新店大廣", "新北市新店區三民路94巷6號對面"], ["敦北飯店", "台北市敦化北路242號"], ["南山A21", "台北市信義區松壽路6號（大門開在市府路上5號門-互助營造）"], ["國賓飯店", "台北市中山區中山北路二段65巷9號"], ["南港冠德", "台北市南港區合成里忠孝東路六段39號"], ["南海段", "台北市中正區泉州街9巷12號旁工地"], ["內湖緯創", "台北市內湖區新湖一路191號"], ["竹北緯創", "竹北市智慧路1號"], ["竹北聯發廠", "竹北市十興路291號"], ["湖口緯創", "新竹縣湖口鄉光復北路50號"], ["湖口緯創 N1F", "新竹縣湖口鄉光復北路50號"], ["湖口緯創 N1J7冰機機房", "新竹縣湖口鄉光復北路50號"], ["高雄緯創", "高雄市前鎮區東七街2號（高雄前鎮科技產業園區）"], ["龜山微星", "龜山區中興路2號"], ["觀音聯華", "桃園市觀音區工業一路16之1號"], ["三重捷六", "三重區捷運路59號對面工地"], ["五谷王(峰左岸)", "新北市三重區(疏洪西路與興德路口)"], ["青埔B基地", "中壢區領航北路三段青昇路交叉口"]];
const SITE_INFO={"公司": {"co": "", "ppl": []}, "五股倉庫": {"co": "", "ppl": [["陳清榮", "0383-969-599"]]}, "宜蘭山河": {"co": "澧育有限公司", "ppl": [["林顯呈", "0937-162-938"], ["陳豐乙", "0961-151-005"], ["曾建智", "0930-891-963"], ["王耀德", "0979-890-000"]]}, "新店大廣": {"co": "紘誠水電工程行", "ppl": [["楊志華", "0960-119-729"]]}, "敦北飯店": {"co": "紘誠水電工程行", "ppl": [["高清華", "0933-066-337"]]}, "南山A21": {"co": "紘誠水電工程行", "ppl": [["林志雄", "0981-575-553"]]}, "國賓飯店": {"co": "紘誠水電工程行", "ppl": [["李弘溢", "0926-283-762"], ["陳致豪", "0983-822-193"]]}, "南港冠德": {"co": "紘誠水電工程行", "ppl": [["陳致豪", "0983-822-193"], ["李弘溢", "0926-283-762"]]}, "南海段": {"co": "聖和工程有限公司", "ppl": [["溫祥淵", "0987-419-519"]]}, "內湖緯創": {"co": "聖和工程有限公司", "ppl": [["周佳珍", "0986-811-500"]]}, "竹北緯創": {"co": "聖和工程有限公司", "ppl": [["游伸鋒", "0955-895-658"]]}, "竹北聯發廠": {"co": "聖和工程有限公司", "ppl": [["毛亮友", "0903-579-317"]]}, "湖口緯創": {"co": "聖和工程有限公司", "ppl": [["蔡永元", "0925-763-735"]]}, "湖口緯創 N1F": {"co": "紘誠水電工程行", "ppl": [["蔡永元", "0925-763-735"]]}, "湖口緯創 N1J7冰機機房": {"co": "澧育有限公司", "ppl": [["蔡永元", "0925-763-735"]]}, "高雄緯創": {"co": "聖和工程有限公司", "ppl": [["游伸鋒", "0955-895-658"], ["蔡永元", "0925-763-735"], ["覃輝豐", "0936-757-907"]]}, "龜山微星": {"co": "聖和工程有限公司", "ppl": [["李重陽", "0978-723-297"], ["陳柏竹", "0970-522-793"]]}, "觀音聯華": {"co": "白鐵工程行", "ppl": [["蔡永元", "0925-763-735"]]}, "三重捷六": {"co": "聖和工程有限公司", "ppl": []}, "五谷王(峰左岸)": {"co": "聖和工程有限公司", "ppl": [["老闆", "0913-515-179"]]}, "青埔B基地": {"co": "紘誠水電工程行", "ppl": [["覃輝豐", "0936-757-907"]]}};
function siteCo(n){const x=SITE_INFO[n];return x&&x.co||""}
function sitePpl(n){const x=SITE_INFO[n];return x?x.ppl:[]}
const SITE_ADDR=Object.fromEntries(SITE_LIST);
if(!S.presetSites2){
  const RENAME={"A21":"南山A21","微星科技":"龜山微星","宜蘭山河飯店":"宜蘭山河"};
  S.projects.forEach(p=>{const n=RENAME[p.name];if(n&&!S.projects.find(x=>x.name===n)){if(p.draft&&p.draft.project===p.name)p.draft.project=n;p.name=n}});
  S.projects=S.projects.filter(p=>!(p.name==="新工地"&&!p.orders.length&&!(p.draft&&p.draft.lines.length)));
  SITE_LIST.forEach(([n,a])=>{let p=S.projects.find(x=>x.name===n);if(!p){p={id:uid(),name:n,addr:a,orders:[],draft:null};S.projects.push(p)}if(!p.addr)p.addr=a;if(p.draft&&!p.draft.addr)p.draft.addr=p.addr});
  const pos=n=>{const i=SITE_LIST.findIndex(x=>x[0]===n);return i<0?99:i};S.projects.sort((x,y)=>pos(x.name)-pos(y.name));
  S.presetSites2=true;
}
if(!S.presetSites3){
  S.projects=S.projects.filter(p=>SITE_ADDR[p.name]!==undefined);
  SITE_LIST.forEach(([n,a])=>{if(!S.projects.find(x=>x.name===n))S.projects.push({id:uid(),name:n,addr:a,orders:[],draft:null})});
  const pos=n=>SITE_LIST.findIndex(x=>x[0]===n);S.projects.sort((x,y)=>pos(x.name)-pos(y.name));
  S.presetSites3=true;
}
S.projects.forEach(p=>{if(p.name==="湖口緯創 N1J7冰機"&&!S.projects.find(x=>x.name==="湖口緯創 N1J7冰機機房")){p.name="湖口緯創 N1J7冰機機房";if(p.draft)p.draft.project=p.name}});
if(!S.presetSites6){S.projects.forEach(p=>{const d=p.draft;if(!d)return;const co=siteCo(p.name);if(co)d.company=co;const pp=sitePpl(p.name);if(pp.length&&!d.contact){d.contact=pp[0][0];d.contactTel=pp[0][1]}});S.presetSites6=true}
if(!S.presetSites4){
  const OLDA={"南海段": "台北市中正區泉州街9號"};
  SITE_LIST.forEach(([n,a])=>{let p=S.projects.find(x=>x.name===n);if(!p){p={id:uid(),name:n,addr:a,orders:[],draft:null};S.projects.push(p)}
    if(!p.addr||p.addr===OLDA[n])p.addr=a;
    const d=p.draft;if(d){if(!d.addr||d.addr===OLDA[n])d.addr=a;const co=siteCo(n);if(co)d.company=co;const pp=sitePpl(n);if(pp.length&&!d.contact){d.contact=pp[0][0];d.contactTel=pp[0][1]}}});
  const pos=n=>{const i=SITE_LIST.findIndex(x=>x[0]===n);return i<0?999:i};S.projects.sort((x,y)=>pos(x.name)-pos(y.name));
  S.presetSites4=true;
}
if(!S.projects.length)S.projects.push({id:uid(),name:"新工地",addr:"",orders:[],draft:null});
S.settings=Object.assign(defSettings(),S.settings||{});
if(!COMPANIES.includes(S.settings.company))S.settings.company=COMPANIES[0];
if(!S.cur||!S.projects.find(p=>p.id===S.cur))S.cur=S.projects[0].id;
const P=()=>S.projects.find(p=>p.id===S.cur);
function draft(){const p=P();if(!p.draft)p.draft=newOrder(p);return p.draft}

// ---------- helpers ----------
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>(Math.round(n*100)/100).toLocaleString("zh-TW",{maximumFractionDigits:2});
const isNum=v=>typeof v==="number"&&isFinite(v);
let tt;function toast(m){const t=$("#toast");const pv=document.getElementById("pv");const host=pv&&pv.open?pv:document.body;if(t.parentNode!==host)host.appendChild(t);t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2200)}
const ICON=c=>/PVC ?管材/.test(c)?"🟦":/PVC/.test(c)?"🔷":/富山閥/.test(c)?"🚰":/電線/.test(c)?"🔌":/EMT|RSG/.test(c)?"⚡":/金通/.test(c)?"🔩":/鐵管|白鐵/.test(c)?"🔧":/溝槽/.test(c)?"🔩":/壓接|配管|保溫管/.test(c)?"🧪":/鑄鐵|牙件/.test(c)?"⚙️":/焊/.test(c)?"🔥":/U型|壁虎|螺絲|華司/.test(c)?"🪛":/C型|角鐵|槽鐵/.test(c)?"📏":/懸吊/.test(c)?"🪝":/立布/.test(c)?"🧱":/BOX/.test(c)?"📦":/法蘭/.test(c)?"⭕":/墊片|膠帶/.test(c)?"🩹":/另料/.test(c)?"🧰":/導線|金屬軟管/.test(c)?"⚡":/軟管|防震/.test(c)?"〰️":"🔧";
const pg=p=>"";
function unitFor(u){if(!u)return "個";return u.replace(/^元\//,"")}
// Build menu categories without changing the saved catalog item or variant keys.
const grooveGroup="滾溝另件";
const weldGroup="鍍鋅・不銹鋼焊接另件";
const carbonCategory=CATALOG.find(c=>c.n==="碳鋼有縫焊另件 20S/40S（黑鐵／電白／熱浸）");
const grooveCategories=new Set(CATALOG.filter(c=>c.g===carbonCategory.g&&/溝槽/.test(c.n)).map(c=>c.n));
const PVC_NEW_START=90;const PVC_OLD=new Set([2, 3, 4, 5, 6]);
const PVC_LAB=Object.fromEntries(CATALOG.slice(PVC_NEW_START).filter(c=>c.lab).map(c=>[c.n,c.lab]));
const HI_PIPE_CI=CATALOG.findIndex(c=>c.hiPipe);
const menuCatalog=CATALOG.flatMap((c,ci)=>{
  if(ci>=PVC_NEW_START)return [];
  if(ci===0&&HI_PIPE_CI>0)return [{...c,n:"PVC灰色管",items:c.items.map((it,ii)=>({it,key:ci+"_"+ii})).filter(({it})=>!it.n.startsWith("HI耐衝擊管")),source:c.n}];
  if(ci===1&&HI_PIPE_CI>0){const c0=CATALOG[0];const all=c0.items.map((it,ii)=>({it,key:"0_"+ii}));const hc=CATALOG[HI_PIPE_CI];
    return [{...c,items:c.items.map((it,ii)=>({it,key:ci+"_"+ii})),source:c.n},
      {...hc,items:hc.items.map((it,ii)=>({it,key:HI_PIPE_CI+"_"+ii})).concat(all.filter(({it})=>it.n.startsWith("HI耐衝擊管 可撓性"))),source:hc.n}];}
  if(PVC_OLD.has(ci))return ci===2?CATALOG.map((c2,j)=>[c2,j]).filter(([c2])=>c2.pvc2022).map(([c2,j])=>({...c2,items:c2.items.map((it,ii)=>({it,key:j+"_"+ii})),source:c2.n})):[];
  const indexed=c.items.map((it,ii)=>({it,key:ci+"_"+ii}));
  if(c===carbonCategory){
    return ["黑鐵","電白","熱浸"].map(finish=>({ ...c, n:finish+"焊接另件 20S/40S", g:finish+"焊接另件",
      items:indexed.filter(({it})=>it.n.endsWith(" "+finish)), source:c.n }));
  }
  if(c.n==="PVC套龍口・配管另件"){
    return [
      {...c,n:"塑膠配管另件",items:indexed.filter(({it})=>it.n!=="PE浪管"&&!it.n.startsWith("套龍口")),source:c.n},
      {n:"PE浪管",g:"電管",items:indexed.filter(({it})=>it.n==="PE浪管"),source:"PE浪管"}
    ];
  }
  const g=grooveCategories.has(c.n)?grooveGroup:(c.g===carbonCategory.g&&/有縫焊/.test(c.n)?weldGroup:c.g);
  return [{ ...c, g, items:indexed, source:c.n }];
});

(function(){
  const out=[];
  const weldGs=["鍍鋅・不銹鋼焊接另件","黑鐵焊接另件","電白焊接另件","熱浸焊接另件"];
  menuCatalog.forEach(c=>{
    if(c.n==="PVC另件・橘色薄（下水道）")c={...c,items:c.items.filter(x=>!/^(90° L型異徑接頭|排氣T型排水接頭|Y型接頭單插口)$/.test(x.it.n))};
    if(c.g==="鐵管・不銹鋼管"){
      const pick=(re)=>c.items.filter(x=>re.test(x.it.n));
      if(c.n==="鍍鋅鋼管・白鐵管・被覆管"){
        const sgp=menuCatalog.find(z=>z.n==="鍍鋅鋼管 SGP／ASTM");const sp=re=>sgp?sgp.items.filter(x=>re.test(x.it.n)):[];
        out.push({...c,g:"鐵管",n:"鍍鋅鋼管 CNS4626",items:pick(/^鍍鋅鋼管 CNS4626$/).concat(sp(/ASTM/))});
        out.push({...c,g:"鐵管",n:"鍍鋅鋼管 CNS6445",items:pick(/^鍍鋅鋼管 白B管$/).map(x=>({...x,it:{...x.it,n:"鍍鋅鋼管 6445"}}))});
        ["10S","20S","40S"].forEach(k=>out.push({...c,g:"不鏽鋼管",n:"不銹鋼管 "+k,items:pick(new RegExp("^不銹鋼管 "+k+"$"))}));
        out.push({...c,g:"不鏽鋼管",n:"不銹鋼管 其他厚度",items:pick(/^不銹鋼管 其他厚度$/)});
        out.push({...c,g:"不鏽鋼管",n:"不銹鋼壓接裸管・被覆管",items:pick(/^不銹鋼(壓接|被覆)/)});
        out.push({...c,g:"CIP管",n:"CIP 鑄鐵直管 AP",items:pick(/^CIP/)});return;}
      if(/^(U\.S\. PIPE|鍍鋅鋼管 SGP)/.test(c.n))return;
      if(/^ACI/.test(c.n)){out.push({...c,g:"ACI"});return;}
      c.g=/^CIP/.test(c.n)?"CIP管":/不銹鋼/.test(c.n)?"不鏽鋼管":"鐵管";
    }else if(c.g==="牙件・焊件・壓接另件"){c.g=/壓接|Nice Joint/.test(c.n)?"壓接另件":"牙件";}
    else if(weldGs.includes(c.g)){c.g="焊件";}
    else if(/^ACI/.test(c.n)){c.g="ACI";}
    else if(c.n==="EMT／RSG 導線管・另件"){const a=c.items.filter(x=>/^ACI/.test(x.it.n));
      out.push({...c,items:c.items.filter(x=>!/^ACI/.test(x.it.n))});if(a.length)out.push({...c,g:"ACI",n:"ACI 粉體塗裝導線管 EMT／RSG",items:a});return;}
    out.push(c);
  });
  {const PIPE=/^(EMT 無螺紋導線管|RSG 厚鋼導線管|C80\.1|CD管$|PF管$|CW |鍍鋅裸管|防水金屬浪管|鋼絲浪管)/;
   const REN={"EMT／RSG 導線管・另件":"EMT／RSG 另件","CD管・PF管（合成樹脂可撓性電線導管）":"CD管・PF管 另件","金屬軟管（電氣配管類）・配件":"金屬軟管 配件"};
   const pipes=[];let at=-1;
   for(let i=0;i<out.length;i++){const c=out[i];if(c.g!=="電管"||!REN[c.n])continue;if(at<0)at=i;
     pipes.push(...c.items.filter(x=>PIPE.test(x.it.n)));out[i]={...c,n:REN[c.n],items:c.items.filter(x=>!PIPE.test(x.it.n))};}
   for(let i=out.length-1;i>=0;i--){if(out[i].g==="電管"&&out[i].n==="PE浪管"){pipes.push(...out[i].items);out.splice(i,1);if(i<at)at--;}}
   if(at>=0&&pipes.length)out.splice(at,0,{...out[at],n:"電管 管材",items:pipes});}
  const first=[...new Set(out.map(c=>c.g||"其他"))];
  const order=[];first.forEach(g=>{
    if(g==="ACI")return;
    if(g==="鐵管"){order.push("鐵管","不鏽鋼管","CIP管","ACI");}
    else if(g==="牙件"||g==="壓接另件"||g==="焊件"){if(!order.includes("牙件"))order.push("牙件","焊件","壓接另件");}
    else if(!order.includes(g))order.push(g);
  });
  out.sort((a,b)=>order.indexOf(a.g||"其他")-order.indexOf(b.g||"其他"));
  menuCatalog.length=0;menuCatalog.push(...out);
})();
function materialName(line){
  if(line.ik&&+String(line.ik).split("_")[0]>=PVC_NEW_START&&PVC_LAB[line.cat])return PVC_LAB[line.cat]+" "+line.name;
  if(CATALOG.some(c=>c.g==="PVC管材"&&c.n===line.cat))
    return (line.brand||"廠牌未指定")+" "+line.name;
  if(line.name.startsWith("加強型套龍口"))return line.name.replace(/^加強型/,"");
  if(line.name==="PE浪管")return "電管 PE浪管";
  if(line.cat===carbonCategory.n){
    const match=/^碳鋼焊另件 (.+) (黑鐵|電白|熱浸)$/.exec(line.name);
    if(match)return match[2]+"碳鋼焊接另件 "+match[1];
  }
  if(grooveCategories.has(line.cat))return grooveGroup+"｜"+line.cat+" "+line.name;
  if(line.cat&&/有縫焊/.test(line.cat))return line.cat+" "+line.name;
  return line.name;
}
// index catalog
const ITEMS=[];menuCatalog.forEach((c,ci)=>c.items.forEach(({it,key})=>{
  const nums=it.v.map(v=>v[2]).filter(isNum);const sizes=[...new Set(it.v.map(v=>v[0]))];
  ITEMS.push({key,cat:c.source,g:c.g||"其他",ci,it,sizes,min:nums.length?Math.min(...nums):null,max:nums.length?Math.max(...nums):null,
    hay:(c.g+" "+c.n+" "+it.n+" "+it.v.map(v=>v[0]+" "+v[1]).join(" ")).toLowerCase()})}));
const vKey=(itemKey,vi)=>itemKey+"|"+vi;

// ---------- header ----------
let siteChosen=false;
function renderProj(){const s=$("#proj");s.innerHTML=(siteChosen?"":'<option value="" selected disabled>請選擇工地</option>')+S.projects.map(p=>`<option value="${p.id}" ${siteChosen&&p.id===S.cur?"selected":""}>${esc(p.name)}</option>`).join("");s.classList.toggle("need",!siteChosen)}
$("#proj").onchange=e=>{if(!e.target.value)return;S.cur=e.target.value;siteChosen=true;persist();renderAll()};
document.addEventListener("click",e=>{if(siteChosen)return;const t=e.target.closest("#vMenu .tile,.tab[data-v=order],.tab[data-v=hist],#cbGo");if(!t)return;e.preventDefault();e.stopPropagation();toast("請先選擇目前工地");const p=$("#proj");p.classList.remove("blink");void p.offsetWidth;p.classList.add("blink");openSitePicker()},true);
$("#appTools").addEventListener("click",e=>{if(e.target.closest("button"))$("#appTools").open=false});
const SP=document.createElement("dialog");SP.id="sitePick";document.body.appendChild(SP);
const CO_ORDER=["聖和工程有限公司","紘誠水電工程行","澧育有限公司","白鐵工程行"];
const CO_COL={"聖和工程有限公司":"#2f6f3e","紘誠水電工程行":"#2c5d9b","澧育有限公司":"#9a5b12","白鐵工程行":"#57606a"};
function openSitePicker(){const gs={};S.projects.forEach(p=>{const c=siteCo(p.name)||"";(gs[c]=gs[c]||[]).push(p)});
  const keys=[...CO_ORDER.filter(k=>gs[k]),...Object.keys(gs).filter(k=>k&&!CO_ORDER.includes(k)),...(gs[""]?[""]:[])];
  SP.innerHTML=`<div class="sp-h"><h2>📍 選擇目前工地</h2>${siteChosen?'<button class="sp-x" data-x>✕ 關閉</button>':""}</div><div class="sp-b">${keys.map(k=>{const col=CO_COL[k]||"#6b7280";return `<div class="sp-g"><div class="sp-gt" style="color:${col}"><i style="background:${col}"></i>${esc(k||"公司・倉庫")}</div><div class="sp-grid">${gs[k].map(p=>`<button class="sp-it${siteChosen&&p.id===S.cur?" on":""}" data-id="${p.id}" style="--c:${col}"><b>${esc(p.name)}</b><small>${esc(p.addr||"")}</small></button>`).join("")}</div></div>`}).join("")}</div>`;
  SP.onclick=e=>{if(e.target.closest("[data-x]")){SP.close();return}const b=e.target.closest("[data-id]");if(!b)return;S.cur=b.dataset.id;siteChosen=true;persist();SP.close();renderAll();toast("目前工地："+P().name)};
  SP.oncancel=e=>{if(!siteChosen)e.preventDefault()};
  if(!SP.open)SP.showModal();SP.querySelector(".sp-b").scrollTop=0}
document.querySelector(".project-context").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openSitePicker()},true);
setTimeout(()=>{if(!siteChosen)openSitePicker()},400);


// ---------- menu (tile style) ----------
let curCat=-1,curG="",curB="",q="";
const GROUPS=[...new Set(menuCatalog.map(c=>c.g||"其他"))];
const GSTYLE={"PVC管材":["#3d6ea6","🟦"],"PVC另件":["#7a5a2e","🧩"],"塑膠另件":["#5c6f8a","🧩"],"鐵管・不銹鋼管":["#567a36","🔧"],"鐵管":["#567a36","🔧"],"不鏽鋼管":["#5f7f8f","🔧"],"CIP管":["#6a4a3a","🔧"],"牙件":["#3a7a72","🔩"],"焊件":["#9a5a2a","🔥"],"壓接另件":["#2f6f9a","🔗"],"ACI":["#4a6a8a","🏷️"],"懸吊・支架・螺絲":["#4f4a8a","🔩"],
  "五金另料":["#8a4545","🧰"],"牙件・焊件・壓接另件":["#3a7a72","🔥"],"法蘭・墊片":["#7a5090","⭕"],"閥類":["#477a43","🚰"],"軟管・防震接頭":["#2f6fa0","➰"],
  "電管":["#a06a1f","⚡"],"電線":["#9a4f2a","🔌"],"開關":["#6a5a9a","🎛️"]};
const cColor=(n,g)=>/橘/.test(n)?"#d2691e":/耐衝擊/.test(n)?"#2f4f8f":(/灰色/.test(n)||g==="PVC管材")?"#6b737b":gColor(g);
const PAL=["#3d6ea6","#7a5a2e","#567a36","#4f4a8a","#8a4545","#3a7a72","#7a5090","#477a43","#2f6fa0","#6b4a2a","#456b2f","#3d5240"];
const gColor=g=>(GSTYLE[g]||[PAL[GROUPS.indexOf(g)%PAL.length]])[0];
const gIcon=g=>(GSTYLE[g]||[,"📦"])[1];
function itemIcon(n,g){return /閥/.test(n)?"🚰":/過濾/.test(n)?"🧽":/法蘭/.test(n)?"⭕":/墊片|由任皮/.test(n)?"🩹":/螺絲|螺帽|華司|壁虎|牙條/.test(n)?"🔩":/立布/.test(n)?"🧱":/BOX|盒/.test(n)?"📦":
  /彎|L型|L /.test(n)?"↪️":/三通|T型|順T|Y型|十字|四通|斜T/.test(n)?"🔀":/塞|帽|蓋/.test(n)?"⛔":/膠|帶/.test(n)?"🎞️":/管束|管夾|吊|鋼|角鐵|槽鐵/.test(n)?"🪝":/接頭|接|套|由令|由另|卜申|補心/.test(n)?"🔗":/管/.test(n)?"🟦":gIcon(g)}
const short=n=>n.replace(/^(東光閥|富山閥|日泰閥|ACHEN閥)・/,"").replace(/^PVC另件・/,"").replace(/^富山閥・/,"").replace(/^塑膠另件・/,"");
function renderMenu(){
  const v=$("#vMenu");
  v.innerHTML=`<div class="menu-title"><small>工程叫料小幫手</small><h1>點料</h1><p>依材料分類快速找到需要的品項</p></div><div class="search"><span>🔍</span><input id="q" type="search" placeholder="搜尋，例如：B管 2&quot;、45°L、球塞閥 FS-312、立布" value="${esc(q)}"></div>
  <div class="tpanel"><div class="crumb" id="crumb"></div><div class="tgrid" id="list"></div></div>`;
  const qi=$("#q");qi.oninput=()=>{q=qi.value;renderList()};
  $("#crumb").onclick=e=>{const b=e.target.closest("[data-nav]");if(!b)return;const n=b.dataset.nav;
    if(n==="root"){curG="";curB="";curCat=-1}else if(n==="group"){curCat=-1;curB=""}else if(n==="brand"){curCat=-1}
    else if(n==="back"){
      if(curCat>=0){if(curB){curCat=-1;if(menuCatalog.filter(c=>c.g===curG&&c.b===curB).length<=1)curB=""}else if(menuCatalog.filter(c=>(c.g||"其他")===curG).length>1)curCat=-1;else{curG="";curCat=-1}}
      else if(curB)curB="";else{curG="";curCat=-1}}
    renderList();window.scrollTo({top:0})};
  $("#list").onclick=e=>{const t=e.target.closest(".tile");if(!t)return;
    if(t.dataset.b!==undefined){curB=t.dataset.b;curCat=-1;const cs=menuCatalog.map((c,i)=>i).filter(i=>menuCatalog[i].g===curG&&menuCatalog[i].b===curB);if(cs.length===1)curCat=cs[0];renderList();window.scrollTo({top:0});return}
    if(t.dataset.g!==undefined){curG=t.dataset.g;curB="";curCat=-1;const cs=menuCatalog.map((c,i)=>i).filter(i=>(menuCatalog[i].g||"其他")===curG);if(cs.length===1)curCat=cs[0];renderList();window.scrollTo({top:0});return}
    if(t.dataset.c!==undefined){curCat=+t.dataset.c;renderList();window.scrollTo({top:0});return}
    if(t.dataset.cleanout){itemDlg(t.dataset.item,t.dataset.cleanout);return}
    if(t.dataset.k)itemDlg(t.dataset.k);
    if(t.dataset.custom!==undefined)customDlg();
  };
  renderList();
}
function inCartCount(itemKey){return draft().lines.filter(l=>l.ik===itemKey).length}
const menuCategoryByItem=new Map(ITEMS.map(x=>[x.key,x.ci]));
function catCount(pred){return draft().lines.filter(l=>menuCategoryByItem.has(l.ik)&&pred(menuCategoryByItem.get(l.ik))).length}
const itemImageKey=x=>x.cat+"|"+x.it.n;
const itemImage=x=>AI_IMAGES[itemImageKey(x)]||imgOf(IMG.ITEM[itemImageKey(x)]);
const isIllustration=x=>Boolean(AI_IMAGES[itemImageKey(x)]);
const imgOf=k=>k&&IMG.IC[k]?IMG.IC[k]:"";
function tile(attrs,color,icon,label,sub,badge,small,img){
  return `<button class="tile${small?" sm":""}" ${attrs} style="--tc:${color}">${badge?`<span class="tbadge">${badge}</span>`:""}${img?`<span class="timg"><img src="${img}" alt=""></span>`:`<span class="ti">${icon}</span>`}<span class="tl">${esc(label)}</span>${sub?`<span class="ts">${esc(sub)}</span>`:""}</button>`;
}
function renderList(){
  const L=$("#list"),C=$("#crumb");
  const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  // breadcrumb
  const parts=[`<button class="cb" data-nav="root">材料分類</button>`];
  if(curG)parts.push(`<span>›</span><button class="cb" data-nav="group">${esc(curG)}</button>`);
  if(curB)parts.push(`<span>›</span><button class="cb" data-nav="brand">${esc(curB)}</button>`);
  if(curCat>=0&&menuCatalog.filter(c=>(c.g||"其他")===curG).length>1)parts.push(`<span>›</span><b>${esc(short(menuCatalog[curCat].n))}</b>`);
  const level=terms.length?"items":(!curG?"groups":(curCat<0?"cats":"items"));
  const title=terms.length?"搜尋結果":level==="groups"?"材料品項":level==="cats"?(curB&&menuCatalog.some(c=>c.g===curG&&c.b)?"材質":"材料細項"):"材料";
  C.innerHTML=`${curG||terms.length?`<button class="cb back" data-nav="back" ${terms.length?"hidden":""}>‹ 返回</button>`:""}<div class="cpath">${parts.join("")}</div>${level==="groups"?"":`<span class="ctitle">${title}</span>`}`;
  if(level==="groups"){
    L.innerHTML=GROUPS.map(g=>{const n=catCount(ci=>(menuCatalog[ci].g||"其他")===g);return tile(`data-g="${esc(g)}"`,gColor(g),gIcon(g),g,"",n,false,imgOf(IMG.GROUP[g]))}).join("")+
      tile(`data-custom`,"#3d5240","✍️","自訂品項","型錄以外","",false);
    return;
  }
  if(level==="cats"){
    const inG=menuCatalog.map((c,i)=>({c,i})).filter(x=>(x.c.g||"其他")===curG);
    if(!curB&&inG.some(x=>x.c.b)){const bs=[...new Set(inG.map(x=>x.c.b||x.c.n))];
      L.innerHTML=bs.map(b=>{const xs=inG.filter(x=>(x.c.b||x.c.n)===b);const n=catCount(ci=>xs.some(x=>x.i===ci));return tile(`data-b="${esc(b)}"`,gColor(curG),gIcon(curG),b,xs.length+" 類",""+(n||""),false,imgOf(IMG.CAT[b]))}).join("");return}
    L.innerHTML=inG.filter(x=>!curB||x.c.b===curB).map(x=>{const n=catCount(ci=>ci===x.i);return tile(`data-c="${x.i}"`,cColor(x.c.n,curG),gIcon(curG),short(x.c.n),x.c.items.length+" 項",""+(n||""),false,imgOf(IMG.CAT[x.c.n]))}).join("");
    return;
  }
  if(!terms.length&&menuCatalog[curCat]?.n==="PVC另件・清潔口"){
    const x=ITEMS.find(x=>x.ci===curCat);
    L.innerHTML=[["灰色","灰色"],["橘色","桔色"]].map(([value,label])=>tile(
      `data-cleanout="${value}" data-item="${x.key}"`,
      value==="灰色"?"#667085":"#b65b22","🔧",label+"暗式清潔口",
      x.it.v.filter(v=>v[1]===value).length+" 種尺寸","",false,CLEANOUT_IMAGES[value])).join("");
    return;
  }
  const hits=ITEMS.filter(x=>(terms.length?true:x.ci===curCat)&&terms.every(t=>x.hay.includes(t)));
  if(!hits.length){L.innerHTML=`<div class="tempty">找不到符合的品項</div>`+tile(`data-custom`,"#3d5240","✍️","自訂品項","型錄以外","",false);return}
  L.innerHTML=hits.slice(0,300).map(x=>{const n=inCartCount(x.key);
    const sz=x.sizes.length>1?`${x.sizes[0]}~${x.sizes[x.sizes.length-1]}`:x.sizes[0];
    return tile(`data-k="${x.key}"`,cColor(x.cat+" "+x.it.n,x.g),itemIcon(x.it.n,x.g),x.it.n,(terms.length?short(menuCatalog[x.ci].n)+"・":"")+sz+(isIllustration(x)?" · AI 示意圖":""),n,true,itemImage(x))}).join("")+
    (hits.length>300?`<div class="tempty">還有 ${hits.length-300} 項，請輸入關鍵字縮小範圍</div>`:"");
}
// ---------- item sheet (選規格) ----------
function findLine(k){return draft().lines.find(l=>l.vk===k)}
function setQty(x,vi,qty){
  const d=draft();const k=vKey(x.key,vi);let l=findLine(k);qty=Math.max(0,Math.round((+qty||0)*100)/100);
  if(qty<=0){if(l)d.lines=d.lines.filter(z=>z!==l)}
  else if(l){l.qty=qty}
  else{const v=x.it.v[vi];const list=isNum(v[2])?v[2]:null;
    d.lines.push({id:uid(),vk:k,ik:x.key,cat:x.cat,name:x.it.n,size:v[0],spec:v[1],list,priceNote:(isNum(v[2])||v[2]==null)?"":String(v[2]),unit:unitFor(v[3]),qty,price:null,remark:(isNum(v[2])||v[2]==null)?"":String(v[2])})}
  persist();updateCart();
}
function cleanoutPhotos(spec){
  return ["灰色","橘色"].filter(color=>!spec||color===spec).map(color=>
    `<figure style="margin:8px 0;text-align:center"><img src="${CLEANOUT_IMAGES[color]}" alt="${color==="橘色"?"桔色":"灰色"}暗式清潔口實物照片" style="width:110px;height:130px;object-fit:contain;background:white;border-radius:8px"><figcaption>${color==="橘色"?"桔色":"灰色"}暗式清潔口</figcaption></figure>`
  ).join("");
}
function itemDlg(key,initialSpec){
  const x=ITEMS.find(i=>i.key===key);const specs=[...new Set(x.it.v.map(v=>v[1]))];let spec=initialSpec||null;
  const D=$("#dlg");
  function body(){
    const rows=x.it.v.map((v,vi)=>({v,vi})).filter(r=>spec==null||r.v[1]===spec);
    return rows.map(({v,vi})=>{const l=findLine(vKey(x.key,vi));const qn=l?l.qty:0;
      return `<div class="vrow ${qn?"in":""}" data-vi="${vi}"><div class="sz"><b>${esc(v[0])}</b>${specs.length>1&&spec==null||v[1]?`<small>${esc(v[1])}</small>`:""}${v[4]?`<small>${esc(v[4])}</small>`:""}</div>
      <div class="pp"><small>單位：${esc(unitFor(v[3]))}</small></div>
      <div class="step"><button data-a="-" aria-label="減少">−</button><input type="number" inputmode="decimal" min="0" value="${qn||""}" placeholder="0"><button data-a="+" aria-label="增加">＋</button></div></div>`}).join("");
  }
  function total(){return x.it.v.reduce((a,v,vi)=>{const l=findLine(vKey(x.key,vi));return a+(l?1:0)},0)}
  const _im=x.cat==="PVC另件・清潔口"?"":itemImage(x);
  D.innerHTML=`<div class="sh-h"><h2>${_im?`<img src="${_im}" alt="" style="width:44px;height:44px;border-radius:10px;vertical-align:middle;margin-right:6px;border:1px solid #e5e7eb">`:ICON(x.cat)} ${esc(x.it.n)}</h2><small>${esc(menuCatalog[x.ci].n)}${isIllustration(x)?" · AI 示意圖":""}</small>${x.cat==="PVC另件・清潔口"?`<div id="cleanoutPhotos" style="display:flex;gap:12px">${cleanoutPhotos(spec)}</div>`:""}<button class="sh-x" data-close>✕</button>
   ${specs.length>1&&specs.length<=12?`<div class="spec-chips"><button class="chip on" data-s="__all">全部</button>${specs.map(s=>`<button class="chip" data-s="${esc(s)}">${esc(s||"一般")}</button>`).join("")}</div>`:""}</div>
   <div class="sh-b" id="shb">${body()}</div>
   <div class="sh-f"><span class="note" style="margin-right:auto;align-self:center" id="shn"></span><button class="btn btn-p" data-close>完成</button></div>`;
  const shn=()=>{$("#shn").textContent=total()?`此品項已選 ${total()} 種規格`:"輸入數量即加入叫料單"};shn();
  let changed=false;
  D.onclick=e=>{
    if(e.target.closest("[data-close]")){if(changed&&x.g==="PVC管材"&&x.it.v.some((v,vi)=>findLine(vKey(x.key,vi)))){pipeBrandDlg(x);return}if(changed&&x.it.n==="塑膠油"&&x.it.v.some((v,vi)=>findLine(vKey(x.key,vi)))){brushDlg();return}const g=changed?screwGroups(x):[];if(g.length){accDlg(g)}else D.close();return}
    const c=e.target.closest("[data-s]");if(c){spec=c.dataset.s==="__all"?null:c.dataset.s;D.querySelectorAll("[data-s]").forEach(z=>z.classList.toggle("on",z===c));$("#shb").innerHTML=body();const photos=$("#cleanoutPhotos");if(photos)photos.innerHTML=cleanoutPhotos(spec);return}
    const b=e.target.closest("[data-a]");if(b){const r=b.closest(".vrow");const inp=r.querySelector("input");let n=(+inp.value||0)+(b.dataset.a==="+"?1:-1);if(n<0)n=0;inp.value=n||"";setQty(x,+r.dataset.vi,n);changed=true;r.classList.toggle("in",n>0);shn()}
  };
  D.oninput=e=>{const inp=e.target.closest(".vrow input");if(!inp)return;const r=inp.closest(".vrow");setQty(x,+r.dataset.vi,inp.value);changed=true;r.classList.toggle("in",+inp.value>0);shn()};
  D.onclose=()=>{renderList()};
  D.showModal();
}
function pipeBrandDlg(x){
  const D=$("#dlg");
  const selected=x.it.v.map((v,vi)=>findLine(vKey(x.key,vi))).filter(Boolean);
  const same=selected.every(line=>line.brand===selected[0].brand)?selected[0].brand:"";
  D.innerHTML=`<div class="sh-h"><h2>請選擇 PVC 管材廠牌</h2><small>${esc(x.it.n)}・套用到此品項已選的尺寸</small></div>
    <div class="sh-b"><fieldset style="border:0;padding:0"><legend>廠牌</legend>${["南亞","大洋"].map(brand=>`<label style="display:inline-block;margin:12px"><input type="radio" name="pipeBrand" value="${brand}" ${same===brand?"checked":""}> ${brand}</label>`).join("")}</fieldset></div>
    <div class="sh-f"><button class="btn btn-p" data-brand-ok>確認廠牌</button></div>`;
  D.oninput=null;
  D.onclick=e=>{
    if(!e.target.closest("[data-brand-ok]"))return;
    const choice=D.querySelector('input[name="pipeBrand"]:checked');
    if(!choice){toast("請選擇南亞或大洋");return}
    selected.forEach(line=>line.brand=choice.value);
    persist();
    D.close();
  };
}
function brushDlg(){
  const D=$("#dlg");
  const brush=ITEMS.find(x=>x.it.n==="塑膠油刷"&&x.cat==="PVC另件・塑膠油");
  const existing=findLine(vKey(brush.key,0));
  D.innerHTML=`<div class="sh-h"><h2>是否需要塑膠油刷？</h2><small>可填數量一起加入叫料單</small></div>
    <div class="sh-b"><label class="f">塑膠油刷數量（支）<input id="brushQty" type="number" inputmode="numeric" min="0" step="1" value="${existing?existing.qty:""}" placeholder="0"></label></div>
    <div class="sh-f"><button class="btn" data-skip>不用，略過</button><button class="btn btn-p" data-add>加入叫料單</button></div>`;
  D.oninput=null;
  D.onclick=e=>{
    if(e.target.closest("[data-skip]")){D.close();return}
    if(e.target.closest("[data-add]")){
      const input=$("#brushQty");
      if(!input.reportValidity())return;
      const qty=Number(input.value);
      if(!Number.isInteger(qty)||qty<=0){toast("請輸入塑膠油刷數量");return}
      setQty(brush,0,qty);
      D.close();
    }
  };
}
// ---------- 螺絲配件提醒（螺帽／華司／彈簧華司）----------
const ACC_CAT="六角螺絲、華司、螺帽";
const ACC={zn:[["螺帽","鍍鋅螺帽"],["華司","鍍鋅華司"],["彈簧華司","彈簧華司"]],ss:[["螺帽","不銹鋼螺帽"],["華司","不銹鋼華司"],["彈簧華司","不銹鋼彈簧華司"]]};
function isScrew(x){const n=x.it.n;return /螺絲|牙條/.test(n)&&!/鑽尾|木螺絲|自攻|鐵板牙|鐵皮|壁虎|附螺絲|附馬車|預埋|外螺絲|鎖緊|內六角|楔形|T型|吊環|螺帽|DIP/.test(n)}
function screwDia(v){const m=(v[1]||"").match(/線徑([\d\/\-]+")/);if(m)return m[1];const a=String(v[0]).split(/[×x*]/)[0].trim();return /^[\d\/\-]+"$/.test(a)?a:null}
function screwGroups(x){
  if(!isScrew(x))return[];const g={};
  x.it.v.forEach((v,vi)=>{const l=findLine(vKey(x.key,vi));if(!l)return;const dia=screwDia(v);if(!dia)return;
    const mat=/不銹鋼|不鏽鋼|白鐵|SUS/.test(x.it.n+" "+(v[1]||""))?"ss":"zn";const k=mat+"|"+dia;(g[k]=g[k]||{mat,dia,qty:0}).qty+=l.qty});
  return Object.values(g);
}
function accFind(name,dia){const x=ITEMS.find(i=>i.cat===ACC_CAT&&i.it.n===name);if(!x)return null;const vi=x.it.v.findIndex(v=>v[0]===dia);return vi<0?{x,vi:-1}:{x,vi}}
function accQty(name,dia){const f=accFind(name,dia);if(f&&f.vi>=0){const l=findLine(vKey(f.x.key,f.vi));return l?l.qty:0}
  const l=draft().lines.find(z=>z.vk==="acc|"+name+"|"+dia);return l?l.qty:0}
function accSet(name,dia,qty){const f=accFind(name,dia);if(f&&f.vi>=0){setQty(f.x,f.vi,qty);return}
  const d=draft();const k="acc|"+name+"|"+dia;let l=d.lines.find(z=>z.vk===k);qty=Math.max(0,+qty||0);
  if(qty<=0){if(l)d.lines=d.lines.filter(z=>z!==l)}else if(l)l.qty=qty;
  else d.lines.push({id:uid(),vk:k,ik:"custom",cat:ACC_CAT,name,size:dia,spec:"孔徑",list:null,priceNote:"",unit:"個",qty,price:null,remark:"型錄未列此尺寸"});
  persist();updateCart()}
function accDlg(groups){
  const D=$("#dlg");
  const rows=groups.map((g,gi)=>`<div class="accg"><div class="acch">🔩 ${esc(g.dia)} ${g.mat==="ss"?"不銹鋼":"鍍鋅／電鍍"}　<small>螺絲共 ${g.qty} 支</small></div>`+
    ACC[g.mat].map(([lab,name],ai)=>{const q=accQty(name,g.dia);const f=accFind(name,g.dia);const miss=!(f&&f.vi>=0);
      return `<div class="vrow ${q?"in":""}" data-g="${gi}" data-ai="${ai}"><div class="sz"><b>${lab}</b><small>${esc(name)} ${esc(g.dia)}${miss?"（型錄未列，將以自訂品項加入）":""}</small></div>
      <div class="accq"><button class="chip" data-m="1">同數量</button><button class="chip" data-m="2">×2</button></div>
      <div class="step"><button data-a="-" aria-label="減少">−</button><input type="number" inputmode="decimal" min="0" value="${q||""}" placeholder="0"><button data-a="+" aria-label="增加">＋</button></div></div>`}).join("")+`</div>`).join("");
  D.innerHTML=`<div class="sh-h"><h2>要一起叫螺帽、華司嗎？</h2><small>依螺絲尺寸與材質自動帶出，可直接填數量</small><button class="sh-x" data-close>✕</button></div>
   <div class="sh-b" id="shb">${rows}</div>
   <div class="sh-f"><button class="btn" data-skip>不用，略過</button><button class="btn btn-p" data-ok>完成</button></div>`;
  const apply=(r,n)=>{const g=groups[+r.dataset.g];const [,name]=ACC[g.mat][+r.dataset.ai];n=Math.max(0,n||0);r.querySelector("input").value=n||"";accSet(name,g.dia,n);r.classList.toggle("in",n>0)};
  D.onclick=e=>{
    if(e.target.closest("[data-close],[data-skip],[data-ok]")){D.close();return}
    const m=e.target.closest("[data-m]");if(m){const r=m.closest(".vrow");apply(r,groups[+r.dataset.g].qty*(+m.dataset.m));return}
    const b=e.target.closest("[data-a]");if(b){const r=b.closest(".vrow");const n=(+r.querySelector("input").value||0)+(b.dataset.a==="+"?1:-1);apply(r,n)}
  };
  D.oninput=e=>{const inp=e.target.closest(".vrow input");if(!inp)return;apply(inp.closest(".vrow"),+inp.value)};
}
function customDlg(){
  const D=$("#dlg");
  D.innerHTML=`<form id="cf"><div class="sh-h"><h2>＋ 自訂品項</h2><small>型錄以外的材料</small><button type="button" class="sh-x" data-close>✕</button></div>
  <div class="sh-b"><div class="grid"><label class="f full">品名 *<input name="name" required maxlength="60" placeholder="例如：PVC 管 B管"></label>
  <label class="f">尺寸<input name="size" maxlength="40" placeholder='例如：2"'></label><label class="f">規格<input name="spec" maxlength="60"></label>
  <label class="f">單位<input name="unit" value="個" maxlength="8"></label><label class="f">數量 *<input name="qty" type="number" min="0.01" step="any" required value="1"></label>
  <label class="f full">備註<input name="remark" maxlength="60"></label></div></div>
  <div class="sh-f"><button type="button" class="btn" data-close>取消</button><button class="btn btn-p">加入叫料單</button></div></form>`;
  D.onclick=e=>{if(e.target.closest("[data-close]"))D.close()};D.oninput=null;D.onclose=null;
  $("#cf").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
    draft().lines.push({id:uid(),vk:"c|"+uid(),ik:"custom",cat:"自訂",name:f.get("name").trim(),size:f.get("size").trim(),spec:f.get("spec").trim(),list:null,priceNote:"",unit:f.get("unit").trim()||"個",qty:+f.get("qty"),price:null,remark:f.get("remark").trim()});
    persist();D.close();updateCart();renderView();toast("已加入自訂品項")};
  D.showModal();
}

// ---------- cart ----------
function lineAmt(l){return isNum(l.price)?l.price*l.qty:0}
function updateCart(){
  const d=draft();const n=d.lines.length;const t=d.lines.reduce((a,l)=>a+(isNum(l.list)?l.list*l.qty:0),0);
  $("#cbN").textContent=n;
  $("#cartbar").hidden=!(n&&view==="menu");
  const tn=$("#tabN");tn.hidden=!n;tn.textContent=n;
}
$("#cbGo").onclick=()=>go("order");

// ---------- order ----------
function renderOrder(){
  const d=draft();const v=$("#vOrder");
  const lines=d.lines.map((l,i)=>`<div class="line" data-id="${l.id}"><div class="no">${i+1}</div>
    <div class="nm"><b>${esc(materialName(l))} ${esc(l.size)}</b><small>${esc(l.spec)}</small>
      <div class="ctl"><div class="step"><button data-a="-">−</button><input class="qt" type="number" inputmode="decimal" min="0" step="any" value="${l.qty}"><button data-a="+">＋</button></div>
      <span class="note">${esc(l.unit)}</span>
      <input class="rm" maxlength="60" value="${esc(l.remark)}" placeholder="備註"><button class="del">刪除</button></div></div>
    <div></div></div>`).join("");
  
  v.innerHTML=`
  <div class="card"><div class="sec">📌 基本資料 <span class="sp"></span><span class="note">${d.no?"單號 "+esc(d.no):"新叫料單"}</span></div>
   <div class="grid">
    <label class="f full">公司名稱（Excel 抬頭）<select data-f="company">${COMPANIES.map(n=>`<option ${n===(d.company||S.settings.company)?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
    <label class="f full">工程名稱<select data-f="project">${[...new Set([...S.projects.map(p=>p.name),d.project].filter(Boolean))].map(n=>`<option ${n===d.project?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
    <label class="f">訂貨日期<input type="date" data-f="orderDate" value="${esc(d.orderDate)}"></label>
    <label class="f">預定交貨日期<input type="date" data-f="dueDate" value="${esc(d.dueDate)}"></label>
    <label class="f">到貨狀況<input data-f="arrival" list="arrList" value="${esc(d.arrival||"")}" placeholder="例如：已到貨、部分到貨"><datalist id="arrList"><option>未到貨</option><option>部分到貨</option><option>已到貨</option></datalist></label>
    <div class="f full"><label class="f" style="margin:0">交貨方式</label><div class="opts">${["工務所","工地","自取"].map(m=>`<label><input type="radio" name="mode" value="${m}" ${d.mode===m?"checked":""}> ${m}</label>`).join("")}</div></div>
    <label class="f full">交貨地點（地址）<input data-f="addr" value="${esc(d.addr)}" placeholder="例如：新竹縣湖口鄉…"></label>
    ${sitePpl(d.project).length>1?`<label class="f full ppl">選擇收貨人<select data-pplsel>${sitePpl(d.project).some(x=>x[0]===d.contact)?"":`<option value="">（請選擇）</option>`}${sitePpl(d.project).map((x,i)=>`<option value="${i}" ${x[0]===d.contact?"selected":""}>${esc(x[0])}　${esc(x[1])}</option>`).join("")}</select></label>`:""}<label class="f">收貨人<input data-f="contact" value="${esc(d.contact)}"></label>
    <label class="f">收貨人電話<input data-f="contactTel" value="${esc(d.contactTel)}" inputmode="tel"></label>
    <div class="f full"><label class="f" style="margin:0">附查驗用證明文件</label><div class="opts">${DOCS.map(x=>`<label><input type="checkbox" data-doc="${x}" ${d.docs.includes(x)?"checked":""}> ${x}</label>`).join("")}<input data-f="docOther" value="${esc(d.docOther)}" placeholder="其它說明" style="border:1px solid #d1d5db;border-radius:8px;padding:4px 8px;min-width:120px"></div></div>
   </div></div>
  <details class="card vend" ${window.__vendOpen?"open":""} ontoggle="window.__vendOpen=this.open"><summary class="sec">🏭 廠商<span class="vsum">${esc(d.vendor||"")}</span><span class="vchev">點我展開 ▾</span></summary><div class="grid">
    <label class="f">廠商名稱<input data-f="vendor" value="${esc(d.vendor)}"></label>
    <label class="f">廠商聯絡人<input data-f="vendorContact" value="${esc(d.vendorContact)}"></label>
    <label class="f">公司電話<input data-f="vendorTel" value="${esc(d.vendorTel)}"></label>
    <label class="f">公司傳真<input data-f="vendorFax" value="${esc(d.vendorFax)}"></label>
  </div></details>
  <div class="card"><div class="sec">🧺 材料明細（${d.lines.length} 項）<span class="sp"></span><button class="btn" id="bAdd">＋ 繼續點料</button><button class="btn" id="bCustom">＋ 自訂品項</button></div>
   ${d.lines.length?lines:`<div class="empty">還沒有選材料<br><button class="btn btn-g" id="bAdd2" style="margin-top:10px">去點料 ›</button></div>`}
   
   <label class="f" style="margin-top:12px">備註（會印在表單下方）<textarea data-f="note" rows="2">${esc(d.note)}</textarea></label>
  </div>
  <div class="acts"><button class="btn btn-g" id="bSave">💾 儲存到紀錄</button><button class="btn btn-p" id="bXls" ${d.lines.length?"":"disabled"}>⬇ 匯出 Excel</button><button class="btn btn-p" id="bPdf" ${d.lines.length?"":"disabled"}>📄 預覽 PDF</button></div><div class="acts acts-clear"><button class="btn" id="bNew">📄 另開新單</button><button class="btn btn-d" id="bClear">🗑 清空</button></div>
  <p class="note" style="text-align:right">匯出 Excel 只會產生這一張叫料單（當月總表請到「紀錄」匯出）；「預覽 PDF」可先看列印樣式再下載。</p>`;
  v.oninput=e=>{const t=e.target;
    if(t.dataset.f){const was=d[t.dataset.f];d[t.dataset.f]=t.type==="number"?(t.value===""?"":+t.value):t.value;if(t.dataset.f==="project"&&t.value!==was){const np=S.projects.find(x=>x.name===t.value),op=S.projects.find(x=>x.name===was);const na=(np&&np.addr)||SITE_ADDR[t.value]||"";if(na&&(!d.addr||d.addr===((op&&op.addr)||SITE_ADDR[was]))){d.addr=na;const ai=v.querySelector("[data-f=addr]");if(ai)ai.value=na}const nc=siteCo(t.value);if(nc)d.company=nc;const pp=sitePpl(t.value);if(pp.length){d.contact=pp[0][0];d.contactTel=pp[0][1]}else{const op2=sitePpl(was);if(op2.some(x=>x[0]===d.contact)){d.contact="";d.contactTel=""}}persist();renderOrder();return}persist();return}
    if(t.dataset.doc){d.docs=DOCS.filter(x=>v.querySelector(`[data-doc="${x}"]`).checked);persist();return}
    if(t.name==="mode"){d.mode=t.value;persist();return}
    const row=t.closest(".line");if(!row)return;const l=d.lines.find(z=>z.id===row.dataset.id);
    if(t.classList.contains("qt")){l.qty=Math.max(0,+t.value||0)}
    else if(t.classList.contains("pr")){l.price=t.value===""?null:+t.value}
    else if(t.classList.contains("rm")){l.remark=t.value}
    persist();
    
  };
  v.onchange=e=>{const t=e.target;if(t.dataset.pplsel!==undefined){const x=sitePpl(d.project)[+t.value];if(x){d.contact=x[0];d.contactTel=x[1];persist();renderOrder()}return}if(t.tagName==="SELECT"&&t.dataset.f){d[t.dataset.f]=t.value;persist()}};
  v.onclick=e=>{const t=e.target;const row=t.closest(".line");
    if(row){const l=d.lines.find(z=>z.id===row.dataset.id);
      if(t.classList.contains("del")){d.lines=d.lines.filter(z=>z!==l);persist();renderOrder();updateCart();return}
      if(t.dataset.a){l.qty=Math.max(0,(+l.qty||0)+(t.dataset.a==="+"?1:-1));if(l.qty===0){d.lines=d.lines.filter(z=>z!==l)}persist();renderOrder();updateCart();return}}
    if(t.id==="bAdd"||t.id==="bAdd2")go("menu");
    if(t.id==="bCustom")customDlg();
    if(false&&t.id==="bReprice"){const k=+d.discount||1;d.lines.forEach(l=>{if(isNum(l.list))l.price=Math.round(l.list*k*100)/100});persist();renderOrder();toast("已依折數 "+k+" 重算單價")}
    if(t.id==="bClear")confirmDlg("真的要清空嗎？🥺 單子上的材料會全部不見喔～",()=>{d.lines=[];persist();renderOrder();updateCart()});
    if(t.id==="bNew")confirmDlg("另開一張新叫料單？目前這張會先存到紀錄。",()=>{saveOrder(true);P().draft=newOrder(P());persist();renderAll();toast("已開新單")});
    if(t.id==="bSave"){saveOrder();toast("已儲存到紀錄："+d.no)}
    if(t.id==="bXls")exportXlsx(d);if(t.id==="bXlsLine")exportXlsx(d,false,true);
    if(t.id==="bPdf")exportPdf(d);
  };
}
function genNo(d){const p=P();const ds=(d.orderDate||today()).replace(/-/g,"");const same=p.orders.filter(o=>o.no&&o.no.startsWith("JL"+ds)).length;return "JL"+ds+"-"+String(same+1).padStart(2,"0")}
function saveOrder(silent){const p=P();const d=draft();if(!d.lines.length&&silent)return;if(!d.no)d.no=genNo(d);d.saved=Date.now();
  const copy=JSON.parse(JSON.stringify(d));const i=p.orders.findIndex(o=>o.id===d.id);if(i>=0)p.orders[i]=copy;else p.orders.unshift(copy);persist();renderOrder()}

// ---------- history ----------
function renderHist(){
  const p=P();const v=$("#vHist");
  const months=[...new Set(p.orders.map(o=>monthOf(o.orderDate)))].sort().reverse();
  v.innerHTML=`${months.length?`<div class="card"><div class="sec">📊 匯出總表（Excel）</div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
   <select id="sumMonth" class="sel" style="max-width:none">${months.map(m=>`<option value="${m}">${+m.slice(0,4)-1911}年${+m.slice(5)}月</option>`).join("")}</select>
   <button class="btn btn-p" id="bMonth">⬇ 匯出${esc(p.name)}當月總表</button></div>
   <p class="note" style="margin:6px 0 0">一個檔案內含「總表」（當月所有叫料單合併，含下單日期、下單廠商、到貨狀況）＋每張叫料單的出貨單分頁。</p></div>`:""}
  <div class="card"><div class="sec">🗂 ${esc(p.name)} 的叫料紀錄（${p.orders.length}）</div>
  ${p.orders.length?p.orders.map(o=>{return `<div class="hist" data-id="${o.id}"><div class="tx"><b>${esc(o.no)}</b>${o.exported?`<span class="tag">已匯出</span>`:""}${o.arrival?`<span class="tag" style="background:#fff7ed;border-color:#fed7aa;color:#c2410c">${esc(o.arrival)}</span>`:""}<small>訂貨 ${esc(o.orderDate)}・交貨 ${esc(o.dueDate)}・${o.lines.length} 項</small></div>
   <button class="btn" data-a="open">開啟</button><button class="btn" data-a="copy">複製</button><button class="btn" data-a="xls">Excel</button><button class="btn" data-a="pdf">PDF</button><button class="btn btn-d" data-a="del">✕</button></div>`}).join(""):`<div class="empty">還沒有紀錄。在「叫料單」按「💾 儲存到紀錄」或匯出 Excel 會自動存檔。</div>`}</div>`;
  const bm=$("#bMonth");if(bm)bm.onclick=()=>exportMonth($("#sumMonth").value);
  v.onclick=e=>{const b=e.target.closest("[data-a]");if(!b)return;const o=p.orders.find(z=>z.id===b.closest(".hist").dataset.id);
    if(b.dataset.a==="open"){if(draft().lines.length&&draft().id!==o.id)saveOrder(true);p.draft=JSON.parse(JSON.stringify(o));persist();go("order")}
    if(b.dataset.a==="copy"){if(draft().lines.length)saveOrder(true);const n=JSON.parse(JSON.stringify(o));n.id=uid();n.no="";n.exported=false;n.orderDate=today();n.dueDate=addDays(today(),1);n.lines.forEach(l=>l.id=uid());p.draft=n;persist();go("order");toast("已複製成新叫料單")}
    if(b.dataset.a==="xls")exportXlsx(o,true);
    if(b.dataset.a==="pdf")exportPdf(o,true);
    if(b.dataset.a==="del")confirmDlg("刪除紀錄 "+o.no+"？",()=>{p.orders=p.orders.filter(z=>z!==o);persist();renderHist()});
  };
}

// ---------- cumulative ----------
let sumQ="",sumSite=null;
function aggregate(projs){
  const m=new Map();
  projs.forEach(p=>p.orders.forEach(o=>o.lines.forEach(l=>{const name=[materialName(l),l.size,l.spec].filter(Boolean).join(" ");const k=(l.cat||"")+"|"+name+"|"+(l.unit||"");
    let x=m.get(k);if(!x){const mm=/^(\d+)_(\d+)\|(\d+)$/.exec(l.vk||"");x={cat:l.cat||"",name,unit:l.unit||"",qty:0,n:0,last:"",by:{},ord:mm?[+mm[1],+mm[2],+mm[3]]:[9999,0,0]};m.set(k,x)}
    const q=+l.qty||0;x.qty=Math.round((x.qty+q)*100)/100;x.by[p.id]=Math.round(((x.by[p.id]||0)+q)*100)/100;x.n++;if((o.orderDate||"")>x.last)x.last=o.orderDate||""})));
  return m;
}
function siteRows(p){
  const terms=sumQ.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const m=aggregate([p]);
  const rows=[...m.values()].filter(x=>terms.every(t=>(x.cat+" "+x.name).toLowerCase().includes(t)));
  rows.sort((a,b)=>a.ord[0]-b.ord[0]||a.ord[1]-b.ord[1]||a.ord[2]-b.ord[2]||a.name.localeCompare(b.name,"zh-Hant"));
  return {rows,total:m.size};
}
function siteTable(p){
  const {rows,total}=siteRows(p);
  let html="",last=null;
  for(const x of rows){if(x.cat!==last){last=x.cat;html+=`<tr class="sg"><td colspan="3">${esc(x.cat||"其他")}</td></tr>`}
    html+=`<tr><td class="nm">${esc(x.name)}<small>叫貨 ${x.n} 次・最近 ${esc(x.last)}</small></td><td class="u">${esc(x.unit)}</td><td class="q">${fmt(x.qty)}</td></tr>`}
  return `<div class="card"><div class="sec">🏗 ${esc(p.name)}<span class="sp"></span><span class="note">${p.orders.length} 張叫料單・${total} 個品項</span></div>
   ${rows.length?`<table class="sum"><thead><tr><th>名稱</th><th>單位</th><th>已叫貨數量</th></tr></thead><tbody>${html}</tbody></table>`:`<div class="empty" style="padding:14px">${p.orders.length?"找不到符合的品項":"尚無叫料紀錄"}</div>`}</div>`;
}
function renderSum(){
  if(sumSite!=="ALL"&&!S.projects.find(p=>p.id===sumSite))sumSite=S.cur;
  const ALL=sumSite==="ALL";const projs=ALL?S.projects:[S.projects.find(p=>p.id===sumSite)];
  const v=$("#vSum");
  const opts=`<option value="ALL" ${ALL?"selected":""}>全部工地（各工地分開統計）</option>`+S.projects.map(p=>`<option value="${p.id}" ${p.id===sumSite?"selected":""}>${esc(p.name)}</option>`).join("");
  const any=projs.some(p=>p.orders.length);
  v.innerHTML=`<div class="card"><div class="sec">📊 叫料品項統計</div>
   <label class="f" style="margin-bottom:8px">工地名稱<select id="sumSite">${opts}</select></label>
   <div class="search" style="margin-bottom:6px"><span>🔍</span><input id="sq" type="search" placeholder="搜尋品項" value="${esc(sumQ)}"></div>
   <p class="note" style="margin:0">每個工地各自累計，只計入「紀錄」裡的叫料單（尚未儲存的草稿不算）；刪除紀錄會一併扣除。</p>
   ${any?`<div class="acts" style="margin-top:8px"><button class="btn btn-p" id="bSumX">⬇ 匯出統計 Excel</button></div>`:""}</div>
   ${projs.map(siteTable).join("")}`;
  $("#sumSite").onchange=e=>{sumSite=e.target.value;renderSum()};
  const sq=$("#sq");sq.oninput=()=>{sumQ=sq.value;const pos=sq.selectionStart;renderSum();const n=$("#sq");n.focus();n.setSelectionRange(pos,pos)};
  const bx=$("#bSumX");if(bx)bx.onclick=()=>exportSum(ALL?"全部工地":projs[0].name,projs);
}
async function exportSum(title,projs){
  try{const wb=new ExcelJS.Workbook();const F={name:"微軟正黑體",size:12};
    const used=new Set();
    projs.forEach(p=>{
      let nm=(p.name||"工地").replace(/[\\/?*\[\]:]/g,"").slice(0,31)||"工地";while(used.has(nm))nm=nm.slice(0,29)+"_"+used.size;used.add(nm);
      const ws=wb.addWorksheet(nm);const {rows}=siteRows(p);
      ws.mergeCells("A1:E1");ws.getCell("A1").value=`${p.name} 叫料品項統計（${today()}）`;ws.getCell("A1").font={name:"微軟正黑體",size:16,bold:true};ws.getCell("A1").alignment={horizontal:"center"};
      ws.addRow(["分類","名稱","單位","已叫貨數量","叫貨次數"]);
      rows.forEach(x=>ws.addRow([x.cat||"其他",x.name,x.unit,x.qty,x.n]));
      if(!rows.length)ws.addRow(["","尚無叫料紀錄","","",""]);
      ws.columns=[{width:24},{width:46},{width:8},{width:14},{width:10}];
      ws.eachRow((r,i)=>{if(i<2)return;for(let c=1;c<=5;c++){const ce=r.getCell(c);ce.font=Object.assign({},F,i===2?{bold:true}:{});ce.border={top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}};ce.alignment={vertical:"middle",wrapText:true,horizontal:c<=2?"left":"center"};if(i===2)ce.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFDDEBF7"}}}});
      ws.views=[{state:"frozen",ySplit:2}];
    });
    const buf=await wb.xlsx.writeBuffer();
    await saveFile(`叫料統計_${title.replace(/[\\/:*?"<>|]/g,"")}_${today().replace(/-/g,"")}.xlsx`,new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
  }catch(err){toast("匯出失敗："+(err&&err.message||err))}
}

// ---------- dialogs ----------
function confirmDlg(msg,ok){const D=$("#dlg");D.innerHTML=`<div class="sh-h"><h2>確認</h2></div><div class="sh-b">${esc(msg)}</div><div class="sh-f"><button class="btn" data-c="0">取消</button><button class="btn btn-p" data-c="1">確定</button></div>`;
  D.oninput=null;D.onclose=null;D.onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;D.close();if(b.dataset.c==="1")ok()};D.showModal()}
$("#bProj").onclick=()=>{const D=$("#dlg");const p=P();
  D.innerHTML=`<form id="pf"><div class="sh-h"><h2>✎ 工地</h2><small>每個工地的叫料單分開保存</small><button type="button" class="sh-x" data-close>✕</button></div>
  <div class="sh-b"><div class="grid"><label class="f full">目前工地名稱（＝工程名稱）<input name="name" required maxlength="50" value="${esc(p.name)}"></label>
  <label class="f full">預設交貨地點<input name="addr" maxlength="80" value="${esc(p.addr||"")}"></label></div>
  <p class="note">新增工地：</p><div style="display:flex;gap:8px"><input id="np" maxlength="50" placeholder="新工地名稱" style="flex:1;border:1px solid #d1d5db;border-radius:9px;padding:8px 10px"><button type="button" class="btn btn-g" id="bNp">＋ 新增</button></div></div>
  <div class="sh-f"><button type="button" class="btn btn-d" id="bDp" ${S.projects.length<2?"disabled":""}>刪除此工地</button><span style="flex:1"></span><button class="btn btn-p">儲存</button></div></form>`;
  D.oninput=null;D.onclose=null;D.onclick=e=>{if(e.target.closest("[data-close]"))D.close()};
  $("#bNp").onclick=()=>{const n=$("#np").value.trim();if(!n)return;const np={id:uid(),name:n,addr:"",orders:[],draft:null};S.projects.push(np);S.cur=np.id;persist();D.close();renderAll();toast("已新增工地："+n)};
  $("#bDp").onclick=()=>{D.close();confirmDlg("刪除工地「"+p.name+"」與它的所有叫料紀錄？",()=>{S.projects=S.projects.filter(z=>z!==p);S.cur=S.projects[0].id;persist();renderAll()})};
  $("#pf").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const old=p.name;p.name=f.get("name").trim();p.addr=f.get("addr").trim();if(p.draft){if(p.draft.project===old)p.draft.project=p.name;if(!p.draft.addr)p.draft.addr=p.addr}persist();D.close();renderAll()};
  D.showModal()};
$("#bSet").onclick=()=>{const D=$("#dlg");const st=S.settings;
  const fld=(k,l,t)=>`<label class="f ${t||""}">${l}<input name="${k}" value="${esc(st[k])}"></label>`;
  D.innerHTML=`<form id="sf"><div class="sh-h"><h2>⚙ 設定</h2><small>新叫料單的預設值（Excel 抬頭、廠商、聯絡人）</small><button type="button" class="sh-x" data-close>✕</button></div>
  <div class="sh-b"><div class="grid"><label class="f full">預設公司名稱<select name="company">${COMPANIES.map(n=>`<option ${n===st.company?"selected":""}>${esc(n)}</option>`).join("")}</select></label>${fld("title","表單標題")}
  ${fld("contact","預設收貨人")}${fld("contactTel","收貨人電話")}${fld("vendor","預設廠商","full")}${fld("vendorContact","廠商聯絡人")}${fld("vendorTel","廠商電話")}${fld("vendorFax","廠商傳真")}</div>
  <p class="note">只影響之後新開的叫料單；目前這張可直接在叫料單頁修改。</p></div>
  <div class="sh-f"><button class="btn btn-p">儲存</button></div></form>`;
  D.oninput=null;D.onclose=null;D.onclick=e=>{if(e.target.closest("[data-close]"))D.close()};
  $("#sf").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);for(const [k,val] of f.entries())st[k]=k==="discount"?(+val||1):val.trim();persist();D.close();toast("設定已儲存")};
  D.showModal()};
$("#bBak").onclick=()=>{const D=$("#dlg");
  D.innerHTML=`<div class="sh-h"><h2>💾 備份</h2><small>資料只存在這台裝置的瀏覽器</small><button class="sh-x" data-close>✕</button></div>
  <div class="sh-b"><p class="note">換電腦、清除瀏覽器資料前，請先匯出備份檔；在新電腦用「匯入」還原。<br>放在 Synology Drive 同步資料夾裡，其他電腦也能拿到備份檔。</p>
  <div class="acts" style="justify-content:flex-start"><button class="btn btn-g" id="bEx">⬇ 匯出備份檔</button><button class="btn" id="bIm">⬆ 匯入備份檔</button></div></div>`;
  D.oninput=null;D.onclose=null;D.onclick=e=>{if(e.target.closest("[data-close]"))D.close()};
  $("#bEx").onclick=()=>{saveFile("工程叫料小幫手備份_"+today().replace(/-/g,"")+".json",new Blob([JSON.stringify(S,null,1)],{type:"application/json"}))};
  $("#bIm").onclick=()=>$("#fImp").click();
  D.showModal()};
$("#fImp").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;try{const o=JSON.parse(await f.text());if(!o.projects)throw 0;
  confirmDlg("用備份檔取代目前所有資料？",()=>{S=o;S.settings=Object.assign(defSettings(),S.settings||{});if(!S.projects.find(p=>p.id===S.cur))S.cur=S.projects[0].id;persist();renderAll();toast("已還原備份")})}catch(err){toast("這不是工程叫料小幫手的備份檔")}};

const hostedArchive=false;
const filesDlg=$("#filesDlg");
async function archiveFile(project,file){
  if(!hostedArchive)return "";
  try{
    const params=new URLSearchParams({project:project||"",name:file.name});
    const response=await fetch("/api/order-files?"+params,{method:"POST",body:file});
    if(!response.ok)throw new Error((await response.json()).error);
    return "已存至工程檔案";
  }catch(error){return "後台存檔失敗："+error.message}
}
function openFilesDialog(title,body,actions=""){
  filesDlg.innerHTML=`<div class="sh-h"><h2>${title}</h2></div><div class="sh-b">${body}</div><div class="sh-f"><button class="btn" id="filesClose">關閉</button>${actions}</div>`;
  $("#filesClose").onclick=()=>filesDlg.close();
  if(!filesDlg.open)filesDlg.showModal();
}
async function showShare(file,status){
  const data={files:[file]};
  const supported=!!(navigator.share&&navigator.canShare?.(data));
  if(supported){try{await navigator.share(data);return}catch(e){if(e.name==="AbortError")return}}
  const steps=supported
    ?'<ol class="lsteps"><li>按下面綠色的「📤 傳到 LINE」</li><li>在跳出來的選單點「LINE」</li><li>選要傳給誰，按「傳送」</li></ol>'
    :'<ol class="lsteps"><li>按「⬇ 下載檔案」</li><li>打開 LINE 聊天室，按左下「＋」→「檔案」</li><li>選剛下載的 Excel 傳送</li></ol>';
  openFilesDialog("傳到 LINE",`<p class="lfile">📄 ${esc(file.name)}</p>${steps}<p id="shareStatus" role="status"></p>`,
    '<button class="btn" id="filesDownload">⬇ 下載檔案</button>'+(supported?'<button class="btn btn-line" id="shareNow">📤 傳到 LINE</button>':""));
  $("#filesDownload").onclick=()=>saveFile(file.name,file);
  if(supported)$("#shareNow").onclick=async()=>{
    try{await navigator.share(data);filesDlg.close()}
    catch(error){if(error.name!=="AbortError")$("#shareStatus").textContent="分享選單打不開，請改按「下載檔案」，再到 LINE 附加。"}
  };
}
if(hostedArchive){
  const button=$("#bFiles");
  button.hidden=false;
  button.onclick=async()=>{
    openFilesDialog("工程檔案",'<div id="archiveList" role="status">載入中…</div>');
    const list=$("#archiveList");
    try{
      const folders=new Map();
      let cursor;
      do{
        const response=await fetch("/api/order-files?"+new URLSearchParams(cursor?{cursor}:{}));
        const page=await response.json();
        if(!response.ok)throw new Error(page.error);
        for(const file of page.files){
          if(!folders.has(file.project))folders.set(file.project,[]);
          folders.get(file.project).push(file);
        }
        cursor=page.cursor;
      }while(cursor&&filesDlg.open);
      list.innerHTML=[...folders].map(([name,files])=>`<details><summary>${esc(name)}（${files.length}）</summary><ul>${files.sort((a,b)=>b.date.localeCompare(a.date)).map(file=>`<li><a download href="/api/order-files?file=${encodeURIComponent(file.id)}">${esc(file.name)}</a> <small>${esc(new Date(file.date).toLocaleString("zh-TW"))}</small></li>`).join("")}</ul></details>`).join("")||"目前沒有歸檔。匯出 Excel 或開啟 PDF 預覽後，檔案會按工程名稱存放。";
    }catch(error){list.textContent="無法讀取工程檔案："+error.message}
  };
}
// ---------- file save ----------
let dl=null;try{if(window.claude&&window.claude.use)window.claude.use("downloads").then(x=>{dl=x}).catch(()=>{})}catch(e){}
async function saveFile(name,blob){
  if(dl){try{await dl.save({filename:name,data:blob});toast("已匯出："+name);return true}catch(e){toast("未下載（已取消或無法下載）");return false}}
  try{const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast("已匯出："+name);return true}
  catch(e){toast("此環境無法下載檔案");return false}
}

// ---------- Excel ----------
function b64buf(b){const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer}
const dt=s=>{if(!s)return null;const [y,m,d]=s.split("-").map(Number);return new Date(Date.UTC(y,m-1,d))};
function fillOrderSheet(ws,d){
  const st=S.settings;
  ws.getCell("A1").value=d.company||(COMPANIES.includes(st.company)?st.company:COMPANIES[0]);ws.getCell("A3").value=(st.title&&st.title!=="材料叫料單"?st.title:"材料出貨單");
  ws.getCell("B5").value=d.project||"";ws.getCell("G5").value=dt(d.orderDate);ws.getCell("G6").value=dt(d.dueDate);
  ws.getCell("B6").value=["工務所","工地","自取"].map(m=>(d.mode===m?"█":"□")+m).join("  ");
  ws.getCell("B7").value=d.addr||"";
  ws.getCell("F7").value="收貨人";ws.getCell("G7").value=d.contact||"";ws.getCell("F8").value="收貨人電話";ws.getCell("G8").value=d.contactTel||"";["F","G"].forEach(c=>{ws.getCell(c+"8").alignment=JSON.parse(JSON.stringify(ws.getCell(c+"7").alignment||{}));ws.getCell(c+"8").font=JSON.parse(JSON.stringify(ws.getCell(c+"7").font||{}))});
  const ck=x=>(d.docs.includes(x)?"■":"□")+x;
  ws.getCell("B8").value=["保固書","測試報告","進口證明及銷售證明","中文操作說明"].map(ck).join(" ");
  ws.getCell("B9").value=["竣工圖","出廠證明","產地證明"].map(ck).join(" ")+" "+ck("其它")+"︰"+(d.docOther||"");
  ws.getCell("B10").value=d.vendor||"";ws.getCell("B11").value=d.vendorContact?"聯絡人："+d.vendorContact:"";
  ws.getCell("G10").value=d.vendorTel||"";ws.getCell("G11").value=d.vendorFax||"";
  const FIRST=13,BASE=32;const n=d.lines.length;const extra=Math.max(0,n-BASE);
  if(extra){try{ws.unMergeCells("A46:G46")}catch(e){}ws.duplicateRow(44,extra,true);try{ws.mergeCells(`A${46+extra}:G${46+extra}`)}catch(e){}}
  const last=FIRST+BASE+extra-1,totR=last+1,noteR=totR+1;
  const R13=ws.getRow(FIRST);const base=[1,2,3,4,5,6,7].map(c=>({font:JSON.parse(JSON.stringify(R13.getCell(c).font||{})),alignment:JSON.parse(JSON.stringify(R13.getCell(c).alignment||{horizontal:"center",vertical:"middle"}))}));
  for(let r=FIRST;r<=last;r++){const i=r-FIRST;const row=ws.getRow(r);const l=d.lines[i];
    for(let c=1;c<=7;c++){const ce=row.getCell(c);ce.style=JSON.parse(JSON.stringify(ce.style||{}));ce.font=JSON.parse(JSON.stringify(base[c-1].font));ce.alignment=Object.assign({vertical:"middle"},JSON.parse(JSON.stringify(base[c-1].alignment)));}
    row.getCell(1).value=l?i+1:null;
    if(!l){for(let c=2;c<=7;c++)row.getCell(c).value=null;continue}
    const name=lineName(l);
    const b=row.getCell(2);b.value=name;b.alignment=Object.assign({},b.alignment,{wrapText:true,horizontal:"left",vertical:"middle"});b.font=Object.assign({},b.font,{size:13});
    row.getCell(3).value=l.unit||"";row.getCell(4).value=+l.qty||0;
    row.getCell(5).value=null;row.getCell(6).value=null;
    const g=row.getCell(7);g.value=l.remark||"";g.font=Object.assign({},g.font,{size:11});g.alignment=Object.assign({},g.alignment,{wrapText:true});
    const len=name.length;if(len>14)row.height=Math.min(110,19*Math.ceil(len/14)+4);
  }
  ws.getCell(`A${noteR}`).value=(d.note?"備註："+d.note:"備註：")+(d.arrival?`　到貨狀況：${d.arrival}`:"");
  ws.getCell(`A${noteR}`).alignment={horizontal:"left",vertical:"middle",wrapText:true};
  ws.pageSetup=Object.assign({},ws.pageSetup,{paperSize:9,orientation:"portrait",fitToPage:true,fitToWidth:1,fitToHeight:0,printArea:`A1:G${noteR}`});
}
function cloneSheet(wb,src,name){
  const ws=wb.addWorksheet(name);
  src.columns.forEach((c,i)=>{if(c&&c.width)ws.getColumn(i+1).width=c.width});
  src.eachRow({includeEmpty:true},(row,r)=>{const nr=ws.getRow(r);if(row.height)nr.height=row.height;
    row.eachCell({includeEmpty:true},(c,ci)=>{const t=nr.getCell(ci);t.value=c.value&&c.value.formula?{formula:c.value.formula}:c.value;t.style=JSON.parse(JSON.stringify(c.style||{}))})});
  Object.keys(src._merges||{}).forEach(k=>{try{ws.mergeCells(src._merges[k].range)}catch(e){}});
  ws.pageSetup=JSON.parse(JSON.stringify(src.pageSetup||{}));
  return ws;
}
const rocDate=s=>{if(!s)return "";const [y,m,d]=s.split("-");return `${+y-1911}/${m}/${d}`};
const rocSheet=s=>{if(!s)return "叫料單";const [y,m,d]=s.split("-");return `${+y-1911}-${m}-${d}`};
const monthOf=s=>(s||today()).slice(0,7);
function buildSummary(ws,orders,proj){
  const F=(sz,b)=>({name:"微軟正黑體",size:sz,bold:!!b});
  const thin={style:"thin"},dbl={style:"double"};
  const brd={top:thin,left:thin,bottom:thin,right:thin};
  [13.9,8,40,7.5,8,21,15,30].forEach((w,i)=>ws.getColumn(i+1).width=w);
  const last=orders[orders.length-1]||{};
  const [yy,mm]=monthOf(last.orderDate).split("-");
  ws.mergeCells("A1:H2");ws.getCell("A1").value=last.company||S.settings.company||"";ws.getCell("A1").font=F(20);ws.getCell("A1").alignment={horizontal:"center",vertical:"middle"};
  ws.mergeCells("A3:H4");ws.getCell("A3").value=`${+yy-1911}.${+mm} 材料出貨單總表`;ws.getCell("A3").font=F(20);ws.getCell("A3").alignment={horizontal:"center",vertical:"middle"};
  const lab=(r,t,v)=>{ws.getCell(`A${r}`).value=t;ws.mergeCells(`C${r}:F${r}`);ws.getCell(`C${r}`).value=v;
    for(let c=1;c<=8;c++){const ce=ws.getRow(r).getCell(c);ce.border=brd;ce.font=F(c===1?14:13);ce.alignment={horizontal:c===1?"center":"left",vertical:"middle"}}ws.getRow(r).height=24.75};
  lab(5,"工程名稱",proj);lab(6,"交貨地點",["工務所","工地","自取"].map(m=>(last.mode===m?"█":"□")+m).join("  ")+(last.addr?"　"+last.addr:""));
  const hdr=["下單日期","項次","品名及規格","單 位","數 量","下單廠商","到貨狀況","備 註"];
  const hr=ws.getRow(7);hdr.forEach((h,i)=>{const c=hr.getCell(i+1);c.value=h;c.font=F(15);c.alignment={horizontal:"center",vertical:"middle"};c.border=brd;c.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFDDEBF7"}}});hr.height=33.75;
  let r=8;
  for(const o of orders){
    const start=r;let no=0;
    const anyRemark=o.lines.some(l=>l.remark);
    let i=0;
    while(i<o.lines.length){const cat=o.lines[i].cat||"";
      while(i<o.lines.length&&(o.lines[i].cat||"")===cat){const l=o.lines[i];no++;const row=ws.getRow(r);
        row.getCell(2).value=no;row.getCell(3).value=lineName(l);row.getCell(4).value=l.unit||"";row.getCell(5).value=+l.qty||0;
        if(anyRemark)row.getCell(8).value=l.remark||"";r++;i++}
      if(cat&&cat!=="自訂"){const row=ws.getRow(r);row.getCell(3).value=`以上 ${cat}`;row.getCell(3).font=Object.assign(F(12),{italic:true,color:{argb:"FF555555"}});r++}
    }
    const end=r-1;
    for(let rr=start;rr<=end;rr++){const row=ws.getRow(rr);for(let c=1;c<=8;c++){const ce=row.getCell(c);ce.border=brd;if(!(c===3&&String(ce.value||"").startsWith("以上 ")))ce.font=F(c===1?15:13);
      ce.alignment={horizontal:c===3?"left":"center",vertical:"middle",wrapText:c===3||c>=6}}}
    const vend=`${+o.orderDate.slice(5,7)}/${+o.orderDate.slice(8,10)}下單${o.vendor||""}`;
    const put=(col,val)=>{if(end>start)ws.mergeCells(`${col}${start}:${col}${end}`);ws.getCell(`${col}${start}`).value=val};
    put("A",rocDate(o.orderDate));put("F",vend);put("G",o.arrival||"");
    if(!anyRemark)put("H",o.note||"");else{const c=ws.getCell(`H${start}`);c.value=[o.note,c.value].filter(Boolean).join("；")}
    for(let c=1;c<=8;c++)ws.getRow(end).getCell(c).border=Object.assign({},brd,{bottom:{style:"medium"}});
  }
  for(let k=0;k<15;k++,r++){const row=ws.getRow(r);for(let c=1;c<=8;c++){row.getCell(c).border=brd;row.getCell(c).font=F(13)}}
  ws.views=[{state:"frozen",ySplit:7}];
  ws.pageSetup={paperSize:9,orientation:"portrait",fitToPage:true,fitToWidth:1,fitToHeight:0,printArea:`A1:H${r-1}`,printTitlesRow:"7:7"};
}
async function exportWorkbook(p,month,extra,share,single){
  const map=new Map();if(!single)p.orders.filter(o=>monthOf(o.orderDate)===month).forEach(o=>map.set(o.id,o));
  if(extra&&monthOf(extra.orderDate)===month)map.set(extra.id,extra);
  const orders=[...map.values()].filter(o=>o.lines.length).sort((a,b)=>(a.orderDate||"").localeCompare(b.orderDate||"")||(a.no||"").localeCompare(b.no||""));
  if(!orders.length){toast("這個月份沒有叫料紀錄");return false}
  const wb=new ExcelJS.Workbook();await wb.xlsx.load(b64buf(TPL_B64));
  const tpl=wb.worksheets[0];
  const used=new Set();if(!single){const sum=wb.addWorksheet("總表");buildSummary(sum,orders,orders[orders.length-1].project||p.name);used.add("總表")}
  [...orders].reverse().forEach(o=>{let nm=rocSheet(o.orderDate),k=2;while(used.has(nm))nm=rocSheet(o.orderDate)+`(${k++})`;used.add(nm);fillOrderSheet(cloneSheet(wb,tpl,nm),o)});
  wb.removeWorksheet(tpl.id);
  const buf=await wb.xlsx.writeBuffer();
  const [yy,mm]=month.split("-");
  const fn=single?`${(p.name||"").replace(/[\\/:*?"<>|]/g,"")}_${rocSheet(extra.orderDate)}_叫料單${extra.no?"_"+String(extra.no).replace(/[\\/:*?"<>|]/g,""):""}.xlsx`:`${(p.name||"").replace(/[\\/:*?"<>|]/g,"")}_${+yy-1911}.${mm}_材料出貨單總表.xlsx`;
  const file=new File([buf],fn,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const status=await archiveFile(extra?.project||p.name,file);
  if(share){showShare(file,status);return true}
  const ok=await saveFile(fn,file);
  if(status)toast(status);
  return ok;
}
async function exportXlsx(d,fromHist,share){
  if(typeof ExcelJS==="undefined"){toast("Excel 元件載入失敗");return}
  if(!d.lines.length){toast("還沒有材料");return}
  if(!fromHist&&!d.no)d.no=genNo(d);
  try{
    const p=S.projects.find(x=>x.orders.some(o=>o.id===d.id))||P();
    const ok=await exportWorkbook(p,monthOf(d.orderDate),d,share,true);
    if(ok&&!fromHist&&d.id===draft().id){draft().exported=true;saveOrder()}
  }catch(err){console.error(err);toast("匯出失敗："+(err&&err.message||err))}
}
async function exportMonth(month){
  try{await exportWorkbook(P(),month,null)}catch(err){console.error(err);toast("匯出失敗："+(err&&err.message||err))}
}
// ---------- PDF (preview + download) ----------
function fmtDate(s){if(!s)return "";const [y,m,dd]=s.split("-").map(Number);return `${y-1911}年${m}月${dd}日`}
const FIRST_ROWS=32,NEXT_ROWS=46;
const LN_PRE={"150磅可鍛鑄鐵零件(熱浸)":"150磅熱浸","300磅可鍛鑄鐵零件(熱浸)":"300磅熱浸","304不銹鋼牙件 150P":"304不銹鋼牙件","展性可鍛鑄鐵牙另件 150psi UL/FM（MECH）":"UL/FM","球狀石墨鑄鐵 300psi 螺紋另件 UL/FM（MECH）":"球墨鑄鐵 UL/FM","不銹鋼雙壓接另件・滑動式保溫另件":"不銹鋼壓接","ONK Nice Joint 不鏽鋼管式接頭 SUS304":"Nice Joint","鍛鋼／碳鋼／不鏽鋼法蘭（萬蕙昇）":"萬蕙昇法蘭","迫緊墊片":"墊片","不銹鋼軟管製品、合成橡膠防震接頭":"不銹鋼軟管"};
function lineName(l){let n=lineName0(l);n=n.replace(/^滾溝另件｜(\S+) /,(m,c)=>/金通/.test(c)?"金通溝槽 ":/邁克/.test(c)?"溝槽 ":"");
  let pre=LN_PRE[l.cat]||"";const fs=/^富山閥・(.+)$/.exec(l.cat||"");if(fs)pre="富山 "+fs[1];
  if(pre&&!n.startsWith(pre))n=pre+" "+n;return n}
function lineName0(l){const name=materialName(l);if(name!==l.name)return [name,l.size,l.spec].filter(Boolean).join(" ");return [false&&l.cat?l.cat.replace(/^PVC另件・/,"PVC ").replace(/另件$/,""):"",l.name,l.size,l.spec].filter(Boolean).join(" ")}
function buildPages(d){
  const st=S.settings;const company=d.company||st.company||"";const title=(st.title&&st.title!=="材料叫料單"?st.title:"材料出貨單");
  const box=on=>on?"■":"□";
  const mode=["工務所","工地","自取"].map(m=>`${d.mode===m?"█":"□"}${m}`).join("　");
  const docs1=["保固書","測試報告","進口證明及銷售證明","中文操作說明"].map(x=>box(d.docs.includes(x))+x).join(" ");
  const docs2=["竣工圖","出廠證明","產地證明"].map(x=>box(d.docs.includes(x))+x).join(" ")+" "+box(d.docs.includes("其它"))+"其它︰"+esc(d.docOther||"");
  const L=d.lines;const chunks=[];
  chunks.push(L.slice(0,FIRST_ROWS));for(let i=FIRST_ROWS;i<L.length;i+=NEXT_ROWS)chunks.push(L.slice(i,i+NEXT_ROWS));
  const total=chunks.length;let start=0;
  const head=`<colgroup><col style="width:7%"><col style="width:41%"><col style="width:7%"><col style="width:9%"><col style="width:10%"><col style="width:10%"><col style="width:16%"></colgroup>
   <thead><tr><th>項次</th><th>品名及規格</th><th>單位</th><th>數量</th><th>單價</th><th>複價</th><th>備註</th></tr></thead>`;
  return chunks.map((ch,pi)=>{
    const pad=pi===0?FIRST_ROWS:ch.length;let rows="";
    for(let i=0;i<Math.max(pad,ch.length);i++){const l=ch[i];
      rows+=`<tr><td class="c">${l?start+i+1:""}</td><td class="nm">${l?esc(lineName(l)):""}</td><td class="c">${l?esc(l.unit||""):""}</td><td class="c">${l?fmt(+l.qty||0):""}</td><td></td><td></td><td class="rm">${l?esc(l.remark||""):""}</td></tr>`}
    start+=ch.length;const last=pi===total-1;
    const top=pi===0?`<div class="pc">${esc(company)}</div><div class="pt">${esc(title)}${d.no?"　No. "+esc(d.no):""}</div>
  <table class="ph"><colgroup><col style="width:13%"><col style="width:52%"><col style="width:15%"><col style="width:20%"></colgroup>
   <tr><th>工程名稱</th><td>${esc(d.project||"")}</td><th>訂貨日期</th><td class="c">${fmtDate(d.orderDate)}</td></tr>
   <tr><th>交貨地點</th><td>${mode}</td><th>預定交貨日期</th><td class="c">${fmtDate(d.dueDate)}</td></tr>
   <tr><th>交貨地點</th><td>${esc(d.addr||"")}</td><th>收貨人</th><td class="c">${esc(d.contact||"")}</td></tr>
   <tr><th rowspan="2">附查驗用<br>證明文件</th><td class="sm">${docs1}</td><th>收貨人電話</th><td class="c">${esc(d.contactTel||"")}</td></tr>
   <tr><td colspan="3" class="sm">${docs2}</td></tr>
   <tr><th rowspan="2">廠商名稱</th><td rowspan="2">${esc(d.vendor||"")}${d.vendorContact?`<br><span class="sm">聯絡人：${esc(d.vendorContact)}</span>`:""}</td><th>公司電話</th><td class="c">${esc(d.vendorTel||"")}</td></tr>
   <tr><th>公司傳真</th><td class="c">${esc(d.vendorFax||"")}</td></tr></table>`
   :`<div class="pcont">${esc(company)}　${esc(title)}${d.no?"　No. "+esc(d.no):""}（續）</div>`;
    return `<div class="pg"><div class="pgin">${top}<table class="pi${pi>0?" pi2":""}">${head}<tbody>${rows}</tbody></table>
     ${last?`<div class="pn">備註：${esc(d.note||"")}</div>`:""}<div class="pf">第 ${pi+1} 頁／共 ${total} 頁</div></div></div>`;
  });
}
const PRINT_CSS=`.pg{width:794px;height:1122px;background:#fff;color:#000;box-sizing:border-box;overflow:hidden;position:relative;font-family:"Microsoft JhengHei","微軟正黑體","Noto Sans TC","PingFang TC",sans-serif}
.pgin{padding:34px 32px 30px}
.pc{text-align:center;font-size:25px;font-weight:700;margin:2px 0 3px}.pt{text-align:center;font-size:17px;margin-bottom:12px}
.pcont{font-size:13px;margin-bottom:8px;color:#333}
.pg table{width:100%;border-collapse:collapse;table-layout:fixed}
.ph{border:2.5px double #000;border-bottom:0}.ph th,.ph td{border:1px solid #000;padding:4px 6px;font-size:13px;height:24px;vertical-align:middle}
.ph th{font-weight:400;text-align:center;white-space:nowrap}
.pi{border:2.5px double #000}.pi th{border:1px solid #000;font-weight:400;font-size:13.5px;padding:3px;text-align:center}
.pi td{border:1px solid #000;font-size:11.5px;padding:1px 5px;height:21px;vertical-align:middle;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.pi td.nm{white-space:normal;line-height:1.25;word-break:break-all}
.c{text-align:center}.rm{font-size:10.5px}.sm{font-size:11.5px}
.pn{border:2.5px double #000;border-top:0;padding:6px 8px;font-size:12.5px;min-height:26px}
.pf{position:absolute;bottom:12px;left:0;right:0;text-align:center;font-size:11px;color:#555}`;
let pvDoc=null,pvHist=false,pvFile=null;
function previewPdf(d,fromHist){
  if(!d.lines.length){toast("還沒有材料");return}
  if(!fromHist&&!d.no){d.no=genNo(d);persist()}
  pvDoc=JSON.parse(JSON.stringify(d));pvHist=!!fromHist;pvFile=null;
  const D=$("#pv");const pages=buildPages(d);
  D.innerHTML=`<div class="pvbar"><button class="btn" data-pv="close">✕ 關閉</button><span class="pvt">PDF 預覽・${esc(d.no||"")}・共 ${pages.length} 頁</span>
    <button class="btn" data-pv="xls">⬇ Excel</button><button class="btn btn-p" data-pv="pdf">⬇ 下載 PDF</button><button class="btn" data-pv="line">PDF 至 LINE</button><small id="pvArchive" role="status"></small></div>
    <div class="pvbody"><style>${PRINT_CSS}</style>${pages.map(p=>`<div class="pvwrap">${p}</div>`).join("")}</div>`;
  const fit=()=>{const w=D.querySelector(".pvbody").clientWidth-24;const sc=Math.min(1,w/794);
    D.querySelectorAll(".pvwrap").forEach(x=>{x.style.width=794*sc+"px";x.style.height=1122*sc+"px";x.firstElementChild.style.transform=`scale(${sc})`})};
  D.onclick=e=>{const b=e.target.closest("[data-pv]");if(!b)return;
    if(b.dataset.pv==="close")D.close();if(b.dataset.pv==="pdf"||b.dataset.pv==="line")downloadPdf(b.dataset.pv==="line");if(b.dataset.pv==="xls")exportXlsx(pvDoc,pvHist)};
  D.showModal();fit();if(hostedArchive)preparePdf();window.addEventListener("resize",fit);D.onclose=()=>window.removeEventListener("resize",fit);
}
async function buildPdf(d){
  if(typeof html2pdf==="undefined")throw new Error("PDF 元件載入失敗");
  const host=document.createElement("div");
  host.innerHTML=`<style>${PRINT_CSS}</style>`+buildPages(d).join(`<div class="html2pdf__page-break"></div>`);
    const blob=await html2pdf().set({margin:0,image:{type:"jpeg",quality:0.95},html2canvas:{scale:2,backgroundColor:"#ffffff",scrollX:0,scrollY:0},
      jsPDF:{unit:"px",format:[794,1122],orientation:"portrait",hotfixes:["px_scaling"]},pagebreak:{mode:["css"]}}).from(host).outputPdf("blob");
    const fn=`叫料單_${(d.project||"").replace(/[\\/:*?"<>|]/g,"")}_${d.no||today().replace(/-/g,"")}.pdf`;
    return new File([blob],fn,{type:"application/pdf"});
}
function preparePdf(){
  if(pvFile)return pvFile;
  const order=pvDoc,status=$("#pvArchive");
  status.textContent="PDF 產生中…";
  pvFile=(async()=>{
    try{
      const file=await buildPdf(order);
      const archiveStatus=await archiveFile(order.project,file);
      status.textContent=archiveStatus||"PDF 已準備";
      return {file,archiveStatus};
    }catch(error){
      status.textContent="PDF 產生失敗，請重試";
      if(order===pvDoc)pvFile=null;
      console.error(error);
      return null;
    }
  })();
  return pvFile;
}
async function downloadPdf(share){
  const order=pvDoc,historical=pvHist;
  const prepared=await preparePdf();
  if(!prepared||order!==pvDoc||!$("#pv").open)return;
  if(share){showShare(prepared.file,prepared.archiveStatus);return}
  const ok=await saveFile(prepared.file.name,prepared.file);
  if(ok&&!historical&&order.id===draft().id){draft().exported=true;saveOrder()}
}
const exportPdf=previewPdf;
window.__exportTest=exportXlsx;window.__state=()=>S;

// ---------- views ----------
let view="menu";
function go(v){view=v;document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("on",t.dataset.v===v));renderView();window.scrollTo({top:0})}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>go(t.dataset.v));
function renderView(){$("#vMenu").hidden=view!=="menu";$("#vOrder").hidden=view!=="order";$("#vHist").hidden=view!=="hist";$("#vSum").hidden=view!=="sum";
  if(view==="menu")renderMenu();if(view==="order")renderOrder();if(view==="hist")renderHist();if(view==="sum")renderSum();updateCart()}
function renderAll(){renderProj();renderView()}
renderAll();
try{document.getElementById("boot").remove()}catch(e){}
const hh=()=>document.documentElement.style.setProperty("--hh",document.querySelector(".bar").offsetHeight+"px");hh();addEventListener("resize",hh);
})();
