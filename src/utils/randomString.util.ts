interface Params {
  length: number;
  alph: string | null;
  prefix: string | null;
}

export default function (data: Params) {
  const { length, prefix } = data;
  let { alph } = data,
    result = prefix || '';

  if (!alph) {
    alph = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  while (result.length < (prefix ? prefix.length + length : length)) {
    result += alph[Math.floor(Math.random() * alph.length)];
  }

  return result;
}
