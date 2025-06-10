// @ts-nocheck
import {
	combineResults,
	fetchRedactionSuggestions,
	highlightRedactionSuggestions,
	stringToChunks
} from '../redact-representation.service.js';
import { jest } from '@jest/globals';

describe('redact-representation.service', () => {
	describe('fetchRedactionSuggestions', () => {
		it('should return null for an empty string', async () => {
			const result = await fetchRedactionSuggestions('');
			expect(result).toBeNull();
		});

		it('should chunk the string for the analytics client', async () => {
			const longString = 'a'.repeat(10000);
			const mockTextAnalyticsClient = {
				recognizePiiEntities: jest
					.fn()
					.mockResolvedValue([{ entities: [], redactedText: '', id: '', warnings: [] }])
			};
			await fetchRedactionSuggestions(longString, () => mockTextAnalyticsClient);
			expect(mockTextAnalyticsClient.recognizePiiEntities).toHaveBeenCalledTimes(1);
			const args = mockTextAnalyticsClient.recognizePiiEntities.mock.calls[0];
			expect(args[0]).toHaveLength(2);
		});

		it('should return null if there are any entity errors', async () => {
			const longString = 'a'.repeat(10000);
			const mockTextAnalyticsClient = {
				recognizePiiEntities: jest.fn().mockResolvedValue([
					{
						entities: [
							{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 }
						],
						redactedText: '',
						id: '',
						warnings: []
					},
					{
						error: { code: 'InvalidRequest', message: 'Invalid request' }
					}
				])
			};
			const result = await fetchRedactionSuggestions(longString, () => mockTextAnalyticsClient);
			expect(result).toBeNull();
		});

		it('should return null if there are any errors', async () => {
			const longString = 'a'.repeat(10000);
			const mockTextAnalyticsClient = {
				recognizePiiEntities: jest.fn().mockRejectedValue(new Error('Network error'))
			};
			const result = await fetchRedactionSuggestions(longString, () => mockTextAnalyticsClient);
			expect(result).toBeNull();
		});

		it('should return combined results for all chunks', async () => {
			const middleChunk = '0'.repeat(5000 - 14);
			const text = 'John Doe lives' + middleChunk + 'at 123 Main St.';
			const mockTextAnalyticsClient = {
				recognizePiiEntities: jest.fn().mockResolvedValue([
					{
						entities: [
							{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 }
						],
						redactedText: '',
						id: '',
						warnings: []
					},
					{
						entities: [
							{
								text: '123 Main St',
								offset: 3,
								length: 11,
								category: 'Address',
								confidenceScore: 0.9
							}
						],
						redactedText: '',
						id: '',
						warnings: []
					}
				])
			};
			const result = await fetchRedactionSuggestions(text, () => mockTextAnalyticsClient);
			expect(result).toBeDefined();
			expect(result.entities).toHaveLength(2);
			expect(result.redactedText).toEqual('████████ lives' + middleChunk + 'at ███████████.');
		});
	});
	describe('highlightRedactionSuggestions', () => {
		it('should add marks', () => {
			const text = 'Some comment that needs redaction and will be marked up as such.';
			const entities = [
				{
					text: 'redaction',
					category: 'Organization',
					offset: 24,
					length: 9,
					confidenceScore: 0.73
				},
				{
					text: 'will be ',
					category: 'Organization',
					offset: 38,
					length: 8,
					confidenceScore: 0.73
				},
				{ text: 'marked up as', category: 'Person', offset: 46, length: 12, confidenceScore: 0.6 }
			];

			const result = highlightRedactionSuggestions(text, entities);
			expect(result).toEqual(
				`Some comment that needs <mark>redaction</mark> and <mark>will be </mark><mark>marked up as</mark> such.`
			);
		});
	});
	describe('combineResults', () => {
		it('should work for a single document result, ignoring the redactedText', () => {
			const results = [
				{
					entities: [
						{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 },
						{
							text: '123 Main St',
							offset: 18,
							length: 11,
							category: 'Address',
							confidenceScore: 0.9
						}
					],
					redactedText: 'REDACTED REDACTED'
				}
			];
			const originalText = 'John Doe lives at 123 Main St.';
			const combined = combineResults(results, originalText);
			expect(combined.entities).toHaveLength(2);
			expect(combined.redactedText).toEqual('████████ lives at ███████████.');
		});
		it('should work for a single document result, ignoring low confidence entities', () => {
			const results = [
				{
					entities: [
						{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 },
						{
							text: '123 Main St',
							offset: 18,
							length: 11,
							category: 'Address',
							confidenceScore: 0.7
						}
					],
					redactedText: 'REDACTED REDACTED'
				}
			];
			const originalText = 'John Doe lives at 123 Main St.';
			const combined = combineResults(results, originalText);
			expect(combined.entities).toHaveLength(1);
			expect(combined.entities[0].text).toEqual('John Doe');
			expect(combined.redactedText).toEqual('████████ lives at 123 Main St.');
		});
		it('should combine multiple results and adjust offsets', () => {
			const results = [
				{
					entities: [
						{ text: 'John Doe', offset: 0, length: 8, category: 'Person', confidenceScore: 0.95 },
						{
							text: '123 Main St',
							offset: 18,
							length: 11,
							category: 'Address',
							confidenceScore: 0.8
						}
					]
				},
				{
					entities: [
						{
							text: 'some-email@example.com',
							offset: 0,
							length: 8,
							category: 'Email',
							confidenceScore: 0.95
						},
						{
							text: 'https://my-website.com',
							offset: 100,
							length: 11,
							category: 'URL',
							confidenceScore: 0.9
						}
					]
				}
			];
			const combined = combineResults(results, '');
			expect(combined.entities).toHaveLength(4);
			expect(combined.entities[0].offset).toEqual(0);
			expect(combined.entities[1].offset).toEqual(18);
			expect(combined.entities[2].offset).toEqual(5000);
			expect(combined.entities[3].offset).toEqual(5100);
		});
	});
	describe('stringToChunks', () => {
		it('should split a long string into chunks of specified length', () => {
			const longString = 'a'.repeat(1000);
			const chunks = stringToChunks(longString, 200);
			expect(chunks).toHaveLength(5);
			chunks.forEach((chunk) => expect(chunk).toHaveLength(200));
		});

		it('should handle strings shorter than the chunk size', () => {
			const shortString = 'short';
			const chunks = stringToChunks(shortString, 200);
			expect(chunks).toHaveLength(1);
			expect(chunks[0]).toEqual(shortString);
		});
	});
});
