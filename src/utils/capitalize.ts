export const capitalize = <K extends string>(str: K): Capitalize<K> => {
  if (!str) {
    return str as Capitalize<K>;
  }

  return str.replace(str[0], str[0].toUpperCase()) as Capitalize<K>;
};
