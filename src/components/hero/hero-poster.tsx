// /**
//  * Painted immediately on first render — the poster the 3D canvas fades in
//  * over, and the complete hero when WebGL is unavailable. Includes a
//  * hand-drawn citadel silhouette so the fallback still feels designed.
//  */
// export function HeroPoster() {
//   return (
//     <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden>
//       {/* base wash */}
//       <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0a0a_0%,#161616_58%,#1e1e1e_100%)]" />
//       {/* warm ember where the light sits behind the citadel */}
//       <div className="animate-glow-pulse absolute inset-x-0 bottom-0 h-[75%] bg-[radial-gradient(55%_60%_at_50%_78%,rgba(255,179,107,0.34),transparent_70%)]" />
//       <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(40%_50%_at_50%_85%,rgba(255,122,26,0.3),transparent_72%)]" />

//       {/* citadel silhouette (fallback / behind-canvas art) */}
//       <svg
//         viewBox="0 0 400 260"
//         className="absolute bottom-0 left-1/2 w-[min(78vw,760px)] -translate-x-1/2 translate-y-[6%] opacity-90"
//         role="presentation"
//       >
//         <defs>
//           <linearGradient id="fort" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#161616" />
//             <stop offset="100%" stopColor="#0a0a0a" />
//           </linearGradient>
//         </defs>
//         <g stroke="#ff7a1a" strokeOpacity="0.5" strokeWidth="1.2" fill="url(#fort)">
//           {/* platform */}
//           <path d="M60 258 L74 232 L326 232 L340 258 Z" />
//           {/* keep */}
//           <path d="M150 232 L150 96 L174 96 L174 84 L200 60 L226 84 L226 96 L250 96 L250 232 Z" />
//           {/* merlons */}
//           <path
//             d="M150 96 h14 v-12 h14 v12 h14 v-12 h14 v12 h14 v-12 h14 v12 h14"
//             fill="none"
//           />
//           {/* corner towers */}
//           <path d="M96 232 L96 132 L112 132 L112 124 L128 104 L144 124 L144 132 L160 132 L160 232 Z" />
//           <path d="M240 232 L240 132 L256 132 L256 124 L272 104 L288 124 L288 132 L304 132 L304 232 Z" />
//           {/* windows */}
//           <g fill="#ffb36b" fillOpacity="0.75" stroke="none">
//             <rect x="192" y="130" width="16" height="26" rx="8" />
//             <rect x="192" y="176" width="16" height="26" rx="8" />
//             <rect x="118" y="160" width="12" height="20" rx="6" />
//             <rect x="270" y="160" width="12" height="20" rx="6" />
//           </g>
//         </g>
//       </svg>

//       {/* vignette for text contrast */}
//       <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_35%,rgba(10,10,10,0.72)_100%)]" />
//       <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 to-transparent" />
//       <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
//     </div>
//   );
// }

/**
 * Painted immediately on first render — a warm sanctuary scene with sunlight
 * streaming through a stained-glass rose window above a cathedral silhouette.
 * This is the complete hero when WebGL is unavailable, so it has to feel
 * finished on its own.
 */
export function HeroPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1208]" aria-hidden>
      {/* Deep sanctuary base — warm charcoal, not black */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1208_0%,#2a1d10_45%,#3d2817_100%)]" />

      {/* Morning light pouring down from behind the window */}
      <div className="animate-glow-pulse absolute inset-x-0 top-0 h-[85%] bg-[radial-gradient(60%_55%_at_50%_30%,rgba(255,214,140,0.42),transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(35%_40%_at_50%_22%,rgba(255,236,189,0.55),transparent_70%)]" />

      {/* Volumetric light shafts — the "God rays" through the window */}
      <div
        className="absolute inset-x-0 top-[8%] h-[80%] opacity-55 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,220,150,0.18) 10deg, transparent 20deg, rgba(255,220,150,0.14) 32deg, transparent 44deg, rgba(255,220,150,0.2) 56deg, transparent 68deg, rgba(255,220,150,0.14) 80deg, transparent 90deg)",
          filter: "blur(2px)",
        }}
      />

      {/* Dust-mote particles catching the light (static, subtle) */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 34%, rgba(255,230,180,0.5) 0.5px, transparent 1.5px), radial-gradient(circle at 68% 52%, rgba(255,230,180,0.4) 0.5px, transparent 1.5px), radial-gradient(circle at 44% 68%, rgba(255,230,180,0.5) 0.5px, transparent 1.5px), radial-gradient(circle at 82% 28%, rgba(255,230,180,0.4) 0.5px, transparent 1.5px), radial-gradient(circle at 14% 72%, rgba(255,230,180,0.4) 0.5px, transparent 1.5px)",
          backgroundSize: "280px 280px, 340px 340px, 220px 220px, 300px 300px, 260px 260px",
        }}
      />

      {/* Stained-glass rose window + cathedral interior silhouette */}
      <svg
        viewBox="0 0 400 400"
        className="absolute top-0 left-1/2 h-full w-[min(96vw,900px)] -translate-x-1/2"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          {/* Stained-glass gradients — jewel tones */}
          <radialGradient id="rose-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#ffc166" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c7721a" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="rose-petal-warm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb86b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a3a0f" stopOpacity="0.75" />
          </radialGradient>
          <radialGradient id="rose-petal-cool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ec4e8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2a4a6b" stopOpacity="0.75" />
          </radialGradient>

          {/* Interior stone — warm sandstone */}
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2817" />
            <stop offset="100%" stopColor="#1a1208" />
          </linearGradient>

          {/* Floor glow where light pools */}
          <radialGradient id="floor-light" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#ffd48a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffd48a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Rose window — centered high, suggesting the apex of the sanctuary */}
        <g transform="translate(200 110)">
          {/* Outer stone ring */}
          <circle r="68" fill="none" stroke="#2a1d10" strokeWidth="6" />
          <circle r="62" fill="#1a1208" />

          {/* 8 outer petals, alternating warm/cool jewel tones */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const fill = i % 2 === 0 ? "url(#rose-petal-warm)" : "url(#rose-petal-cool)";
            return (
              <g key={i} transform={`rotate(${angle})`}>
                <path
                  d="M 0 -58 Q 14 -40 10 -24 Q 0 -18 -10 -24 Q -14 -40 0 -58 Z"
                  fill={fill}
                  stroke="#2a1d10"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Inner ring of 8 smaller panes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8 + 22.5;
            return (
              <g key={`inner-${i}`} transform={`rotate(${angle})`}>
                <circle
                  cx="0"
                  cy="-18"
                  r="6"
                  fill={i % 2 === 0 ? "#ffb86b" : "#9ec4e8"}
                  fillOpacity="0.75"
                  stroke="#2a1d10"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Center — the sun/light */}
          <circle r="14" fill="url(#rose-center)" stroke="#2a1d10" strokeWidth="1.5" />
          <circle r="4" fill="#fff4d6" />
        </g>

        {/* Two tall gothic lancet windows flanking the rose */}
        <g>
          {/* Left lancet */}
          <path
            d="M 70 180 Q 70 148 90 148 Q 110 148 110 180 L 110 280 L 70 280 Z"
            fill="#ffb86b"
            fillOpacity="0.55"
            stroke="#2a1d10"
            strokeWidth="2"
          />
          <line x1="90" y1="150" x2="90" y2="280" stroke="#2a1d10" strokeWidth="1.5" />
          <line x1="70" y1="215" x2="110" y2="215" stroke="#2a1d10" strokeWidth="1.5" />

          {/* Right lancet */}
          <path
            d="M 290 180 Q 290 148 310 148 Q 330 148 330 180 L 330 280 L 290 280 Z"
            fill="#ffb86b"
            fillOpacity="0.55"
            stroke="#2a1d10"
            strokeWidth="2"
          />
          <line x1="310" y1="150" x2="310" y2="280" stroke="#2a1d10" strokeWidth="1.5" />
          <line x1="290" y1="215" x2="330" y2="215" stroke="#2a1d10" strokeWidth="1.5" />
        </g>

        {/* Interior architecture — pointed arches framing the view */}
        <g fill="url(#stone)" stroke="#4a3220" strokeWidth="1">
          {/* Left pillar + arch */}
          <path d="M 0 400 L 0 60 L 40 60 L 40 240 Q 40 180 140 160 L 140 400 Z" />
          {/* Right pillar + arch */}
          <path d="M 400 400 L 400 60 L 360 60 L 360 240 Q 360 180 260 160 L 260 400 Z" />
        </g>

        {/* Pews suggested as horizontal bands in the lower nave */}
        <g fill="#1a1208" opacity="0.85">
          <rect x="150" y="340" width="100" height="6" rx="1" />
          <rect x="145" y="358" width="110" height="6" rx="1" />
          <rect x="140" y="378" width="120" height="7" rx="1" />
        </g>

        {/* Central aisle light pool */}
        <ellipse cx="200" cy="395" rx="90" ry="30" fill="url(#floor-light)" />
      </svg>

      {/* Gentle vignette — enough contrast for text without going dark */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_50%_42%,transparent_30%,rgba(20,12,6,0.55)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1a1208]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#1a1208] via-[#1a1208]/75 to-transparent" />
    </div>
  );
}