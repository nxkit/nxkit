export function normalizeArgValue(argValue: boolean | string | number) {
  if (typeof argValue === 'boolean' && argValue) {
    return undefined;
  }

  return argValue;
}
