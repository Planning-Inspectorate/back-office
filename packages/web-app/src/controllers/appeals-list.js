const views = require('../config/views');

const getAppealsList = (req, res) => {
  const appealsListData = [
    {
      id: 'db9cc77a-7991-42e5-a917-0fc73e4ccd49',
      reference: 'APP/Q9999/D/21/1234567',
      dateReceived: '16 May 2021',
      site: '96 The Avenue, Maidstone, Kent, MD2 5XY',
    },
    {
      id: '6ff03eb3-40f2-4e0e-8206-d7720e59d1cb',
      reference: 'APP/Q9999/D/21/5463281',
      dateReceived: '16 May 2021',
      site: '55 Butcher Street, Thurnscoe, S63 0RB',
    },
    {
      id: 'f81695aa-0eb8-4744-95e6-0c4e0c4d6666',
      reference: 'APP/Q9999/D/21/1203521',
      dateReceived: '16 May 2021',
      site: '8 The Chase, Findon, BN14 0TT',
    },
    {
      id: '36a8d442-bf4b-4a3b-b07e-a8feb6ac5928',
      reference: 'APP/Q9999/D/21/1154923',
      dateReceived: '17 May 2021',
      site: '44 Rivervale, Bridport, DT6 5RN',
    },
    {
      id: '4a96993d-3616-4aa5-afa6-fb0af00e3ce8',
      reference: 'APP/Q9999/D/21/1087562',
      dateReceived: '17 May 2021',
      site: '92 Huntsmoor Road, Tadley, RG26 4BX',
    },
    {
      id: 'af828a38-bfd5-493c-a0e7-f3fb77ac0bed',
      reference: 'APP/Q9999/D/21/1365524',
      dateReceived: '18 May 2021',
      site: '29 St Marys Gardens, Hilperton Marsh, BA1 7PQ',
    },
    {
      id: 'e06ea69b-e367-4acf-b98d-92d80ac960c5',
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
