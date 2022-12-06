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

test.serial("sends 'passed' machine action to back office if passed AV check", async (t) => {
	sinon
		.stub(NodeClam.prototype, 'init')
		.returns({ scanStream: sinon.stub().returns({ isInfected: false }) });
	await checkMyBlob({ bindingData: { uri: 'applications/1/123-345' } }, fileStream);
	t.is(true, true);

	sinon.assert.calledWith(
		patchStub,
		'http://localhost:3000/applications/1/documents/123-345/status',
		{ json: { machineAction: 'passed' } }
	);
	NodeClam.prototype.init.restore();
});

test.serial("sends 'failed' machine action to back office if failed AV check", async (t) => {
	sinon
		.stub(NodeClam.prototype, 'init')
		.returns({ scanStream: sinon.stub().returns({ isInfected: true }) });
	await checkMyBlob({ bindingData: { uri: 'applications/1/123-345' } }, fileStream);
	t.is(true, true);

	sinon.assert.calledWith(
		patchStub,
		'http://localhost:3000/applications/1/documents/123-345/status',
		{ json: { machineAction: 'failed' } }
	);
});
