const suffixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const fileSizeDisplay = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return (!bytes && '0Bytes') || `${(bytes / 1000 ** i).toFixed()}${suffixes[i]}`;
};

module.exports = fileSizeDisplay;
