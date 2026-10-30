export type CatMood = "sleep" | "sit" | "happy" | "proud";

export function Cat({
  mood = "sit",
  className = "",
}: {
  mood?: CatMood;
  className?: string;
}) {
  const eye = mood === "sleep" ? "closed" : mood === "proud" ? "spark" : "open";
  return (
    <svg viewBox="0 0 140 120" className={className} aria-hidden="true">
      <ellipse cx="78" cy="108" rx="36" ry="7" fill="#e7cbb8" opacity="0.7" />
      <path d="M96 78c18 2 28 14 24 24-8 2-22-4-30-12" fill="#f3b7a4" />
      <path d="M28 46l10 18 16-12z" fill="#f6d2c2" />
      <path d="M58 40l8 20 16-10z" fill="#f6d2c2" />
      <path d="M34 52l6 8 8-6z" fill="#f4a7b5" />
      <path d="M62 48l5 8 8-5z" fill="#f4a7b5" />
      <ellipse cx="48" cy="74" rx="28" ry="24" fill="#f7d7c8" />
      <ellipse cx="46" cy="78" rx="16" ry="12" fill="#fff7f2" />
      {eye === "closed" ? (
        <>
          <path d="M34 70h10" stroke="#5c4038" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 70h10" stroke="#5c4038" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="38" cy="70" rx="3.2" ry={eye === "spark" ? 3.6 : 3.2} fill="#5c4038" />
          <ellipse cx="58" cy="70" rx="3.2" ry={eye === "spark" ? 3.6 : 3.2} fill="#5c4038" />
          <circle cx="39" cy="69" r="1" fill="white" />
          <circle cx="59" cy="69" r="1" fill="white" />
        </>
      )}
      <path d="M46 76l4 3 4-3" fill="none" stroke="#e18b96" strokeWidth="1.6" strokeLinejoin="round" />
      {mood === "happy" || mood === "proud" ? (
        <path d="M42 84c3 4 9 4 12 0" fill="none" stroke="#5c4038" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M44 84h8" stroke="#5c4038" strokeWidth="1.6" strokeLinecap="round" />
      )}
      <ellipse cx="30" cy="78" rx="4" ry="2.4" fill="#f4a7b5" opacity="0.8" />
      <ellipse cx="66" cy="78" rx="4" ry="2.4" fill="#f4a7b5" opacity="0.8" />
      <path d="M22 74h8M20 80h8M64 74h8M66 80h8" stroke="#d9a898" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function moodFor(percent: number): CatMood {
  if (percent <= 0) return "sleep";
  if (percent < 45) return "sit";
  if (percent < 80) return "happy";
  return "proud";
}
