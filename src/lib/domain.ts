const MAIN_SITE_ORIGIN = 'https://www.multilingual.no';

export function isCvDomain(hostname: string = window.location.hostname): boolean {
  return hostname === 'cv.multilingual.no' || hostname.startsWith('cv.');
}

export function resolveCrossDomainHref(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return isCvDomain() ? `${MAIN_SITE_ORIGIN}${normalizedPath}` : normalizedPath;
}
