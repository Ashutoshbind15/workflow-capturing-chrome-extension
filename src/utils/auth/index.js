export const getCurrentTokenCookie = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = url.hostname;

  const cookies = await getDomainCookies(domain);
  const tokenCookie = cookies.find((cookie) => cookie.name === "token");
  return tokenCookie;
};

export async function getDomainCookies(domain) {
  try {
    const cookies = await chrome.cookies.getAll({ domain });

    if (cookies.length === 0) {
      return [];
    }

    return cookies;
  } catch (error) {
    return `Unexpected error: ${error.message}`;
  }
}
