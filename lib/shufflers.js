export const unshuffleImage = (rndIndexes, pixelsData) => {
  const tmpArr = [...pixelsData];
  const len = tmpArr.length;
  const tmpIndexes = rndIndexes;

  for (let i = len - 4; i >= 0; i -= 4) {
    const rnd = tmpIndexes[(i / 4)];
    const iSlice = tmpArr.slice(i, i + 4);

    tmpArr[i] = tmpArr[rnd];
    tmpArr[(i + 1)] = tmpArr[(rnd + 1)];
    tmpArr[(i + 2)] = tmpArr[(rnd + 2)];
    tmpArr[(i + 3)] = tmpArr[(rnd + 3)];

    tmpArr[rnd] = iSlice[0];
    tmpArr[(rnd + 1)] = iSlice[1];
    tmpArr[(rnd + 2)] = iSlice[2];
    tmpArr[(rnd + 3)] = iSlice[3];
  }
  return tmpArr;
};

export const shuffleImage = (rndIndexes, pixelsData) => {
  const tmpArr = [...pixelsData];
  const len = tmpArr.length;
  const tmpIndexes = rndIndexes;
  for (let i = 0; i <= len - 4; i += 4) {
    const rnd = tmpIndexes[(i / 4)];

    const iSlice = tmpArr.slice(i, i + 4);
    tmpArr[i] = tmpArr[rnd];
    tmpArr[(i + 1)] = tmpArr[(rnd + 1)];
    tmpArr[(i + 2)] = tmpArr[(rnd + 2)];
    tmpArr[(i + 3)] = tmpArr[(rnd + 3)];

    tmpArr[rnd] = iSlice[0];
    tmpArr[(rnd + 1)] = iSlice[1];
    tmpArr[(rnd + 2)] = iSlice[2];
    tmpArr[(rnd + 3)] = iSlice[3];
  }
  return tmpArr;
};

export const randomIndexes = (rng, pixelsData) => {
  const rndArr = [];
  for (let i = 0; i <= pixelsData.length - 4; i += 4) {
    const max = ((pixelsData.length) / 4);
    const rnd = 4 * (Math.floor(rng() * max));
    rndArr.push(rnd);
  }
  return rndArr;
};
