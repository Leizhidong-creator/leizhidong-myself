import { compileTemplate } from "./template";
import { translations } from "../store";

export const t = (key: string, props: { [key: string]: any } = {}) => {
  const translation = translations.value[key];
  if (!translation) return "";

  const render = compileTemplate(translation);
  return render(props);
};
