export const convertTo2DArray = (arr: [], cols = 2) => {
  const result = [];
  for (let i = 0; i < arr.length / cols; i++) {
    const row = arr.slice(i * cols, (i + 1) * cols);
    result.push(row);
  }

  return result;
};
