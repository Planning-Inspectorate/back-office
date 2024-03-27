import { extractPublishedBlobName } from "../util.js";

describe('util', () => {
    describe('extractPublishedBlobName', () => {
        const container = 'pub-container';
        const tests = [
            {input: 'https://my-blob.com/pub-container/blob-1', expected: 'blob-1'},
            {input: 'https://my-blob.com/pub-container/blob/1/2/3', expected: 'blob/1/2/3'}
        ];

        it.each(tests)(`should handle {input}`, ({input, expected}) => {
            const got = extractPublishedBlobName(input, container);
            expect(got).toEqual(expected);
        });
        const failTests = [
            {input: 'https://my-blob.com/pub-container/'},
            {input: 'https://my-blob.com/pub2-container/blob/1/2/3'}
        ];

        it.each(failTests)(`should fail with {input}`, ({input}) => {
            expect(() => {
                extractPublishedBlobName(input, container);
            }).toThrow();
        });
    });
});