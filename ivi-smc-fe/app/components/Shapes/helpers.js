export const euclideanDistance = (arr1, arr2) => {
  let sum = 0;
  for (let n = 0; n < arr1.length; n++) {
    sum += (arr1[n] - arr2[n]) ** 2;
  }
  return Math.sqrt(sum);
};
