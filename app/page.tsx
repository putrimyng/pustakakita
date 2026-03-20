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

const BOOK_DEFS: Book[] = [
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

const SEED_COPIES: Copy[] = [
  {id:1,bookId:1,ownerId:2},{id:2,bookId:1,ownerId:4},
  {id:3,bookId:2,ownerId:3},{id:4,bookId:3,ownerId:4},{id:5,bookId:3,ownerId:6},
  {id:6,bookId:4,ownerId:1},{id:7,bookId:5,ownerId:1},{id:8,bookId:6,ownerId:1},
  {id:9,bookId:7,ownerId:4},{id:10,bookId:8,ownerId:2},{id:11,bookId:9,ownerId:6},
  {id:12,bookId:10,ownerId:5},{id:13,bookId:11,ownerId:6},{id:14,bookId:12,ownerId:5},
];

const SEED_LOANS: Loan[] = [
  {id:1,bookId:4, borrowerId:5,ownerId:1,state:"active",          startDate:"Mar 1", dueDate:"Mar 29",method:"meeting", queueIds:[]},
  {id:2,bookId:2, borrowerId:1,ownerId:3,state:"active",          startDate:"Mar 5", dueDate:"Apr 5", method:"shipping",queueIds:[]},
  {id:3,bookId:9, borrowerId:4,ownerId:6,state:"overdue",         startDate:"Feb 10",dueDate:"Mar 10",method:"meeting", queueIds:[2]},
  {id:4,bookId:7, borrowerId:2,ownerId:4,state:"in_transit",      startDate:"Mar 18",dueDate:"Apr 15",method:"shipping",queueIds:[]},
  {id:5,bookId:11,borrowerId:3,ownerId:6,state:"pending_meeting", startDate:null,    dueDate:null,    method:"meeting", queueIds:[1,5]},
  {id:6,bookId:8, borrowerId:1,ownerId:2,state:"return_initiated",startDate:"Feb 20",dueDate:"Mar 20",method:"meeting", queueIds:[],returnMethod:"meeting"},
];

const SEED_NOTIFS: Notif[] = [
  {id:1,toId:1,emoji:"📬",title:"Endi wants to borrow Lessons in Chemistry", body:"Tap to approve or decline.",                         time:"2h ago",   read:false,action:"approve_request",loanId:5},
  {id:2,toId:1,emoji:"⚠️",title:"The Midnight Library is overdue",           body:"Meita has had it since Mar 1. Time to follow up.",   time:"5h ago",   read:false,action:"overdue_owner",  loanId:1},
  {id:3,toId:1,emoji:"📬",title:"Puty is returning Crying in H Mart",        body:"She'll bring it to the next meeting. Confirm when you have it.",time:"Yesterday",read:false,action:"confirm_return",loanId:6},
  {id:4,toId:1,emoji:"🎉",title:"Your borrow request was approved!",          body:"Amelia will bring Normal People to the next meeting.", time:"2d ago",   read:true, action:null},
  {id:5,toId:1,emoji:"🧍",title:"Meita joined your queue for Klara and the Sun",body:"She's #2 after Vinka.",                             time:"3d ago",   read:true, action:null},
];

const MOCK_ISBN: { [isbn: string]: { title: string; author: string; genre: string; cover: string; emoji: string } } = {
  "9780593311042":{title:"The Women",        author:"Kristin Hannah", genre:"Fiction",cover:"#F4D0B0",emoji:"🌺"},
  "9780525559474":{title:"Intermezzo",        author:"Sally Rooney",   genre:"Fiction",cover:"#D0E8F4",emoji:"🎹"},
  "default":       {title:"Cantik itu Luka",  author:"Eka Kurniawan",  genre:"Fiction",cover:"#D0F4E0",emoji:"🌴"},
};

const COVER_PAL: string[]  = ["#F4C4A0","#A0C4D8","#B5D4A0","#C4B0E8","#E8D4A0","#F0A0A0","#FFD4A0","#A0D8C4","#A0C4A0","#D4A0C4","#F4D0B0","#D0E8F4"];
const COVER_EMO: string[]  = ["📖","🌸","🌿","🌙","🌾","🦋","🌺","☀️","🎭","🌊","🏔️","🎪","🦚","🌻","🎨"];
const ST_LABEL   = {requested:"Requested",approved:"Approved",pending_meeting:"Pending handoff",in_transit:"In transit",active:"Active",overdue:"Overdue ⚠️",extend_requested:"Extension asked",return_initiated:"Being returned",returned:"Returned"};
const ST_COLOR   = {requested:"blue",approved:"blue",pending_meeting:"purple",in_transit:"orange",active:"green",overdue:"red",extend_requested:"orange",return_initiated:"purple",returned:"green"};

// Utility functions
const getBook    = (id: number) => BOOK_DEFS.find(b => b.id === id);
const getMember  = (id: number, members: Member[]) => members.find(m => m.id === id) || SEED_MEMBERS[0];
const isLentFn   = (copy: Copy, loans: Loan[]) => loans.some(l => l.bookId === copy.bookId && l.ownerId === copy.ownerId);
const getLoanFn  = (copy: Copy, loans: Loan[]) => loans.find(l => l.bookId === copy.bookId && l.ownerId === copy.ownerId);

// Component types

type StarsProps = { n: number; size?: number };
const Stars = ({n, size = 12 }: StarsProps) => <span style={{color:T.gold,fontSize:size,letterSpacing:-1}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;

type AvatarProps = { member: Member; size?: number };
const Avatar = ({member, size = 36}: AvatarProps) =>
  <div style={{width:size,height:size,borderRadius:"50%",background:member?.color||T.brown,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:700,flexShrink:0}}>{member?.initials||"?"}</div>;

type BadgeProps = { children: ReactNode; color?: string };
const Badge = ({children, color="brown"}: BadgeProps) => {
  const m: { [k:string]: [string, string] } = {
    green:[T.greenBg,T.green],orange:[T.orangeBg,T.orange],brown:[T.warm50,T.brownDk],
    blue:[T.blueBg,T.blue],red:[T.redBg,T.red],purple:[T.purpleBg,T.purple]
  };
  const [bg,fg]=m[color]||m.brown;
  return <span style={{display:"inline-block",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:bg,color:fg,whiteSpace:"nowrap"}}>{children}</span>;
};

type BtnProps = {
  children: ReactNode;
  variant?: "primary"|"secondary"|"ghost"|"danger"|"success";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  small?: boolean;
  fullWidth?: boolean;
};
const Btn = ({children,variant="primary",onClick,disabled,small,fullWidth=true}: BtnProps) => {
  const v = {
    primary:{background:T.brown,color:"#fff",border:"none"},
    secondary:{background:"transparent",color:T.brown,border:`1.5px solid ${T.brown}`},
    ghost:{background:T.warm50,color:T.brownDk,border:"none"},
    danger:{background:T.redBg,color:T.red,border:`1.5px solid ${T.red}`},
    success:{background:T.greenBg,color:T.green,border:`1.5px solid ${T.green}`}
  };
  return <button onClick={onClick} disabled={disabled} style={{
    ...v[variant]||v.primary,
    borderRadius:12,
    padding:small?"7px 14px":"12px 16px",
    fontSize:small?12:14,
    fontWeight:600,
    cursor:disabled?"not-allowed":"pointer",
    width:fullWidth?"100%":"auto",
    fontFamily:"'DM Sans',sans-serif",
    opacity:disabled?.5:1,
    transition:"opacity 0.15s"
  }}>{children}</button>;
};

type BookCoverProps = { book: Partial<Book>; size?: number };
const BookCover = ({book, size=48 }: BookCoverProps) =>
  <div style={{width:size,height:size*1.4,borderRadius:6,flexShrink:0,background:book?.cover||T.warm100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,boxShadow:"2px 3px 10px rgba(0,0,0,0.12)"}}>{book?.emoji||"📖"}</div>;

const Divider = () => <div style={{height:1,background:T.warm100,margin:"0 20px"}}/>;

type SectionTitleProps = { children: ReactNode };
const SectionTitle = ({children}: SectionTitleProps) =>
  <div style={{fontSize:11,fontWeight:700,color:T.textSm,textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 20px 8px"}}>{children}</div>;

type ChipProps = { children: ReactNode; active: boolean; onClick?: () => void };
const Chip = ({children,active,onClick}: ChipProps) =>
  <span onClick={onClick}
    style={{
      display:"inline-block",
      padding:"5px 13px",
      borderRadius:20,
      fontSize:12,
      fontWeight:500,
      cursor:"pointer",
      whiteSpace:"nowrap",
      border:active?"none":`1px solid ${T.warm200}`,
      background:active?T.brown:"transparent",
      color:active?"#fff":T.textSm,
      transition:"all 0.15s"
    }}
  >{children}</span>;

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
};
const Input = ({value,onChange,placeholder,multiline,rows=3,type="text"}: InputProps) => {
  const b={
    width:"100%",
    padding:"12px 14px",
    borderRadius:12,
    border:`1.5px solid ${T.warm200}`,
    background:T.cream,
    fontSize:14,
    color:T.text,
    fontFamily:"'DM Sans',sans-serif",
    outline:"none",
    boxSizing:"border-box"
  };
  return (multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...b,resize:"none"}}/>
    : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={b}/>);
};

type LabelProps = { children: ReactNode };
const Label = ({children}: LabelProps) => <div style={{fontSize:12,fontWeight:600,color:T.brown,marginBottom:5}}>{children}</div>;

type FGProps = { label: string; children: ReactNode };
const FG = ({label,children}: FGProps) => <div style={{marginBottom:16}}><Label>{label}</Label>{children}</div>;

type PageHeaderProps = {
  title: string;
  sub?: string;
  onBack?: () => void;
  right?: ReactNode;
};
const PageHeader = ({title,sub,onBack,right}: PageHeaderProps) =>
  <div style={{padding:"12px 20px 14px",borderBottom:`1px solid ${T.warm100}`,background:T.paper}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      {onBack&&
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.brown,padding:0,lineHeight:1}}>←</button>
      }
      <div style={{flex:1}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:onBack?18:22,fontWeight:700,color:T.text,margin:0,lineHeight:1.2}}>{title}</h1>
        {sub && <p style={{fontSize:12,color:T.textSm,margin:"2px 0 0"}}>{sub}</p>}
      </div>
      {right}
    </div>
  </div>;

type LoanTimelineProps = { state: string };
const LoanTimeline = ({state}: LoanTimelineProps) => {
  const idx: {[k:string]: number} = {approved:0,pending_meeting:1,in_transit:1,active:2,overdue:2,extend_requested:2,return_initiated:3,returned:3};
  const cur=idx[state]??0; const labels=["Approved","Handoff","Active","Returned"];
  return <div style={{display:"flex",alignItems:"center",padding:"10px 20px 4px",gap:0}}>{labels.map((lbl,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:i<labels.length-1?1:0}}><div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,background:i<=cur?T.brown:T.warm100,border:`2px solid ${i<=cur?T.brown:T.warm200}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{i<cur&&<span style={{color:"#fff",fontSize:9}}>✓</span>}{i===cur&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}</div><div style={{position:"relative"}}><div style={{fontSize:8.5,color:i<=cur?T.brownDk:T.textXs,fontWeight:i===cur?700:400,position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap"}}>{lbl}</div></div>{i<labels.length-1&&<div style={{flex:1,height:2,background:i<cur?T.brown:T.warm100,margin:"0 3px"}}/>}</div>)}</div>;
};

type WrapProps = { children: ReactNode };
const Wrap = ({children}: WrapProps) => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.cream,minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"24px 16px"}}>
      <div style={{width:390,minHeight:780,background:T.paper,borderRadius:40,border:`1.5px solid ${T.warm100}`,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative",boxShadow:"0 32px 80px rgba(90,50,20,0.13),0 4px 16px rgba(90,50,20,0.06)"}}>
        {children}
      </div>
    </div>
  </>
);

// ...All large screen/components functions: Keep as is but add parameter types...

// (for brevity, only types of functions/props that previously did NOT have types, main focus on App below)

// ── ROOT ──────────────────────────────────────────────────────────────────────
const NAV: NavTab[] = [
  {id:"catalog",e:"📚",label:"Catalog"},
  {id:"shelf",e:"🛋️",label:"Shelf"},
  {id:"borrows",e:"🔄",label:"Borrows"},
  {id:"members",e:"👩‍👧",label:"Members"},
  {id:"notifs",e:"🔔",label:"Alerts"},
];

export default function App() {
  const [authState, setAuthState] = useState<string>("login");
  const [me, setMe] = useState<Member | null>(null);
  const [tab, setTab] = useState<string>("catalog");
  const [screen, setScreen] = useState<ScreenState>(null);
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [loans, setLoans] = useState<Loan[]>(SEED_LOANS);
  const [copies, setCopies] = useState<Copy[]>(SEED_COPIES);
  const [notifs, setNotifs] = useState<Notif[]>(SEED_NOTIFS);

  const go = useCallback((type: string, payload: { [key:string]: any } = {}) => setScreen({type, ...payload}), []);
  const back = useCallback(() => setScreen(null), []);
  const pushNotif = (n: Partial<Notif>) =>
    setNotifs(p => [{id: Date.now(), read: false, toId: me?.id || 1, time: "Just now", ...n} as Notif, ...p]);
  const updateLoan = (id: number, patch: Partial<Loan>) =>
    setLoans(p => p.map(l => l.id === id ? {...l, ...patch} : l));

  const handleAction = useCallback(
    (action: string, payload: any) => {
      switch (action) {
        case "approve_request":
        case "approve_from_notif": {
          const loan = payload.loanId ? loans.find(l => l.id === payload.loanId) : payload;
          if (!loan) return;
          updateLoan(loan.id, { state: "approved" });
          go("delivery", { loan: { ...loan, state: "approved" } });
          break;
        }
        case "delivery_confirmed": {
          const { loan, method, tracking } = payload;
          updateLoan(loan.id, { state: method === "meeting" ? "pending_meeting" : "in_transit", method, tracking });
          pushNotif({
            emoji: method === "meeting" ? "📅" : "📦",
            title: `${getBook(loan.bookId)?.title} — ${method === "meeting" ? "pick up at next meeting" : "on its way!"}`,
            body: method === "meeting"
              ? "Confirm when you have it."
              : tracking
                ? `Tracking: ${tracking}`
                : "Mark received when it arrives.",
          });
          back();
          break;
        }
        case "confirm_handoff": {
          updateLoan(payload.id, { state: "active", startDate: "Mar 21", dueDate: "Apr 4" });
          pushNotif({
            emoji: "✅",
            title: `Handoff confirmed — ${getBook(payload.bookId)?.title}`,
            body: "Loan started. Due Apr 4.",
          });
          break;
        }
        case "confirm_received": {
          updateLoan(payload.id, { state: "active", startDate: "Mar 21", dueDate: "Apr 5" });
          pushNotif({
            emoji: "✅",
            title: `You received ${getBook(payload.bookId)?.title}`,
            body: "Loan started. Due Apr 5.",
          });
          break;
        }
        case "request_extend":
          go("extend", { loan: payload, isOwner: false });
          break;
        case "extend_owner":
          go("extend", { loan: payload, isOwner: true });
          break;
        case "overdue_nudge":
          go("extend", { loan: loans.find(l => l.id === payload.loanId) || loans[2], isOwner: true });
          break;
        case "return_book":
          go("return", { loan: payload });
          break;
        case "return_confirmed": {
          updateLoan(payload.id, { state: "return_initiated", returnMethod: payload.method });
          pushNotif({
            emoji: "📬",
            title: `${getBook(payload.bookId)?.title} is coming back`,
            body: `${me?.name?.split(" ")[0]} is returning it. Confirm when you have it.`,
            toId: payload.ownerId,
            action: "confirm_return",
            loanId: payload.id,
          });
          back();
          break;
        }
        case "confirm_return_owner":
        case "confirm_return_notif": {
          const loan = action === "confirm_return_notif"
            ? loans.find(l => l.id === payload.loanId)
            : payload;
          if (!loan) return;
          go("confirm_return", { loan });
          break;
        }
        default:
          break;
      }
    },
    [loans, members, me, go, back]
  );

  const handleConfirmRequest = (
    copy: Copy,
    msg: string,
    dur: string,
    joiningQueue: boolean
  ) => {
    if (!me) return;
    if (joiningQueue) {
      setLoans((p) => p.map(l =>
        l.bookId === copy.bookId && l.ownerId === copy.ownerId
          ? {...l, queueIds: [...(l.queueIds || []), me.id]}
          : l
      ));
    } else {
      setLoans((p) => [
        ...p,
        {
          id: Date.now(),
          bookId: copy.bookId,
          borrowerId: me.id,
          ownerId: copy.ownerId,
          state: "requested",
          message: msg,
          duration: dur,
          startDate: null,
          dueDate: null,
          queueIds: [],
        },
      ]);
    }
  };

  const handleSaveBook = (bookData: any) => {
    if (!me) return;
    const newId = Date.now();
    BOOK_DEFS.push({ id: newId, ...bookData, stars: 0, desc: "" });
    setCopies((p) => [...p, { id: Date.now() + 1, bookId: newId, ownerId: me.id }]);
    back();
  };

  const unread = notifs.filter((n) => n.toId === me?.id && !n.read).length;
  const currentMe: Member | null = (me && members.find((m) => m.id === me.id)) || me;

  // --- conditional rendering

  if (authState === "login")
    return (
      <Wrap>
        <LoginScreen
          onLogin={(m: Member) => {
            setMe(m);
            setAuthState("app");
          }}
          onGoRegister={() => setAuthState("register")}
        />
      </Wrap>
    );
  if (authState === "register")
    return (
      <Wrap>
        <RegisterScreen
          onRegister={(m: Member) => {
            setMembers((p) => [...p, m]);
            setMe(m);
            setAuthState("onboarding");
          }}
          onGoLogin={() => setAuthState("login")}
        />
      </Wrap>
    );
  if (authState === "onboarding")
    return (
      <Wrap>
        <OnboardingScreen
          me={currentMe!}
          onFinish={() => setAuthState("app")}
          onAddBook={() => {
            setAuthState("app");
            go("addbook");
          }}
        />
      </Wrap>
    );

  // @ts-ignore the following any type matching is necessary as screen is typed as {[key: string]: any}
  const renderScreen = (): ReactNode => {
    if (!screen) return null;
    switch (screen.type) {
      case "book":
        return (
          <BookDetailScreen
            bookId={screen.bookId}
            copies={copies}
            loans={loans}
            members={members}
            onBack={back}
            onRequestCopy={(copy: Copy, q: boolean) => go("request", { copy, joiningQueue: !!q })}
          />
        );
      case "request":
        return (
          <BorrowRequestScreen
            copy={screen.copy}
            joiningQueue={screen.joiningQueue}
            members={members}
            onBack={back}
            onConfirm={handleConfirmRequest}
          />
        );
      case "delivery":
        return (
          <DeliveryScreen
            loan={screen.loan}
            members={members}
            onBack={back}
            onConfirm={(m: string, t: string) => handleAction("delivery_confirmed", { loan: screen.loan, method: m, tracking: t })}
          />
        );
      case "extend":
        return (
          <ExtendScreen
            loan={screen.loan}
            isOwner={screen.isOwner}
            members={members}
            onBack={back}
            onConfirm={(nd: string) => {
              updateLoan(screen.loan.id, { state: "active", dueDate: nd });
              pushNotif({
                emoji: "📅",
                title: `Loan extended — ${getBook(screen.loan.bookId)?.title}`,
                body: `New due date: ${nd}.`,
              });
            }}
          />
        );
      case "return":
        return (
          <ReturnScreen
            loan={screen.loan}
            members={members}
            onBack={back}
            onConfirm={(m: string) => handleAction("return_confirmed", { ...screen.loan, method: m })}
          />
        );
      case "confirm_return":
        return (
          <ConfirmReturnScreen
            loan={screen.loan}
            members={members}
            onBack={back}
            onConfirm={() => updateLoan(screen.loan.id, { state: "returned" })}
          />
        );
      case "addbook":
        return <AddBookScreen onBack={back} onSave={handleSaveBook} me={currentMe!} />;
      case "editbook":
        return <AddBookScreen onBack={back} onSave={handleSaveBook} me={currentMe!} existingBook={getBook(screen.copy?.bookId)} />;
      case "profile":
        return (
          <ProfileScreen
            me={currentMe!}
            members={members}
            copies={copies}
            onBack={back}
            onLogout={() => {
              setMe(null);
              setAuthState("login");
              setScreen(null);
            }}
            onUpdate={(u: Member) => setMembers((p) => p.map((m) => m.id === u.id ? u : m))}
          />
        );
      case "coordinator":
        return (
          <CoordinatorScreen
            me={currentMe!}
            members={members}
            setMembers={setMembers}
            copies={copies}
            loans={loans}
            onBack={back}
          />
        );
      default:
        return null;
    }
  };

  const renderTab = (): ReactNode => {
    switch (tab) {
      case "catalog":
        return (
          <CatalogScreen
            copies={copies}
            loans={loans}
            me={currentMe!}
            onBook={(id: number) => go("book", { bookId: id })}
          />
        );
      case "shelf":
        return (
          <ShelfScreen
            copies={copies}
            loans={loans}
            members={members}
            me={currentMe!}
            onBook={(id: number) => go("book", { bookId: id })}
            onAction={handleAction}
            onAddBook={() => go("addbook")}
            onEditBook={(copy: Copy) => go("editbook", { copy })}
          />
        );
      case "borrows":
        return (
          <BorrowsScreen
            loans={loans}
            members={members}
            onAction={handleAction}
            onBook={(id: number) => go("book", { bookId: id })}
          />
        );
      case "members":
        return (
          <MembersScreen
            copies={copies}
            loans={loans}
            members={members}
            me={currentMe!}
            onBook={(id: number) => go("book", { bookId: id })}
            onCoordinator={() => go("coordinator")}
          />
        );
      case "notifs":
        return (
          <NotificationsScreen
            notifs={notifs}
            setNotifs={setNotifs}
            me={currentMe!}
            onAction={handleAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrap>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:T.textSm,fontWeight:600,flexShrink:0}}>
          <span>9:41</span>
          <span>●●●● WiFi 🔋</span>
        </div>
        <div style={{flex:1,overflowY:"auto",paddingBottom:screen?0:80}}>
          {screen ? renderScreen() : renderTab()}
        </div>
        {!screen &&
          <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",background:T.paper,borderTop:`1px solid ${T.warm100}`,padding:"8px 0 20px",flexShrink:0}}>
            {NAV.map(item =>
              <div
                key={item.id}
                onClick={() => { setTab(item.id); setScreen(null); }}
                style={{
                  flex:1,
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:2,
                  cursor:"pointer",
                  padding:"4px 0",
                  position:"relative",
                  color:tab === item.id ? T.brown : T.textXs,
                  fontSize:10,
                  fontWeight:tab === item.id ? 700 : 400
                }}>
                <span style={{fontSize:20,lineHeight:1,filter:tab === item.id ? "none" : "grayscale(0.5) opacity(0.5)"}}>{item.e}</span>
                {item.label}
                {item.id === "notifs" && unread > 0 && (
                  <div style={{
                    position:"absolute",
                    top:2,
                    right:"24%",
                    width:14,
                    height:14,
                    borderRadius:"50%",
                    background:"#C0392B",
                    color:"#fff",
                    fontSize:8,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:700
                  }}>{unread}</div>
                )}
              </div>
            )}
            <div
              onClick={() => go("profile")}
              style={{
                flex:1,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:2,
                cursor:"pointer",
                padding:"4px 0",
                color:T.textXs,
                fontSize:10
              }}>
              <span style={{fontSize:20,lineHeight:1,filter:"grayscale(0.3) opacity(0.7)"}}>👤</span>
              Profile
            </div>
          </div>
        }
      </div>
    </Wrap>
  );
}
