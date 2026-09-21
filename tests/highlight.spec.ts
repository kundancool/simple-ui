import { describe, expect, it } from 'vitest'
import { highlight, guessLang } from '../docs/codeTheme'

describe('highlight', () => {
    it('highlights vue sfcs section by section', () => {
        const out = highlight('<template>\n  <s-button>Go</s-button>\n</template>\n<script setup>\nimport { ref } from \'vue\'\n</script>', 'vue')
        expect(out).toContain('s-hl-tag')
        expect(out).toContain('s-hl-kwd')
        expect(out).toContain('s-hl-str')
    })

    it('escapes html in text mode', () => {
        expect(highlight('<b>&</b>', 'text')).toBe('&lt;b&gt;&amp;&lt;/b&gt;')
    })

    it('highlights bash commands and comments', () => {
        const out = highlight('# install\nnpm install foo', 'bash')
        expect(out).toContain('s-hl-com')
        expect(out).toContain('s-hl-kwd')
    })

    it('guesses languages from titles', () => {
        expect(guessLang('App.vue', '<div/>')).toBe('vue')
        expect(guessLang('Terminal', 'npm install x')).toBe('bash')
        expect(guessLang('main.js', 'const a = 1')).toBe('js')
        expect(guessLang('.mcp.json', '{"a":1}')).toBe('json')
    })
})
