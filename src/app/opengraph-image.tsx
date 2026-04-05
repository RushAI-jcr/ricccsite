import { ImageResponse } from "next/og";

export const alt =
  "RICCC — ICU Data Science & Clinical Trials at Rush University, Chicago";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#006332",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          RICCC
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 28,
            fontWeight: 400,
            opacity: 0.9,
            marginBottom: "32px",
            lineHeight: 1.4,
          }}
        >
          <span>Rush Interdisciplinary Consortium for</span>
          <span>Critical Care Trials and Data Science</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: 20,
            opacity: 0.75,
          }}
        >
          <span>ICU Data Science</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Clinical Trials</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Federated Research</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>CLIF Consortium</span>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "48px",
            left: "80px",
            fontSize: 18,
            opacity: 0.6,
          }}
        >
          Rush University · Chicago, IL
        </div>
      </div>
    ),
    { ...size }
  );
}
