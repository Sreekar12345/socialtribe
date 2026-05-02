const HANDLE_PATTERN = /^@[a-zA-Z0-9._]{1,30}$/;
const UNAVAILABLE_HANDLES = new Set(['@test', '@invalid', '@fakeuser']);

export const validateInstagramHandle = (handle: string) => {
  if (handle.length < 2 || handle.length > 31) return false;
  if (!handle.startsWith('@')) return false;
  if (handle.includes(' ')) return false;
  if (handle.includes('..')) return false;
  return HANDLE_PATTERN.test(handle);
};

export const checkInstagramExists = async (handle: string) => {
  const delay = 500 + Math.floor(Math.random() * 301);
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return !UNAVAILABLE_HANDLES.has(handle.toLowerCase());
};
