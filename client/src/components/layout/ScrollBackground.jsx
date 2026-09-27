import { useState, useEffect } from "react";

const bgImages = [
  "/bg/bg1.jpg",
  "/bg/bg2.jpg",
  "/bg/bg3.jpg",
  "/bg/bg4.jpg",
  "/bg/bg5.jpg",
  "/bg/bg6.jpg",
  "/bg/bg7.jpg",
  "/bg/bg8.jpg",
];

export default function ScrollBackground() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
      const index = Math.min(bgImages.length - 1, Math.floor(scrollRatio * bgImages.length));
      setActiveIdx(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {bgImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === activeIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={img}
            alt="ARISE Background"
            className="h-full w-full object-cover filter brightness-[0.85] contrast-115 saturate-110"
          />
        </div>
      ))}
      {/* Transparent vignette overlay for depth without blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1013]/45 via-[#0e1013]/20 to-[#0e1013]/65 pointer-events-none" />
    </div>
  );
}
