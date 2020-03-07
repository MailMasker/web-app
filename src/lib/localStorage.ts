function callLocalStorage(
  method: "setItem" | "getItem" | "removeItem",
  accountId: string,
  key: string,
  value?: string
) {
  try {
    switch (method) {
      case "setItem":
        if (!value) {
          throw new Error("Missing value for localStorage.setItem() call");
        }
        return window.localStorage.setItem(`s/${accountId}/${key}`, value);
      case "getItem":
        return window.localStorage.getItem(`s/${accountId}/${key}`);
      case "removeItem":
        return window.localStorage.removeItem(`s/${accountId}/${key}`);
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function setItem(accountId: string, key: string, value?: string) {
  return callLocalStorage("setItem", accountId, key, value);
}

export function getItem(accountId: string, key: string) {
  return callLocalStorage("getItem", accountId, key);
}

export function removeItem(accountId: string, key: string) {
  return callLocalStorage("removeItem", accountId, key);
}

export default { setItem, getItem, removeItem };
