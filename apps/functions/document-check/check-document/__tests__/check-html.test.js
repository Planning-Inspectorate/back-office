import { validateHTML } from '../validate-html.js';

describe('HTML validation', () => {
	test('does not throw for a YouTube iframe', async () => {
		const html = '<iframe src="https://www.youtube.com"></iframe>';
		await expect(() => validateHTML(html)).not.toThrow();
	});

	test('throws an error for a non-YouTube src attribute', async () => {
		const html = '<iframe src="https://www.google.com"></iframe>';
		await expect(() => validateHTML(html)).rejects.toThrow();
	});

	test('throws an error if a script tag is encountered', async () => {
		const html = `
      <html>
        <script>console.log('hello world')</script>
        <iframe src="https://www.youtube.com"></iframe>
      </html>
    `;

		await expect(() => validateHTML(html)).rejects.toThrow();
	});

	test('does not throw if a style tag is encountered', async () => {
		const html = `
      <html>
        <style>
        html, body {
          margin: 0;
        }
        </style>
        <iframe src="https://www.youtube.com"></iframe>
      </html>
    `;

		await expect(() => validateHTML(html)).not.toThrow();
	});
});
