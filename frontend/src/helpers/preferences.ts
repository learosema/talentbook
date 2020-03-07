export function testMediaQuery(query: string): boolean {
  const hasMediaQuery = 'matchMedia' in window;
  const mediaQuery = hasMediaQuery && window.matchMedia(query);
  return Boolean(mediaQuery && mediaQuery.matches);
}

export function isDarkTheme() {
  const preferredTheme = localStorage.getItem('talentBookTheme');
  if (preferredTheme !== null) {
    return preferredTheme === 'dark';
  }
  return testMediaQuery('(prefers-color-scheme: dark)');
}
