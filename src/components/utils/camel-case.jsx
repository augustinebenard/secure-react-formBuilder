
export const toCamelCase = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (chr) => chr.toUpperCase());
  };
  