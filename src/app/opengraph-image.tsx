import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Ian Kengott — Research Software & Magnetic Materials at USF Physics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph card for the portfolio.
 * Rendered at request time so it always reflects the live brand.
 * Theme-aware: dark warm-night background with copper accents.
 */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #1c1814 0%, #16110d 50%, #1a1410 100%)",
          color: "#f4ece1",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Faint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(#b87333 1px, transparent 1px), linear-gradient(90deg, #b87333 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            display: "flex",
          }}
        />

        {/* Top: eyebrow + brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                border: "1px solid rgba(184,115,51,0.5)",
                background: "rgba(184,115,51,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 600,
                color: "#e09757",
                fontFamily: "Georgia, serif",
              }}
            >
              IK
            </div>
            <div
              style={{
                fontSize: "18px",
                fontFamily: "monospace",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#e09757",
                display: "flex",
              }}
            >
              USF Physics · Magnetic Materials
            </div>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: "rgba(244,236,225,0.5)",
              display: "flex",
            }}
          >
            github.com/iankengott
          </div>
        </div>

        {/* Middle: name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          <div
            style={{
              fontSize: "104px",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              display: "flex",
              background:
                "linear-gradient(100deg, #f4ece1 0%, #f4ece1 40%, #e09757 60%, #f4ece1 82%)",
              backgroundClip: "text",
              color: "transparent",
              fontFamily: "Georgia, serif",
            }}
          >
            Ian Kengott
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              lineHeight: 1.4,
              maxWidth: "920px",
              color: "rgba(244,236,225,0.78)",
              fontFamily: "Georgia, serif",
              display: "flex",
            }}
          >
            Research software, magnonics, x-ray spectromicroscopy tooling
            (MANTiS), and reproducible research infrastructure.
          </div>
        </div>

        {/* Bottom: tag chips */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            zIndex: 1,
          }}
        >
          {[
            "Magnonics",
            "Muon telescope",
            "MANTiS / x-ray",
            "Nix flakes",
            "Research automation",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "1px solid rgba(184,115,51,0.35)",
                background: "rgba(184,115,51,0.06)",
                fontSize: "18px",
                fontFamily: "monospace",
                color: "#e09757",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Copper hairline accent */}
        <div
          style={{
            position: "absolute",
            left: "72px",
            right: "72px",
            bottom: "180px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(184,115,51,0.55) 50%, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
