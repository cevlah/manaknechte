export function getColorGradient(colors: string[]) {
  if (!colors || colors.length === 0) {
    return "linear-gradient(135deg, #444, #222)";
  }

  const map: Record<string, string> = {
    W: "#f5f5dc",
    U: "#4da6ff",
    B: "#2b2b2b",
    R: "#ff4d4d",
    G: "#4caf50",
  };

  const selected = colors.map(c => map[c] || "#888");

  return `linear-gradient(135deg, ${selected.join(", ")})`;
}