import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Citadel of Grace — Christ Apostolic Church (CAC)";
export const size = { width: 1280, height: 630 };
export const contentType = "image/png";

const display = await readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff",
  ),
);
const displayItalic = await readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff",
  ),
);
const sans = await readFile(
  join(process.cwd(), "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"),
);
const seal = await readFile(join(process.cwd(), "public/seal.png"));
const sealSrc = `data:image/png;base64,${seal.toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0a0a0a 0%, #161616 55%, #1e1e1e 100%)",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* warm ember */}
      <div
        style={{
          position: "absolute",
          bottom: -160,
          width: 700,
          height: 420,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(255,179,107,0.35), rgba(255,122,26,0.12) 55%, transparent 75%)",
          display: "flex",
        }}
      />
      {/* hairline frame */}
      <div
        style={{
          position: "absolute",
          inset: 36,
          border: "1px solid rgba(255,122,26,0.45)",
          display: "flex",
        }}
      />

      <img
        src={sealSrc}
        alt=""
        width={132}
        height={132}
        style={{
          display: "flex",
          marginBottom: 22,
          borderRadius: 999,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
          color: "#ff7a1a",
          fontFamily: "Inter",
          fontSize: 22,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        Christ Apostolic Church (CAC)
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 18,
        fontFamily: "Cormorant Garamond",
        fontSize: 118,
        fontWeight: 400,
        }}
      >
        <span style={{ color: "#ffffff" }}>Citadel</span>
        <span style={{ color: "#ffb36b", fontStyle: "italic" }}>of Grace</span>
      </div>

      <div
        style={{
          display: "flex",
        marginTop: 22,
        fontFamily: "Inter",
        fontSize: 27,
          color: "rgba(255,255,255,0.75)",
        }}
      >
        A sanctuary of light — come as you are.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 62,
          display: "flex",
          gap: 28,
          fontFamily: "Inter",
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,122,26,0.9)",
        }}
      >
        <span>Service times online</span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
        <span>Watch live</span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
        <span>Give securely</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: display, style: "normal", weight: 400 },
        { name: "Cormorant Garamond", data: displayItalic, style: "italic", weight: 400 },
        { name: "Inter", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
