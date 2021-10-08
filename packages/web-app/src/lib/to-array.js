const toArray = (candidate) => {
  const array = [];
  if (candidate) {
    if (Array.isArray(candidate)) {
      array.push(...candidate);
    } else {
      array.push(candidate);
    }
  }
  return array;
};

module.exports = toArray;
