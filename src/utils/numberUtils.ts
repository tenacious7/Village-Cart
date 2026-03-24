export const toOdiaNumerals = (num: number): string => {
  const odiaNumerals = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : odiaNumerals[digit];
    })
    .join('');
};
