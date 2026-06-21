import { useLocation } from "wouter";

export function useNavigate() {
  const [, setLocation] = useLocation();
  return (href: string) => {
    setLocation(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
