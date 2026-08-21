export const social = [
  { url: "mailto:gaddaladurgarao661@gmail.com", name: "mail" },
  { url: "https://github.com/leizhidong985985?tab=repositories", name: "github" },
  { url: "#wechat", name: "wechat" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" | "wechat" }[];
