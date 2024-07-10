export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const generateUniqueId = () =>
  "xxxx_4xx_yxxx_xxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateTime = (
  value: string,
  timeZone: string = getUserTimeZone()
) => {
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("default", {
      dateStyle: "long",
      timeStyle: "long",
      timeZone,
    })?.format(date);
  }
  return value;
};
