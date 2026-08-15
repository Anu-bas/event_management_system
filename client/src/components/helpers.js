export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function monthAbbr(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}
export function dayNum(iso) {
  return new Date(iso + "T00:00:00").getDate();
}
export function fmtTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${ap}`;
}
export function initials(name) {
  return (name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
