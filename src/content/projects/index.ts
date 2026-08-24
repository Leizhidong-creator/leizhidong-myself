import type { Locale } from "../../i18n/types";
import type { ProjectContent } from "../types";

export const projectIds = ["garden-dream", "zhiyan-agent", "pet-agent"] as const;

export type ProjectModuleLoader = () => Promise<{ default: ProjectContent }>;

function simplifyModules(glob: Record<string, ProjectModuleLoader>) {
  const result: Record<string, ProjectModuleLoader> = {};
  for (const [path, mod] of Object.entries(glob)) {
    const match = path.match(/\/([a-z0-9_-]+)\.ts$/i);
    if (match) result[match[1] as string] = mod;
  }
  return result;
}

export const projectModules = {
  de: simplifyModules(import.meta.glob<{ default: ProjectContent }>("./de/*.ts")),
  en: simplifyModules(import.meta.glob<{ default: ProjectContent }>("./en/*.ts")),
} as const satisfies Record<Locale, Record<string, ProjectModuleLoader>>;
