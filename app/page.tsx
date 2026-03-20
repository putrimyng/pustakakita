"use client";

// Import necessary hooks from React
import React, { useState, useCallback, ReactNode } from "react";

// ——— TYPE DEFINITIONS ———————————————————————————
type Member = {
  id: number;
  name: string;
  initials: string;
  role: "coordinator" | "member";
  color: string;
  email: string;
  joined: string;
  notifEmail: boolean;
  notifApp: boolean;
};
type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  emoji: string;
  stars: number;
  desc: string;
};
type Copy = {
  id: number;
  bookId: number;
  ownerId: number;
};
type Loan = {
  id: number;
  bookId: number;
  borrowerId: number;
  ownerId: number;
  state: string;
  startDate: string | null;
  dueDate: string | null;
  method: string;
  queueIds: number[];
  message?: string;
  duration?: string;
  returnMethod?: string;
  tracking?: string;
};
type Notif = {
  id: number;
  toId: number;
  emoji: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  action?: string | null;
  loanId?: number;
};
type NavTab = {
  id: string;
  e: string;
  label: string;
};
type ScreenState = { type: string; [key:string]: any } | null;

const T = {
  cream:"#FAF7F2",paper:"#FEFCF8",warm50:"#F5EEE6",warm100:"#EDE4D8",warm200:"#D9C8B4",
  brown:"#7A3B1E",brownDk:"#5C2A12",brownLt:"#A05C30",gold:"#C87941",
  text:"#2C1A0E",textMd:"#5A3820",textSm:"#9B8470",textXs:"#B8A090",
  green:"#1A6B3A",greenBg:"#E8F5EE",orange:"#B45309",orangeBg:"#FEF3E8",
  blue:"#1D4ED8",blueBg:"#EBF3FF",red:"#B91C1C",redBg:"#FEE8E8",
  purple:"#6B21A8",purpleBg:"#F3E8FF",
};

const SEED_MEMBERS: Member[] = [
  {id:1,name:"Putri Mayang", initials:"PM",role:"coordinator",color:"#7A3B1E",email:"em@gmail.com",  joined:"Jan 2024",notifEmail:true, notifApp:true},
  {id:2,name:"Amelia",       initials:"AM",role:"member",     color:"#C87941",email:"dini@email.com",  joined:"Jan 2024",notifEmail:false,notifApp:true},
  {id:3,name:"Puty",         initials:"PU",role:"member",     color:"#A05C30",email:"rani@email.com",  joined:"Feb 2024",notifEmail:true, notifApp:true},
  {id:4,name:"Vinka",        initials:"VI",role:"member",     color:"#8B6914",email:"sari@email.com",  joined:"Jan 2024",notifEmail:false,notifApp:true},
  {id:5,name:"Meita",        initials:"ME",role:"member",     color:"#5C6E1A",email:"ayu@email.com",   joined:"Mar 2024",notifEmail:false,notifApp:true},
  {id:6,name:"Endi",         initials:"EN",role:"member",     color:"#1A5C6B",email:"nadia@email.com", joined:"Feb 2024",notifEmail:true, notifApp:true},
];

const BOOK_DEFS = [
  {id:1, title:"Normal People",           author:"Sally Rooney",      genre:"Fiction",    cover:"#F4C4A0",emoji:"🌸",stars:5,desc:"A story about the complicated love between two people from the west of Ireland."},
  {id:2, title:"Thinking, Fast and Slow", author:"Daniel Kahneman",   genre:"Non-fiction",cover:"#A0C4D8",emoji:"🧠",stars:4,desc:"Kahneman reveals where we can and cannot trust our intuitions."},
  {id:3, title:"Pachinko",                author:"Min Jin Lee",        genre:"Fiction",    cover:"#B5D4A0",emoji:"🌿",stars:5,desc:"A powerful saga of an immigrant family across four generations."},
  {id:4, title:"The Midnight Library",    author:"Matt Haig",          genre:"Fiction",    cover:"#C4B0E8",emoji:"🌙",stars:4,desc:"Between life and death there is a library with infinite shelves."},
  {id:5, title:"Educated",               author:"Tara Westover",      genre:"Memoir",     cover:"#E8D4A0",emoji:"🌾",stars:5,desc:"A memoir about a young girl who earns a PhD from Cambridge University."},
  {id:6, title:"The Kite Runner",         author:"Khaled Hosseini",    genre:"Fiction",    cover:"#E8C4A0",emoji:"🪁",stars:4,desc:"An unforgettable story of the friendship between a wealthy boy and his servant's son."},
  {id:7, title:"Demon Copperhead",        author:"Barbara Kingsolver", genre:"Fiction",    cover:"#F0A0A0",emoji:"🦅",stars:5,desc:"A Pulitzer Prize-winning novel set in the mountains of Appalachia."},
  {id:8, title:"Crying in H Mart",        author:"Michelle Zauner",    genre:"Memoir",     cover:"#FFD4A0",emoji:"🍜",stars:5,desc:"A memoir about losing her Korean mother and finding herself through food."},
  {id:9, title:"Klara and the Sun",       author:"Kazuo Ishiguro",     genre:"Fiction",    cover:"#A0D8C4",emoji:"☀️",stars:4,desc:"A luminous novel about what it means to love."},
  {id:10,title:"Lessons in Chemistry",    author:"Bonnie Garmus",      genre:"Fiction",    cover:"#A0C4A0",emoji:"⚗️",stars:5,desc:"A female chemist becomes the star of a 1960s cooking show."},
  {id:11,title:"Bewilderment",            author:"Richard Powers",     genre:"Fiction",    cover:"#A0B4D8",emoji:"🌌",stars:4,desc:"A father raises his neurodivergent son after losing his wife."},
  {id:12,title:"Tomorrow & Tomorrow",     author:"Jonathan Tropper",   genre:"Fiction",    cover:"#D4A0C4",emoji:"🎮",stars:3,desc:"A love story set inside a video game."},
];

const SEED_COPIES = [
  {id:1,bookId:1,ownerId:2},{id:2,bookId:1,ownerId:4},
  {id:3,bookId:2,ownerId:3},{id:4,bookId:3,ownerId:4},{id:5,bookId:3,ownerId:6},
  {id:6,bookId:4,ownerId:1},{id:7,bookId:5,ownerId:1},{id:8,bookId:6,ownerId:1},
  {id:9,bookId:7,ownerId:4},{id:10,bookId:8,ownerId:2},{id:11,bookId:9,ownerId:6},
  {id:12,bookId:10,ownerId:5},{id:13,bookId:11,ownerId:6},{id:14,bookId:12,ownerId:5},
];

const SEED_LOANS = [
  {id:1,bookId:4, borrowerId:5,ownerId:1,state:"active",          startDate:"Mar 1", dueDate:"Mar 29",method:"meeting", queueIds:[]},
  {id:2,bookId:2, borrowerId:1,ownerId:3,state:"active",          startDate:"Mar 5", dueDate:"Apr 5", method:"shipping",queueIds:[]},
  {id:3,bookId:9, borrowerId:4,ownerId:6,state:"overdue",         startDate:"Feb 10",dueDate:"Mar 10",method:"meeting", queueIds:[2]},
  {id:4,bookId:7, borrowerId:2,ownerId:4,state:"in_transit",      startDate:"Mar 18",dueDate:"Apr 15",method:"shipping",queueIds:[]},
  {id:5,bookId:11,borrowerId:3,ownerId:6,state:"pending_meeting", startDate:null,    dueDate:null,    method:"meeting", queueIds:[1,5]},
  {id:6,bookId:8, borrowerId:1,ownerId:2,state:"return_initiated",startDate:"Feb 20",dueDate:"Mar 20",method:"meeting", queueIds:[],returnMethod:"meeting"},
];

const SEED_NOTIFS = [
  {id:1,toId:1,emoji:"📬",title:"Endi wants to borrow Lessons in Chemistry", body:"Tap to approve or decline.",                         time:"2h ago",   read:false,action:"approve_request",loanId:5},
  {id:2,toId:1,emoji:"⚠️",title:"The Midnight Library is overdue",           body:"Meita has had it since Mar 1. Time to follow up.",   time:"5h ago",   read:false,action:"overdue_owner",  loanId:1},
  {id:3,toId:1,emoji:"📬",title:"Puty is returning Crying in H Mart",        body:"She'll bring it to the next meeting. Confirm when you have it.",time:"Yesterday",read:false,action:"confirm_return",loanId:6},
  {id:4,toId:1,emoji:"🎉",title:"Your borrow request was approved!",          body:"Amelia will bring Normal People to the next meeting.", time:"2d ago",   read:true, action:null},
  {id:5,toId:1,emoji:"🧍",title:"Meita joined your queue for Klara and the Sun",body:"She's #2 after Vinka.",                             time:"3d ago",   read:true, action:null},
];

const MOCK_ISBN = {
  "9780593311042":{title:"The Women",        author:"Kristin Hannah", genre:"Fiction",cover:"#F4D0B0",emoji:"🌺"},
  "9780525559474":{title:"Intermezzo",        author:"Sally Rooney",   genre:"Fiction",cover:"#D0E8F4",emoji:"🎹"},
  "default":       {title:"Cantik itu Luka",  author:"Eka Kurniawan",  genre:"Fiction",cover:"#D0F4E0",emoji:"🌴"},
};

const COVER_PAL  = ["#F4C4A0","#A0C4D8","#B5D4A0","#C4B0E8","#E8D4A0","#F0A0A0","#FFD4A0","#A0D8C4","#A0C4A0","#D4A0C4","#F4D0B0","#D0E8F4"];
const COVER_EMO  = ["📖","🌸","🌿","🌙","🌾","🦋","🌺","☀️","🎭","🌊","🏔️","🎪","🦚","🌻","🎨"];
const ST_LABEL   = {requested:"Requested",approved:"Approved",pending_meeting:"Pending handoff",in_transit:"In transit",active:"Active",overdue:"Overdue ⚠️",extend_requested:"Extension asked",return_initiated:"Being returned",returned:"Returned"};
const ST_COLOR   = {requested:"blue",approved:"blue",pending_meeting:"purple",in_transit:"orange",active:"green",overdue:"red",extend_requested:"orange",return_initiated:"purple",returned:"green"};

// Tambahkan tanda kurung dan tipe data (: any)
const getBook    = (id: any) => BOOK_DEFS.find(b => b.id === id);
const getMember  = (id: any, members: any[]) => members.find(m => m.id === id) || SEED_MEMBERS[0];
const isLentFn   = (copy: any, loans: any[]) => loans.some(l => l.bookId === copy.bookId && l.ownerId === copy.ownerId);
const getLoanFn  = (copy: any, loans: any[]) => loans.find(l => l.bookId === copy.bookId && l.ownerId === copy.ownerId);

const Stars = ({n,size=12}) => <span style={{color:T.gold,fontSize:size,letterSpacing:-1}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
const Avatar = ({member,size=36}) => <div style={{width:size,height:size,borderRadius:"50%",background:member?.color||T.brown,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:700,flexShrink:0}}>{member?.initials||"?"}</div>;
const Badge = ({children,color="brown"}) => { const m={green:[T.greenBg,T.green],orange:[T.orangeBg,T.orange],brown:[T.warm50,T.brownDk],blue:[T.blueBg,T.blue],red:[T.redBg,T.red],purple:[T.purpleBg,T.purple]}; const [bg,fg]=m[color]||m.brown; return <span style={{display:"inline-block",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:bg,color:fg,whiteSpace:"nowrap"}}>{children}</span>; };
const Btn = ({children,variant="primary",onClick,disabled,small,fullWidth=true}) => { const v={primary:{background:T.brown,color:"#fff",border:"none"},secondary:{background:"transparent",color:T.brown,border:`1.5px solid ${T.brown}`},ghost:{background:T.warm50,color:T.brownDk,border:"none"},danger:{background:T.redBg,color:T.red,border:`1.5px solid ${T.red}`},success:{background:T.greenBg,color:T.green,border:`1.5px solid ${T.green}`}}; return <button onClick={onClick} disabled={disabled} style={{...v[variant]||v.primary,borderRadius:12,padding:small?"7px 14px":"12px 16px",fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:fullWidth?"100%":"auto",fontFamily:"'DM Sans',sans-serif",opacity:disabled?.5:1,transition:"opacity 0.15s"}}>{children}</button>; };
const BookCover = ({book,size=48}) => <div style={{width:size,height:size*1.4,borderRadius:6,flexShrink:0,background:book?.cover||T.warm100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,boxShadow:"2px 3px 10px rgba(0,0,0,0.12)"}}>{book?.emoji||"📖"}</div>;
const Divider = () => <div style={{height:1,background:T.warm100,margin:"0 20px"}}/>;
const SectionTitle = ({children}) => <div style={{fontSize:11,fontWeight:700,color:T.textSm,textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 20px 8px"}}>{children}</div>;
const Chip = ({children,active,onClick}) => <span onClick={onClick} style={{display:"inline-block",padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",border:active?"none":`1px solid ${T.warm200}`,background:active?T.brown:"transparent",color:active?"#fff":T.textSm,transition:"all 0.15s"}}>{children}</span>;
const Input = ({value,onChange,placeholder,multiline,rows=3,type="text"}) => { const b={width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${T.warm200}`,background:T.cream,fontSize:14,color:T.text,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}; return multiline?<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...b,resize:"none"}}/>:<input type={type} value={value} onChange={onChange} placeholder={placeholder} style={b}/>; };
const Label = ({children}) => <div style={{fontSize:12,fontWeight:600,color:T.brown,marginBottom:5}}>{children}</div>;
const FG = ({label,children}) => <div style={{marginBottom:16}}><Label>{label}</Label>{children}</div>;
const PageHeader = ({title,sub,onBack,right}) => <div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`,background:T.paper}}><div style={{display:"flex",alignItems:"center",gap:10}}>{onBack&&<button onClick={onBack} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.brown,padding:0,lineHeight:1}}>←</button>}<div style={{flex:1}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:onBack?18:22,fontWeight:700,color:T.text,margin:0,lineHeight:1.2}}>{title}</h1>{sub&&<p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>{sub}</p>}</div>{right}</div></div>;

const LoanTimeline = ({state}) => {
  const idx={approved:0,pending_meeting:1,in_transit:1,active:2,overdue:2,extend_requested:2,return_initiated:3,returned:3};
  const cur=idx[state]??0; const labels=["Approved","Handoff","Active","Returned"];
  return <div style={{display:"flex",alignItems:"center",padding:"10px 20px 4px",gap:0}}>{labels.map((lbl,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:i<labels.length-1?1:0}}><div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,background:i<=cur?T.brown:T.warm100,border:`2px solid ${i<=cur?T.brown:T.warm200}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{i<cur&&<span style={{color:"#fff",fontSize:9}}>✓</span>}{i===cur&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}</div><div style={{position:"relative"}}><div style={{fontSize:8.5,color:i<=cur?T.brownDk:T.textXs,fontWeight:i===cur?700:400,position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap"}}>{lbl}</div></div>{i<labels.length-1&&<div style={{flex:1,height:2,background:i<cur?T.brown:T.warm100,margin:"0 3px"}}/>}</div>)}</div>;
};

// ── AUTH SCREENS ──────────────────────────────────────────────────────────────
function LoginScreen({onLogin,onGoRegister}) {
  const [email,setEmail]=useState("em@gmail.com"); const [pass,setPass]=useState("password"); const [err,setErr]=useState("");
  const submit=()=>{ const f=SEED_MEMBERS.find(m=>m.email===email.trim()); f?onLogin(f):setErr("No account found with that email."); };
  return <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
    <div style={{background:`linear-gradient(160deg,${T.brown} 0%,${T.brownLt} 100%)`,padding:"48px 32px 36px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>📚</div>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#fff",margin:"0 0 6px",fontWeight:700}}>Pustaka Kita</h1>
      <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,margin:0}}>Our little book club library</p>
    </div>
    <div style={{flex:1,padding:"32px 24px"}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 24px"}}>Welcome back 👋</h2>
      <FG label="Email"><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email"/></FG>
      <FG label="Password"><Input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password"/></FG>
      {err&&<div style={{background:T.redBg,color:T.red,borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:16}}>{err}</div>}
      <Btn variant="primary" onClick={submit}>Sign in →</Btn>
      <div style={{textAlign:"center",marginTop:20,fontSize:13,color:T.textSm}}>Don't have an account?{" "}<span onClick={onGoRegister} style={{color:T.brown,fontWeight:600,cursor:"pointer"}}>Register here</span></div>
      <div style={{marginTop:20,background:T.warm50,borderRadius:12,padding:"12px 14px",fontSize:12,color:T.textSm}}>💡 <strong>Demo:</strong> Email pre-filled as Putri Mayang (coordinator). Just tap Sign in.</div>
    </div>
  </div>;
}

function RegisterScreen({onRegister,onGoLogin}) {
  const [step,setStep]=useState(0); const [code,setCode]=useState(""); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  const verifyCode=()=>{ code.trim().toUpperCase()==="BUKU2024"?(setErr(""),setStep(1)):setErr("Invalid invite code. Ask your coordinator."); };
  const submit=()=>{ if(!name.trim()||!email.trim()||!pass.trim()){setErr("Please fill all fields.");return;} const nm=name.trim(); onRegister({id:Date.now(),name:nm,initials:nm.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),role:"member",color:T.brownLt,email:email.trim(),joined:"Mar 2024",notifEmail:true,notifApp:true}); };
  return <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
    <div style={{background:`linear-gradient(160deg,${T.brown} 0%,${T.brownLt} 100%)`,padding:"40px 32px 28px",textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>📚</div>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#fff",margin:0}}>Join Pustaka Kita</h1>
    </div>
    <div style={{flex:1,padding:"24px"}}>
      <div style={{display:"flex",gap:8,marginBottom:24}}>{["Invite code","Your details"].map((s,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?T.brown:T.warm100}}/>)}</div>
      {step===0&&<>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.text,margin:"0 0 6px"}}>Enter your invite code</h2>
        <p style={{fontSize:13,color:T.textSm,margin:"0 0 20px",lineHeight:1.6}}>Your coordinator shared a link or code. Only members can join.</p>
        <FG label="Invite code"><Input value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. BUKU2024"/></FG>
        {err&&<div style={{background:T.redBg,color:T.red,borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:16}}>{err}</div>}
        <Btn variant="primary" onClick={verifyCode}>Verify →</Btn>
        <div style={{marginTop:14,background:T.warm50,borderRadius:10,padding:"10px 12px",fontSize:12,color:T.textSm}}>💡 Demo code: <strong>BUKU2024</strong></div>
      </>}
      {step===1&&<>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.text,margin:"0 0 6px"}}>Tell us about yourself</h2>
        <p style={{fontSize:13,color:T.textSm,margin:"0 0 20px"}}>This is how you'll appear to other members.</p>
        <FG label="Full name"><Input value={name}  onChange={e=>setName(e.target.value)}  placeholder="e.g. Wulandari Putri"/></FG>
        <FG label="Email">    <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email"/></FG>
        <FG label="Password"> <Input value={pass}  onChange={e=>setPass(e.target.value)}  placeholder="Min. 8 characters" type="password"/></FG>
        {err&&<div style={{background:T.redBg,color:T.red,borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:16}}>{err}</div>}
        <Btn variant="primary" onClick={submit}>Create account →</Btn>
      </>}
      <div style={{textAlign:"center",marginTop:20,fontSize:13,color:T.textSm}}>Already have an account?{" "}<span onClick={onGoLogin} style={{color:T.brown,fontWeight:600,cursor:"pointer"}}>Sign in</span></div>
    </div>
  </div>;
}

function OnboardingScreen({me,onFinish,onAddBook}) {
  const [step,setStep]=useState(0);
  const slides=[
    {e:"📚",t:"Welcome to Pustaka Kita!",b:`Hi ${me.name.split(" ")[0]}! This is your book club's lending library. Browse what everyone owns, request to borrow, and share your own books with the club.`},
    {e:"🔄",t:"How borrowing works",b:"Request a copy → owner approves → agree on handoff (meeting or shipped) → loan starts → you return it when done. Simple and friendly."},
    {e:"📖",t:"Start by adding your books",b:"List the books you're willing to lend. Others can discover and request them. You approve every request — you stay in control."},
  ];
  const s=slides[step];
  return <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
    <div style={{background:`linear-gradient(160deg,${T.brown} 0%,${T.brownLt} 100%)`,padding:"48px 32px 36px",textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:12}}>{s.e}</div>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#fff",margin:"0 0 12px",fontWeight:700}}>{s.t}</h1>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.7}}>{s.b}</p>
    </div>
    <div style={{flex:1,padding:"32px 24px",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32}}>
        {slides.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?T.brown:T.warm100,transition:"all 0.2s"}}/>)}
      </div>
      <div style={{marginTop:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {step<slides.length-1?<Btn variant="primary" onClick={()=>setStep(step+1)}>Next →</Btn>:<>
          <Btn variant="primary" onClick={onAddBook}>+ Add my first book</Btn>
          <Btn variant="ghost"   onClick={onFinish}>Browse catalog first</Btn>
        </>}
        {step>0&&<Btn variant="ghost" onClick={()=>setStep(step-1)}>← Back</Btn>}
      </div>
    </div>
  </div>;
}

// ── ADD / EDIT BOOK ───────────────────────────────────────────────────────────
function AddBookScreen({onBack,onSave,me,existingBook=null}) {
  const editing=!!existingBook;
  const [mode,setMode]=useState("isbn"); const [isbn,setIsbn]=useState(""); const [found,setFound]=useState(existingBook?{...existingBook}:null);
  const [title,setTitle]=useState(existingBook?.title||""); const [author,setAuthor]=useState(existingBook?.author||"");
  const [genre,setGenre]=useState(existingBook?.genre||"Fiction"); const [avail,setAvail]=useState(true);
  const [cover,setCover]=useState(existingBook?.cover||COVER_PAL[0]); const [emoji,setEmoji]=useState(existingBook?.emoji||COVER_EMO[0]);
  const [searching,setSearching]=useState(false); const [done,setDone]=useState(false);
  const doSearch=()=>{ setSearching(true); setTimeout(()=>{ const r=MOCK_ISBN[isbn.trim()]||MOCK_ISBN["default"]; setFound(r);setTitle(r.title);setAuthor(r.author);setGenre(r.genre);setCover(r.cover);setEmoji(r.emoji);setSearching(false); },800); };
  const save=()=>{ if(!title.trim())return; onSave({title:title.trim(),author:author.trim(),genre,cover,emoji,available:avail,ownerId:me.id}); setDone(true); };
  const showFields=mode==="manual"||editing||found;
  if(done)return <><PageHeader title={editing?"Book updated!":"Book added!"} onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>🎉</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>{title} is now in the club!</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 32px"}}>{avail?"Other members can find and request it.":"Marked as unavailable for now."}</p><Btn variant="primary" onClick={onBack}>Back to shelf</Btn></div></>;
  return <><PageHeader title={editing?"Edit book":"Add a book"} onBack={onBack}/>
    <div style={{padding:"0 0 20px"}}>
      {!editing&&<div style={{padding:"14px 20px 10px",display:"flex",gap:8}}><Chip active={mode==="isbn"} onClick={()=>setMode("isbn")}>🔍 Search / ISBN</Chip><Chip active={mode==="manual"} onClick={()=>setMode("manual")}>✏️ Manual</Chip></div>}
      {mode==="isbn"&&!editing&&<div style={{padding:"0 20px 4px"}}>
        <Label>ISBN or book title</Label>
        <div style={{display:"flex",gap:8,marginBottom:8}}><Input value={isbn} onChange={e=>setIsbn(e.target.value)} placeholder="9780593311042 or 'The Women'"/><button onClick={doSearch} style={{background:T.brown,color:"#fff",border:"none",borderRadius:12,padding:"12px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{searching?"…":"Search"}</button></div>
        <p style={{fontSize:11,color:T.textXs,margin:"0 0 14px"}}>Try: <strong>9780593311042</strong> for a demo auto-fill 📚</p>
        {found&&<div style={{background:T.warm50,borderRadius:14,padding:"14px",marginBottom:14,border:`1.5px solid ${T.warm100}`}}><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}><BookCover book={found} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text}}>{found.title}</div><div style={{fontSize:12,color:T.textSm}}>{found.author}</div><Badge color="brown">{found.genre}</Badge></div></div><div style={{fontSize:12,color:T.green}}>✓ Auto-filled from Open Library</div></div>}
      </div>}
      <div style={{padding:"0 20px"}}>
        {showFields&&<>
          <FG label="Title"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Book title"/></FG>
          <FG label="Author"><Input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author name"/></FG>
          <FG label="Genre"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Fiction","Non-fiction","Memoir","Poetry","Self-help","Other"].map(g=><Chip key={g} active={genre===g} onClick={()=>setGenre(g)}>{g}</Chip>)}</div></FG>
          <FG label="Cover colour"><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{COVER_PAL.map(c=><div key={c} onClick={()=>setCover(c)} style={{width:28,height:28,borderRadius:6,background:c,cursor:"pointer",border:`2px solid ${cover===c?T.brown:"transparent"}`}}/>)}</div></FG>
          <FG label="Cover emoji"><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{COVER_EMO.map(em=><span key={em} onClick={()=>setEmoji(em)} style={{fontSize:22,cursor:"pointer",padding:"4px",borderRadius:8,border:`2px solid ${emoji===em?T.brown:"transparent"}`,background:emoji===em?T.warm50:"transparent"}}>{em}</span>)}</div></FG>
          <div style={{background:cover+"55",borderRadius:14,padding:"14px",display:"flex",gap:12,alignItems:"center",marginBottom:16}}><BookCover book={{cover,emoji}} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text}}>{title||"Book title"}</div><div style={{fontSize:12,color:T.textSm}}>{author||"Author"}</div><Badge color="brown">{genre}</Badge></div></div>
          <FG label="Availability right now"><div style={{display:"flex",gap:8}}>
            {[{v:true,e:"✓",l:"Available to lend",c:T.green,bg:T.greenBg},{v:false,e:"⏸",l:"Not right now",c:T.orange,bg:T.orangeBg}].map(opt=><div key={String(opt.v)} onClick={()=>setAvail(opt.v)} style={{flex:1,padding:"10px 8px",borderRadius:12,fontSize:12,fontWeight:500,cursor:"pointer",textAlign:"center",border:`${avail===opt.v?"2px":"1.5px"} solid ${avail===opt.v?opt.c:T.warm200}`,background:avail===opt.v?opt.bg:"transparent",color:avail===opt.v?opt.c:T.textSm}}><div style={{fontSize:18,marginBottom:4}}>{opt.e}</div>{opt.l}</div>)}
          </div></FG>
          <Btn variant="primary" disabled={!title.trim()} onClick={save}>{editing?"Save changes ✓":"Add to club library 📚"}</Btn>
        </>}
      </div>
    </div>
  </>;
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfileScreen({me,members,copies,onBack,onLogout,onUpdate}) {
  const [name,setName]=useState(me.name); const [notifEmail,setNE]=useState(me.notifEmail); const [notifApp,setNA]=useState(me.notifApp); const [saved,setSaved]=useState(false);
  const myBooks=copies.filter(c=>c.ownerId===me.id);
  const save=()=>{ onUpdate({...me,name:name.trim(),notifEmail,notifApp}); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return <><PageHeader title="Profile & Settings" onBack={onBack}/>
    <div>
      <div style={{padding:"24px 20px",display:"flex",alignItems:"center",gap:16,background:T.warm50,borderBottom:`1px solid ${T.warm100}`}}>
        <Avatar member={{...me,name}} size={60}/>
        <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:T.text}}>{name}</div><div style={{fontSize:12,color:T.textSm}}>{me.email}</div><Badge color={me.role==="coordinator"?"brown":"blue"}>{me.role==="coordinator"?"Coordinator":"Member"}</Badge><div style={{fontSize:11,color:T.textXs,marginTop:4}}>Member since {me.joined}</div></div>
      </div>
      <div style={{display:"flex"}}>
        {[{n:myBooks.length,l:"Books listed"},{n:myBooks.length,l:"In the pool"}].map((s,i)=><div key={i} style={{flex:1,padding:"14px 20px",textAlign:"center",borderRight:i<1?`1px solid ${T.warm100}`:"none",borderBottom:`1px solid ${T.warm100}`}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.brown}}>{s.n}</div><div style={{fontSize:11,color:T.textSm,marginTop:2}}>{s.l}</div></div>)}
      </div>
      <SectionTitle>Edit profile</SectionTitle>
      <div style={{padding:"0 20px"}}><FG label="Display name"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></FG></div>
      <SectionTitle>Notifications</SectionTitle>
      <div style={{padding:"0 20px"}}>
        {[{label:"In-app",sub:"Alerts inside the app",val:notifApp,set:setNA},{label:"Email",sub:"Get emails for key events",val:notifEmail,set:setNE}].map(opt=><div key={opt.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.warm50}`}}>
          <div><div style={{fontSize:14,fontWeight:500,color:T.text}}>{opt.label} notifications</div><div style={{fontSize:12,color:T.textSm,marginTop:2}}>{opt.sub}</div></div>
          <div onClick={()=>opt.set(!opt.val)} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:opt.val?T.brown:T.warm200,transition:"background 0.2s",position:"relative"}}><div style={{position:"absolute",top:3,left:opt.val?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/></div>
        </div>)}
      </div>
      <div style={{padding:"4px 20px 16px"}}>{saved?<div style={{background:T.greenBg,color:T.green,borderRadius:12,padding:"12px 16px",fontSize:14,fontWeight:600,textAlign:"center"}}>✓ Saved!</div>:<Btn variant="primary" onClick={save}>Save changes</Btn>}</div>
      <Divider/>
      <div style={{padding:"16px 20px"}}><Btn variant="danger" onClick={onLogout}>Sign out</Btn></div>
    </div>
  </>;
}

// ── COORDINATOR PANEL ─────────────────────────────────────────────────────────
function CoordinatorScreen({me,members,setMembers,copies,loans,onBack}) {
  const [tab,setTab]=useState("members"); const [copied,setCopied]=useState(false);
  const copyLink=()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return <><PageHeader title="Coordinator Panel" sub="Club management" onBack={onBack}/>
    <div style={{padding:"10px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}><div style={{display:"flex",gap:8}}><Chip active={tab==="members"} onClick={()=>setTab("members")}>Members</Chip><Chip active={tab==="invite"} onClick={()=>setTab("invite")}>Invite</Chip><Chip active={tab==="activity"} onClick={()=>setTab("activity")}>Activity</Chip></div></div>
    {tab==="members"&&<div>{members.map(m=><div key={m.id} style={{padding:"12px 20px",borderBottom:`1px solid ${T.warm50}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar member={m} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{m.name}</div><div style={{fontSize:11,color:T.textSm}}>{m.email} · {copies.filter(c=>c.ownerId===m.id).length} books</div></div><Badge color={m.role==="coordinator"?"brown":"blue"}>{m.role==="coordinator"?"Coord.":"Member"}</Badge></div>
      {m.id!==me.id&&<div style={{display:"flex",gap:8,marginTop:10}}>{m.role!=="coordinator"&&<Btn variant="ghost" small onClick={()=>setMembers(p=>p.map(x=>x.id===m.id?{...x,role:"coordinator"}:x))}>⬆ Make coordinator</Btn>}<Btn variant="danger" small onClick={()=>setMembers(p=>p.filter(x=>x.id!==m.id))}>Remove</Btn></div>}
    </div>)}</div>}
    {tab==="invite"&&<div style={{padding:"20px"}}>
      <div style={{background:T.warm50,borderRadius:16,padding:"20px",textAlign:"center",marginBottom:20}}><div style={{fontSize:40,marginBottom:12}}>🔗</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:T.text,marginBottom:8}}>Club invite link</div><div style={{background:"#fff",borderRadius:10,padding:"10px 14px",fontSize:12,color:T.textMd,wordBreak:"break-all",border:`1px solid ${T.warm100}`,marginBottom:14}}>pustakakita.app/join?code=BUKU2024</div><Btn variant="primary" onClick={copyLink}>{copied?"✓ Copied!":"Copy link"}</Btn></div>
      <div style={{background:T.warm50,borderRadius:12,padding:"14px",fontSize:13,color:T.textMd,lineHeight:1.6}}>Share this link with the woman you want to invite. She enters the code <strong>BUKU2024</strong>, fills in her details, and she's in.</div>
    </div>}
    {tab==="activity"&&<div>
      <SectionTitle>All active loans</SectionTitle>
      {loans.filter(l=>["active","overdue","in_transit","pending_meeting","return_initiated"].includes(l.state)).map(l=>{
        const book=getBook(l.bookId); const borrower=getMember(l.borrowerId,members); const owner=getMember(l.ownerId,members); const isOver=l.state==="overdue";
        return <div key={l.id} style={{padding:"12px 20px",borderBottom:`1px solid ${T.warm50}`,background:isOver?"#FFF8F8":"transparent"}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{book?.title}</div><div style={{fontSize:12,color:T.textSm,marginTop:2}}>{borrower.name.split(" ")[0]} ← {owner.name.split(" ")[0]}{isOver&&<span style={{color:T.red,fontWeight:600}}> · OVERDUE</span>}</div>{l.dueDate&&<div style={{fontSize:11,color:isOver?T.red:T.textXs}}>Due {l.dueDate}</div>}</div>;
      })}
    </div>}
  </>;
}

// ── OWNER CONFIRM RETURN ──────────────────────────────────────────────────────
function ConfirmReturnScreen({loan,members,onBack,onConfirm}) {
  const book=getBook(loan.bookId); const borrower=getMember(loan.borrowerId,members); const [done,setDone]=useState(false);
  if(done)return <><PageHeader title="Return confirmed!" onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>✅</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>{book.title} is back on your shelf!</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 12px"}}>{borrower.name.split(" ")[0]} has been notified. The loan is officially closed.</p>{(loan.queueIds||[]).length>0&&<div style={{background:T.greenBg,borderRadius:12,padding:"12px 16px",fontSize:13,color:T.green,marginBottom:20}}>🧍 <strong>{getMember(loan.queueIds[0],members).name.split(" ")[0]}</strong> was next in queue — they've been notified!</div>}<Btn variant="primary" onClick={onBack}>Done</Btn></div></>;
  return <><PageHeader title="Confirm you received it" onBack={onBack}/>
    <div style={{padding:"20px"}}>
      <div style={{background:book.cover+"44",borderRadius:16,padding:"16px",display:"flex",gap:14,alignItems:"center",marginBottom:24}}><BookCover book={book} size={60}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:12,color:T.textSm,marginTop:4}}>Returned by <strong>{borrower.name}</strong></div><div style={{fontSize:12,color:T.textSm,marginTop:2}}>Via: {loan.returnMethod==="meeting"?"☕ At the meeting":"📦 Shipped back"}</div></div></div>
      <div style={{background:T.warm50,borderRadius:12,padding:"14px 16px",fontSize:13,color:T.textMd,lineHeight:1.6,marginBottom:24}}>Check the book is in good condition before confirming. Once done, the loan closes{(loan.queueIds||[]).length>0?` and ${getMember(loan.queueIds[0],members).name.split(" ")[0]} will be notified it's available`:""}.
      </div>
      {(loan.queueIds||[]).length>0&&<div style={{background:T.blueBg,borderRadius:12,padding:"12px 14px",fontSize:12,color:T.blue,marginBottom:20}}>🧍 {loan.queueIds.length} member{loan.queueIds.length>1?"s":""} waiting in queue after this</div>}
      <Btn variant="success" onClick={()=>{ onConfirm(); setDone(true); }}>✓ Yes, I have it back</Btn>
      <div style={{marginTop:10}}><Btn variant="ghost">Haven't received it yet</Btn></div>
    </div>
  </>;
}

// ── DELIVERY / EXTEND / RETURN helpers ───────────────────────────────────────
function DeliveryScreen({loan,members,onBack,onConfirm}) {
  const book=getBook(loan.bookId); const borrower=getMember(loan.borrowerId,members);
  const [method,setMethod]=useState(null); const [tracking,setTracking]=useState(""); const [done,setDone]=useState(false);
  if(done)return <><PageHeader title="Done!" onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>{method==="meeting"?"☕":"📦"}</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>{method==="meeting"?"Set for next meeting!":"Marked as shipped!"}</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 32px"}}>{borrower.name.split(" ")[0]} has been notified.</p><Btn variant="primary" onClick={onBack}>Done</Btn></div></>;
  return <><PageHeader title="How will she get it?" onBack={onBack}/>
    <div style={{padding:"20px"}}>
      <div style={{display:"flex",gap:12,alignItems:"center",background:book.cover+"44",padding:"14px",borderRadius:14,marginBottom:24}}><BookCover book={book} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:12,color:T.textSm}}>Approved for {borrower.name}</div></div></div>
      {[{id:"meeting",e:"☕",t:"At the next meeting",s:"She picks it up when we meet."},{id:"shipping",e:"📦",t:"Ship it",s:"Send now, she confirms receipt."}].map(opt=><div key={opt.id} onClick={()=>setMethod(opt.id)} style={{padding:"14px 16px",borderRadius:14,cursor:"pointer",marginBottom:10,border:`${method===opt.id?"2px":"1.5px"} solid ${method===opt.id?T.brown:T.warm200}`,background:method===opt.id?T.warm50:"#fff"}}><div style={{fontSize:20,marginBottom:6}}>{opt.e}</div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{opt.t}</div><div style={{fontSize:12,color:T.textSm,marginTop:3}}>{opt.s}</div></div>)}
      {method==="shipping"&&<FG label="Tracking number (optional)"><Input value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. JNE-88123456"/></FG>}
      <Btn variant="primary" disabled={!method} onClick={()=>{ onConfirm(method,tracking); setDone(true); }}>Confirm →</Btn>
    </div>
  </>;
}

function ExtendScreen({loan,isOwner,members,onBack,onConfirm}) {
  const book=getBook(loan.bookId); const other=getMember(isOwner?loan.borrowerId:loan.ownerId,members);
  const [nd,setNd]=useState(""); const [done,setDone]=useState(false);
  if(done)return <><PageHeader title="Extended!" onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>📅</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>New due date: {nd}</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 32px"}}>Both you and {other.name.split(" ")[0]} have been notified.</p><Btn variant="primary" onClick={onBack}>Done</Btn></div></>;
  return <><PageHeader title="Extend loan" onBack={onBack}/>
    <div style={{padding:"20px"}}>
      <div style={{display:"flex",gap:12,alignItems:"center",background:book.cover+"44",padding:"14px",borderRadius:14,marginBottom:20}}><BookCover book={book} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:12,color:T.textSm}}>Current due date: <strong>{loan.dueDate}</strong></div></div></div>
      <div style={{background:T.warm50,borderRadius:12,padding:"12px 14px",marginBottom:20,fontSize:13,color:T.textMd,lineHeight:1.6}}>💡 Agree with {other.name.split(" ")[0]} on WhatsApp first, then record the new date here to keep the app in sync.</div>
      <Label>New due date</Label>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>{["Apr 12","Apr 19","Apr 26","May 3"].map(d=><div key={d} onClick={()=>setNd(d)} style={{padding:"9px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:500,border:`${nd===d?"2px":"1.5px"} solid ${nd===d?T.brown:T.warm200}`,background:nd===d?T.warm50:"#fff",color:nd===d?T.brown:T.textSm}}>{d}</div>)}</div>
      <Btn variant="primary" disabled={!nd} onClick={()=>{ onConfirm(nd); setDone(true); }}>✓ Confirm: {nd||"—"}</Btn>
    </div>
  </>;
}

function ReturnScreen({loan,members,onBack,onConfirm}) {
  const book=getBook(loan.bookId); const owner=getMember(loan.ownerId,members);
  const [method,setMethod]=useState(null); const [done,setDone]=useState(false);
  if(done)return <><PageHeader title="Return initiated!" onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>📬</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>{owner.name.split(" ")[0]} has been notified!</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 32px"}}>{method==="meeting"?"Bring it to the next meeting.":"She'll confirm once she receives it."}</p><Btn variant="primary" onClick={onBack}>Done</Btn></div></>;
  return <><PageHeader title="Return this book" onBack={onBack}/>
    <div style={{padding:"20px"}}>
      <div style={{display:"flex",gap:12,alignItems:"center",background:book.cover+"44",padding:"14px",borderRadius:14,marginBottom:24}}><BookCover book={book} size={48}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:12,color:T.textSm}}>Returning to {owner.name}</div></div></div>
      {[{id:"meeting",e:"☕",t:"At the next meeting",s:"Bring it along, she confirms there."},{id:"shipping",e:"📦",t:"Ship it back",s:"She confirms when it arrives."}].map(opt=><div key={opt.id} onClick={()=>setMethod(opt.id)} style={{padding:"14px 16px",borderRadius:14,cursor:"pointer",marginBottom:10,border:`${method===opt.id?"2px":"1.5px"} solid ${method===opt.id?T.brown:T.warm200}`,background:method===opt.id?T.warm50:"#fff"}}><div style={{fontSize:20,marginBottom:6}}>{opt.e}</div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{opt.t}</div><div style={{fontSize:12,color:T.textSm,marginTop:3}}>{opt.s}</div></div>)}
      <Btn variant="primary" disabled={!method} onClick={()=>{ onConfirm(method); setDone(true); }}>Notify {owner.name.split(" ")[0]} →</Btn>
    </div>
  </>;
}

// ── CATALOG ───────────────────────────────────────────────────────────────────
function CatalogScreen({copies,loans,me,onBook}) {
  const [q,setQ]=useState(""); const [genre,setGenre]=useState("All"); const [avOnly,setAvOnly]=useState(false);
  const bookMap={}; copies.forEach(c=>{ if(!bookMap[c.bookId])bookMap[c.bookId]=[]; bookMap[c.bookId].push({...c,lent:isLentFn(c,loans)}); });
  const books=BOOK_DEFS.map(b=>{ const cs=bookMap[b.id]||[]; return{...b,avail:cs.filter(c=>!c.lent).length,total:cs.length}; }).filter(b=>b.total>0);
  const filtered=books.filter(b=>{ const mq=b.title.toLowerCase().includes(q.toLowerCase())||b.author.toLowerCase().includes(q.toLowerCase()); return mq&&(genre==="All"||b.genre===genre)&&(!avOnly||b.avail>0); });
  return <>
    <div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,margin:0}}>Pustaka Kita</h1><p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>{books.length} titles · {books.reduce((a,b)=>a+b.avail,0)} available</p></div>
        <Avatar member={me} size={36}/>
      </div>
      {books.length>0&&<><div style={{display:"flex",alignItems:"center",gap:8,marginTop:12,background:T.warm50,borderRadius:14,padding:"9px 14px",border:`1px solid ${T.warm100}`}}><span style={{fontSize:16}}>🔍</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title or author…" style={{background:"none",border:"none",outline:"none",flex:1,fontSize:13,color:T.text,fontFamily:"'DM Sans',sans-serif"}}/>{q&&<span onClick={()=>setQ("")} style={{cursor:"pointer",color:T.textXs,fontSize:18}}>×</span>}</div><div style={{display:"flex",gap:6,marginTop:10,overflowX:"auto",paddingBottom:2}}>{["All","Fiction","Non-fiction","Memoir"].map(g=><Chip key={g} active={genre===g} onClick={()=>setGenre(g)}>{g}</Chip>)}<Chip active={avOnly} onClick={()=>setAvOnly(!avOnly)}>✓ Available</Chip></div></>}
    </div>
    {books.length===0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:16}}>📭</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>No books yet!</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:0}}>Be the first to add a book to the club's collection.</p></div>:
    <div style={{padding:"12px 16px"}}>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:T.textSm}}><div style={{fontSize:40,marginBottom:12}}>🔍</div>No books match</div>}
      {filtered.map(book=><div key={book.id} onClick={()=>onBook(book.id)} style={{background:"#fff",borderRadius:16,border:`1px solid ${T.warm100}`,marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,padding:"14px"}}><BookCover book={book} size={50}/><div style={{flex:1,minWidth:0}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text,lineHeight:1.2}}>{book.title}</div><div style={{fontSize:12,color:T.textSm,marginTop:2}}>{book.author}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}><Stars n={book.stars} size={11}/><span style={{fontSize:10,color:T.textXs}}>· {book.genre}</span>{book.total>1&&<span style={{fontSize:10,color:T.textXs}}>· 📚 {book.total} copies</span>}</div><div style={{marginTop:8}}>{book.avail>0?<Badge color="green">✓ {book.avail} available</Badge>:<Badge color="orange">All lent out</Badge>}</div></div></div>
      </div>)}
    </div>}
  </>;
}

// ── BOOK DETAIL ───────────────────────────────────────────────────────────────
function BookDetailScreen({bookId,copies,loans,members,onBack,onRequestCopy}) {
  const book=getBook(bookId);
  const bookCopies=copies.filter(c=>c.bookId===bookId).map(c=>{
    const loan=getLoanFn(c,loans); const owner=getMember(c.ownerId,members);
    const myLoan=loan?.borrowerId===1; const queue=loan?.queueIds||[]; const myQueuePos=queue.indexOf(1);
    return{...c,loan,owner,myLoan,queue,myQueuePos};
  });
  const myOwnCopy=bookCopies.find(c=>c.ownerId===1);
  return <><PageHeader title="Book details" onBack={onBack}/>
    <div>
      <div style={{background:book.cover+"44",padding:"20px",display:"flex",gap:16}}><BookCover book={book} size={72}/><div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:T.text,lineHeight:1.2}}>{book.title}</div><div style={{fontSize:13,color:T.textMd,marginTop:4}}>{book.author}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}><Stars n={book.stars} size={13}/></div><Badge color="brown">{book.genre}</Badge></div></div>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm100}`}}><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:0}}>{book.desc}</p></div>
      <SectionTitle>{bookCopies.length>1?`${bookCopies.length} copies in the club`:"In the club"}</SectionTitle>
      {bookCopies.map(copy=>{
        const loanState=copy.loan?.state; const canRequest=!copy.loan&&copy.ownerId!==1&&!myOwnCopy;
        const canQueue=copy.loan&&copy.ownerId!==1&&!copy.myLoan&&copy.myQueuePos===-1&&!myOwnCopy;
        const inQueue=copy.myQueuePos>=0;
        return <div key={copy.id} style={{margin:"0 16px 10px",background:"#fff",borderRadius:14,border:`1px solid ${T.warm100}`}}>
          <div style={{padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar member={copy.owner} size={32}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{copy.owner.name}</div><div style={{fontSize:11,color:T.textSm}}>{copy.owner.role==="coordinator"?"Coordinator":"Member"}</div></div>{copy.ownerId===1?<Badge color="brown">Your copy</Badge>:loanState?<Badge color={ST_COLOR[loanState]}>{ST_LABEL[loanState]}</Badge>:<Badge color="green">Available</Badge>}</div>
            {copy.queue.length>0&&<div style={{marginTop:10,background:T.warm50,borderRadius:10,padding:"8px 12px",fontSize:12,color:T.textMd}}>🧍 {copy.queue.length} in queue{inQueue&&<span style={{color:T.brown,fontWeight:600}}> · You're #{copy.myQueuePos+1}</span>}</div>}
            {copy.loan?.dueDate&&copy.loan.state==="active"&&<div style={{marginTop:8,fontSize:12,color:T.textSm}}>Due {copy.loan.dueDate}</div>}
            {(canRequest||canQueue||copy.myLoan||inQueue)&&<div style={{marginTop:10}}>{canRequest&&<Btn variant="primary" onClick={()=>onRequestCopy(copy)}>Request to borrow →</Btn>}{canQueue&&<Btn variant="secondary" onClick={()=>onRequestCopy(copy,true)}>🧍 Join the queue</Btn>}{copy.myLoan&&<Btn variant="ghost" disabled>You're reading this 📖</Btn>}{inQueue&&!copy.myLoan&&<Btn variant="ghost" disabled>You're #{copy.myQueuePos+1} in queue</Btn>}</div>}
          </div>
        </div>;
      })}
    </div>
  </>;
}

// ── BORROW REQUEST ────────────────────────────────────────────────────────────
function BorrowRequestScreen({copy,joiningQueue,members,onBack,onConfirm}) {
  const book=getBook(copy.bookId); const owner=getMember(copy.ownerId,members);
  const [msg,setMsg]=useState(""); const [dur,setDur]=useState("2 weeks"); const [done,setDone]=useState(false);
  if(done)return <><PageHeader title={joiningQueue?"Joined!":"Request sent!"} onBack={onBack}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:20}}>{joiningQueue?"🧍":"📬"}</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.text,margin:"0 0 12px"}}>{joiningQueue?"You're in the queue!":` Request sent to ${owner.name.split(" ")[0]}!`}</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 32px"}}>{joiningQueue?"We'll notify you when it's your turn.":"She'll get a notification and can approve or decline."}</p><Btn variant="primary" onClick={onBack}>Back to catalog</Btn></div></>;
  return <><PageHeader title={joiningQueue?"Join the queue":"Request to borrow"} onBack={onBack}/>
    <div style={{padding:"0 0 20px"}}>
      <div style={{background:book.cover+"44",padding:"16px 20px",display:"flex",gap:14,alignItems:"center",borderBottom:`1px solid ${T.warm100}`}}><BookCover book={book} size={52}/><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:12,color:T.textSm,marginTop:2}}>{book.author}</div><div style={{fontSize:12,color:T.textSm,marginTop:4}}>Owned by <strong style={{color:T.brown}}>{owner.name}</strong></div></div></div>
      {joiningQueue&&<div style={{margin:"14px 20px 0",background:T.orangeBg,borderRadius:12,padding:"12px 14px",fontSize:13,color:T.orange}}>⏳ This copy is lent out. You'll be notified when it's your turn.</div>}
      <div style={{padding:"16px 20px"}}>
        {!joiningQueue&&<FG label="How long do you need it?"><div style={{display:"flex",gap:8}}>{["1 week","2 weeks","1 month"].map(d=><div key={d} onClick={()=>setDur(d)} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:12,fontSize:12,fontWeight:500,cursor:"pointer",border:`${dur===d?"2px":"1.5px"} solid ${dur===d?T.brown:T.warm200}`,background:dur===d?T.warm50:"transparent",color:dur===d?T.brown:T.textSm}}>{d}</div>)}</div></FG>}
        <FG label={`Message to ${owner.name.split(" ")[0]} (optional)`}><Input value={msg} onChange={e=>setMsg(e.target.value)} multiline placeholder={`Hi ${owner.name.split(" ")[0]}! I'd love to borrow this…`}/></FG>
        <Btn variant="primary" onClick={()=>{ onConfirm(copy,msg,dur,joiningQueue); setDone(true); }}>{joiningQueue?"🧍 Join the queue":"Send request ✉️"}</Btn>
      </div>
    </div>
  </>;
}

// ── MY SHELF ──────────────────────────────────────────────────────────────────
function ShelfScreen({copies,loans,members,me,onBook,onAction,onAddBook,onEditBook}) {
  const [tab,setTab]=useState("mine"); const [q,setQ]=useState("");
  const myBooks=copies.filter(c=>c.ownerId===me.id);
  const borrowing=loans.filter(l=>l.borrowerId===me.id&&["active","overdue","in_transit","pending_meeting","return_initiated"].includes(l.state));
  const lentOut=loans.filter(l=>l.ownerId===me.id&&["active","overdue","in_transit","pending_meeting","return_initiated"].includes(l.state));
  const filteredBooks=myBooks.filter(c=>{ const b=getBook(c.bookId); return !q||b.title.toLowerCase().includes(q.toLowerCase())||b.author.toLowerCase().includes(q.toLowerCase()); });
  return <>
    <div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,margin:0}}>My Shelf</h1><p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>Hi, {me.name.split(" ")[0]} 👋</p></div><Avatar member={me} size={36}/></div>
      <div style={{display:"flex",gap:8,marginTop:14}}>{[{n:myBooks.length,l:"My books"},{n:lentOut.length,l:"Lent out"},{n:borrowing.length,l:"Borrowing"}].map(s=><div key={s.l} style={{flex:1,background:T.warm50,borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${T.warm100}`}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:T.brown,lineHeight:1}}>{s.n}</div><div style={{fontSize:10,color:T.textSm,marginTop:3}}>{s.l}</div></div>)}</div>
      <div style={{display:"flex",gap:6,marginTop:12}}>{[["mine","My books"],["lent","Lent out"],["reading","Borrowing"]].map(([id,lbl])=><Chip key={id} active={tab===id} onClick={()=>setTab(id)}>{lbl}</Chip>)}</div>
    </div>
    {tab==="mine"&&<div>
      {myBooks.length===0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 32px",textAlign:"center"}}><div style={{fontSize:64,marginBottom:16}}>📭</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:T.text,margin:"0 0 10px"}}>Your shelf is empty</h2><p style={{fontSize:13,color:T.textMd,lineHeight:1.7,margin:"0 0 24px"}}>Add books you're willing to lend. Other members can find and request them.</p><Btn variant="primary" onClick={onAddBook} fullWidth={false}>+ Add your first book</Btn></div>:<>
        <div style={{padding:"12px 16px 0"}}><div style={{display:"flex",alignItems:"center",gap:8,background:T.warm50,borderRadius:12,padding:"9px 14px",border:`1px solid ${T.warm100}`}}><span style={{fontSize:14}}>🔍</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your shelf…" style={{background:"none",border:"none",outline:"none",flex:1,fontSize:13,color:T.text,fontFamily:"'DM Sans',sans-serif"}}/>{q&&<span onClick={()=>setQ("")} style={{cursor:"pointer",color:T.textXs}}>×</span>}</div></div>
        {filteredBooks.map(copy=>{ const book=getBook(copy.bookId); const loan=getLoanFn(copy,loans); const borrower=loan?getMember(loan.borrowerId,members):null; return <div key={copy.id} style={{display:"flex",gap:12,padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`}}>
          <div onClick={()=>onBook(copy.bookId)} style={{cursor:"pointer"}}><BookCover book={book} size={44}/></div>
          <div style={{flex:1}}><div onClick={()=>onBook(copy.bookId)} style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:T.text,cursor:"pointer"}}>{book.title}</div><div style={{fontSize:11,color:T.textSm}}>{book.author}</div>{borrower?<div style={{fontSize:11,color:T.orange,marginTop:4}}>📤 {borrower.name.split(" ")[0]} · {ST_LABEL[loan.state]}{(loan.queueIds||[]).length>0?` · 🧍${loan.queueIds.length}`:""}</div>:<div style={{fontSize:11,color:T.green,marginTop:4}}>✓ On your shelf</div>}</div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}><Badge color={loan?(ST_COLOR[loan.state]||"orange"):"green"}>{loan?ST_LABEL[loan.state]:"Available"}</Badge><span onClick={()=>onEditBook(copy)} style={{fontSize:11,color:T.brown,cursor:"pointer",fontWeight:500}}>Edit</span></div>
        </div>; })}
        <div style={{padding:"16px 20px"}}><Btn variant="primary" onClick={onAddBook}>+ Add another book</Btn></div>
      </>}
    </div>}
    {tab==="lent"&&<div>
      {lentOut.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:T.textXs}}>Nothing lent out 🌿</div>}
      {lentOut.map(loan=>{ const book=getBook(loan.bookId); const borrower=getMember(loan.borrowerId,members); const isOver=loan.state==="overdue"; const isReturn=loan.state==="return_initiated"; return <div key={loan.id} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`,background:isReturn?"#FFFBF6":"transparent"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}><BookCover book={book} size={44}/><div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:11,color:T.textSm}}>Lent to <strong>{borrower.name}</strong></div>{loan.dueDate&&<div style={{fontSize:11,color:isOver?T.red:T.textSm,marginTop:2}}>{isOver?"⚠️ Overdue since":"Due"} {loan.dueDate}</div>}{loan.state==="pending_meeting"&&<div style={{fontSize:11,color:T.purple,marginTop:2}}>📅 Pending meeting handoff</div>}{loan.state==="in_transit"&&<div style={{fontSize:11,color:T.orange,marginTop:2}}>📦 In transit to borrower</div>}{isReturn&&<div style={{fontSize:11,color:T.purple,marginTop:2}}>📬 {borrower.name.split(" ")[0]} is returning it — confirm when you have it</div>}{(loan.queueIds||[]).length>0&&<div style={{fontSize:11,color:T.textXs,marginTop:2}}>🧍 {loan.queueIds.length} in queue after</div>}</div></div>
        <div style={{marginTop:10,display:"flex",gap:8}}>{isReturn&&<Btn variant="success" small onClick={()=>onAction("confirm_return_owner",loan)}>✓ I got it back</Btn>}{isOver&&!isReturn&&<><Btn variant="secondary" small onClick={()=>onAction("extend_owner",loan)}>Agree to extend</Btn><Btn variant="ghost" small>She's returning it</Btn></>}{loan.state==="pending_meeting"&&<Btn variant="success" small onClick={()=>onAction("confirm_handoff",loan)}>✓ Exchanged at meeting</Btn>}</div>
      </div>; })}
    </div>}
    {tab==="reading"&&<div>
      {borrowing.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:T.textXs}}>Not borrowing anything 📖</div>}
      {borrowing.map(loan=>{ const book=getBook(loan.bookId); const owner=getMember(loan.ownerId,members); const isOver=loan.state==="overdue"; return <div key={loan.id} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`}}>
        <LoanTimeline state={loan.state}/>
        <div style={{display:"flex",gap:12,alignItems:"center",marginTop:6}}><BookCover book={book} size={44}/><div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:11,color:T.textSm}}>From {owner.name}</div>{loan.dueDate&&<div style={{fontSize:11,color:isOver?T.red:T.blue,marginTop:2}}>{isOver?"⚠️ Overdue":"📅 Due"} {loan.dueDate}</div>}{loan.state==="in_transit"&&<div style={{fontSize:11,color:T.orange,marginTop:2}}>📦 On its way to you</div>}{loan.state==="pending_meeting"&&<div style={{fontSize:11,color:T.purple,marginTop:2}}>📅 Pick up at next meeting</div>}</div><Badge color={ST_COLOR[loan.state]}>{ST_LABEL[loan.state]}</Badge></div>
        <div style={{marginTop:10,display:"flex",gap:8}}>{loan.state==="in_transit"&&<Btn variant="success" small onClick={()=>onAction("confirm_received",loan)}>📦 I received it!</Btn>}{loan.state==="pending_meeting"&&<Btn variant="success" small onClick={()=>onAction("confirm_handoff",loan)}>✓ Got it at meeting</Btn>}{loan.state==="active"&&<><Btn variant="ghost" small onClick={()=>onAction("request_extend",loan)}>Ask to extend</Btn><Btn variant="secondary" small onClick={()=>onAction("return_book",loan)}>Return →</Btn></>}{isOver&&<><Btn variant="ghost" small onClick={()=>onAction("request_extend",loan)}>Ask to extend</Btn><Btn variant="danger" small onClick={()=>onAction("return_book",loan)}>Return →</Btn></>}</div>
      </div>; })}
    </div>}
  </>;
}

// ── BORROWS ───────────────────────────────────────────────────────────────────
function BorrowsScreen({loans,members,onAction,onBook}) {
  const [tab,setTab]=useState("active");
  const pending=loans.filter(l=>l.state==="requested");
  const active=loans.filter(l=>["approved","pending_meeting","in_transit","active","overdue","extend_requested","return_initiated"].includes(l.state));
  return <><PageHeader title="Borrows" sub="All ongoing and pending activity"/>
    <div style={{padding:"10px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}><div style={{display:"flex",gap:6}}><Chip active={tab==="active"} onClick={()=>setTab("active")}>Active</Chip><Chip active={tab==="requests"} onClick={()=>setTab("requests")}>Pending{pending.length>0?` (${pending.length})`:""}</Chip></div></div>
    {tab==="active"&&<div>{active.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:T.textXs}}><div style={{fontSize:40,marginBottom:12}}>📚</div>No active loans</div>}{active.map(loan=>{ const book=getBook(loan.bookId); const borrower=getMember(loan.borrowerId,members); const owner=getMember(loan.ownerId,members); const isOver=loan.state==="overdue"; return <div key={loan.id} onClick={()=>onBook(loan.bookId)} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`,cursor:"pointer",background:isOver?"#FFF8F8":"transparent"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><BookCover book={book} size={44}/><div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:11,color:T.textSm,marginTop:2}}>{borrower.name.split(" ")[0]} ← {owner.name.split(" ")[0]}{loan.borrowerId===1&&<span style={{color:T.brown,fontWeight:600}}> (you)</span>}</div>{loan.dueDate&&<div style={{fontSize:11,color:isOver?T.red:T.textSm,marginTop:2}}>{isOver?"⚠️ Overdue":"Due"} {loan.dueDate}</div>}{loan.state==="return_initiated"&&<div style={{fontSize:11,color:T.purple,marginTop:2}}>📬 Return in progress</div>}</div><Badge color={ST_COLOR[loan.state]}>{ST_LABEL[loan.state]}</Badge></div></div>; })}</div>}
    {tab==="requests"&&<div>{pending.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:T.textXs}}>No pending requests 🌿</div>}{pending.map(loan=>{ const book=getBook(loan.bookId); const requester=getMember(loan.borrowerId,members); const isMyBook=loan.ownerId===1; return <div key={loan.id} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`}}><div style={{display:"flex",gap:12}}><BookCover book={book} size={44}/><div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:T.text}}>{book.title}</div><div style={{fontSize:11,color:T.textSm,marginTop:2}}>{requester.name} wants to borrow</div>{loan.message&&<div style={{fontSize:12,color:T.textMd,marginTop:6,fontStyle:"italic"}}>"{loan.message}"</div>}{loan.duration&&<div style={{fontSize:11,color:T.textXs,marginTop:4}}>For {loan.duration}</div>}</div></div>{isMyBook&&<div style={{display:"flex",gap:8,marginTop:10}}><Btn variant="success" small onClick={()=>onAction("approve_request",loan)}>✓ Approve</Btn><Btn variant="danger" small>✗ Decline</Btn></div>}{!isMyBook&&<div style={{marginTop:8}}><Badge color="brown">Pending owner's response</Badge></div>}</div>; })}</div>}
  </>;
}

// ── MEMBERS ───────────────────────────────────────────────────────────────────
function MembersScreen({copies,loans,members,me,onBook,onCoordinator}) {
  return <><div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,margin:0}}>Members</h1><p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>{members.length} members</p></div>{me.role==="coordinator"&&<button onClick={onCoordinator} style={{background:T.brown,color:"#fff",border:"none",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>⚙ Manage</button>}</div></div>
    <div>{members.map(m=>{ const mc=copies.filter(c=>c.ownerId===m.id); const avl=mc.filter(c=>!isLentFn(c,loans)).length; return <div key={m.id} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`}}><div style={{display:"flex",gap:12,alignItems:"center"}}><Avatar member={m} size={40}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,fontWeight:600,color:T.text}}>{m.name}</span>{m.role==="coordinator"&&<Badge color="brown">Coordinator</Badge>}{m.id===me.id&&<Badge color="blue">You</Badge>}</div><div style={{fontSize:11,color:T.textSm,marginTop:2}}>{mc.length} books · <span style={{color:T.green}}>{avl} available</span></div></div></div>{mc.length>0&&<div style={{marginTop:10,display:"flex",gap:6,overflowX:"auto"}}>{mc.slice(0,6).map(c=>{ const b=getBook(c.bookId); return <div key={c.id} onClick={()=>onBook(c.bookId)} style={{flexShrink:0,width:32,height:44,borderRadius:4,background:b.cover,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",opacity:isLentFn(c,loans)?.4:1}}>{b.emoji}</div>; })}</div>}</div>; })}</div>
  </>;
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function NotificationsScreen({notifs,setNotifs,me,onAction}) {
  const mine=notifs.filter(n=>n.toId===me.id);
  return <><div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text,margin:0}}>Notifications</h1><button onClick={()=>setNotifs(p=>p.map(n=>n.toId===me.id?{...n,read:true}:n))} style={{background:"none",border:"none",fontSize:12,color:T.brown,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Mark all read</button></div><p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>{mine.filter(n=>!n.read).length} unread</p></div>
    <div>{mine.length===0&&<div style={{padding:"60px 20px",textAlign:"center",color:T.textXs}}><div style={{fontSize:40,marginBottom:12}}>🔔</div>All caught up!</div>}{mine.map(n=><div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{padding:"14px 20px",borderBottom:`1px solid ${T.warm50}`,background:n.read?"transparent":"#FFFBF6",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{fontSize:24,lineHeight:1.2,flexShrink:0}}>{n.emoji}</div>
      <div style={{flex:1}}><div style={{fontSize:13,color:n.read?T.textMd:T.text,fontWeight:n.read?400:600,lineHeight:1.5}}>{n.title}</div><div style={{fontSize:12,color:T.textSm,marginTop:3,lineHeight:1.5}}>{n.body}</div><div style={{fontSize:10,color:T.textXs,marginTop:4}}>{n.time}</div>
        {n.action==="approve_request"&&!n.read&&<div style={{display:"flex",gap:8,marginTop:10}}><Btn variant="success" small onClick={e=>{e.stopPropagation();onAction("approve_from_notif",n);}}>✓ Approve</Btn><Btn variant="danger" small onClick={e=>e.stopPropagation()}>✗ Decline</Btn></div>}
        {n.action==="confirm_return"&&!n.read&&<div style={{marginTop:10}}><Btn variant="success" small onClick={e=>{e.stopPropagation();onAction("confirm_return_notif",n);}}>✓ Confirm received</Btn></div>}
        {n.action==="overdue_owner"&&!n.read&&<div style={{display:"flex",gap:8,marginTop:10}}><Btn variant="secondary" small onClick={e=>{e.stopPropagation();onAction("overdue_nudge",n);}}>Agree to extend</Btn><Btn variant="ghost" small onClick={e=>e.stopPropagation()}>She's returning it</Btn></div>}
      </div>
      {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:T.brown,marginTop:6,flexShrink:0}}/>}
    </div>)}</div>
  </>;
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const NAV=[{id:"catalog",e:"📚",label:"Catalog"},{id:"shelf",e:"🛋️",label:"Shelf"},{id:"borrows",e:"🔄",label:"Borrows"},{id:"members",e:"👩‍👧",label:"Members"},{id:"notifs",e:"🔔",label:"Alerts"}];

export default function App() {
  const [authState,setAuthState]=useState("login");
  const [me,setMe]=useState(null);
  const [tab,setTab]=useState("catalog");
  const [screen,setScreen]=useState(null);
  const [members,setMembers]=useState(SEED_MEMBERS);
  const [loans,setLoans]=useState(SEED_LOANS);
  const [copies,setCopies]=useState(SEED_COPIES);
  const [notifs,setNotifs]=useState(SEED_NOTIFS);

  const go=useCallback((type,payload={})=>setScreen({type,...payload}),[]);
  const back=useCallback(()=>setScreen(null),[]);
  const pushNotif=n=>setNotifs(p=>[{id:Date.now(),read:false,toId:me?.id||1,time:"Just now",...n},...p]);
  const updateLoan=(id,patch)=>setLoans(p=>p.map(l=>l.id===id?{...l,...patch}:l));

  const handleAction=useCallback((action,payload)=>{
    switch(action){
      case "approve_request": case "approve_from_notif":{ const loan=payload.loanId?loans.find(l=>l.id===payload.loanId):payload; if(!loan)return; updateLoan(loan.id,{state:"approved"}); go("delivery",{loan:{...loan,state:"approved"}}); break; }
      case "delivery_confirmed":{ const{loan,method,tracking}=payload; updateLoan(loan.id,{state:method==="meeting"?"pending_meeting":"in_transit",method,tracking}); pushNotif({emoji:method==="meeting"?"📅":"📦",title:`${getBook(loan.bookId).title} — ${method==="meeting"?"pick up at next meeting":"on its way!"}`,body:method==="meeting"?"Confirm when you have it.":tracking?`Tracking: ${tracking}`:"Mark received when it arrives."}); back(); break; }
      case "confirm_handoff":{ updateLoan(payload.id,{state:"active",startDate:"Mar 21",dueDate:"Apr 4"}); pushNotif({emoji:"✅",title:`Handoff confirmed — ${getBook(payload.bookId).title}`,body:"Loan started. Due Apr 4."}); break; }
      case "confirm_received":{ updateLoan(payload.id,{state:"active",startDate:"Mar 21",dueDate:"Apr 5"}); pushNotif({emoji:"✅",title:`You received ${getBook(payload.bookId).title}`,body:"Loan started. Due Apr 5."}); break; }
      case "request_extend":   go("extend",{loan:payload,isOwner:false}); break;
      case "extend_owner":     go("extend",{loan:payload,isOwner:true}); break;
      case "overdue_nudge":    go("extend",{loan:loans.find(l=>l.id===payload.loanId)||loans[2],isOwner:true}); break;
      case "return_book":      go("return",{loan:payload}); break;
      case "return_confirmed":{ updateLoan(payload.id,{state:"return_initiated",returnMethod:payload.method}); pushNotif({emoji:"📬",title:`${getBook(payload.bookId).title} is coming back`,body:`${me.name.split(" ")[0]} is returning it. Confirm when you have it.`,toId:payload.ownerId,action:"confirm_return",loanId:payload.id}); back(); break; }
      case "confirm_return_owner": case "confirm_return_notif":{ const loan=action==="confirm_return_notif"?loans.find(l=>l.id===payload.loanId):payload; if(!loan)return; go("confirm_return",{loan}); break; }
      default: break;
    }
  },[loans,members,me,go,back]);

  const handleConfirmRequest=(copy,msg,dur,joiningQueue)=>{
    if(joiningQueue){setLoans(p=>p.map(l=>l.bookId===copy.bookId&&l.ownerId===copy.ownerId?{...l,queueIds:[...(l.queueIds||[]),me.id]}:l));}
    else{setLoans(p=>[...p,{id:Date.now(),bookId:copy.bookId,borrowerId:me.id,ownerId:copy.ownerId,state:"requested",message:msg,duration:dur,startDate:null,dueDate:null,queueIds:[]}]);}
  };

  const handleSaveBook=(bookData)=>{
    const newId=Date.now();
    BOOK_DEFS.push({id:newId,...bookData,stars:0,desc:""});
    setCopies(p=>[...p,{id:Date.now()+1,bookId:newId,ownerId:me.id}]);
    back();
  };

  const unread=notifs.filter(n=>n.toId===me?.id&&!n.read).length;
  const currentMe=members.find(m=>m.id===me?.id)||me;

  const Wrap=({children})=><><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/><div style={{fontFamily:"'DM Sans',sans-serif",background:T.cream,minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"24px 16px"}}><div style={{width:390,minHeight:780,background:T.paper,borderRadius:40,border:`1.5px solid ${T.warm100}`,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative",boxShadow:"0 32px 80px rgba(90,50,20,0.13),0 4px 16px rgba(90,50,20,0.06)"}}>{children}</div></div></>;

  if(authState==="login")     return <Wrap><LoginScreen onLogin={m=>{setMe(m);setAuthState("app");}} onGoRegister={()=>setAuthState("register")}/></Wrap>;
  if(authState==="register")  return <Wrap><RegisterScreen onRegister={m=>{setMembers(p=>[...p,m]);setMe(m);setAuthState("onboarding");}} onGoLogin={()=>setAuthState("login")}/></Wrap>;
  if(authState==="onboarding")return <Wrap><OnboardingScreen me={currentMe} onFinish={()=>setAuthState("app")} onAddBook={()=>{setAuthState("app");go("addbook");}}/></Wrap>;

  const renderScreen=()=>{
    if(!screen)return null;
    switch(screen.type){
      case "book":           return <BookDetailScreen bookId={screen.bookId} copies={copies} loans={loans} members={members} onBack={back} onRequestCopy={(copy,q)=>go("request",{copy,joiningQueue:!!q})}/>;
      case "request":        return <BorrowRequestScreen copy={screen.copy} joiningQueue={screen.joiningQueue} members={members} onBack={back} onConfirm={handleConfirmRequest}/>;
      case "delivery":       return <DeliveryScreen loan={screen.loan} members={members} onBack={back} onConfirm={(m,t)=>handleAction("delivery_confirmed",{loan:screen.loan,method:m,tracking:t})}/>;
      case "extend":         return <ExtendScreen loan={screen.loan} isOwner={screen.isOwner} members={members} onBack={back} onConfirm={nd=>{updateLoan(screen.loan.id,{state:"active",dueDate:nd});pushNotif({emoji:"📅",title:`Loan extended — ${getBook(screen.loan.bookId).title}`,body:`New due date: ${nd}.`});}}/>;
      case "return":         return <ReturnScreen loan={screen.loan} members={members} onBack={back} onConfirm={m=>handleAction("return_confirmed",{...screen.loan,method:m})}/>;
      case "confirm_return": return <ConfirmReturnScreen loan={screen.loan} members={members} onBack={back} onConfirm={()=>updateLoan(screen.loan.id,{state:"returned"})}/>;
      case "addbook":        return <AddBookScreen onBack={back} onSave={handleSaveBook} me={currentMe}/>;
      case "editbook":       return <AddBookScreen onBack={back} onSave={handleSaveBook} me={currentMe} existingBook={getBook(screen.copy?.bookId)}/>;
      case "profile":        return <ProfileScreen me={currentMe} members={members} copies={copies} onBack={back} onLogout={()=>{setMe(null);setAuthState("login");setScreen(null);}} onUpdate={u=>setMembers(p=>p.map(m=>m.id===u.id?u:m))}/>;
      case "coordinator":    return <CoordinatorScreen me={currentMe} members={members} setMembers={setMembers} copies={copies} loans={loans} onBack={back}/>;
      default: return null;
    }
  };

  const renderTab=()=>{
    switch(tab){
      case "catalog":  return <CatalogScreen copies={copies} loans={loans} me={currentMe} onBook={id=>go("book",{bookId:id})}/>;
      case "shelf":    return <ShelfScreen copies={copies} loans={loans} members={members} me={currentMe} onBook={id=>go("book",{bookId:id})} onAction={handleAction} onAddBook={()=>go("addbook")} onEditBook={copy=>go("editbook",{copy})}/>;
      case "borrows":  return <BorrowsScreen loans={loans} members={members} onAction={handleAction} onBook={id=>go("book",{bookId:id})}/>;
      case "members":  return <MembersScreen copies={copies} loans={loans} members={members} me={currentMe} onBook={id=>go("book",{bookId:id})} onCoordinator={()=>go("coordinator")}/>;
      case "notifs":   return <NotificationsScreen notifs={notifs} setNotifs={setNotifs} me={currentMe} onAction={handleAction}/>;
      default: return null;
    }
  };

  return <Wrap>
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:T.textSm,fontWeight:600,flexShrink:0}}><span>9:41</span><span>●●●● WiFi 🔋</span></div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:screen?0:80}}>{screen?renderScreen():renderTab()}</div>
      {!screen&&<div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",background:T.paper,borderTop:`1px solid ${T.warm100}`,padding:"8px 0 20px",flexShrink:0}}>
        {NAV.map(item=><div key={item.id} onClick={()=>{setTab(item.id);setScreen(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 0",position:"relative",color:tab===item.id?T.brown:T.textXs,fontSize:10,fontWeight:tab===item.id?700:400}}><span style={{fontSize:20,lineHeight:1,filter:tab===item.id?"none":"grayscale(0.5) opacity(0.5)"}}>{item.e}</span>{item.label}{item.id==="notifs"&&unread>0&&<div style={{position:"absolute",top:2,right:"24%",width:14,height:14,borderRadius:"50%",background:"#C0392B",color:"#fff",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</div>}</div>)}
        <div onClick={()=>go("profile")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 0",color:T.textXs,fontSize:10}}><span style={{fontSize:20,lineHeight:1,filter:"grayscale(0.3) opacity(0.7)"}}>👤</span>Profile</div>
      </div>}
    </div>
  </Wrap>;
}
