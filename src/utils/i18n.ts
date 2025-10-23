// Client helper to set the app locale via cookie and reload.
export function setLang(lang: string, reload = true) {
  const name = "NEXT_LOCALE";
  const value = encodeURIComponent(lang);
  // Expires in 1 year
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; sameSite=lax`;
  // Optionally reload so server picks up the new locale via cookie
  if (reload) {
    window.location.reload();
  }
}
