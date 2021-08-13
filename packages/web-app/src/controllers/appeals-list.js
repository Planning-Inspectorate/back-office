const views = require('../config/views');

const getAppealsList = (req, res) => {
  const appealsListData = [
    {
      reference: 'APP/Q9999/D/21/1234567',
      dateReceived: '16 May 2021',
      site: '96 The Avenue, Maidstone, Kent, MD2 5XY',
    },
    {
      reference: 'APP/Q9999/D/21/5463281',
      dateReceived: '16 May 2021',
      site: '55 Butcher Street, Thurnscoe, S63 0RB',
    },
    {
      reference: 'APP/Q9999/D/21/1203521',
      dateReceived: '16 May 2021',
      site: '8 The Chase, Findon, BN14 0TT',
    },
    {
      reference: 'APP/Q9999/D/21/1154923',
      dateReceived: '17 May 2021',
      site: '44 Rivervale, Bridport, DT6 5RN',
    },
    {
      reference: 'APP/Q9999/D/21/1087562',
      dateReceived: '17 May 2021',
      site: '92 Huntsmoor Road, Tadley, RG26 4BX',
    },
    {
      reference: 'APP/Q9999/D/21/1365524',
      dateReceived: '18 May 2021',
      site: '29 St Marys Gardens, Hilperton Marsh, BA1 7PQ',
    },
    {
      reference: 'APP/Q9999/D/21/1224115',
      dateReceived: '18 May 2021',
      site: '1 Grove Cottage, Shotesham Road, Woodton NR35 2ND',
    },
  ];

  res.render(views.appealsList, {
    appealsListData,
    pageTitle: 'Appeal submissions for review',
  });
};

module.exports = getAppealsList;
