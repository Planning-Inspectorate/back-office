export const hasOneOf = (object = {}, keys = []) => {
  return Object.keys(object).some(key => keys.includes(key));
};
