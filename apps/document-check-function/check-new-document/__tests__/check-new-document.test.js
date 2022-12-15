import test from 'ava';
import got from 'got';
import { Readable } from 'node:stream';
import sinon from 'sinon';
import { clamAvClient } from '../clam-av-client.js';
import { checkMyBlob } from '../index.js';

const fileStream = new Readable();
const backOfficePatchStub = sinon.stub().returns({ json: sinon.stub() });
const documentStorageDeleteStub = sinon.stub().returns({ json: sinon.stub() });
const errorStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(got, 'patch').callsFake(backOfficePatchStub);
	sinon.stub(got, 'delete').callsFake(documentStorageDeleteStub);
});

test.serial('throws error if blob path doesnt have 4 parts', async (t) => {
	const error = await t.throwsAsync(async () => {
		await checkMyBlob(
			{ bindingData: { uri: '/applications/1/test.pdf' }, error: errorStub },
			fileStream
		);
	});

	t.is(error?.message, 'Unexpected blob URI /applications/1/test.pdf');
});

test.serial("sends 'passed' machine action to back office if passed AV check", async (t) => {
	sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: false });
	await checkMyBlob(
		{ bindingData: { uri: '/applications/1/123-345/test.pdf' }, error: errorStub },
		fileStream
	);
	t.is(true, true);

	sinon.assert.calledWith(
		backOfficePatchStub,
		'test-api-host:3000/applications/1/documents/123-345/status',
		{
			json: { machineAction: 'check_pass' }
		}
	);
	clamAvClient.scanStream.restore();
});

test.serial("sends 'failed' machine action to back office if failed AV check", async (t) => {
	sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });
	await checkMyBlob(
		{ bindingData: { uri: '/applications/1/123-345/test.pdf' }, error: errorStub },
		fileStream
	);
	t.is(true, true);

	sinon.assert.calledWith(
		backOfficePatchStub,
		'test-api-host:3000/applications/1/documents/123-345/status',
		{
			json: { machineAction: 'check_fail' }
		}
	);
	sinon.assert.calledWith(documentStorageDeleteStub, 'document-storage-api/document', {
		json: { documentPath: '/applications/1/123-345/test.pdf' }
	});
});
