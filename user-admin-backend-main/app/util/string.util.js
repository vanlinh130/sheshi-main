import numeral from 'numeral';

export function generateRandomCode (length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function formatMoney (amount, currencyCode) {
  return `${numeral(amount).format('0,0.00[000000]')} ${currencyCode}`;
}
