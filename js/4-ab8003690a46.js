
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
const SITE_INFO={"公司": {"co": "", "ppl": []}, "五股倉庫": {"co": "", "ppl": [["陳清榮", "0383-969-599"]]}, "宜蘭山河": {"co": "澧育有限公司", "ppl": [["林顯呈", "0937-162-938"], ["陳豐乙", "0961-151-005"], ["曾建智", "0930-891-963"], ["王耀德", "0979-890-000"]]}, "新店大廣": {"co": "紘誠水電工程行", "ppl": [["楊志華", "0960-119-729"]]}, "敦北飯店": {"co": "紘誠水電工程行", "ppl": [["高清華", "0933-066-337"]]}, "南山A21": {"co": "紘誠水電工程行", "ppl": [["林志雄", "0981-575-553"]]}, "國賓飯店": {"co": "紘誠水電工程行", "ppl": [["李弘溢", "0926-283-762"], ["陳致豪", "0983-822-193"]]}, "南港冠德": {"co": "澧育有限公司", "ppl": [["陳致豪", "0983-822-193"], ["李弘溢", "0926-283-762"]]}, "南海段": {"co": "聖和工程有限公司", "ppl": [["溫祥淵", "0987-419-519"]]}, "內湖緯創": {"co": "聖和工程有限公司", "ppl": [["李羿萱", "0960-905-782"]]}, "竹北緯創": {"co": "聖和工程有限公司", "ppl": [["游伸鋒", "0955-895-658"]]}, "竹北聯發廠": {"co": "聖和工程有限公司", "ppl": [["毛亮友", "0903-579-317"]]}, "湖口緯創": {"co": "聖和工程有限公司", "ppl": [["蔡永元", "0925-763-735"]]}, "湖口緯創 N1F": {"co": "紘誠水電工程行", "ppl": [["蔡永元", "0925-763-735"]]}, "湖口緯創 N1J7冰機機房": {"co": "澧育有限公司", "ppl": [["蔡永元", "0925-763-735"]]}, "高雄緯創": {"co": "聖和工程有限公司", "ppl": [["游伸鋒", "0955-895-658"], ["蔡永元", "0925-763-735"], ["覃輝豐", "0936-757-907"]]}, "龜山微星": {"co": "聖和工程有限公司", "ppl": [["李重陽", "0978-723-297"], ["陳柏竹", "0970-522-793"]]}, "觀音聯華": {"co": "白鐵工程行", "ppl": [["蔡永元", "0925-763-735"]]}, "三重捷六": {"co": "聖和工程有限公司", "ppl": []}, "五谷王(峰左岸)": {"co": "聖和工程有限公司", "ppl": [["老闆", "0913-515-179"]]}, "青埔B基地": {"co": "紘誠水電工程行", "ppl": [["覃輝豐", "0936-757-907"]]}};
function siteCo(n){const x=SITE_INFO[n];if(x&&x.co)return x.co;const p=(typeof S!=="undefined"&&S.projects||[]).find(z=>z.name===n);return p&&p.co||""}
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
  S.projects=S.projects.filter(p=>Object.hasOwn(SITE_ADDR,p.name)||p.orders.length||p.draft?.lines.length);
  SITE_LIST.forEach(([n,a])=>{if(!S.projects.find(x=>x.name===n))S.projects.push({id:uid(),name:n,addr:a,orders:[],draft:null})});
  const pos=n=>SITE_LIST.findIndex(x=>x[0]===n);S.projects.sort((x,y)=>pos(x.name)-pos(y.name));
  S.presetSites3=true;
}
S.projects.forEach(p=>{if(p.name==="湖口緯創 N1J7冰機"&&!S.projects.find(x=>x.name==="湖口緯創 N1J7冰機機房")){p.name="湖口緯創 N1J7冰機機房";if(p.draft)p.draft.project=p.name}});
if(!S.presetSites8){S.projects.forEach(p=>{const d=p.draft;if(p.name==="南港冠德"&&d)d.company="澧育有限公司"});S.presetSites8=true}
if(!S.presetSites7){S.projects.forEach(p=>{const d=p.draft;if(p.name==="內湖緯創"&&d&&(!d.contact||d.contact==="周佳珍")){d.contact="李羿萱";d.contactTel="0960-905-782"}});S.presetSites7=true}
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
const supplierItems=[["內迫式短壁虎",{"n":"內迫式短壁虎 DR3030（新生）","p":"新生五金 DR3030","v":[["3/8\"","DR3030・全長 30 mm・鑽孔 12.7 mm",null,"個","材質依叫料需求指定"]]}],["鍍鋅角鐵",{"n":"有孔角鐵 AGH620T（新生）","p":"新生五金 AGH620T","v":[["2\" × 5.0 mm","AGH620T・長孔 13 × 34 mm・3M/支",null,"支","孔距 55 mm"]]}],["鍍鋅雙層管束",{"n":"ST 雙層管束（新生）","p":"新生五金 ST","v":[["10\"","ST6100・碳鋼電鍍・外徑 267.4 mm",null,"個","型錄尺寸 A 3/4 吋"],["12\"","ST6120・碳鋼電鍍・外徑 318.5 mm",null,"個","型錄尺寸 A 3/4 吋"]]}]];
 for(const [existing,item] of supplierItems){
   const category=CATALOG.find(c=>c.items.some(entry=>entry.n===existing));
   if(category)category.items.push(item);
 }
// 品項查核修正 2026-11-15
 (function(){
  const inch=s=>{const m=String(s).replace(/\s/g,"").match(/^(\d+)(?:-(\d+)\/(\d+))?"|^(\d+)\/(\d+)"/);if(!m)return 1e9;return m[4]?m[4]/m[5]:+m[1]+(m[2]?m[2]/m[3]:0)};
  const SORT=new Set(["鍍鋅螺帽","不銹鋼螺帽","鍍鋅突緣螺帽","不銹鋼突緣螺帽","船型螺帽"]);
  const UNIT={"元/支":"支","元/M":"米","M":"米","PCS":"片"};
  const remap={};
  CATALOG.forEach((c,ci)=>c.items.forEach((it,ii)=>{
   for(const v of it.v){
    if(typeof v[0]==="string"){
     v[0]=v[0].replace(/^(\d) (\d\/\d")/,"$1-$2").replace(/^(\d+(?:-\d+\/\d+)?") W$/,"$1W");
    }
    if(UNIT[v[3]])v[3]=UNIT[v[3]];
    if(!v[3])v[3]=/100mm單價/.test(it.n)?"段":"個";
    if(it.n==="耐熱CPVC管 (CNS14664)"&&typeof v[4]==="string")v[4]=v[4].replace(/^W15・/,"W16・");
   }
   if(SORT.has(it.n)){
    const order=it.v.map((v,i)=>i).sort((a,b)=>inch(it.v[a][0])-inch(it.v[b][0])||a-b);
    if(order.some((o,i)=>o!==i)){remap[ci+"_"+ii]=Object.fromEntries(order.map((o,i)=>[o,i]));it.v=order.map(o=>it.v[o]);}
   }
  }));
  if(Object.keys(remap).length&&S&&!S.variantFix20261115){
   for(const p of S.projects||[])for(const o of [p.draft,...(p.orders||[])])for(const l of (o&&o.lines)||[]){
    const m=/^(\d+_\d+)\|(\d+)$/.exec(l.vk||"");
    if(m&&remap[m[1]]&&remap[m[1]][m[2]]!=null)l.vk=m[1]+"|"+remap[m[1]][m[2]];
   }
   S.variantFix20261115=1;persist();
  }
 })();
// 補空白尺寸 BEGIN
 (function(){
  const SIZES={"止洩帶":"10捲/盒","調薄劑":"1加侖","鍍鋅漆":"1加侖","鋅粉底漆":"1加侖","AB膠":"1組"},VARIANTS={"松香水":{"v":[["1加侖","加侖"],["5加侖","桶"]],"keepAs":1},"甲苯":{"v":[["1加侖","加侖"],["5加侖","桶"]],"keepAs":1}},ADD=[{"after":"AB膠","item":{"n":"達克隆 ENA-1299","p":"","v":[["1組","",null,"組",""]]}}];
  const moved={};
  CATALOG.forEach((c,ci)=>c.items.forEach((it,ii)=>{
   if(Object.hasOwn(SIZES,it.n))for(const v of it.v)if(!v[0])v[0]=SIZES[it.n];
   const nv=VARIANTS[it.n];
   if(nv&&it.v.length===1&&!it.v[0][0]){it.v=nv.v.map(([s,u])=>[s,"",null,u,""]);moved[ci+"_"+ii]=nv.keepAs;}
  }));
  for(const a of ADD){
   if(CATALOG.some(c=>c.items.some(it=>it.n===a.item.n)))continue;
   const c=CATALOG.find(c=>c.items.some(it=>it.n===a.after));
   if(c)c.items.push(a.item);
  }
  if(S&&!S.variantFix20261115b){
   for(const p of S.projects||[])for(const o of [p.draft,...(p.orders||[])])for(const l of (o&&o.lines)||[]){
    const m=/^(\d+_\d+)\|0$/.exec(l.vk||"");
    if(m&&moved[m[1]]!=null)l.vk=m[1]+"|"+moved[m[1]];
   }
   S.variantFix20261115b=1;persist();
  }
 })();
// 補空白尺寸 END
// PVC另件分類圖 BEGIN
 (function(){
  const SRC={"pvcT_g":"img/d62715358b0dc056b85b.jpg","pvc90_g":"img/8105f064c95504030dcb.jpg","pvcY_g":"img/b047e0cec47efadd1aa2.jpg","pvcFl_g":"img/9b1cac82fb27cd4fbe4e.jpg","pvcT_o":"img/25f8ea751927f39f968c.jpg","pvc90_o":"img/6fe7e3c7e383d9070b00.jpg","pvc90_h":"img/168ba27e9ced967e76c2.jpg"},MAP={"pvcT_g":{"cat":["PVC另件・灰色厚","PVC另件・灰色厚・自來水用"]},"pvc90_g":{"cat":["PVC另件・灰色厚・一般用"],"group":["PVC另件"]},"pvcY_g":{"cat":["PVC另件・灰色薄・排水用"]},"pvcFl_g":{"cat":["PVC另件・灰色・配件"]},"pvcT_o":{"cat":["PVC另件・橘色厚（下水道）"]},"pvc90_o":{"cat":["PVC另件・橘色薄（下水道）"]},"pvc90_h":{"cat":["PVC另件・HI耐衝擊（深藍）"]}};
  for(const [k,m] of Object.entries(MAP)){
   const key="tile_"+k;IMG.IC[key]=SRC[k];
   for(const c of m.cat||[])IMG.CAT[c]=key;
   for(const g of m.group||[])IMG.GROUP[g]=key;
  }
 })();
// PVC另件分類圖 END
// 管管整合 BEGIN
 (function(){
  const PH={"0_0":"img/fbf026158a5839ca708e.jpg","0_1":"img/fbf026158a5839ca708e.jpg","0_2":"img/fbf026158a5839ca708e.jpg","0_3":"img/fbf026158a5839ca708e.jpg","0_4":"img/fbf026158a5839ca708e.jpg","0_5":"img/fbf026158a5839ca708e.jpg","0_6":"img/3e84571bda5d0c97d429.jpg","0_7":"img/3ea749d994eeb962363c.jpg","0_8":"img/3ea749d994eeb962363c.jpg","0_9":"img/3ea749d994eeb962363c.jpg","98_0":"img/3ea749d994eeb962363c.jpg","98_1":"img/3ea749d994eeb962363c.jpg","0_13":"img/c58749c90609145f4305.jpg","0_14":"img/ef7ada1a3337fd778283.jpg","0_15":"img/ef7ada1a3337fd778283.jpg","1_0":"img/6ecceb09aa8fae120628.jpg","1_1":"img/6ecceb09aa8fae120628.jpg","1_2":"img/13eb5afee18d0dcd0483.jpg","90_0":"img/bf7e1f34e761a50ced45.jpg","90_1":"img/3323e49ade90bf363b2e.jpg","90_5":"img/ffec25bcb79f8f70948a.jpg","90_6":"img/51967ee7c446851c66b8.jpg","90_7":"img/13996796005dca3b0134.jpg","90_8":"img/5bdf4cdb5f0d06b4b201.jpg","90_9":"img/662cbd73dce98d51d5a9.jpg","90_10":"img/662cbd73dce98d51d5a9.jpg","90_11":"img/dc8705fc3c95d07d8e6d.jpg","90_12":"img/4ed9265c973b7a605211.jpg","90_13":"img/65a6c043f0081a13b4a9.jpg","90_14":"img/433edb787cddd80a2b2f.jpg","90_15":"img/b091ee0cba9b7d3a3f56.jpg","90_18":"img/aa6914e5ca0eb35dacaa.jpg","90_20":"img/cadf97fd9baf9274c4c9.jpg","90_21":"img/75956855e45dd876b0bd.jpg","90_22":"img/3bb5ca2a4c8a159552ad.jpg","90_23":"img/eceeb4612c4c3ad54869.jpg","90_24":"img/11b874e5b19705c3baf3.jpg","91_0":"img/bf7e1f34e761a50ced45.jpg","91_1":"img/3323e49ade90bf363b2e.jpg","91_5":"img/ffec25bcb79f8f70948a.jpg","91_6":"img/51967ee7c446851c66b8.jpg","91_8":"img/13996796005dca3b0134.jpg","91_9":"img/5bdf4cdb5f0d06b4b201.jpg","91_10":"img/662cbd73dce98d51d5a9.jpg","91_11":"img/662cbd73dce98d51d5a9.jpg","91_12":"img/dc8705fc3c95d07d8e6d.jpg","91_13":"img/4ed9265c973b7a605211.jpg","91_15":"img/7f0cca511cfffc2116a8.jpg","92_3":"img/8dd8d487d6360f051cf6.jpg","92_4":"img/bbaf78e3707d2dbe6c9d.jpg","92_6":"img/23751847185957d3c66e.jpg","92_11":"img/625893c88ad5d573693a.jpg","92_12":"img/08865929d76ea84a7397.jpg","93_0":"img/cb665a14993fd9a94eb5.jpg","93_1":"img/d5f0d2d54a7bb4098cbc.jpg","93_2":"img/cf7cd7ea4a6c094e0640.jpg","93_4":"img/82c5448a6dd3c2d99eeb.jpg","93_5":"img/c354944f23f7ca1d4f17.jpg","93_6":"img/a679eac6fa39eaab88fb.jpg","93_7":"img/65acf3c5d9b0c55b5505.jpg","93_8":"img/57571c293dbc559202a0.jpg","93_9":"img/0b4e93088727e36eeb7b.jpg","93_10":"img/22e4cf4754364560ceee.jpg","93_12":"img/e36f7c06477bef2186a2.jpg","94_0":"img/cb665a14993fd9a94eb5.jpg","94_1":"img/d5f0d2d54a7bb4098cbc.jpg","94_2":"img/cf7cd7ea4a6c094e0640.jpg","94_3":"img/ba110b52f010269753e3.jpg","94_5":"img/82c5448a6dd3c2d99eeb.jpg","94_6":"img/9416da6834c152d69e48.jpg","94_8":"img/c354944f23f7ca1d4f17.jpg","94_9":"img/a679eac6fa39eaab88fb.jpg","94_10":"img/65acf3c5d9b0c55b5505.jpg","94_11":"img/26035ba8bdab6616d088.jpg","94_12":"img/57571c293dbc559202a0.jpg","94_13":"img/431632c671d6e9fcc9d5.jpg","94_15":"img/e36f7c06477bef2186a2.jpg","94_17":"img/402553bc9aa9a4aadcdd.jpg","95_0":"img/88cb0b7151b6a6343ee2.jpg","96_0":"img/d0d04692d1eaf119e9f3.jpg","96_1":"img/06bed557154b7995159d.jpg","96_2":"img/226f5c250e78334c2be6.jpg","96_3":"img/c4cf015e57f99895b22d.jpg","96_4":"img/6eeb7edc1e125717c8be.jpg","96_5":"img/c144eba041159287b419.jpg","96_6":"img/1c4dd0083f1596f0cfb8.jpg","96_7":"img/2bf5f0b2bdfde53c2f8f.jpg","96_10":"img/0f066b0f82abf8900ddc.jpg","96_12":"img/c1d9f9eabd715e21f6ef.jpg","96_13":"img/452071f05cfbb80cde53.jpg","8_5":"img/e264a12269d060c4271f.jpg","8_6":"img/283f6d9380972b3db961.jpg","8_7":"img/32baccd24fc492e93d9d.jpg","8_8":"img/32baccd24fc492e93d9d.jpg","9_2":"img/23751847185957d3c66e.jpg","10_1":"img/693d0ab1acdd06a4be30.jpg","11_1":"img/ce893ac977536eb1a9a8.jpg","11_2":"img/32baccd24fc492e93d9d.jpg","11_3":"img/790115b11e9ad5e7366e.jpg","11_6":"img/c12477c84fcea20d2e7c.jpg","11_8":"img/28344c22f1b792656e73.jpg","12_0":"img/14d783d383318bad1fea.jpg","12_1":"img/ab61bfb5f62ea6f06a7e.jpg","13_0":"img/bd552393bf22ae4d36c8.jpg","14_0":"img/bfc6f94d4993912f2d0c.jpg","14_2":"img/033c731b95108ccfa34c.jpg","15_4":"img/1474a9a6bfe395e7111d.jpg","15_5":"img/1474a9a6bfe395e7111d.jpg","88_0":"img/ddb3123c7f2bc3be51da.jpg","88_1":"img/8b0b342d0bac951f9994.jpg","18_0":"img/3ed704c026bc2790f815.jpg","18_1":"img/c56558c95a22e9935bb2.jpg","18_2":"img/78a51b1ceacc5a8026a3.jpg","18_8":"img/78a51b1ceacc5a8026a3.jpg","18_9":"img/78a51b1ceacc5a8026a3.jpg","18_10":"img/78a51b1ceacc5a8026a3.jpg","18_11":"img/78a51b1ceacc5a8026a3.jpg","18_3":"img/55f2bccf45b57965da4a.jpg","18_4":"img/9ec9426d9dd58894ca83.jpg","18_5":"img/9ec9426d9dd58894ca83.jpg","18_6":"img/9ec9426d9dd58894ca83.jpg","18_7":"img/4cb8a6671b4fdd05650f.jpg","20_0":"img/4cb8a6671b4fdd05650f.jpg","20_1":"img/d2ab81f6ec6160ec0960.jpg","20_2":"img/944d9648b1656dfc6aca.jpg","20_9":"img/9ffa8e13b3e4dad493a6.jpg","20_10":"img/545f487d74c3b904647c.jpg","20_13":"img/b6bdcd77e17b77298d72.jpg","20_14":"img/ab1692ba76b0a8b248a2.jpg","20_15":"img/f6293f880e00a695905a.jpg","20_24":"img/700e95a2bd710a6dc92a.jpg","20_26":"img/acf947cf6af393031abe.jpg","20_29":"img/ce3ec999a7acb216815a.jpg","23_0":"img/3ed704c026bc2790f815.jpg","23_1":"img/7d7486336a8cc236a61b.jpg","24_0":"img/98dbd193780079c5212a.jpg","25_1":"img/0ea8ef42e6cb7a596faf.jpg","25_2":"img/14e6ff6a225a10fb05b7.jpg","26_0":"img/e4549bbe24e9567478c8.jpg","26_1":"img/b41e243c4bfef5612e49.jpg","26_3":"img/4d6ee78f1b98efeffb54.jpg","26_5":"img/a2d2c7dd77ba2ede8c56.jpg","27_0":"img/2a428cbb48548a115d13.jpg","27_1":"img/b825b78a84bb4ddbf189.jpg","27_2":"img/c89fafe9cc74b5f1e894.jpg","27_3":"img/c89fafe9cc74b5f1e894.jpg","27_6":"img/9c82ebc0002209142e9a.jpg","27_9":"img/04332159e9e30d5aaf93.jpg","27_10":"img/a5725c012297a32b32e6.jpg","27_11":"img/dda149bf5c696e7200f2.jpg","27_17":"img/265d8a93f1c1de9986e4.jpg","27_19":"img/03305ec2b9e0ac2af18a.jpg","27_20":"img/61fba0780126b209d9e2.jpg","27_21":"img/8abffee5092836d0ffc3.jpg","27_29":"img/5615742260b3ad8ce270.jpg","27_40":"img/c89fafe9cc74b5f1e894.jpg","27_42":"img/b825b78a84bb4ddbf189.jpg","27_44":"img/c89fafe9cc74b5f1e894.jpg","27_45":"img/c89fafe9cc74b5f1e894.jpg","28_0":"img/5f156ab1cbdd36c744cd.jpg","28_1":"img/5f156ab1cbdd36c744cd.jpg","28_3":"img/ada349e20354ad07e0f3.jpg","28_7":"img/7b67c928326c4083d6f5.jpg","28_9":"img/8f743cb57960fb03bdfe.jpg","30_3":"img/c074f13c20493ffa2629.jpg","31_0":"img/ab28fbbba7346a0910ef.jpg","32_0":"img/e0ea5ea79902b6912078.jpg","32_2":"img/637bd8a714552a34216f.jpg","32_3":"img/50e85675c61db51cf2f8.jpg","32_10":"img/def858fc8a2b2604de61.jpg","32_14":"img/228e2a5a34b817995c91.jpg","32_15":"img/2863778f129ca1783e30.jpg","32_20":"img/d862cbef08e2a722eab6.jpg","32_21":"img/d862cbef08e2a722eab6.jpg","32_22":"img/d862cbef08e2a722eab6.jpg","32_25":"img/d862cbef08e2a722eab6.jpg","35_0":"img/0fbc155b855cfbc1f518.jpg","35_2":"img/e4f05804495dbfecedb1.jpg","35_3":"img/8ccc69e9509110f1c8f0.jpg","35_4":"img/6411ec3c6ef7cc54e252.jpg","35_5":"img/317097c1ca825d3ef117.jpg","35_6":"img/ac7ce66d622f3e5d5c0b.jpg","35_7":"img/848f21fb9ddcaf66bb19.jpg","35_8":"img/3afb0d5ef574f2a2fca3.jpg","35_9":"img/1abea597c06a1aa346d2.jpg","35_10":"img/9cdb9f1a4f8f55aa7554.jpg","35_11":"img/53c092743606cf8c0b59.jpg","35_12":"img/dee73de5ae675dfdca9d.jpg","35_13":"img/d576f51080f1d3351621.jpg","35_14":"img/59a01d7944eea813c8c8.jpg","35_15":"img/844e58a66303bae8c598.jpg","35_16":"img/844e58a66303bae8c598.jpg","35_17":"img/6eee01102395cb639a18.jpg","36_0":"img/0fbc155b855cfbc1f518.jpg","36_1":"img/e4f05804495dbfecedb1.jpg","36_2":"img/6411ec3c6ef7cc54e252.jpg","36_3":"img/d576f51080f1d3351621.jpg","36_4":"img/317097c1ca825d3ef117.jpg","36_5":"img/dee73de5ae675dfdca9d.jpg","36_6":"img/9cdb9f1a4f8f55aa7554.jpg","36_7":"img/53c092743606cf8c0b59.jpg","36_9":"img/ac7ce66d622f3e5d5c0b.jpg","36_10":"img/6eee01102395cb639a18.jpg","36_11":"img/3afb0d5ef574f2a2fca3.jpg","39_0":"img/324af9f85d90a45b46bf.jpg","39_2":"img/cf8be78ba8bc4c20c49a.jpg","39_3":"img/61f0b56fa31df397ede5.jpg","39_4":"img/a17876edbf6e3236b374.jpg","39_5":"img/a17e87624dc4abfc22b4.jpg","39_6":"img/1da52b9c18beccd74184.jpg","39_7":"img/af1b5578abb8a8fb5343.jpg","39_8":"img/67dbffa02072832aad72.jpg","39_9":"img/283223990c855d92c949.jpg","39_10":"img/c6f97be23c471467519e.jpg","39_11":"img/f09020c8c0dab6629d5c.jpg","39_12":"img/b7c7c02473baabb9ad06.jpg","39_13":"img/74efcb06532ffa2671cc.jpg","39_14":"img/56fe820375a7f551f7ef.jpg","39_15":"img/af1b5578abb8a8fb5343.jpg","37_0":"img/a6d3e02785a63e3e9b91.jpg","37_1":"img/6486e2a5fb5aa1c5272b.jpg","37_2":"img/a39156d8a3b5b5529fad.jpg","37_3":"img/3b405cc7ead3c603229a.jpg","37_4":"img/d4fafc63212b72b487c0.jpg","37_5":"img/9c0fce05cf5bfa9ea480.jpg","38_0":"img/a6d3e02785a63e3e9b91.jpg","38_1":"img/6486e2a5fb5aa1c5272b.jpg","38_2":"img/a39156d8a3b5b5529fad.jpg","38_3":"img/9c0fce05cf5bfa9ea480.jpg","38_4":"img/3b405cc7ead3c603229a.jpg","38_5":"img/d4fafc63212b72b487c0.jpg","40_0":"img/2cb44c66b9f240436460.jpg","40_1":"img/1b8046e5e9e5b2e58ca5.jpg","40_2":"img/56579e0b4e0bc59f0e2a.jpg","40_3":"img/278cccfe641c0e087089.jpg","40_4":"img/e7567180f17027d548e4.jpg","40_5":"img/c6cd02e6a90d2983a485.jpg","41_0":"img/2cb44c66b9f240436460.jpg","41_1":"img/1b8046e5e9e5b2e58ca5.jpg","41_2":"img/56579e0b4e0bc59f0e2a.jpg","41_3":"img/278cccfe641c0e087089.jpg","41_4":"img/e7567180f17027d548e4.jpg","41_5":"img/c6cd02e6a90d2983a485.jpg","49_2":"img/a6d3e02785a63e3e9b91.jpg","49_5":"img/6486e2a5fb5aa1c5272b.jpg","49_8":"img/a39156d8a3b5b5529fad.jpg","49_11":"img/9c0fce05cf5bfa9ea480.jpg","49_14":"img/d4fafc63212b72b487c0.jpg","49_17":"img/3b405cc7ead3c603229a.jpg","42_0":"img/7c7afb84e028e239be0d.jpg","42_1":"img/643f89f5d1cbb4177e3c.jpg","99_0":"img/cda858ae1a2bae4d7319.jpg","99_1":"img/872dc35d7c7884e5309c.jpg","99_2":"img/ecf98ff7ece66732a4ce.jpg","99_3":"img/922a1bca422b42fd9e0f.jpg","99_4":"img/177c7e34520e36a99c10.jpg","99_5":"img/e6f32b317a1e5a3596b9.jpg","100_0":"img/cda858ae1a2bae4d7319.jpg","100_1":"img/872dc35d7c7884e5309c.jpg","100_2":"img/ecf98ff7ece66732a4ce.jpg","100_3":"img/922a1bca422b42fd9e0f.jpg","100_4":"img/177c7e34520e36a99c10.jpg","100_5":"img/e6f32b317a1e5a3596b9.jpg","101_0":"img/7e21f385ad474b8171fd.jpg","101_1":"img/97ecd1c52b09d28e8e17.jpg","101_2":"img/8959cfab8784f39d278f.jpg","101_3":"img/07335ef51698353b5ec3.jpg","101_4":"img/6ac8d037644ec89d2487.jpg","101_5":"img/d8613ebf6aae41ae32a2.jpg","101_7":"img/c5d63dda096d49f04890.jpg","101_8":"img/1e0d28a8169a26270094.jpg","101_9":"img/38a5912cfc53bb8226c6.jpg","101_10":"img/e138b3d0574aab677193.jpg","101_11":"img/367561c096ac9c6d6003.jpg","73_15":"img/3d917adf6a0e35ab6288.jpg","73_16":"img/8162a7672e0c512f4c22.jpg","73_17":"img/3ec1280e8eb42d9fc7a0.jpg","75_0":"img/f48c4a66095028de3465.jpg","75_1":"img/b339bd975835a4942826.jpg","75_2":"img/4c47b89ac7a47be94b8a.jpg","75_3":"img/9660fec417ecc5d0249d.jpg","75_4":"img/6a35ab29d5b09ae76a90.jpg","75_5":"img/6d5fd046978d3a9485a2.jpg","75_6":"img/7126e0f4862fa61bee15.jpg","75_7":"img/6e96f6d2ba6785173708.jpg","75_8":"img/4c47b89ac7a47be94b8a.jpg","75_9":"img/f2413ba9e09f1791c49a.jpg","75_10":"img/3a0e9c341d4ab91c8032.jpg","76_0":"img/a0665f5fda9863e5d6cb.jpg","76_1":"img/0036d67cf9db5fde34dc.jpg","76_2":"img/586ecda2c73f83055729.jpg","76_3":"img/b3cfc2c6780826d11e3e.jpg","76_4":"img/713aec92a325548880ea.jpg","76_7":"img/283f6d9380972b3db961.jpg","77_0":"img/098571164136b0aa551a.jpg","77_3":"img/fa511adb290dea5d99eb.jpg","77_4":"img/9b6f100f8aba58f8358f.jpg","77_5":"img/4eb1c1d66a1d6ca0241d.jpg","77_6":"img/d2a60eb25fd2a4ee3f7a.jpg","77_7":"img/54f686a9db3f6c48f6f4.jpg","77_8":"img/3633eee94e092d861bf7.jpg","77_9":"img/8cc9f7572fd26c95e0bd.jpg","77_12":"img/8054e0bb596c3f925dfa.jpg","80_0":"img/0af2e21d60396a8bbbc2.jpg","80_1":"img/c25acf172ec15b07f4bb.jpg","80_2":"img/74c8841d67b150ac5e73.jpg","80_3":"img/51c58d0bd9d9831148d6.jpg","80_4":"img/4db84b4990ad8b2f5f28.jpg","81_0":"img/4ce18e8b49b07b0d58db.jpg","81_1":"img/8a786edc39a82c529633.jpg","81_2":"img/8a786edc39a82c529633.jpg","81_3":"img/8a786edc39a82c529633.jpg","81_4":"img/45f152752f3122d7dc0f.jpg","81_5":"img/45f152752f3122d7dc0f.jpg","82_0":"img/61890eb5042348b5af10.jpg","82_1":"img/61890eb5042348b5af10.jpg","82_2":"img/61890eb5042348b5af10.jpg","82_3":"img/61890eb5042348b5af10.jpg","84_0":"img/3877fb36f14697961b42.jpg","84_1":"img/3877fb36f14697961b42.jpg","84_2":"img/78bddcf69689c7697253.jpg","85_0":"img/367854b1e188c07729d2.jpg","85_3":"img/531e6b6c3691c9a07787.jpg"},ADD=[["PVC另件・HI耐衝擊（深藍）",[{"n":"HI耐衝擊 外牙接頭(塑膠牙)","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/4\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"]],"ggImg":"img/1566451f6d8a2bb17fad.jpg"},{"n":"HI耐衝擊 外牙彎頭","p":"管管貿易","v":[["1/2\"","",null,"個","旭振・PT牙"],["3/4\"","",null,"個","旭振・PT牙"],["1\"","",null,"個","旭振・PT牙"]],"ggImg":"img/4b201bad477b892d5b49.jpg"},{"n":"HI耐衝擊 膠合劑","p":"管管貿易","v":[["1kg","",null,"罐","南亞 耐衝擊專用膠"]],"ggImg":"img/d14830c63d1aafd2bf83.jpg"}]],["PVC另件・灰色・配件",[{"n":"內管束","p":"管管貿易","v":[["2\" 薄","",null,"個",""],["2\" 厚","",null,"個",""],["3\" 薄","",null,"個",""],["4\" 薄","",null,"個",""],["5\" 薄","",null,"個",""],["6\" 薄","",null,"個",""]],"ggImg":"img/343b384c5b314e563638.jpg"},{"n":"給水固定座","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"W","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""],["5\"","",null,"個",""],["6\"","",null,"個",""]],"ggImg":"img/50af6f55aee681be752e.jpg"},{"n":"穿樑套管（直樑）","p":"管管貿易","v":[["1-1/4\"","長10cm",null,"個",""],["1-1/2\"","長10cm",null,"個",""],["2\"","長10cm",null,"個",""],["2-1/2\"","長10cm",null,"個",""],["3\"","長10cm",null,"個",""],["4\"","長10cm",null,"個",""],["5\"","長10cm",null,"個",""],["6\"","長10cm",null,"個",""],["8\"","長10cm",null,"個",""],["10\"","長10cm",null,"個",""]],"ggImg":"img/47473f5623f04ffd0661.jpg"},{"n":"竹筏塞口（內塞）","p":"管管貿易","v":[["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"],["10\"","",null,"個","南亞"],["12\"","",null,"個","南亞"],["14\"","",null,"個","南亞"],["16\"","",null,"個","南亞"]],"ggImg":"img/a2d9fbc791335241c8fd.jpg"}]],["塑膠另件・電氣配管",[{"n":"PVC一般大月彎（90°）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["3-1/2\"","",null,"個",""],["4\"","",null,"個",""],["5\"","",null,"個",""],["6\"","",null,"個",""]],"ggImg":"img/ada9543edd70ecbd21a7.jpg"},{"n":"PVC拐杖彎","p":"管管貿易","v":[["1/2\" 57cm","",null,"支",""],["1/2\" 67cm","",null,"支",""],["3/4\" 67cm","",null,"支",""]],"ggImg":"img/49c3cbe0538ea61e432e.jpg"},{"n":"PVC電信大彎（外管線・80cm）","p":"管管貿易","v":[["2\"","厚4.0mm",null,"個",""],["3\"","厚5.5mm",null,"個",""],["4\"","厚7.0mm",null,"個",""],["5\"","厚7.0mm",null,"個",""],["6\"","厚8.5mm",null,"個",""]],"ggImg":"img/38c8a9c03e1f861064eb.jpg"},{"n":"PVC電管S彎","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""]],"ggImg":"img/9bf4c3227dc8f85c5404.jpg"},{"n":"PVC快速接頭（盒接）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""]],"ggImg":"img/ca419404a1960198cc5c.jpg"},{"n":"PVC電用平頂彎頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""]],"ggImg":"img/198b0227ccc46b8fbbd8.jpg"}]],["CD管・PF管（合成樹脂可撓性電線導管）",[{"n":"CD管 平頂接頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""]],"ggImg":"img/f4d89c115bb291859180.jpg"},{"n":"CD管 平頂彎頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""]],"ggImg":"img/ac7836b26573d65a9267.jpg"}]]],NEW=[{"n":"PVC另件・CPVC耐熱","g":"PVC另件","gg19":true,"items":[{"n":"CPVC耐熱 45° L型接頭","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/61da450e146ea496f581.jpg"},{"n":"CPVC耐熱 90° L型接頭","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/9f701898ad3925d49d75.jpg"},{"n":"CPVC耐熱 T型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/71e77c7420e319b27f32.jpg"},{"n":"CPVC耐熱 T型異徑接頭","p":"管管貿易","v":[["2-1/2\"x1-1/2\"","",null,"個","南亞"],["2-1/2\"x2\"","",null,"個","南亞"],["3\"x3/4\"","",null,"個","南亞"],["3\"x1-1/2\"","",null,"個","南亞"],["3\"x2\"","",null,"個","南亞"],["3\"x2-1/2\"","",null,"個","南亞"],["4\"x1-1/2\"","",null,"個","南亞"],["4\"x2\"","",null,"個","南亞"],["4\"x3\"","",null,"個","南亞"],["5\"x3\"","",null,"個","南亞"],["5\"x4\"","",null,"個","南亞"],["6\"x3\"","",null,"個","南亞"],["6\"x4\"","",null,"個","南亞"],["6\"x5\"","",null,"個","南亞"],["8\"x4\"","",null,"個","南亞"],["8\"x6\"","",null,"個","南亞"]],"ggImg":"img/556e36df663787cb4fec.jpg"},{"n":"CPVC耐熱 S型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/c0baec948b791627ffe4.jpg"},{"n":"CPVC耐熱 S型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個","南亞"],["1\"Wx3/4\"","",null,"個","南亞"],["1-1/2\"x1\"W","",null,"個","南亞"],["2\"x1-1/2\"","",null,"個","南亞"],["2-1/2\"x1-1/2\"","",null,"個","南亞"],["2-1/2\"x2\"","",null,"個","南亞"],["3\"x1-1/2\"","",null,"個","南亞"],["3\"x2\"","",null,"個","南亞"],["3\"x2-1/2\"","",null,"個","南亞"],["4\"x1-1/2\"","",null,"個","南亞"],["4\"x2\"","",null,"個","南亞"],["4\"x3\"","",null,"個","南亞"],["5\"x4\"","",null,"個","南亞"],["6\"x3\"","",null,"個","南亞"],["6\"x4\"","",null,"個","南亞"],["6\"x5\"","",null,"個","南亞"],["8\"x4\"","",null,"個","南亞"],["8\"x5\"","",null,"個","南亞"],["8\"x6\"","",null,"個","南亞"]],"ggImg":"img/0487c09dff7dd40eae92.jpg"},{"n":"CPVC耐熱 塞頭","p":"管管貿易","v":[["1/2\"","",null,"個","南亞"],["3/4\"","",null,"個","南亞"],["1\"W","",null,"個","南亞"],["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/aa63a128ac93fe3a2db0.jpg"},{"n":"CPVC耐熱 法蘭接頭","p":"管管貿易","v":[["1-1/2\"","",null,"個","南亞"],["2\"","",null,"個","南亞"],["2-1/2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/ad03dfcd8b6876853cc4.jpg"},{"n":"CPVC耐熱 清除孔接頭","p":"管管貿易","v":[["2\"","",null,"個","南亞"],["3\"","",null,"個","南亞"],["4\"","",null,"個","南亞"],["5\"","",null,"個","南亞"],["6\"","",null,"個","南亞"],["8\"","",null,"個","南亞"]],"ggImg":"img/9d6f24e672bbd6c864ae.jpg"},{"n":"CPVC耐熱 止閥接頭","p":"管管貿易","v":[["1/2\"","",null,"個","HYH・PT牙"],["3/4\"","",null,"個","HYH・PT牙"],["1\"W","",null,"個","HYH・PT牙"],["1-1/2\"","",null,"個","HYH・PT牙"],["2\"","",null,"個","HYH・PT牙"]],"ggImg":"img/baa30a21616a6571c303.jpg"},{"n":"CPVC耐熱 龍S接頭","p":"管管貿易","v":[["1/2\"","",null,"個","HYH・PT牙"],["3/4\"","",null,"個","HYH・PT牙"],["3/4\"x1/2\"","",null,"個","HYH・PT牙"]],"ggImg":"img/8a471bd58775c2db46f3.jpg"},{"n":"CPVC耐熱 龍L接頭","p":"管管貿易","v":[["1/2\"","",null,"個","HYH・PT牙"],["3/4\"","",null,"個","HYH・PT牙"],["3/4\"x1/2\"","",null,"個","HYH・PT牙"]],"ggImg":"img/9364ba172024263eb24a.jpg"},{"n":"CPVC耐熱 膠合劑","p":"管管貿易","v":[["1kg","",null,"罐","南亞"]],"ggImg":"img/9c1d25bdc84efbb07512.jpg"}]},{"n":"PVC另件・美規 SCH80（灰）","g":"PVC另件","gg19":true,"items":[{"n":"SCH80 45° L型接頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""],["5\"","",null,"個",""],["6\"","",null,"個",""],["8\"","",null,"個",""]],"ggImg":"img/23ac0969787131f86cc1.jpg"},{"n":"SCH80 90° L型接頭","p":"管管貿易","v":[["1/2\"","承插",null,"個",""],["1/2\"","雙內牙 NPT",null,"個",""],["3/4\"","承插",null,"個",""],["3/4\"","雙內牙 NPT",null,"個",""],["1\"","承插",null,"個",""],["1\"","雙內牙 NPT",null,"個",""],["1-1/4\"","承插",null,"個",""],["1-1/4\"","雙內牙 NPT",null,"個",""],["1-1/2\"","承插",null,"個",""],["1-1/2\"","雙內牙 NPT",null,"個",""],["2\"","承插",null,"個",""],["2\"","雙內牙 NPT",null,"個",""],["2-1/2\"","承插",null,"個",""],["2-1/2\"","雙內牙 NPT",null,"個",""],["3\"","承插",null,"個",""],["3\"","雙內牙 NPT",null,"個",""],["4\"","承插",null,"個",""],["4\"","雙內牙 NPT",null,"個",""],["5\"","承插",null,"個",""],["5\"","雙內牙 NPT",null,"個",""],["6\"","承插",null,"個",""],["6\"","雙內牙 NPT",null,"個",""],["8\"","承插",null,"個",""],["8\"","雙內牙 NPT",null,"個",""]],"ggImg":"img/286bc3b14340afdbe0f0.jpg"},{"n":"SCH80 T型同徑接頭","p":"管管貿易","v":[["1/2\"","承插",null,"個",""],["1/2\"","三內牙 NPT",null,"個",""],["3/4\"","承插",null,"個",""],["3/4\"","三內牙 NPT",null,"個",""],["1\"","承插",null,"個",""],["1\"","三內牙 NPT",null,"個",""],["1-1/4\"","承插",null,"個",""],["1-1/4\"","三內牙 NPT",null,"個",""],["1-1/2\"","承插",null,"個",""],["1-1/2\"","三內牙 NPT",null,"個",""],["2\"","承插",null,"個",""],["2\"","三內牙 NPT",null,"個",""],["2-1/2\"","承插",null,"個",""],["2-1/2\"","三內牙 NPT",null,"個",""],["3\"","承插",null,"個",""],["3\"","三內牙 NPT",null,"個",""],["4\"","承插",null,"個",""],["4\"","三內牙 NPT",null,"個",""],["5\"","承插",null,"個",""],["5\"","三內牙 NPT",null,"個",""],["6\"","承插",null,"個",""],["6\"","三內牙 NPT",null,"個",""],["8\"","承插",null,"個",""],["8\"","三內牙 NPT",null,"個",""]],"ggImg":"img/2d455cc106159117a272.jpg"},{"n":"SCH80 T型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個",""],["1\"x1/2\"","",null,"個",""],["1\"x3/4\"","",null,"個",""],["1-1/4\"x3/4\"","",null,"個",""],["1-1/4\"x1\"","",null,"個",""],["1-1/2\"x1/2\"","",null,"個",""],["1-1/2\"x3/4\"","",null,"個",""],["1-1/2\"x1\"","",null,"個",""],["1-1/2\"x1-1/4\"","",null,"個",""],["2\"x1/2\"","",null,"個",""],["2\"x3/4\"","",null,"個",""],["2\"x1\"","",null,"個",""],["2\"x1-1/2\"","",null,"個",""],["2-1/2\"x1-1/2\"","",null,"個",""],["2-1/2\"x2\"","",null,"個",""],["3\"x1\"","",null,"個",""],["3\"x1-1/2\"","",null,"個",""],["3\"x2\"","",null,"個",""],["4\"x2\"","",null,"個",""],["4\"x3\"","",null,"個",""],["6\"x2\"","",null,"個",""],["6\"x3\"","",null,"個",""],["6\"x4\"","",null,"個",""],["8\"x6\"","",null,"個",""]],"ggImg":"img/3dde718a98615757182e.jpg"},{"n":"SCH80 十字接頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""]],"ggImg":"img/5426615d846d23fe4e29.jpg"},{"n":"SCH80 S型同徑接頭","p":"管管貿易","v":[["1/2\"","承插",null,"個",""],["1/2\"","雙內牙 NPT",null,"個",""],["3/4\"","承插",null,"個",""],["3/4\"","雙內牙 NPT",null,"個",""],["1\"","承插",null,"個",""],["1\"","雙內牙 NPT",null,"個",""],["1-1/4\"","承插",null,"個",""],["1-1/4\"","雙內牙 NPT",null,"個",""],["1-1/2\"","承插",null,"個",""],["1-1/2\"","雙內牙 NPT",null,"個",""],["2\"","承插",null,"個",""],["2\"","雙內牙 NPT",null,"個",""],["2-1/2\"","承插",null,"個",""],["2-1/2\"","雙內牙 NPT",null,"個",""],["3\"","承插",null,"個",""],["3\"","雙內牙 NPT",null,"個",""],["4\"","承插",null,"個",""],["4\"","雙內牙 NPT",null,"個",""],["5\"","承插",null,"個",""],["5\"","雙內牙 NPT",null,"個",""],["6\"","承插",null,"個",""],["6\"","雙內牙 NPT",null,"個",""],["8\"","承插",null,"個",""],["8\"","雙內牙 NPT",null,"個",""]],"ggImg":"img/f9f0df4346a5798ee009.jpg"},{"n":"SCH80 S型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個",""],["1\"x1/2\"","",null,"個",""],["1\"x3/4\"","",null,"個",""],["1-1/4\"x1/2\"","",null,"個",""],["1-1/4\"x3/4\"","",null,"個",""],["1-1/4\"x1\"","",null,"個",""],["1-1/2\"x1/2\"","",null,"個",""],["1-1/2\"x3/4\"","",null,"個",""],["1-1/2\"x1\"","",null,"個",""],["1-1/2\"x1-1/4\"","",null,"個",""],["2\"x1/2\"","",null,"個",""],["2\"x3/4\"","",null,"個",""],["2\"x1\"","",null,"個",""],["2\"x1-1/4\"","",null,"個",""],["2\"x1-1/2\"","",null,"個",""],["3\"x2\"","",null,"個",""],["4\"x2\"","",null,"個",""],["4\"x3\"","",null,"個",""],["6\"x4\"","",null,"個",""],["8\"x6\"","",null,"個",""]],"ggImg":"img/56c2dc45ddf228f83715.jpg"},{"n":"SCH80 Y型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""],["6\"","",null,"個",""],["8\"","",null,"個",""]],"ggImg":"img/f6acdea6097e8ad2e08a.jpg"},{"n":"SCH80 塞頭","p":"管管貿易","v":[["1/2\"","承插",null,"個",""],["1/2\"","NPT牙",null,"個",""],["3/4\"","承插",null,"個",""],["3/4\"","NPT牙",null,"個",""],["1\"","承插",null,"個",""],["1\"","NPT牙",null,"個",""],["1-1/4\"","承插",null,"個",""],["1-1/4\"","NPT牙",null,"個",""],["1-1/2\"","承插",null,"個",""],["1-1/2\"","NPT牙",null,"個",""],["2\"","承插",null,"個",""],["2\"","NPT牙",null,"個",""],["2-1/2\"","承插",null,"個",""],["2-1/2\"","NPT牙",null,"個",""],["3\"","承插",null,"個",""],["3\"","NPT牙",null,"個",""],["4\"","承插",null,"個",""],["4\"","NPT牙",null,"個",""],["6\"","承插",null,"個",""],["6\"","NPT牙",null,"個",""],["8\"","承插",null,"個",""],["8\"","NPT牙",null,"個",""]],"ggImg":"img/c48c58a5cc1f5cf72a8f.jpg"},{"n":"SCH80 卜申","p":"管管貿易","v":[["3/8\"x1/4\"","公頭×母頭",null,"個",""],["3/8\"x1/4\"","公頭＋內牙 NPT",null,"個",""],["1/2\"x1/4\"","公頭×母頭",null,"個",""],["1/2\"x1/4\"","公頭＋內牙 NPT",null,"個",""],["1/2\"x3/8\"","公頭×母頭",null,"個",""],["1/2\"x3/8\"","公頭＋內牙 NPT",null,"個",""],["3/4\"x1/4\"","公頭×母頭",null,"個",""],["3/4\"x1/4\"","公頭＋內牙 NPT",null,"個",""],["3/4\"x1/2\"","公頭×母頭",null,"個",""],["3/4\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["1\"x3/8\"","公頭×母頭",null,"個",""],["1\"x3/8\"","公頭＋內牙 NPT",null,"個",""],["1\"x1/2\"","公頭×母頭",null,"個",""],["1\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["1\"x3/4\"","公頭×母頭",null,"個",""],["1\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["1-1/4\"x1/2\"","公頭×母頭",null,"個",""],["1-1/4\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["1-1/4\"x3/4\"","公頭×母頭",null,"個",""],["1-1/4\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["1-1/4\"x1\"","公頭×母頭",null,"個",""],["1-1/4\"x1\"","公頭＋內牙 NPT",null,"個",""],["1-1/2\"x1/2\"","公頭×母頭",null,"個",""],["1-1/2\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["1-1/2\"x3/4\"","公頭×母頭",null,"個",""],["1-1/2\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["1-1/2\"x1\"","公頭×母頭",null,"個",""],["1-1/2\"x1\"","公頭＋內牙 NPT",null,"個",""],["1-1/2\"x1-1/4\"","公頭×母頭",null,"個",""],["1-1/2\"x1-1/4\"","公頭＋內牙 NPT",null,"個",""],["2\"x1/2\"","公頭×母頭",null,"個",""],["2\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["2\"x3/4\"","公頭×母頭",null,"個",""],["2\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["2\"x1\"","公頭×母頭",null,"個",""],["2\"x1\"","公頭＋內牙 NPT",null,"個",""],["2\"x1-1/4\"","公頭×母頭",null,"個",""],["2\"x1-1/4\"","公頭＋內牙 NPT",null,"個",""],["2\"x1-1/2\"","公頭×母頭",null,"個",""],["2\"x1-1/2\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x1/2\"","公頭×母頭",null,"個",""],["2-1/2\"x1/2\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x3/4\"","公頭×母頭",null,"個",""],["2-1/2\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x1\"","公頭×母頭",null,"個",""],["2-1/2\"x1\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x1-1/4\"","公頭×母頭",null,"個",""],["2-1/2\"x1-1/4\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x1-1/2\"","公頭×母頭",null,"個",""],["2-1/2\"x1-1/2\"","公頭＋內牙 NPT",null,"個",""],["2-1/2\"x2\"","公頭×母頭",null,"個",""],["2-1/2\"x2\"","公頭＋內牙 NPT",null,"個",""],["3\"x3/4\"","公頭×母頭",null,"個",""],["3\"x3/4\"","公頭＋內牙 NPT",null,"個",""],["3\"x1\"","公頭×母頭",null,"個",""],["3\"x1\"","公頭＋內牙 NPT",null,"個",""],["3\"x1-1/4\"","公頭×母頭",null,"個",""],["3\"x1-1/4\"","公頭＋內牙 NPT",null,"個",""],["3\"x1-1/2\"","公頭×母頭",null,"個",""],["3\"x1-1/2\"","公頭＋內牙 NPT",null,"個",""],["3\"x2\"","公頭×母頭",null,"個",""],["3\"x2\"","公頭＋內牙 NPT",null,"個",""],["3\"x2-1/2\"","公頭×母頭",null,"個",""],["3\"x2-1/2\"","公頭＋內牙 NPT",null,"個",""],["4\"x2\"","公頭×母頭",null,"個",""],["4\"x2\"","公頭＋內牙 NPT",null,"個",""],["4\"x2-1/2\"","公頭×母頭",null,"個",""],["4\"x2-1/2\"","公頭＋內牙 NPT",null,"個",""],["4\"x3\"","公頭×母頭",null,"個",""],["4\"x3\"","公頭＋內牙 NPT",null,"個",""],["5\"x4\"","公頭×母頭",null,"個",""],["5\"x4\"","公頭＋內牙 NPT",null,"個",""],["6\"x2\"","公頭×母頭",null,"個",""],["6\"x2\"","公頭＋內牙 NPT",null,"個",""],["6\"x3\"","公頭×母頭",null,"個",""],["6\"x3\"","公頭＋內牙 NPT",null,"個",""],["6\"x4\"","公頭×母頭",null,"個",""],["6\"x4\"","公頭＋內牙 NPT",null,"個",""],["6\"x5\"","公頭×母頭",null,"個",""],["6\"x5\"","公頭＋內牙 NPT",null,"個",""],["8\"x6\"","公頭×母頭",null,"個",""],["8\"x6\"","公頭＋內牙 NPT",null,"個",""]],"ggImg":"img/a626493347d5429569bb.jpg"},{"n":"SCH80 異徑內外牙卜申（NPT）","p":"管管貿易","v":[["3/8\"x1/4\"","",null,"個",""],["1/2\"x1/4\"","",null,"個",""],["1/2\"x3/8\"","",null,"個",""],["3/4\"x1/4\"","",null,"個",""],["3/4\"x3/8\"","",null,"個",""],["3/4\"x1/2\"","",null,"個",""],["1\"x1/4\"","",null,"個",""],["1\"x3/8\"","",null,"個",""],["1\"x1/2\"","",null,"個",""],["1\"x3/4\"","",null,"個",""],["1-1/4\"x1/2\"","",null,"個",""],["1-1/4\"x3/4\"","",null,"個",""],["1-1/4\"x1\"","",null,"個",""],["1-1/2\"x1/2\"","",null,"個",""],["1-1/2\"x3/4\"","",null,"個",""],["1-1/2\"x1\"","",null,"個",""],["1-1/2\"x1-1/4\"","",null,"個",""],["2\"x1/2\"","",null,"個",""],["2\"x3/4\"","",null,"個",""],["2\"x1\"","",null,"個",""],["2\"x1-1/4\"","",null,"個",""],["2\"x1-1/2\"","",null,"個",""],["2-1/2\"x2\"","",null,"個",""],["3\"x1-1/2\"","",null,"個",""],["3\"x2\"","",null,"個",""],["3\"x2-1/2\"","",null,"個",""],["4\"x2\"","",null,"個",""],["4\"x3\"","",null,"個",""]],"ggImg":"img/925ee27f5fba9e857351.jpg"},{"n":"SCH80 內牙接頭（NPT）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""]],"ggImg":"img/ef4aea08a475c9ce59dd.jpg"},{"n":"SCH80 外牙接頭（NPT）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""]],"ggImg":"img/82f44c5094905806b96c.jpg"},{"n":"SCH80 外牙塞頭（NPT）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""],["2-1/2\"","",null,"個",""],["3\"","",null,"個",""],["4\"","",null,"個",""]],"ggImg":"img/f7824a3ed855adedaa5c.jpg"},{"n":"SCH80 法蘭接頭","p":"管管貿易","v":[["1/2\"","150LBS 活動式",null,"片",""],["1/2\"","JIS 10K 孔",null,"片",""],["3/4\"","150LBS 活動式",null,"片",""],["3/4\"","JIS 10K 孔",null,"片",""],["1\"","150LBS 活動式",null,"片",""],["1\"","JIS 10K 孔",null,"片",""],["1-1/4\"","150LBS 活動式",null,"片",""],["1-1/4\"","JIS 10K 孔",null,"片",""],["1-1/2\"","150LBS 活動式",null,"片",""],["1-1/2\"","JIS 10K 孔",null,"片",""],["2\"","150LBS 活動式",null,"片",""],["2\"","JIS 10K 孔",null,"片",""],["2-1/2\"","150LBS 活動式",null,"片",""],["2-1/2\"","JIS 10K 孔",null,"片",""],["3\"","150LBS 活動式",null,"片",""],["3\"","JIS 10K 孔",null,"片",""],["4\"","150LBS 活動式",null,"片",""],["4\"","JIS 10K 孔",null,"片",""],["5\"","150LBS 活動式",null,"片",""],["5\"","JIS 10K 孔",null,"片",""],["6\"","150LBS 活動式",null,"片",""],["6\"","JIS 10K 孔",null,"片",""],["8\"","150LBS 活動式",null,"片",""],["8\"","JIS 10K 孔",null,"片",""]],"ggImg":"img/9591e7a430aa47d54bec.jpg"},{"n":"SCH80 盲法蘭","p":"管管貿易","v":[["1/2\"","150LBS",null,"片",""],["1/2\"","JIS 10K 孔",null,"片",""],["3/4\"","150LBS",null,"片",""],["3/4\"","JIS 10K 孔",null,"片",""],["1\"","150LBS",null,"片",""],["1\"","JIS 10K 孔",null,"片",""],["1-1/4\"","150LBS",null,"片",""],["1-1/4\"","JIS 10K 孔",null,"片",""],["1-1/2\"","150LBS",null,"片",""],["1-1/2\"","JIS 10K 孔",null,"片",""],["2\"","150LBS",null,"片",""],["2\"","JIS 10K 孔",null,"片",""],["2-1/2\"","150LBS",null,"片",""],["2-1/2\"","JIS 10K 孔",null,"片",""],["3\"","150LBS",null,"片",""],["3\"","JIS 10K 孔",null,"片",""],["4\"","150LBS",null,"片",""],["4\"","JIS 10K 孔",null,"片",""],["5\"","150LBS",null,"片",""],["5\"","JIS 10K 孔",null,"片",""],["6\"","150LBS",null,"片",""],["6\"","JIS 10K 孔",null,"片",""],["8\"","150LBS",null,"片",""],["8\"","JIS 10K 孔",null,"片",""]],"ggImg":"img/08865929d76ea84a7397.jpg"},{"n":"SCH80 龍L接頭（NPT）","p":"管管貿易","v":[["1/2\"","",null,"個",""],["3/4\"","",null,"個",""],["1\"","",null,"個",""],["1-1/4\"","",null,"個",""],["1-1/2\"","",null,"個",""],["2\"","",null,"個",""]],"ggImg":"img/7ad89e89a198c520b5ff.jpg"},{"n":"SCH80 冷膠／清潔劑","p":"管管貿易","v":[["冷膠 1kg","",null,"罐",""],["清潔劑 1kg","",null,"罐",""]],"ggImg":"img/e2814044f4fe95268a99.jpg"}]},{"n":"HDPE管・PEX管","g":"PVC管材","gg19":true,"items":[{"n":"HDPE 全黑管（公制 PN16）","p":"管管貿易","v":[["20mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["25mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["32mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["40mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["50mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["63mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["75mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["90mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"],["110mm","100M/捲",null,"捲","厚2.0mm・耐壓PN16"]],"ggImg":"img/ac65cb014e4249bd4a6a.jpg"},{"n":"HDPE 全黑管（日標 JIS）","p":"管管貿易","v":[["1/2\"","100M/捲",null,"捲","外徑21.5mm・耐壓10kgf/cm²"],["3/4\"","100M/捲",null,"捲","外徑27mm・耐壓10kgf/cm²"],["1\"","100M/捲",null,"捲","外徑34mm・耐壓10kgf/cm²"],["1-1/4\"","100M/捲",null,"捲","外徑42mm・耐壓10kgf/cm²"],["1-1/2\"","100M/捲",null,"捲","外徑48mm・耐壓10kgf/cm²"],["2\"","100M/捲",null,"捲","外徑60mm・耐壓10kgf/cm²"],["2-1/2\"","100M/捲",null,"捲","外徑76mm・耐壓10kgf/cm²"],["3\"","100M/捲",null,"捲","外徑89mm・耐壓10kgf/cm²"],["4\"","100M/捲",null,"捲","外徑114mm・耐壓10kgf/cm²"],["5\"","100M/捲",null,"捲","外徑140mm・耐壓10kgf/cm²"],["6\"","100M/捲",null,"捲","外徑165mm・耐壓10kgf/cm²"],["8\"","100M/捲",null,"捲","外徑216mm・耐壓10kgf/cm²"]],"ggImg":"img/ac65cb014e4249bd4a6a.jpg"},{"n":"PEX管","p":"管管貿易","v":[["1/2\"","紅色 100M/捲",null,"捲",""],["1/2\"","藍色 100M/捲",null,"捲",""],["3/4\"","紅色 100M/捲",null,"捲",""],["3/4\"","藍色 100M/捲",null,"捲",""],["1\"","紅色 100M/捲",null,"捲",""],["1\"","藍色 100M/捲",null,"捲",""]],"ggImg":"img/129043df59ddc2ebc4b3.jpg"}]},{"n":"塑膠另件・HDPE 鎖式接頭（公制）","g":"塑膠另件","gg19":true,"items":[{"n":"HDPE公制 90° L型接頭","p":"管管貿易","v":[["20mm","",null,"個","耐壓10kgf/cm²"],["25mm","",null,"個","耐壓10kgf/cm²"],["32mm","",null,"個","耐壓10kgf/cm²"],["40mm","",null,"個","耐壓10kgf/cm²"],["50mm","",null,"個","耐壓10kgf/cm²"],["63mm","",null,"個","耐壓10kgf/cm²"],["75mm","",null,"個","耐壓10kgf/cm²"],["90mm","",null,"個","耐壓10kgf/cm²"],["110mm","",null,"個","耐壓10kgf/cm²"]]},{"n":"HDPE公制 T型同徑接頭","p":"管管貿易","v":[["20mm","",null,"個","耐壓10kgf/cm²"],["25mm","",null,"個","耐壓10kgf/cm²"],["32mm","",null,"個","耐壓10kgf/cm²"],["40mm","",null,"個","耐壓10kgf/cm²"],["50mm","",null,"個","耐壓10kgf/cm²"],["63mm","",null,"個","耐壓10kgf/cm²"],["75mm","",null,"個","耐壓10kgf/cm²"],["90mm","",null,"個","耐壓10kgf/cm²"],["110mm","",null,"個","耐壓10kgf/cm²"]]},{"n":"HDPE公制 T型異徑接頭","p":"管管貿易","v":[["25x20mm","",null,"個","耐壓10kgf/cm²"],["32x20mm","",null,"個","耐壓10kgf/cm²"],["32x25mm","",null,"個","耐壓10kgf/cm²"],["40x25mm","",null,"個","耐壓10kgf/cm²"],["40x32mm","",null,"個","耐壓10kgf/cm²"],["50x32mm","",null,"個","耐壓10kgf/cm²"],["50x40mm","",null,"個","耐壓10kgf/cm²"],["63x32mm","",null,"個","耐壓10kgf/cm²"],["63x40mm","",null,"個","耐壓10kgf/cm²"],["63x50mm","",null,"個","耐壓10kgf/cm²"],["75x50mm","",null,"個","耐壓10kgf/cm²"],["75x63mm","",null,"個","耐壓10kgf/cm²"],["90x63mm","",null,"個","耐壓10kgf/cm²"],["90x75mm","",null,"個","耐壓10kgf/cm²"],["110x90mm","",null,"個","耐壓10kgf/cm²"]]},{"n":"HDPE公制 S型同徑接頭","p":"管管貿易","v":[["20mm","",null,"個","耐壓10kgf/cm²"],["25mm","",null,"個","耐壓10kgf/cm²"],["32mm","",null,"個","耐壓10kgf/cm²"],["40mm","",null,"個","耐壓10kgf/cm²"],["50mm","",null,"個","耐壓10kgf/cm²"],["63mm","",null,"個","耐壓10kgf/cm²"],["75mm","",null,"個","耐壓10kgf/cm²"],["90mm","",null,"個","耐壓10kgf/cm²"],["110mm","",null,"個","耐壓10kgf/cm²"]]},{"n":"HDPE公制 S型異徑接頭","p":"管管貿易","v":[["25x20mm","",null,"個","耐壓10kgf/cm²"],["32x20mm","",null,"個","耐壓10kgf/cm²"],["32x25mm","",null,"個","耐壓10kgf/cm²"],["40x25mm","",null,"個","耐壓10kgf/cm²"],["40x32mm","",null,"個","耐壓10kgf/cm²"],["50x32mm","",null,"個","耐壓10kgf/cm²"],["50x40mm","",null,"個","耐壓10kgf/cm²"],["63x32mm","",null,"個","耐壓10kgf/cm²"],["63x40mm","",null,"個","耐壓10kgf/cm²"],["63x50mm","",null,"個","耐壓10kgf/cm²"],["75x50mm","",null,"個","耐壓10kgf/cm²"],["75x63mm","",null,"個","耐壓10kgf/cm²"],["90x63mm","",null,"個","耐壓10kgf/cm²"],["90x75mm","",null,"個","耐壓10kgf/cm²"],["110x90mm","",null,"個","耐壓10kgf/cm²"]]},{"n":"HDPE公制 內牙接頭","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 內牙彎頭","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 內牙三通","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 外牙接頭","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 外牙彎頭","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 外牙三通","p":"管管貿易","v":[["20mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["20mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["25mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx3/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["32mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["40mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["50mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx1-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["63mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx2-1/2\"","",null,"個","PT牙・耐壓10kgf/cm²"],["75mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx3\"","",null,"個","PT牙・耐壓10kgf/cm²"],["90mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"],["110mmx4\"","",null,"個","PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE公制 法蘭","p":"管管貿易","v":[["50mm","",null,"片","10K・耐壓10kgf/cm²"],["63mm","",null,"片","10K・耐壓10kgf/cm²"],["75mm","",null,"片","10K・耐壓10kgf/cm²"],["90mm","",null,"片","10K・耐壓10kgf/cm²"],["110mm","",null,"片","10K・耐壓10kgf/cm²"]],"ggImg":"img/8393a25318440d3aec82.jpg"}]},{"n":"塑膠另件・HDPE 鎖式接頭（日標）","g":"塑膠另件","gg19":true,"items":[{"n":"HDPE日標 45° L型接頭","p":"管管貿易","v":[["1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 90° L型接頭","p":"管管貿易","v":[["1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 T型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 T型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"x3\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 S型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 S型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/4\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["1-1/2\"x1-1/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x3/4\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1\"","",null,"個","JIS・耐壓10kgf/cm²"],["2\"x1-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["2-1/2\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["3\"x2-1/2\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"x2\"","",null,"個","JIS・耐壓10kgf/cm²"],["4\"x3\"","",null,"個","JIS・耐壓10kgf/cm²"]]},{"n":"HDPE日標 外牙接頭","p":"管管貿易","v":[["1/2\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["3/4\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["1\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["1-1/4\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["1-1/2\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["2\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["2-1/2\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["3\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"],["4\"","",null,"個","JIS・PT牙・耐壓10kgf/cm²"]]},{"n":"HDPE日標 法蘭","p":"管管貿易","v":[["2\" 10K","",null,"片","JIS 10K"],["2-1/2\" 10K","",null,"片","JIS 10K"],["3\" 10K","",null,"片","JIS 10K"],["4\" 10K","",null,"片","JIS 10K"]],"ggImg":"img/8393a25318440d3aec82.jpg"}]},{"n":"塑膠另件・PEX 承插接頭","g":"塑膠另件","gg19":true,"items":[{"n":"PEX 90° L型接頭","p":"管管貿易","v":[["1/2\"","",null,"個","承插式"],["3/4\"","",null,"個","承插式"],["1\"","",null,"個","承插式"]],"ggImg":"img/98fe3c0b8e6874b71eab.jpg"},{"n":"PEX S型同徑接頭","p":"管管貿易","v":[["1/2\"","承插式",null,"個",""],["1/2\"","承插式 加長",null,"個",""],["3/4\"","承插式",null,"個",""],["3/4\"","承插式 加長",null,"個",""],["1\"","承插式",null,"個",""],["1\"","承插式 加長",null,"個",""]],"ggImg":"img/8ba49092f20198bff61a.jpg"},{"n":"PEX S型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個","承插式"],["1\"x3/4\"","",null,"個","承插式"]],"ggImg":"img/1dda7f9514f73856c6b6.jpg"},{"n":"PEX T型同徑接頭","p":"管管貿易","v":[["1/2\"","",null,"個","承插式"],["3/4\"","",null,"個","承插式"],["1\"","",null,"個","承插式"]],"ggImg":"img/0179472b63b96e7efefa.jpg"},{"n":"PEX T型異徑接頭","p":"管管貿易","v":[["3/4\"x1/2\"","",null,"個","承插式"],["1\"x1/2\"","",null,"個","承插式"],["1\"x3/4\"","",null,"個","承插式"]],"ggImg":"img/c7b23419d46498ff1ca6.jpg"},{"n":"PEX 內牙接頭","p":"管管貿易","v":[["1/2\"","",null,"個","承插式・NPT牙"],["3/4\"","",null,"個","承插式・NPT牙"],["1\"","",null,"個","承插式・NPT牙"]],"ggImg":"img/9618475391acb26097c9.jpg"},{"n":"PEX 內牙彎頭","p":"管管貿易","v":[["1/2\"","",null,"個","承插式・NPT牙"],["3/4\"","",null,"個","承插式・NPT牙"],["1\"","",null,"個","承插式・NPT牙"]],"ggImg":"img/af95f3775bdf9777ff83.jpg"},{"n":"PEX 內牙彎頭（附座）","p":"管管貿易","v":[["1/2\"","",null,"個","承插式・NPT牙"],["3/4\"","",null,"個","承插式・NPT牙"]],"ggImg":"img/845b868b73d5f9891ee9.jpg"},{"n":"PEX 塞頭","p":"管管貿易","v":[["1/2\"","",null,"個","承插式"],["3/4\"","",null,"個","承插式"],["1\"","",null,"個","承插式"]],"ggImg":"img/3210eaecc2c24610b1bf.jpg"},{"n":"PEX 分離夾","p":"管管貿易","v":[["1/2\"","",null,"個","單只"],["1/2\"~1\"","",null,"個","單只"],["3/4\"","",null,"個","單只"],["1\"","",null,"個","單只"]],"ggImg":"img/8d9be062ed6600a4d4b3.jpg"},{"n":"PEX 導角修邊器","p":"管管貿易","v":[["1/2\"~1\"","",null,"支","1/2\"～1\" 共用"]],"ggImg":"img/2b0abbabcfcd7e47e8f0.jpg"}]}],TILE={"PVC另件・CPVC耐熱":"img/9f6b62020e3040290822.jpg","PVC另件・美規 SCH80（灰）":"img/b39c746e131975cae9d9.jpg","HDPE管・PEX管":"img/779bf0822bde1735c415.jpg","塑膠另件・HDPE 鎖式接頭（公制）":"img/5ba44e2bf6370ad09c7a.jpg","塑膠另件・HDPE 鎖式接頭（日標）":"img/5ba44e2bf6370ad09c7a.jpg","塑膠另件・PEX 承插接頭":"img/c45b529adb39e61665a4.jpg","PVC另件・塑膠油":"img/52ca9eee22fb21beca5c.jpg"};
  for(const [k,src] of Object.entries(PH)){const [ci,ii]=k.split("_").map(Number);const it=CATALOG[ci]&&CATALOG[ci].items[ii];if(it)it.ggImg=src;}
  for(const [cn,items] of ADD){const c=CATALOG.find(c=>c.n===cn);if(!c)continue;for(const it of items)if(!c.items.some(x=>x.n===it.n))c.items.push(it);}
  // gg19 設成不可列舉：選單會顯示這些分類，但不會被當成「新版 PVC 分類」整批搬到前面
  for(const c of NEW)if(!CATALOG.some(x=>x.n===c.n)){delete c.gg19;Object.defineProperty(c,"gg19",{value:true,enumerable:false});CATALOG.push(c);}
  for(const [cn,src] of Object.entries(TILE)){IMG.IC["ggtile|"+cn]=src;IMG.CAT[cn]="ggtile|"+cn;}
 })();
// 管管整合 END
// 保溫管墊 BEGIN
 (function(){
  const c=CATALOG.find(c=>c.n==="PU管墊・PE保溫管");if(!c)return;
  for(const it of [{"n":"PE座式管墊","p":"友閎","v":[["1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"","鐵束",null,"個",""],["3/4\"","鐵束",null,"個",""],["1\"","鐵束",null,"個",""],["1-1/4\"","鐵束",null,"個",""],["1-1/2\"","鐵束",null,"個",""],["2\"","鐵束",null,"個",""],["2-1/2\"","鐵束",null,"個",""],["3\"","鐵束",null,"個",""],["4\"","鐵束",null,"個",""],["5\"","鐵束",null,"個",""],["6\"","鐵束",null,"個",""],["8\"","鐵束",null,"個",""],["10\"","鐵束",null,"個",""],["12\"","鐵束",null,"個",""],["14\"","鐵束",null,"個",""],["16\"","鐵束",null,"個",""],["18\"","鐵束",null,"個",""],["20\"","鐵束",null,"個",""]],"ggImg":"img/874a269e5fb1deeadc31.jpg"},{"n":"PE吊式管墊","p":"友閎","v":[["3/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"","鐵束",null,"個",""],["1\"","鐵束",null,"個",""],["1-1/4\"","鐵束",null,"個",""],["1-1/2\"","鐵束",null,"個",""],["2\"","鐵束",null,"個",""],["2-1/2\"","鐵束",null,"個",""],["3\"","鐵束",null,"個",""],["4\"","鐵束",null,"個",""],["5\"","鐵束",null,"個",""],["6\"","鐵束",null,"個",""],["8\"","鐵束",null,"個",""],["10\"","鐵束",null,"個",""],["12\"","鐵束",null,"個",""]]},{"n":"PU座式管墊","p":"規格比照PE座式","v":[["1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["14\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["16\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["18\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["20\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1/2\"","鐵束",null,"個",""],["3/4\"","鐵束",null,"個",""],["1\"","鐵束",null,"個",""],["1-1/4\"","鐵束",null,"個",""],["1-1/2\"","鐵束",null,"個",""],["2\"","鐵束",null,"個",""],["2-1/2\"","鐵束",null,"個",""],["3\"","鐵束",null,"個",""],["4\"","鐵束",null,"個",""],["5\"","鐵束",null,"個",""],["6\"","鐵束",null,"個",""],["8\"","鐵束",null,"個",""],["10\"","鐵束",null,"個",""],["12\"","鐵束",null,"個",""],["14\"","鐵束",null,"個",""],["16\"","鐵束",null,"個",""],["18\"","鐵束",null,"個",""],["20\"","鐵束",null,"個",""]]},{"n":"PU吊式管墊","p":"規格比照PE吊式","v":[["3/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["1-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["2-1/2\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["3\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["4\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["5\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1\"厚","1\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["6\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/4\"厚","1-1/4\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["8\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["10\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*1-1/2\"厚","1-1/2\"厚",null,"組","寬1-1/2\"・長38mm"],["12\"*2\"厚","2\"厚",null,"組","寬1-1/2\"・長38mm"],["3/4\"","鐵束",null,"個",""],["1\"","鐵束",null,"個",""],["1-1/4\"","鐵束",null,"個",""],["1-1/2\"","鐵束",null,"個",""],["2\"","鐵束",null,"個",""],["2-1/2\"","鐵束",null,"個",""],["3\"","鐵束",null,"個",""],["4\"","鐵束",null,"個",""],["5\"","鐵束",null,"個",""],["6\"","鐵束",null,"個",""],["8\"","鐵束",null,"個",""],["10\"","鐵束",null,"個",""],["12\"","鐵束",null,"個",""]]}])if(!c.items.some(x=>x.n===it.n))c.items.push(it);
  for(const [n,from] of Object.entries({"PU座式管墊":"PU管墊《整組》","PU吊式管墊":"PU管墊《整組》"})){const k=c.n+"|"+from;if(AI_IMAGES[k]&&!AI_IMAGES[c.n+"|"+n])AI_IMAGES[c.n+"|"+n]=AI_IMAGES[k];if(IMG.ITEM[k]&&!IMG.ITEM[c.n+"|"+n])IMG.ITEM[c.n+"|"+n]=IMG.ITEM[k];}
  IMG.IC["pad|tile"]="img/8e3876a325789f55864e.jpg";IMG.CAT["保溫管墊"]="pad|tile";
 })();
// 保溫管墊 END
 const menuCatalog=CATALOG.flatMap((c,ci)=>{
  if(ci>=PVC_NEW_START&&!c.gg19&&!c.xadd)return [];
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
    if(c.items.some(x=>x.it.nw&&x.it.n==="排水管蓋（淺管帽）")){const ORD=["排水管蓋（淺管帽）","伸縮套管 10cm","伸縮套管 12cm","伸縮套管 15cm","卡式套管","饅頭（平頂塞口）"];c={...c,items:c.items.filter(x=>!/^(冷氣孔修飾|浪管圓片|伸縮套管)$/.test(x.it.n)&&!(x.it.n==="排水管蓋（淺管帽）"&&!x.it.nw)).sort((a,b)=>ORD.indexOf(a.it.n)-ORD.indexOf(b.it.n))};}
    if(c.n==="懸吊系列"){const NEWN=["鍍鋅雙層管束","不鏽鋼雙層管束","鍍鋅葫蘆束 3/8\"孔","鍍鋅葫蘆束 1/2\"孔","不鏽鋼葫蘆束 3/8\"孔"];const nw=c.items.filter(x=>NEWN.includes(x.it.n)).sort((a,b)=>NEWN.indexOf(a.it.n)-NEWN.indexOf(b.it.n));const OLDN=/^(雙層管束|葫蘆管束 (3\/8|1\/2)"孔|不銹鋼葫蘆束 (3\/8|1\/2)"孔|鍍鋅葫蘆束|不鏽鋼葫蘆束)$/;const at=c.items.findIndex(x=>OLDN.test(x.it.n));const rest=c.items.filter(x=>!OLDN.test(x.it.n)&&!NEWN.includes(x.it.n));c={...c,items:at<0?rest.concat(nw):[...rest.slice(0,at),...nw,...rest.slice(at)]};}
    if(c.n==="PVC另件・其他（價目表）")return;
    if(c.n==="電白(鍍鋅)法蘭"||c.n==="304不銹鋼法蘭"||c.n==="迫緊墊片")return;
    {const DEL={"PVC另件・灰色厚": ["龍S接頭(豪宅型・威猛)", "龍L彎頭(豪宅型・威猛)"], "PVC另件・灰色・配件": ["清除孔接頭", "止水板接頭", "雙層止水板接頭", "組合式穿樑接頭"], "PVC另件・橘色厚（下水道）": ["清除孔接頭"], "PVC另件・清潔口": ["暗式清潔口"], "塑膠另件・平頂・喇叭口": ["平頂塞口（饅頭）", "平頂接頭－水用"], "塑膠另件・PVC凡而・由令": ["PVC由令（套管）"]};if(DEL[c.n])c={...c,items:c.items.filter(x=>!DEL[c.n].includes(x.it.n))};if(!c.items.length)return;}
    if(c.n==="PVC套龍口")return;

    if(c.g==="PVC另件"||/^PVC另件/.test(c.n))c={...c,items:c.items.filter(x=>!/^(HI耐衝擊 )?90° ?L型異徑接頭$/.test(x.it.n))};
    if(c.n==="不銹鋼雙壓接另件・滑動式保溫另件"){out.push({...c,g:"壓接另件",n:"北銘 雙壓接接頭",items:c.items.filter(x=>x.it.bm)});return;}
    if(c.n==="邁克溝槽式機械接頭・另件（UL/FM）"){out.push({...c,n:"秀而久 溝槽式接頭・另件",items:c.items.filter(x=>x.it.sj)});return;}
    if(c.n==="金通溝槽機械接頭・可彎接頭")return;
    if(c.n==="ONK Nice Joint 不鏽鋼管式接頭 SUS304")return;
    if(c.n==="PU管墊・PE保溫管"){out.push({...c,n:"PU管墊",items:c.items.filter(x=>/^PU/.test(x.it.n))});out.push({...c,n:"PE保溫管・膠帶",items:c.items.filter(x=>!/^PU/.test(x.it.n))});return;}
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
  {const pi=out.findIndex(c=>c.items.some(x=>x.it.nw&&x.it.n==="排水管蓋（淺管帽）"));const yi=out.findIndex(c=>c.n==="塑膠另件・預埋・伸縮・止水");
   if(pi>=0&&yi>=0){const P=out[pi],Y=out[yi];const get=n=>P.items.find(x=>x.it.n===n);
     const kas=Y.items.find(x=>x.it.n==="卡式伸縮套管");
     const head=["伸縮套管 10cm","伸縮套管 12cm","伸縮套管 15cm"].map(get).filter(Boolean);
     const rest=Y.items.filter(x=>!/^(PVC伸縮套管|卡式伸縮套管)$/.test(x.it.n));
     const tail=["排水管蓋（淺管帽）","饅頭（平頂塞口）"].map(get).filter(Boolean);
     out[yi]={...Y,items:[...head,...(kas?[{...kas,it:{...kas.it,n:"卡式套管"}}]:[get("卡式套管")].filter(Boolean)),...rest,...tail]};
     out.splice(pi,1);}}
  const first=[...new Set(out.map(c=>c.g||"其他"))];
  const order=[];first.forEach(g=>{
    if(g==="ACI")return;
    if(g==="鐵管"){order.push("鐵管","不鏽鋼管","CIP管","ACI");}
    else if(g==="牙件"||g==="壓接另件"||g==="焊件"){if(!order.includes("牙件"))order.push("牙件","焊件","壓接另件");}
    else if(!order.includes(g))order.push(g);
  });
  const mv=(g,after)=>{const i=order.indexOf(g);if(i<0||!order.includes(after))return;order.splice(i,1);order.splice(order.indexOf(after)+1,0,g)};mv("ACI","軟管・防震接頭");mv("H型鋼","CIP管");mv("五金另料","法蘭・墊片");
  out.sort((a,b)=>order.indexOf(a.g||"其他")-order.indexOf(b.g||"其他"));
  {const A=out.find(c=>c.n==="PVC另件・灰色・配件"),G=out.find(c=>c.n==="PVC另件・灰色厚");if(A&&G){const m=A.items.filter(x=>x.it.n==="樓板接頭");A.items=A.items.filter(x=>x.it.n!=="樓板接頭");G.items=[...G.items,...m];}}
  {const f=out.filter(c=>c.gg19);if(f.length){const r=out.filter(c=>!c.gg19);const k=r.findIndex(c=>c.g===f[0].g);r.splice(k<0?r.length:k,0,...f);out.length=0;out.push(...r);}}
  {const H=new Set(["內迫式短壁虎","內迫式短壁虎 DR3030（新生）","有孔角鐵 AGH620T（新生）","被覆吊配管另件","UL直角管束","UCL 型鋼用直角管束","新型輕型鋼吊架 CHKN","ST 雙層管束（新生）"]);out.forEach(c=>{if(c.items.some(x=>H.has(x.it.n)))c.items=c.items.filter(x=>!H.has(x.it.n))});const C=out.find(c=>c.n==="C型鋼、角鐵、ㄇ型槽鐵、牙條");if(C){const r=/C型鋼$/;C.items=[...C.items.filter(x=>r.test(x.it.n)),...C.items.filter(x=>!r.test(x.it.n))];}}
  {const di=out.findIndex(c=>c.n==="電白焊接另件 20S/40S");if(di>=0)out.splice(di,1);out.forEach(c=>{if(/焊接另件|有縫焊另件/.test(c.n)&&!/^SUS/.test(c.n))IMG.CAT[c.n]="h125"});IMG.IC["blk90"]="img/adce9ba0cff859a0e540.jpg";IMG.CAT["黑鐵焊接另件 20S/40S"]="blk90";}
  menuCatalog.length=0;menuCatalog.push(...out);
})();
// 選單隱藏與排序 BEGIN
 (function(){
  const HIDE=new Set(["拉線膏"]),ADD=[["AB膠","達克隆 ENA-1299"]];
  for(const c of menuCatalog){
   c.items=c.items.filter(x=>!HIDE.has(x.it.n));
   for(const [after,name] of ADD){
    const from=c.items.findIndex(x=>x.it.n===name),to=c.items.findIndex(x=>x.it.n===after);
    if(from>=0&&to>=0&&from!==to+1){const [x]=c.items.splice(from,1);c.items.splice(c.items.findIndex(y=>y.it.n===after)+1,0,x);}
   }
  }
 })();
// 選單隱藏與排序 END
// 保溫管墊選單 BEGIN
 (function(){
  const NEWN=["PE座式管墊","PE吊式管墊","PU座式管墊","PU吊式管墊"];
  const ci=CATALOG.findIndex(c=>c.n==="PU管墊・PE保溫管");if(ci<0)return;
  const mine=NEWN.map(n=>{const ii=CATALOG[ci].items.findIndex(x=>x.n===n);return ii<0?null:{it:CATALOG[ci].items[ii],key:ci+"_"+ii}}).filter(Boolean);
  if(S&&!S.padFix20261115b){
   for(const p of S.projects||[])for(const o of [p.draft,...(p.orders||[])])for(const l of (o&&o.lines)||[]){
    if(!NEWN.includes(l.name))continue;const m=/^厚(.+?)・(管墊|鐵束|整組（管墊＋鐵束）)$/.exec(l.spec||"");if(!m)continue;
    const it=CATALOG[ci].items.find(x=>x.n===l.name);const ii=CATALOG[ci].items.indexOf(it);
    const want=m[2]==="鐵束"?[l.size,"鐵束"]:[l.size+"*"+m[1]+"厚",m[1]+"厚"];
    const vi=it.v.findIndex(v=>v[0]===want[0]&&v[1]===want[1]);if(vi<0)continue;
    l.vk=ci+"_"+ii+"|"+vi;l.size=want[0];l.spec=want[1];l.unit=it.v[vi][3];
   }
   S.padFix20261115b=1;persist();
  }
  for(const c of menuCatalog){
   if(c.source==="PU管墊・PE保溫管"&&c.n==="PU管墊"){c.n="保溫管墊";c.items=mine;}
   else if(c.source==="PU管墊・PE保溫管")c.items=c.items.filter(x=>!NEWN.includes(x.it.n));
  }
 })();
// 保溫管墊選單 END
// 管管整合排序 BEGIN
 (function(){
  const NEWN=new Set(["PVC另件・CPVC耐熱","PVC另件・美規 SCH80（灰）","HDPE管・PEX管","塑膠另件・HDPE 鎖式接頭（公制）","塑膠另件・HDPE 鎖式接頭（日標）","塑膠另件・PEX 承插接頭"]);
  for(const n of NEWN){
   const i=menuCatalog.findIndex(c=>c.n===n);if(i<0)continue;
   const [c]=menuCatalog.splice(i,1);
   let last=-1;menuCatalog.forEach((x,j)=>{if((x.g||"其他")===(c.g||"其他"))last=j});
   menuCatalog.splice(last<0?menuCatalog.length:last+1,0,c);
  }
 })();
// 管管整合排序 END
function materialName(line){
  if(line.ik&&+String(line.ik).split("_")[0]>=PVC_NEW_START&&PVC_LAB[line.cat])return (line.brand?PVC_LAB[line.cat].replace(/^南亞/,line.brand):PVC_LAB[line.cat])+" "+line.name;
  if(line.brand&&CATALOG.some(c=>c.g==="PVC另件"&&c.n===line.cat))return line.brand+" "+line.name;
  if(CATALOG.some(c=>c.g==="PVC管材"&&c.n===line.cat))
    return (line.brand||"廠牌未指定")+" "+line.name;
  if(line.name.startsWith("加強型套龍口"))return line.name.replace(/^加強型/,"");
  if(line.name==="PE浪管")return "電管 PE浪管";
  if(line.cat===carbonCategory.n){
    const match=/^碳鋼焊另件 (.+) (黑鐵|電白|熱浸)$/.exec(line.name);
    if(match)return match[2]+"碳鋼焊接另件 "+match[1];
  }
  if(/^(秀而久|北銘)/.test(line.name||""))return line.name;
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
 function stockLength(name,variant){
   return /^(鍍鋅|不銹鋼)槽鐵$/.test(name)&&/^[36]M\/支$/.test(variant?.[4]||"")?variant[4]:"";
 }
 function lineSpec(line){
   const match=/^(\d+)_(\d+)\|(\d+)$/.exec(line.vk||"");
   const variant=match&&CATALOG[+match[1]]?.items[+match[2]]?.v[+match[3]];
   const length=line.stockLength||stockLength(line.name,variant);
   return [line.spec,length].filter(Boolean).join(" ");
 }

// ---------- header ----------
let siteChosen=!!(S.projects.find(p=>p.id===S.cur)&&(S.siteChosen||S.cur!==S.projects[0].id));if(siteChosen)S.siteChosen=true;
function renderProj(){const s=$("#proj");s.innerHTML=(siteChosen?"":'<option value="" selected disabled>請選擇工地</option>')+S.projects.map(p=>`<option value="${p.id}" ${siteChosen&&p.id===S.cur?"selected":""}>${esc(p.name)}</option>`).join("");s.classList.toggle("need",!siteChosen)}
$("#proj").onchange=e=>{if(!e.target.value)return;S.cur=e.target.value;siteChosen=true;S.siteChosen=true;persist();renderAll()};
document.addEventListener("click",e=>{if(siteChosen)return;const t=e.target.closest("#vMenu .tile,.tab[data-v=order],.tab[data-v=hist],#cbGo");if(!t)return;e.preventDefault();e.stopPropagation();toast("請先選擇目前工地");},true);
$("#appTools").addEventListener("click",e=>{if(e.target.closest("button"))$("#appTools").open=false});addEventListener("popstate",()=>{const b=document.querySelector("#crumb [data-nav=back]");if(b&&!b.hidden&&!$("#vMenu").hidden&&!document.querySelector("dialog[open]")){window.__popping=true;b.click();window.__popping=false}});
const SP=document.createElement("dialog");SP.id="sitePick";document.body.appendChild(SP);
const CO_ORDER=["聖和工程有限公司","紘誠水電工程行","澧育有限公司","白鐵工程行"];
const CO_COL={"聖和工程有限公司":"#2f6f3e","紘誠水電工程行":"#2c5d9b","澧育有限公司":"#9a5b12","白鐵工程行":"#57606a"};
function openSitePicker(){const gs={};S.projects.forEach(p=>{const c=siteCo(p.name)||"";(gs[c]=gs[c]||[]).push(p)});
  const keys=[...CO_ORDER.filter(k=>gs[k]),...Object.keys(gs).filter(k=>k&&!CO_ORDER.includes(k)),...(gs[""]?[""]:[])];
  SP.innerHTML=`<div class="sp-h"><h2>選擇目前工地 ▾</h2>${siteChosen?'<button class="sp-x" data-x>✕ 關閉</button>':""}</div><div class="sp-b">${keys.map(k=>{const col=CO_COL[k]||"#6b7280";return `<div class="sp-g"><div class="sp-gt" style="color:${col}"><i style="background:${col}"></i>${esc(k||"公司・倉庫")}</div><div class="sp-grid">${gs[k].map(p=>`<button class="sp-it${siteChosen&&p.id===S.cur?" on":""}" data-id="${p.id}" style="--c:${col}"><b>${esc(p.name)}</b><small>${esc(p.addr||"")}</small></button>`).join("")}</div></div>`}).join("")}</div>`;
  SP.onclick=e=>{if(e.target.closest("[data-x]")){SP.close();return}const b=e.target.closest("[data-id]");if(!b)return;S.cur=b.dataset.id;siteChosen=true;S.siteChosen=true;persist();SP.close();renderAll();toast("目前工地："+P().name)};
  SP.oncancel=e=>{if(!siteChosen)e.preventDefault()};
  if(!SP.open)SP.showModal();SP.querySelector(".sp-b").scrollTop=0}
document.querySelector(".project-context").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openSitePicker()},true);


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
const short=n=>({"PVC另件・灰色厚":"灰色-厚","PVC另件・灰色薄・排水用":"灰色-薄"})[n]||n.replace(/^(東光閥|富山閥|日泰閥|ACHEN閥)・/,"").replace(/^PVC另件・/,"").replace(/^富山閥・/,"").replace(/^塑膠另件・/,"");
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
const itemImageKey=x=>x.cat+"|"+x.it.n;try{const _k="塑膠另件・預埋・伸縮・止水|排水管蓋（淺管帽）",_o="PVC套龍口・配管另件|排水管蓋（淺管帽）";if(!AI_IMAGES[_k]&&AI_IMAGES[_o])AI_IMAGES[_k]=AI_IMAGES[_o]}catch(e){}
const supplierPhotos={"內迫式短壁虎 DR3030（新生）":"img/f89952c72cddab156427.jpg","有孔角鐵 AGH620T（新生）":"img/b7f66ade62d738718018.jpg","ST 雙層管束（新生）":"img/88b5b195b958e2361b60.jpg","P型管夾(附螺絲)":"img/43f920c7941cb38bf52e.jpg","UL直角管束":"img/6650abfd5f74b69a83f6.jpg"};
 const stainlessWeldPhotos={"45°彎頭":"img/dfbd398c89a777cb71de.jpg","90°彎頭":"img/11a54e34626d0ed778bf.jpg","同心大小頭":"img/c436e8a5cf147390afe7.jpg","三通":"img/ed0430acbaddb981311d.jpg","異徑三通":"img/b1e10001802e3b1d8346.jpg","管帽":"img/8f2b4a83ab20b28a931a.jpg"};
 const supplierPhoto=x=>x.g==="懸吊・支架・螺絲"?supplierPhotos[x.it.n]:
   /^SUS304不銹鋼有縫焊另件 (10S|20S)$/.test(x.cat)?stainlessWeldPhotos[x.it.n]:undefined;
 const itemImage=x=>x.it.ggImg||supplierPhoto(x)||AI_IMAGES[itemImageKey(x)]||imgOf(IMG.ITEM[itemImageKey(x)]);
const isIllustration=x=>!x.it.ggImg&&!supplierPhoto(x)&&Boolean(AI_IMAGES[itemImageKey(x)]);
const imgOf=k=>k&&IMG.IC[k]?IMG.IC[k]:"";
function tile(attrs,color,icon,label,sub,badge,small,img){
  return `<button class="tile${small?" sm":""}" ${attrs} style="--tc:${color}">${badge?`<span class="tbadge">${badge}</span>`:""}${img?`<span class="timg"><img src="${img}" alt=""></span>`:`<span class="ti">${icon}</span>`}<span class="tl">${esc(label)}</span>${sub?`<span class="ts">${esc(sub)}</span>`:""}</button>`;
}
function renderList(){
  {const _dep=(curG?1:0)+(curB?1:0)+(curCat>=0?1:0);if(_dep>(window.__dep||0)&&!window.__popping)try{history.pushState({jl:_dep},"")}catch(e){};window.__dep=_dep;}
  const L=$("#list"),C=$("#crumb");
  const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  // breadcrumb
  const parts=[`<button class="cb" data-nav="root">材料分類</button>`];
  if(curG)parts.push(`<span>›</span><button class="cb" data-nav="group">${esc(curG)}</button>`);
  if(curB)parts.push(`<span>›</span><button class="cb" data-nav="brand">${esc(curB)}</button>`);
  if(curCat>=0&&menuCatalog.filter(c=>(c.g||"其他")===curG).length>1)parts.push(`<span>›</span><b>${esc(short(menuCatalog[curCat].n))}</b>`);
  const level=terms.length?"items":(!curG?"groups":(curCat<0?"cats":"items"));
  const title=terms.length?"搜尋結果":level==="groups"?"材料品項":level==="cats"?(curB&&menuCatalog.some(c=>c.g===curG&&c.b)?"材質":"材料細項"):"材料";
  C.innerHTML=`${curG||terms.length?`<button class="cb back" data-nav="back" ${terms.length?"hidden":""}><span class="bk-ar">←</span> 回上一層<small>${esc(curCat>=0?(curB||curG):curB?curG:"材料分類")}</small></button>`:""}<div class="cpath">${parts.join("")}</div>${level==="groups"?"":`<span class="ctitle">${title}</span>`}`;
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
    d.lines.push({id:uid(),vk:k,ik:x.key,cat:x.cat,name:x.it.n,size:v[0],spec:v[1],stockLength:stockLength(x.it.n,v)||undefined,list,priceNote:(isNum(v[2])||v[2]==null)?"":String(v[2]),unit:unitFor(v[3]),qty,price:null,remark:(isNum(v[2])||v[2]==null)?"":String(v[2])})}
  persist();updateCart();
}
function cleanoutPhotos(spec){
  return ["灰色","橘色"].filter(color=>!spec||color===spec).map(color=>
    `<figure style="margin:8px 0;text-align:center"><img src="${CLEANOUT_IMAGES[color]}" alt="${color==="橘色"?"桔色":"灰色"}暗式清潔口實物照片" style="width:110px;height:130px;object-fit:contain;background:white;border-radius:8px"><figcaption>${color==="橘色"?"桔色":"灰色"}暗式清潔口</figcaption></figure>`
  ).join("");
}
const ITEM_REMIND={};
function hbDlg(x){
  const D=$("#dlg");let spec=null;const specs=[...new Set(x.it.v.map(v=>v[1]))];
  const row=(v,vi)=>{const l=findLine(vKey(x.key,vi));const on=l&&l.qty>0;
    return `<div class="vrow ${on?"in":""}" data-vi="${vi}" style="flex-wrap:wrap"><div class="sz"><b>${esc(v[0])}</b><small>${esc(v[1])}</small></div>
    <div style="display:flex;gap:8px;align-items:center;margin-left:auto">
    <label style="font-size:13px;display:flex;align-items:center;gap:4px">長<input data-f="len" type="number" inputmode="decimal" min="0" value="${l&&l.len||""}" placeholder="0" style="width:64px;font-size:16px;padding:6px;border:1px solid #cbd5e1;border-radius:8px;text-align:center">公分</label>
    <label style="font-size:13px;display:flex;align-items:center;gap:4px">×<input data-f="qty" type="number" inputmode="decimal" min="0" value="${on?l.qty:""}" placeholder="0" style="width:52px;font-size:16px;padding:6px;border:1px solid #cbd5e1;border-radius:8px;text-align:center">支</label></div></div>`};
  const body=()=>x.it.v.map((v,vi)=>({v,vi})).filter(r=>spec==null||r.v[1]===spec).map(r=>row(r.v,r.vi)).join("");
  const save=r=>{const vi=+r.dataset.vi;const v=x.it.v[vi];const len=+r.querySelector('[data-f=len]').value||0;const q=+r.querySelector('[data-f=qty]').value||0;
    const d=draft();const k=vKey(x.key,vi);let l=findLine(k);
    if(q<=0){if(l)d.lines=d.lines.filter(z=>z!==l)}
    else{const sp=v[1]+(len?`・每支 ${len} 公分`:"・長度未填");
      if(l){l.qty=q;l.len=len||"";l.spec=sp;l.unit="支"}
      else d.lines.push({id:uid(),vk:k,ik:x.key,cat:x.cat,name:x.it.n,size:v[0],spec:sp,len:len||"",list:null,priceNote:"",unit:"支",qty:q,price:null,remark:""})}
    r.classList.toggle("in",q>0);persist();updateCart()};
  const _im=itemImage(x);
  D.innerHTML=`<div class="sh-h"><h2>${_im?`<img src="${_im}" alt="" style="width:44px;height:44px;border-radius:10px;vertical-align:middle;margin-right:6px">`:ICON(x.cat)} ${esc(x.it.n)}</h2><small>每一列填長度（公分）和支數</small><button class="sh-x" data-close>✕</button>
   <div class="spec-chips"><button class="chip on" data-s="__all">全部</button>${specs.map(s=>`<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>
   <div class="sh-b" id="shb">${body()}</div>
   <div class="sh-f"><span class="note" style="margin-right:auto;align-self:center">長度和支數都填才會加入</span><button class="btn btn-p" data-close>完成</button></div>`;
  D.onclick=e=>{
    if(e.target.closest("[data-close]")){const miss=x.it.v.some((v,vi)=>{const l=findLine(vKey(x.key,vi));return l&&!l.len});if(miss){toast("有 H型鋼 沒填長度（公分），請補上");return}D.close();return}
    const c=e.target.closest("[data-s]");if(c){spec=c.dataset.s==="__all"?null:c.dataset.s;D.querySelectorAll("[data-s]").forEach(z=>z.classList.toggle("on",z===c));$("#shb").innerHTML=body();return}
  };
  D.oninput=e=>{const r=e.target.closest(".vrow");if(r)save(r)};
  D.onclose=()=>{renderList()};
  D.showModal();
}
function itemDlg(key,initialSpec){
  const x=ITEMS.find(i=>i.key===key);if(x&&x.it.n==="H型鋼"&&x.g==="H型鋼"){hbDlg(x);return}const specs=[...new Set(x.it.v.map(v=>v[1]))];let spec=initialSpec||null;if(specs.length&&specs.every(z=>/^(無孔|單孔|雙孔)[36]M$/.test(z))){const HOLE_ORD=["無孔","單孔","雙孔"];specs.sort((p,q)=>HOLE_ORD.indexOf(p.slice(0,2))-HOLE_ORD.indexOf(q.slice(0,2))||p.localeCompare(q))}
  const D=$("#dlg");
  function body(){
    const rows=x.it.v.map((v,vi)=>({v,vi})).filter(r=>spec==null||r.v[1]===spec);if(x.it.n==="鍍鋅角鐵"){const ANGLE_SORT=z=>{const m=z.v[0].match(/^([\d\-\/]+)"\*([\d.]+)mm/);if(!m)return [99,0,""];const [w,f]=m[1].split("-");const inch=f?(+w+eval(f)):eval(w);return [inch,+m[2],z.v[1]]};rows.sort((p,q)=>{const A=ANGLE_SORT(p),B=ANGLE_SORT(q);return A[0]-B[0]||A[1]-B[1]||A[2].localeCompare(B[2])})}
    return rows.map(({v,vi})=>{const l=findLine(vKey(x.key,vi));const qn=l?l.qty:0;
      return `<div class="vrow ${qn?"in":""}" data-vi="${vi}"><div class="sz"><b>${esc(v[0])}</b>${specs.length>1&&spec==null||v[1]?`<small>${esc(v[1])}</small>`:""}${v[4]?`<small>${esc(v[4])}</small>`:""}</div>
      <div class="pp"><small>單位：${esc(unitFor(v[3]))}</small></div>
      <div class="step"><button data-a="-" aria-label="減少">−</button><input type="number" inputmode="decimal" min="0" value="${qn||""}" placeholder="0"><button data-a="+" aria-label="增加">＋</button></div></div>`}).join("");
  }
  function total(){return x.it.v.reduce((a,v,vi)=>{const l=findLine(vKey(x.key,vi));return a+(l?1:0)},0)}
  const _im=x.cat==="PVC另件・清潔口"?"":itemImage(x);
  if(ITEM_REMIND[x.it.n])setTimeout(()=>toast(ITEM_REMIND[x.it.n]),50);
  D.innerHTML=`<div class="sh-h"><h2>${_im?`<img src="${_im}" alt="" style="width:44px;height:44px;border-radius:10px;vertical-align:middle;margin-right:6px;border:1px solid #e5e7eb">`:ICON(x.cat)} ${esc(x.it.n)}</h2><small>${esc(menuCatalog[x.ci].n)}${isIllustration(x)?" · AI 示意圖":""}</small>${(ITEM_REMIND[x.it.n])?`<div class="remind" style="margin:8px 0 2px;padding:8px 10px;border-radius:10px;background:#fff3cd;border:1px solid #f0c36d;color:#7a4b00;font-weight:600;font-size:15px">${esc(ITEM_REMIND[x.it.n])}</div>`:""}${x.cat==="PVC另件・清潔口"?`<div id="cleanoutPhotos" style="display:flex;gap:12px">${cleanoutPhotos(spec)}</div>`:""}<button class="sh-x" data-close>✕</button>
   ${specs.length>1&&specs.length<=12?`<div class="spec-chips"><button class="chip on" data-s="__all">全部</button>${specs.map(s=>`<button class="chip" data-s="${esc(s)}">${esc(s||"一般")}</button>`).join("")}</div>`:""}</div>
   <div class="sh-b" id="shb">${body()}</div>
   <div class="sh-f"><span class="note" style="margin-right:auto;align-self:center" id="shn"></span><button class="btn btn-p" data-close>完成</button></div>`;
  const shn=()=>{$("#shn").textContent=total()?`此品項已選 ${total()} 種規格`:"輸入數量即加入叫料單"};shn();
  let changed=false;
  D.onclick=e=>{
    if(e.target.closest("[data-close]")){if(changed&&(x.g==="PVC管材"||(x.g==="PVC另件"&&!/^塑膠油/.test(x.it.n)))&&x.it.v.some((v,vi)=>findLine(vKey(x.key,vi)))){pipeBrandDlg(x);return}if(changed&&x.it.n==="塑膠油"&&x.it.v.some((v,vi)=>findLine(vKey(x.key,vi)))){brushDlg();return}if(changed&&/直角管束|牙條固定片/.test(x.it.n)&&(draft().angleClampAccessoryCounts?.[x.key]||x.it.v.some((v,vi)=>findLine(vKey(x.key,vi))))){raDlg(x);return}const g=changed?screwGroups(x):[];if(g.length){accDlg(g)}else D.close();return}
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
  D.innerHTML=`<div class="sh-h"><h2>請選擇 ${x.g==="PVC另件"?"PVC 另件":"PVC 管材"}廠牌</h2><small>${esc(x.it.n)}・套用到此品項已選的尺寸</small></div>
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
function raDlg(x){
  const D=$("#dlg");const n=x.it.v.reduce((t,v,vi)=>{const l=findLine(vKey(x.key,vi));return t+(l?+l.qty||0:0)},0);
  const UN="U型螺絲 2分（直角管束用）";
  const uq=()=>{const l=draft().lines.find(z=>z.vk==="acc|"+UN+"|2分");return l?l.qty:0};
  const uset=q=>{const d=draft();const k="acc|"+UN+"|2分";let l=d.lines.find(z=>z.vk===k);q=Math.max(0,+q||0);
    if(q<=0){if(l)d.lines=d.lines.filter(z=>z!==l)}else if(l)l.qty=q;
    else d.lines.push({id:uid(),vk:k,ik:"custom",cat:"懸吊系列",name:"U型螺絲",size:"2分(1/4\")",spec:"直角管束用",list:null,priceNote:"",unit:"支",qty:q,price:null,remark:""});
    persist();updateCart()};
  const NN="鍍鋅突緣螺帽",ND='1/4"';
  const order=draft();
   const counts=order.angleClampAccessoryCounts||{};
   // An old draft can already have a shared accessory line. Start from its saved quantities.
   const previous=counts[x.key]||(!order.angleClampAccessoryCounts?Math.min(uq(),n):0);
   const delta=n-previous;
   const UR=x.it.n==="牙條固定片"?2:1;const screwTotal=Math.max(0,uq()+delta*UR);
   const nutTotal=Math.max(0,accQty(NN,ND)+delta*2);
   const rows=[["U型螺絲 2分","直角管束用・叫料單合計",screwTotal],["凸緣螺母 2分","鍍鋅突緣螺帽 1/4\"・叫料單合計",nutTotal]];
  D.innerHTML=`<div class="sh-h"><h2>需要 2分 U型螺絲＋2分凸緣螺母嗎？</h2><small>${esc(x.it.n)} 共 ${n} 個・每個配 U型螺絲 ${UR} 支、凸緣螺母 2 個</small><button class="sh-x" data-close>✕</button></div>
   <div class="sh-b">${rows.map(([b,sm,q],ri)=>`<div class="vrow in" data-r="${ri}"><div class="sz"><b>${b}</b><small>${sm}</small></div><div class="step"><button data-a="-" aria-label="減少">−</button><input type="number" inputmode="decimal" min="0" value="${q||""}" placeholder="0"><button data-a="+" aria-label="增加">＋</button></div></div>`).join("")}</div>
   <div class="sh-f"><button class="btn" data-skip>不需要</button><button class="btn btn-p" data-ok>需要，加入</button></div>`;
  D.onclick=e=>{
    if(e.target.closest("[data-close],[data-skip]")){D.close();return}
    if(e.target.closest("[data-ok]")){const ins=D.querySelectorAll(".vrow input");order.angleClampAccessoryCounts={...counts,[x.key]:n};uset(+ins[0].value||0);accSet(NN,ND,+ins[1].value||0);toast("已更新 U型螺絲、凸緣螺母數量");D.close();return}
    const b=e.target.closest("[data-a]");if(b){const inp=b.closest(".vrow").querySelector("input");let q=(+inp.value||0)+(b.dataset.a==="+"?1:-1);inp.value=Math.max(0,q)||""}
  };
  D.oninput=null;
}
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
    <div class="nm"><b>${esc(materialName(l))} ${esc(l.size)}</b><small>${esc(lineSpec(l))}</small>
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
  projs.forEach(p=>p.orders.forEach(o=>o.lines.forEach(l=>{const name=[materialName(l),l.size,lineSpec(l)].filter(Boolean).join(" ");const k=(l.cat||"")+"|"+name+"|"+(l.unit||"");
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
  <p class="note" style="margin-top:14px;font-weight:700">＋ 新增工地</p><div class="grid"><label class="f full">工地名稱<input id="np" maxlength="50" placeholder="新工地名稱"></label><label class="f full">公司抬頭<select id="npCo">${COMPANIES.map(n=>`<option>${esc(n)}</option>`).join("")}</select></label><label class="f full">交貨地點（可不填）<input id="npAddr" maxlength="80"></label></div><div style="display:flex;justify-content:flex-end;margin-top:6px"><button type="button" class="btn btn-g" id="bNp">＋ 新增工地</button></div><p class="note" style="margin-top:16px;font-weight:700">🗑 刪除現有工地</p><div id="siteDelList">${S.projects.map(z=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #eee"><span style="flex:1">${esc(z.name)}<small style="color:#6b7280;margin-left:6px">${esc(siteCo(z.name))}</small></span><button type="button" class="btn btn-d" data-del-site="${z.id}" ${S.projects.length<2?"disabled":""} style="padding:4px 10px">刪除</button></div>`).join("")}</div></div>
  <div class="sh-f"><button type="button" class="btn btn-d" id="bDp" ${S.projects.length<2?"disabled":""}>刪除此工地</button><span style="flex:1"></span><button class="btn btn-p">儲存</button></div></form>`;
  D.oninput=null;D.onclose=null;D.onclick=e=>{if(e.target.closest("[data-close]")){D.close();return}const del=e.target.closest("[data-del-site]");if(del){const z=S.projects.find(q=>q.id===del.dataset.delSite);if(!z||S.projects.length<2)return;const n=(z.orders||[]).length;D.close();confirmDlg("刪除工地「"+z.name+"」"+(n?"與它的 "+n+" 筆叫料紀錄":"")+"？刪除後無法復原。",()=>{S.projects=S.projects.filter(q=>q!==z);if(S.cur===z.id)S.cur=S.projects[0].id;persist();renderAll();toast("已刪除工地："+z.name)})}};
  $("#bNp").onclick=()=>{const n=$("#np").value.trim();if(!n){toast("請輸入工地名稱");return}if(S.projects.some(z=>z.name===n)){toast("已經有這個工地");return}const np={id:uid(),name:n,co:$("#npCo").value,addr:$("#npAddr").value.trim(),orders:[],draft:null};S.projects.push(np);S.cur=np.id;persist();D.close();renderAll();toast("已新增工地："+n)};
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
const LN_PRE={"150磅可鍛鑄鐵零件(熱浸)":"150磅熱浸","300磅可鍛鑄鐵零件(熱浸)":"300磅熱浸","304不銹鋼牙件 150P":"304不銹鋼牙件","展性可鍛鑄鐵牙另件 150psi UL/FM（MECH）":"UL/FM","球狀石墨鑄鐵 300psi 螺紋另件 UL/FM（MECH）":"球墨鑄鐵 UL/FM","ONK Nice Joint 不鏽鋼管式接頭 SUS304":"Nice Joint","鍛鋼／碳鋼／不鏽鋼法蘭（萬蕙昇）":"萬蕙昇法蘭","迫緊墊片":"墊片","不銹鋼軟管製品、合成橡膠防震接頭":"不銹鋼軟管"};
function lineName(l){let n=lineName0(l);n=n.replace(/^滾溝另件｜(\S+) /,(m,c)=>/^秀而久/.test(l.name||"")?"":/金通/.test(c)?"金通溝槽 ":/邁克/.test(c)?"溝槽 ":"");
  let pre=LN_PRE[l.cat]||"";const fs=/^富山閥・(.+)$/.exec(l.cat||"");if(fs)pre="富山 "+fs[1];
  if(!pre&&l.cat==="不銹鋼雙壓接另件・滑動式保溫另件"&&!/^北銘/.test(n))pre="不銹鋼壓接";if(pre&&!n.startsWith(pre))n=pre+" "+n;return n}
function lineName0(l){const sp=lineSpec(l);return [materialName(l),l.size,l.size&&sp&&String(l.size).endsWith("*"+sp)?"":sp].filter(Boolean).join(" ")}
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
