export const ALL_GLOBAL_CATEGORIES = ["ALL", "BASKETBALL", "CRICKET", "FOOTBALL", "TENNIS", "BOXING", "BASEBALL", "RUGBY", "ICE HOCKEY", "VOLLEYBALL"];

export interface SportInfo {
  name: string;
  color: string;
  img: string;
  catKey: string;
}

export const sportsLookup: Record<string, SportInfo> = {
  "basketball": { name: "Basketball", color: "#b43c00", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115766/tsn-sports/file_uh2eve.png", catKey: "Basketball" },
  "cricket": { name: "Cricket", color: "#1a50c2", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115806/tsn-sports/file_bsq78c.png", catKey: "Cricket" },
  "football": { name: "Football", color: "#008f3a", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115415/tsn-sports/file_cwcsta.png", catKey: "Football" },
  "tennis": { name: "Tennis", color: "#b48001", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115863/tsn-sports/file_dkygbz.png", catKey: "Tennis" },
  "boxing": { name: "Boxing", color: "#ff00a2", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115945/tsn-sports/file_wbystn.png", catKey: "Boxing" },
  "baseball": { name: "Baseball", color: "#4238bc", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116053/tsn-sports/file_x6okvk.png", catKey: "Baseball" },
  "rugby": { name: "Rugby", color: "#8129c5", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116094/tsn-sports/file_iofcyb.png", catKey: "Rugby" },
  "ice-hockey": { name: "Ice Hockey", color: "#01819b", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116129/tsn-sports/file_iieb7q.png", catKey: "Ice Hockey" },
  "volleyball": { name: "Volleyball", color: "#ba1c6c", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116171/tsn-sports/file_hoannk.png", catKey: "Volleyball" },
};

export const sportsList = [
  { key: "basketball", name: "Basketball", color: "#b43c00", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115766/tsn-sports/file_uh2eve.png" },
  { key: "cricket", name: "Cricket", color: "#1a50c2", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115806/tsn-sports/file_bsq78c.png" },
  { key: "football", name: "Football", color: "#008f3a", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115415/tsn-sports/file_cwcsta.png" },
  { key: "tennis", name: "Tennis", color: "#b48001", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115863/tsn-sports/file_dkygbz.png" },
  { key: "boxing", name: "Boxing", color: "#ff00a2", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115945/tsn-sports/file_wbystn.png" },
  { key: "baseball", name: "Baseball", color: "#4238bc", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116053/tsn-sports/file_x6okvk.png" },
  { key: "rugby", name: "Rugby", color: "#8129c5", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116094/tsn-sports/file_iofcyb.png" },
  { key: "ice-hockey", name: "Ice Hockey", color: "#01819b", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116129/tsn-sports/file_iieb7q.png" },
  { key: "volleyball", name: "Volleyball", color: "#ba1c6c", img: "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781116171/tsn-sports/file_hoannk.png" },
];

export function getSportLogo(cat: string): string {
  if (!cat) return "";
  const key = cat.toLowerCase().trim().replace(/\s+/g, "-");
  const found = sportsLookup[key];
  if (found) return found.img;
  return "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1781115415/tsn-sports/file_cwcsta.png";
}

export const API_URL = "https://tight-river-c898.ranatoufik66.workers.dev/?url=https://all-rounder-two.vercel.app/tsn";
