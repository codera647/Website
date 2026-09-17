// Temporarily pause public Work navigation without removing pages or content.
// Set this to true to restore every link using SiteLink.
export const WORK_NAVIGATION_ENABLED = false;

export function isWorkNavigationDisabled(href: string): boolean {
  if (WORK_NAVIGATION_ENABLED) return false;

  try {
    const url = new URL(href, "https://thekinetiq.solutions");
    const siteHosts = [
      "thekinetiq.solutions",
      "www.thekinetiq.solutions",
      "localhost",
      "127.0.0.1",
      "[::1]",
    ];
    return (
      siteHosts.includes(url.hostname) &&
      (url.pathname === "/work" || url.pathname.startsWith("/work/"))
    );
  } catch {
    return false;
  }
}
