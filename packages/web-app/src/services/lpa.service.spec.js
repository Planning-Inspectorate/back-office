const { getLpa } = require('./lpa.service');

describe('#getLpa', () => {
  it('should return correct data', async () => {
    const id = 12345;
    const lpa = await getLpa(id);
    expect(lpa.id).toEqual(id);
    expect(lpa.name).toEqual('Miss Mock Lpa');
    expect(lpa.email).toEqual('AppealPlanningDecisionTest@planninginspectorate.gov.uk');
  });
});
