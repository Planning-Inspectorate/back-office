const views = require('../../config/views');

const getAnyOfFollowing = async (req, res) => {
  res.render(views.anyOfFollowing, {});
};

const postAnyOfFollowing = async (req, res) => {
  res.render(views.anyOfFollowing, {});
};

module.exports = {
  getAnyOfFollowing,
  postAnyOfFollowing,
};
