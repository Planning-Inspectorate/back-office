const views = require('../config/views');

const getAppealSearch = async (req, res) => {
  res.render(views.search, {
    pageTitle: 'Dashboard',
  });
};

const postAppealSearch = async (req, res) => {
  const { searchString } = req.body;
  res.redirect(`/${views.search}/${searchString}`);
};

module.exports = {
  getAppealSearch,
  postAppealSearch,
};
