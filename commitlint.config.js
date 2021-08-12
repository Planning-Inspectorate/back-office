module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message) => message.startsWith('Auto-release'),
    (message) => message.includes('[ci skip]'),
  ],
};
