import { locale } from "../store";

import type { Locale } from "../types";

export const changeLocale = (newLocale: Locale) => {
  locale.value = newLocale;
};
