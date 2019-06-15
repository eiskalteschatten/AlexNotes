import { markdownToHtml, markdownToHtmlWithCodeHighlighting } from '../../../src/lib/markdown';

describe('Markdown lib', () => {
    test('Convert Markdown to HTML', async () => {
        const markdown = '# Test';
        const html = markdownToHtml(markdown);
        expect(html).toEqual("<h1 id=\"test\">Test</h1>\n");
    });

    test('Convert Markdown to HTML with Syntax Highlighting', async () => {
        const markdown = '`const variable = "";`';
        const html = markdownToHtmlWithCodeHighlighting(markdown);
        expect(html).toEqual("<p><code>const variable = &quot;&quot;;</code></p>\n");
    });
});
