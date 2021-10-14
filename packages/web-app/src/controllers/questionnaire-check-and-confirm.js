const reviewOutcome = {
  COMPLETE: 'COMPLETE',
  INCOMPLETE: 'INCOMPLETE',
};

const documents = ['Passport', 'Birth certificate'];

const siteAddress = {
  address1: 'Jaleno',
  address2: 'Church Lane',
  town: 'Eakring',
  city: 'NEWARK',
  postcode: 'NG22 ODH',
};

const compileAddress = (address) => {
  const mappedAddress = Object.values(address).map((item) => `${item} <br> `);
  return mappedAddress.toString().replace(/,/g, '');
};

const compileMissingDocuments = (items) => {
  const mappedDocuments = items.map((item) => `${item} <br>`);
  return mappedDocuments.toString().replace(/,/g, '');
};

const getConfirmationSections = (appealReference, outcome) => {
  const payload = {
    rows: [],
  };

  switch (outcome) {
    case reviewOutcome.INCOMPLETE: {
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
            html: compileMissingDocuments(documents),
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

const getBreadcrumbs = () => [
  {
    title: 'Questionnaires for review',
  },
  {
    title: 'APP/Q9999/D/21/1224115',
  },
  {
    title: 'Check and confirm',
  },
];

const getCheckAndConfirm = (req, res) => {
  const { appealId } = req.param;
  const { outcome } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Check and confirm',
    sections: getConfirmationSections(appealId, outcome),
    breadcrumbs: getBreadcrumbs(),
    reviewOutcome: outcome,
  });
};

module.exports = {
  getCheckAndConfirm,
  util: {
    compileMissingDocuments,
    compileAddress,
  },
};
