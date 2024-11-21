export function isValidLocale(
  locale: string,
  validLocales: readonly ['en', 'es']
): locale is 'en' | 'es' {
  return validLocales.includes(locale as 'en' | 'es');
}
