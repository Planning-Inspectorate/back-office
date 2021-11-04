const {
  QUESTIONNAIRE: { REVIEWOUTCOME },
} = require('../constants');
const {
  reviewQuestionnaire: previousPage,
  reviewQuestionnaireComplete: nextPage,
} = require('../config/views');

const siteAddress = {
  address1: 'Jaleno',
  address2: 'Church Lane',
  town: 'Eakring',
  city: 'NEWARK',
  postcode: 'NG22 ODH',
};

const compileAddress = (address) => {
  const mappedAddress = Object.values(address).map((item) => `${item} <br>`);
  return mappedAddress.toString().replace(/,/g, '');
};

const compileMissingDocuments = (items) => {
  const mappedDocuments = items.map((item) => `${item} <br>`);
  return mappedDocuments.toString().replace(/,/g, '');
};

const getConfirmationSections = (outcome, missingOrIncorrectDocuments) => {
  const payload = {
    rows: [],
  };

  switch (outcome) {
    case REVIEWOUTCOME.INCOMPLETE: {
      payload.rows.push(
        {
          key: {
            text: 'Review outcome',
          },
          value: {
            text: 'Incomplete',
          },
        },
        {
          key: {
            text: 'Missing or incorrect documents',
          },
          value: {
            html: compileMissingDocuments(missingOrIncorrectDocuments),
          },
        },
        {
          key: {
            text: 'Appeal reference',
          },
          value: {
            text: 'APP/Q9999/D/21/1224115',
          },
        },
        {
          key: {
            text: 'Appeal site',
          },
          value: {
            html: compileAddress(siteAddress),
          },
        },
        {
          key: {
            text: 'Local planning department',
          },
          value: {
            text: 'Newark and Sherwood District Council',
          },
        }
      );
      return payload;
    }

    default:
      payload.rows.push(
        {
          key: {
            text: 'Review outcome',
          },
          value: {
            text: 'Complete',
          },
        },
        {
          key: {
            text: 'Appeal reference',
          },
          value: {
            text: 'APP/Q9999/D/21/1224115',
          },
        },
        {
          key: {
            text: 'Appeal site',
          },
          value: {
            html: compileAddress(siteAddress),
          },
        },
        {
          key: {
            text: 'Local planning department',
          },
          value: {
            text: 'Newark and Sherwood District Council',
          },
        }
      );
      return payload;
  }
};

const getBreadcrumbs = (appealId) => [
  {
    text: 'Questionnaires for review',
    href: '/planning-inspectorate/appeals/questionnaires-for-review',
  },
  {
    text: 'APP/Q9999/D/21/1224115',
    href: `/planning-inspectorate/appeals/questionnaires-for-review/review/${appealId}`,
  },
  {
    text: 'Check and confirm',
    href: `/planning-inspectorate/appeals/questionnaires-for-review/check-and-confirm/${appealId}`,
  },
];

const getCheckAndConfirm = (req, res) => {
  const {
    appeal,
    questionnaire: { outcome, missingOrIncorrectDocuments },
  } = req.session;
  const appealId = appeal.id;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage,
    sections: getConfirmationSections(outcome, missingOrIncorrectDocuments),
    breadcrumbs: getBreadcrumbs(appealId),
    reviewOutcome: outcome,
  });
};

const postCheckAndConfirm = (req, res) => {
  res.redirect(`/${nextPage}`);
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
  util: {
    compileMissingDocuments,
    compileAddress,
  },
};
