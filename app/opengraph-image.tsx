import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const poppinsBold = await readFile(join(process.cwd(), "fonts/Poppins-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #c0dece 0%, #99a896 60%, #5f6149 100%)",
          fontFamily: "Poppins",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 132,
            height: 132,
            borderRadius: "50%",
            background: "#f8faf8",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            boxShadow: "0 18px 40px rgba(24,52,46,0.25)",
          }}
        >
          <span style={{ fontSize: 68 }}>🐾</span>
        </div>
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            color: "#464834",
            marginBottom: 14,
          }}
        >
          JEROMOS EGYESÜLET
        </div>
        <div
          style={{
            fontSize: 58,
            color: "#343334",
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.15,
          }}
        >
          Minden kutya hazatalálhat
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Poppins", data: poppinsBold, weight: 700, style: "normal" }],
    }
  );
}
