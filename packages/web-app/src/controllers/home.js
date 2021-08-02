const views = require('../config/views');

const getHome = (req, res) => {
  res.redirect(`/${views.appealsList}`);
};

module.exports = getHome;
