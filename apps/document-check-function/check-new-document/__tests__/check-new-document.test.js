import test from 'ava';
import NodeClam from 'clamscan';
import got from 'got';
import ReadableStream from 'node:stream';
import sinon from 'sinon';
import { checkMyBlob } from '../index.js';

const fileStream = new ReadableStream();

const patchStub = sinon.stub().returns({ json: sinon.stub() });

test.before('set up mocks', () => {
	sinon.stub(got, 'patch').callsFake(patchStub);
});

test.serial('throws error if blob path doesnt have 4 parts', async (t) => {
	const error = await t.throwsAsync(async () => {
		await checkMyBlob({ bindingData: { uri: '/applications/1/test.pdf' } }, fileStream);
	});

	t.is(error?.message, 'Unexpected blob URI /applications/1/test.pdf');
});

test.serial("sends 'passed' machine action to back office if passed AV check", async (t) => {
	sinon
		.stub(NodeClam.prototype, 'init')
		.returns({ scanStream: sinon.stub().returns({ isInfected: false }) });
	await checkMyBlob({ bindingData: { uri: '/applications/1/123-345/test.pdf' } }, fileStream);
	t.is(true, true);

	sinon.assert.calledWith(patchStub, 'test-api-host:3000/applications/1/documents/123-345/status', {
		json: { machineAction: 'check_pass' }
	});
	NodeClam.prototype.init.restore();
});

test.serial("sends 'failed' machine action to back office if failed AV check", async (t) => {
	sinon
		.stub(NodeClam.prototype, 'init')
		.returns({ scanStream: sinon.stub().returns({ isInfected: true }) });
	await checkMyBlob({ bindingData: { uri: '/applications/1/123-345/test.pdf' } }, fileStream);
	t.is(true, true);

	sinon.assert.calledWith(patchStub, 'test-api-host:3000/applications/1/documents/123-345/status', {
		json: { machineAction: 'check_fail' }
	});
});
