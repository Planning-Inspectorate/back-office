export const filterExists = (payload) => {
  return Object.keys(payload)
    .filter(key => payload[key] !== undefined)
    .reduce(
      (body, key) => ({
        ...body,
        [key]: payload[key]
      }),
      {}
    );
};
