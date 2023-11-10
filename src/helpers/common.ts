export const getCommand = (args: string): string => args?.split('@')[0].substring(1);
export const log = <T>(obj: T): T => {
  console.log(obj);
  return obj;
};
export const addSearchParams = (
  url: URL,
  params: Record<string, string> = {},
): URL =>
  new URL(
    `${url.origin}${url.pathname}?${new URLSearchParams(
      Object.entries(
        Object.fromEntries([
          ...Array.from(url.searchParams.entries()),
          ...Object.entries(params),
        ]),
      ),
    ).toString()}`,
  );

export const htmlEscape = (text: string) =>
  text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const generateKey = () => {
  const chars = 'qwertyuiopasdfghjklzxcvbnm' + 'qwertyuiopasdfghjklzxcvbnm'.toUpperCase() + '0123456789';
  const length = 20;
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};
