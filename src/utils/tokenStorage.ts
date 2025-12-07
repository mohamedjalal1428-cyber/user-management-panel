const KEY = "app_auth_token_v1";

const set = (token: string) => {
  try {
    const ob = btoa(JSON.stringify({ t: token, i: Date.now() }));
    localStorage.setItem(KEY, ob);
  } catch (e) {
    console.error("tokenStorage.set failed", e);
  }
};

const get = (): string | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(atob(raw));
    return parsed?.t ?? null;
  } catch {
    return null;
  }
};

const remove = () => {
  localStorage.removeItem(KEY);
};

export default { set, get, remove };
