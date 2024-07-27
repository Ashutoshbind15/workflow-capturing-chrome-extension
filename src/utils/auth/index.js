export const getCurrentTokenCookie = async () => {
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // const url = new URL(tab.url);
  // const domain = url.hostname;

  // console.log("domain", domain);

  const cookies = await getDomainCookies("localhost");
  const tokenCookie = cookies.find((cookie) => cookie.name === "token");
  return tokenCookie;
};

export const getWorkflowId = async () => {
  const cookies = await getDomainCookies("localhost");
  const workflowIdCookie = cookies.find((cookie) => cookie.name === "wid");
  return workflowIdCookie;
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
