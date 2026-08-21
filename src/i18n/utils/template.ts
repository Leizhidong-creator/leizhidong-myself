export const compileTemplate = (template = ""): ((variables: Record<string, string>) => string) => {
  if (typeof template !== "string") return () => template;
  const parts = template.split(/({.*?})/);

  return (variables) => {
    return parts
      .map((part) => (part.startsWith("{") && part.endsWith("}") ? (variables[part.slice(1, -1)] ?? part) : part))
      .join("");
  };
};
