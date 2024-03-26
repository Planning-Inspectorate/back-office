import { validateStorageAccount } from "../util.js";

describe('util', () => {
    describe('validateStorageAccount', () => {
        const conf = {
            BLOB_STORAGE_ACCOUNT_HOST: 'https://host-1.com',
            BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN: 'https://domain-1.com'
        }
        const tests = [
            {input: 'https://host-1.com/pub-container/blob-1'},
            {input: 'https://domain-1.com/pub-container/blob/1/2/3'}
        ];

        it.each(tests)(`should accept {input}`, ({input}) => {
            expect(() => {
                validateStorageAccount(input, conf);
            }).not.toThrow();
        });
        const failTests = [
            {input: 'https://my-blob.com/pub-container/'},
            {input: 'https://my-blob.com/pub2-container/blob/1/2/3'}
        ];

        it.each(failTests)(`should reject {input}`, ({input}) => {
            expect(() => {
                validateStorageAccount(input, conf);
            }).toThrow();
        });
    });
});