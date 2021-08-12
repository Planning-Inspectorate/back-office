const fs = require('fs');
const yaml = require('js-yaml');
const logger = require('./logger');
const getYamlAsJson = require('./get-yaml-as-json');

const mockFileContents = { mocked: true };
const mockFilePath = '../../api/openapi.yaml';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('js-yaml', () => ({
  safeLoad: jest.fn(),
}));

jest.mock('../lib/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

fs.readFileSync
  .mockImplementationOnce(() => mockFileContents)
  .mockImplementationOnce(() => {
    throw new Error('Internal Server Error');
  });

describe('lib/get-yaml-as-json', () => {
  it('should return the file data', () => {
    getYamlAsJson(mockFilePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(mockFilePath, 'utf8');

    expect(yaml.safeLoad).toBeCalledTimes(1);
    expect(yaml.safeLoad).toBeCalledWith(mockFileContents);

    expect(logger.error).not.toBeCalled();
    expect(logger.debug).toBeCalledTimes(1);
    expect(logger.debug).toBeCalledWith('Successfully loaded file');
  });

  it('should log an error and not return any data when the file cannot be loaded', () => {
    getYamlAsJson(mockFilePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(mockFilePath, 'utf8');

    expect(yaml.safeLoad).not.toBeCalled();

    expect(logger.debug).not.toBeCalled();
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith('Failed to load file\nError: Internal Server Error');
  });
});
