// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ⭐ GLOBAL SIZE CONTROLS */
const HERO_IMG = 520;
const SERVICE_IMG_W = 320;
const SERVICE_IMG_H = 200;
const ABOUT_IMG_W = 420;
const CLIENT_IMG = 70;

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
  background: "#f8fafc",
};

export default function LandingPage() {

  /* ⭐ WORD TYPING EFFECT */
  const words = ["Weightloss", "Muscle Gain", "Strength Training"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const word = words[index];
    const timer = setTimeout(() => {

      if(deleteMode){
        setText(word.substring(0,text.length-1));
      }else{
        setText(word.substring(0,text.length+1));
      }

      if(!deleteMode && text === word){
        setTimeout(()=>setDeleteMode(true),1500);
      }

      if(deleteMode && text === ""){
        setDeleteMode(false);
        setIndex((index+1)%words.length);
      }

    },deleteMode?80:140);

    return ()=>clearTimeout(timer);

  },[text,deleteMode,index]);


  return (
    <div style={{
      background:"linear-gradient(180deg,#ecfdf5 0%, #f0fdfa 40%, #f8fafc 100%)",
      minHeight:"100vh"
    }}>

{/* ================= HEADER ================= */}
<header style={{
  position:"sticky",
  top:0,
  background:"rgba(255,255,255,0.9)",
  backdropFilter:"blur(12px)",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"18px 8%",
  boxShadow:"0 6px 20px rgba(0,0,0,0.05)",
  zIndex:100
}}>

<h2 style={{fontWeight:900,color:"#020617"}}>
SMARTFIT:FITNESS AND HEALTH COMPANION
</h2>

<nav style={{display:"flex",gap:12}}>

{["Home","Services","About","Reviews","Contact"].map((item)=>(
<a
  key={item}
  href={`#${item.toLowerCase()}`}
  style={{
    background:"#ccfbf1",
    color:"#0f172a",
    padding:"8px 18px",
    borderRadius:"12px",
    fontWeight:"600",
    textDecoration:"none",
    transition:"0.3s"
  }}
>
{item}
</a>
))}

</nav>

<div style={{display:"flex",gap:12}}>
<Link to="/login">
<button style={{
background:"#e2e8f0",
border:"none",
padding:"10px 18px",
borderRadius:12,
fontWeight:"bold"
}}>
Sign In
</button>
</Link>

<Link to="/register">
<button style={{
background:"linear-gradient(135deg,#14b8a6,#0ea5e9)",
border:"none",
padding:"10px 20px",
borderRadius:12,
color:"white",
fontWeight:"bold",
boxShadow:"0 10px 20px rgba(20,184,166,0.3)"
}}>
Get Started
</button>
</Link>
</div>

</header>


{/* ================= HERO ================= */}
<section id="home" style={{
  padding:"80px 10%",
  background:"rgba(255,255,255,0.8)",
  borderRadius:"22px",
  margin:"40px auto",
  width:"90%",
  backdropFilter:"blur(8px)",
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between",
  gap:60,
  flexWrap:"wrap"
}}>

<div>
<h1 style={{
  fontSize:"64px",
  fontWeight:900,
  color:"#065f46",                      // ⭐ dark green
  lineHeight:"1.1",
  textShadow:"2px 4px 10px rgba(0,0,0,0.18)"   // ⭐ soft black shadow
}}>
  Built a healthier you!!
</h1>

<h2 style={{color:"#14b8a6",marginTop:10}}>
{text} |
</h2>

<p style={{marginTop:20,color:"#64748b",maxWidth:500,lineHeight:1.7}}>
Track workouts, nutrition, sleep and progress with intelligent dashboards
for users, trainers and admins.
</p>

<button style={{
marginTop:30,
background:"linear-gradient(135deg,#14b8a6,#0ea5e9)",
padding:"16px 30px",
border:"none",
borderRadius:16,
color:"white",
fontWeight:"bold",
boxShadow:"0 12px 24px rgba(20,184,166,0.35)",
cursor:"pointer"
}}>
Start Free
</button>

</div>

<img
src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
style={{
width:HERO_IMG,
height:420,
objectFit:"cover",
borderRadius:"32px",
boxShadow:"0 20px 40px rgba(2,6,23,0.08)"
}}
/>

</section>


{/* ================= SERVICES ================= */}
<section id="services" style={{
  padding:"80px 10%",
  background:"rgba(255,255,255,0.8)",
  borderRadius:"22px",
  margin:"40px auto",
  width:"90%",
  backdropFilter:"blur(8px)"
}}>
<h2 style={{fontSize:40,fontWeight:900,color:"#020617"}}>
Our <span style={{color:"#14b8a6"}}>Services</span>
</h2>

<div style={{display:"flex",gap:30,marginTop:40,flexWrap:"wrap"}}>

{[
"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
"https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
].map((img,i)=>(
<motion.div whileHover={{y:-8,scale:1.02}} key={i} style={{
background:"white",
padding:20,
borderRadius:24,
boxShadow:"0 8px 25px rgba(20,184,166,0.12)"
}}>
<img src={img}
style={{
width:SERVICE_IMG_W,
height:SERVICE_IMG_H,
objectFit:"cover",
borderRadius:"18px"
}}/>
</motion.div>
))}

</div>
</section>


{/* ================= ABOUT ================= */}
<section id="about" style={{
  padding:"80px 10%",
  background:"rgba(255,255,255,0.8)",
  borderRadius:"22px",
  margin:"40px auto",
  width:"90%",
  backdropFilter:"blur(8px)",
  display:"flex",
  gap:80,
  alignItems:"center",
  flexWrap:"wrap"
}}>

<img
src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
style={{
width:ABOUT_IMG_W,
height:300,
borderRadius:"28px",
objectFit:"cover",
boxShadow:"0 20px 40px rgba(2,6,23,0.08)"
}}
/>

<div>
<h2 style={{fontSize:38,fontWeight:900,color:"#020617"}}>
Why Choose <span style={{color:"#14b8a6"}}>WellNest?</span>
</h2>

<p style={{marginTop:15,color:"#64748b",maxWidth:500,lineHeight:1.7}}>
AI powered dashboards, smart analytics and real trainer collaboration
in one clean modern platform.
</p>

</div>

</section>


{/* ================= CLIENT REVIEWS ================= */}
<section id="reviews" style={{
  padding:"80px 10%",
  background:"rgba(255,255,255,0.8)",
  borderRadius:"22px",
  margin:"40px auto",
  width:"90%",
  backdropFilter:"blur(8px)"
}}>

<h2 style={{fontSize:40,fontWeight:900,color:"#020617"}}>
Client <span style={{color:"#14b8a6"}}>Reviews</span>
</h2>

<div style={{display:"flex",gap:30,marginTop:40,flexWrap:"wrap"}}>

{[
{img:"https://randomuser.me/api/portraits/women/65.jpg",name:"Nivetha",msg:"Best trainers and clean dashboard tracking!"},
{img:"https://randomuser.me/api/portraits/women/68.jpg",name:"Mounika",msg:"Love the analytics and progress charts."},
{img:"https://randomuser.me/api/portraits/women/70.jpg",name:"Priyanka",msg:"Professional plan improved my routine massively."}
].map((r,i)=>(
<motion.div key={i} whileHover={{y:-6}} style={{
background:"white",
padding:24,
borderRadius:24,
width:320,
boxShadow:"0 8px 25px rgba(20,184,166,0.12)"
}}>

<img src={r.img}
style={{
width:CLIENT_IMG,
height:CLIENT_IMG,
borderRadius:"50%",
objectFit:"cover"
}}/>

<h3 style={{marginTop:10}}>{r.name}</h3>
<p style={{color:"#64748b"}}>{r.msg}</p>

</motion.div>
))}

</div>

</section>


{/* ================= CONTACT SECTION ================= */}
<section
  id="contact"
  style={{
    padding: "100px 10%",
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ffffff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.9)",
      borderRadius: "22px",
      padding: "50px",
      width: "100%",
      maxWidth: "520px",
      boxShadow: "0 20px 40px rgba(20,184,166,0.15)",
      backdropFilter: "blur(10px)",
      textAlign: "center",
    }}
  >
    <h2
      style={{
        fontSize: "32px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "10px",
      }}
    >
      Contact <span style={{ color: "#14b8a6" }}>Us</span>
    </h2>

    <p style={{ color: "#64748b", marginBottom: "30px" }}>
      Have questions about workouts, plans, or trainers? Reach out — no login required.
    </p>

    <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <input type="text" placeholder="Your Name" style={inputStyle} />
      <input type="email" placeholder="Your Email" style={inputStyle} />
      <textarea rows="4" placeholder="Your Message" style={{ ...inputStyle, resize: "none" }} />

      <button
        type="button"
        style={{
          background: "#14b8a6",
          color: "white",
          fontWeight: "700",
          padding: "12px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send Message
      </button>
    </form>
  </div>
</section>


{/* ================= FOOTER ================= */}
<footer style={{
textAlign:"center",
padding:50,
color:"#64748b"
}}>
© 2026 WellNest Smart Health
</footer>


</div>
  );
}