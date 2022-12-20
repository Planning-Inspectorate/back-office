import test from 'ava';
import got, { HTTPError } from 'got';
import { Readable } from 'node:stream';
import sinon from 'sinon';
import { clamAvClient } from '../clam-av-client.js';
import { checkMyBlob } from '../index.js';

const fileStream = new Readable();
const backOfficePatchStub = sinon.stub().returns({ json: sinon.stub() });
const documentStorageDeleteStub = sinon.stub();

documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345/test.pdf' }
	})
	.returns({ json: sinon.stub() });

const errorResponse = {
	body: '{"errors":{"documentPath":"Document does not exist in Blob Storage"}}',
	statusCode: 404
};
// @ts-ignore
const httpError = new HTTPError(errorResponse);

// @ts-ignore
httpError.response = errorResponse;

documentStorageDeleteStub
	.withArgs('http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345/test-that-has-been-deleted.pdf' }
	})
	.throwsException(httpError);

const errorStub = sinon.stub();
const infoStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(got, 'patch').callsFake(backOfficePatchStub);
	sinon.stub(got, 'delete').callsFake(documentStorageDeleteStub);
});

test.serial('throws error if blob path doesnt have 4 parts', async (t) => {
	const error = await t.throwsAsync(async () => {
		await checkMyBlob(
			{ bindingData: { uri: '/applications/1/test.pdf' }, error: errorStub, info: infoStub },
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

test.serial(
	"sends 'failed' machine action to back office even if already deleted from blob storage",
	async (t) => {
		sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });
		await checkMyBlob(
			{
				bindingData: { uri: '/applications/1/123-345/test-that-has-been-deleted.pdf' },
				error: errorStub,
				info: infoStub
			},
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
		clamAvClient.scanStream.restore();
	}
);

test.serial("sends 'failed' machine action to back office if failed AV check", async (t) => {
	sinon.stub(clamAvClient, 'scanStream').returns({ isInfected: true });
	await checkMyBlob(
		{ bindingData: { uri: '/applications/1/123-345/test.pdf' }, error: errorStub, info: infoStub },
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
	sinon.assert.calledWith(documentStorageDeleteStub, 'http://localhost:3001/document', {
		json: { documentPath: '/applications/1/123-345/test.pdf' }
	});
});
