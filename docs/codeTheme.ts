/**
 * Tiny syntax highlighter for docs code blocks — no dependencies, output
 * styled with Simple UI theme variables so it follows light/dark.
 *
 * Supports vue SFCs (template/script/style sections), javascript, xml/html,
 * css, bash and json. Unknown languages render as plain escaped text.
 */

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const JS_KEYWORDS = new Set(
    'import,from,export,default,const,let,var,function,return,if,else,for,while,of,in,new,typeof,await,async,true,false,null,undefined,this,type,interface'.split(','),
)

function highlightJs(src: string): string {
    let out = ''
    let i = 0
    const n = src.length

    const span = (cls: string, text: string) => `<span class="s-hl-${cls}">${escapeHtml(text)}</span>`

    while (i < n) {
        const c = src[i]

        // line / block comments
        if (c === '/' && src[i + 1] === '/') {
            let j = src.indexOf('\n', i)
            if (j === -1) {
                j = n
            }
            out += span('com', src.slice(i, j))
            i = j
            continue
        }
        if (c === '/' && src[i + 1] === '*') {
            let j = src.indexOf('*/', i + 2)
            j = j === -1 ? n : j + 2
            out += span('com', src.slice(i, j))
            i = j
            continue
        }
        // strings (no template nesting — good enough for examples)
        if (c === "'" || c === '"' || c === '`') {
            let j = i + 1
            while (j < n && src[j] !== c) {
                j += src[j] === '\\' ? 2 : 1
            }
            out += span('str', src.slice(i, Math.min(j + 1, n)))
            i = Math.min(j + 1, n)
            continue
        }
        // numbers
        if (/[0-9]/.test(c) && (i === 0 || /[^A-Za-z0-9_$.]/.test(src[i - 1]))) {
            let j = i
            while (j < n && /[0-9a-fA-FxXoObB._]/.test(src[j])) {
                j++
            }
            out += span('num', src.slice(i, j))
            i = j
            continue
        }
        // words: keyword, component/function call, or plain
        if (/[A-Za-z_$]/.test(c)) {
            let j = i
            while (j < n && /[A-Za-z0-9_$]/.test(src[j])) {
                j++
            }
            const word = src.slice(i, j)
            const rest = src.slice(j).match(/^\s*(\(|=>)/)?.[1]
            if (JS_KEYWORDS.has(word)) {
                out += span('kwd', word)
            } else if (rest || /^[A-Z]/.test(word)) {
                out += span('fn', word)
            } else if (word.startsWith('@') || word.startsWith('v-') || word.startsWith(':') || word.startsWith('#')) {
                out += span('attr', word)
            } else {
                out += escapeHtml(word)
            }
            i = j
            continue
        }
        // vue template interpolation
        if (c === '{' && src[i + 1] === '{') {
            const j = src.indexOf('}}', i + 2)
            const end = j === -1 ? n : j + 2
            out += `<span class="s-hl-tpl">{{</span>${highlightJs(src.slice(i + 2, end - 2))}<span class="s-hl-tpl">}}</span>`
            i = end
            continue
        }
        out += escapeHtml(c)
        i++
    }
    return out
}

function highlightXml(src: string): string {
    let out = ''
    let i = 0
    const n = src.length
    const span = (cls: string, text: string) => `<span class="s-hl-${cls}">${escapeHtml(text)}</span>`

    while (i < n) {
        // comments
        if (src.startsWith('<!--', i)) {
            let j = src.indexOf('-->', i + 4)
            j = j === -1 ? n : j + 3
            out += span('com', src.slice(i, j))
            i = j
            continue
        }
        // tags
        if (src[i] === '<' && /[A-Za-z!/]/.test(src[i + 1] ?? '')) {
            let j = src.indexOf('>', i + 1)
            j = j === -1 ? n : j + 1
            out += highlightTag(src.slice(i, j))
            i = j
            continue
        }
        // interpolation
        if (src[i] === '{' && src[i + 1] === '{') {
            const j = src.indexOf('}}', i + 2)
            const end = j === -1 ? n : j + 2
            out += `<span class="s-hl-tpl">{{</span>${highlightJs(src.slice(i + 2, end - 2))}<span class="s-hl-tpl">}}</span>`
            i = end
            continue
        }
        out += escapeHtml(src[i])
        i++
    }
    return out
}

function highlightTag(tag: string): string {
    // split: < / name attrs... >
    const m = tag.match(/^(<\/?!?)([A-Za-z][A-Za-z0-9:.-]*)([\s\S]*?)(>)$/)
    if (!m) {
        return escapeHtml(tag)
    }
    const [, open, name, body, close] = m
    let attrs = ''
    const re = /([:@#a-zA-Z][\w:.-]*)(=("[^"]*"|'[^']*'|[^\s>]+))?/g
    let last = 0
    let match: RegExpExecArray | null
    while ((match = re.exec(body)) !== null) {
        attrs += escapeHtml(body.slice(last, match.index))
        attrs += `<span class="s-hl-attr">${escapeHtml(match[1])}</span>`
        if (match[2]) {
            const eq = match[2][0]
            const val = match[2].slice(1)
            const quote = val[0] === '"' || val[0] === "'" ? val[0] : ''
            const inner = quote ? val.slice(1, -1) : val
            attrs += `<span class="s-hl-punc">${escapeHtml(eq)}</span><span class="s-hl-str">${escapeHtml(quote + inner + quote)}</span>`
        }
        last = match.index + match[0].length
    }
    attrs += escapeHtml(body.slice(last))
    return `<span class="s-hl-punc">${escapeHtml(open)}</span><span class="s-hl-tag">${escapeHtml(name)}</span>${attrs}<span class="s-hl-punc">${escapeHtml(close)}</span>`
}

function highlightCss(src: string): string {
    return escapeHtml(src)
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="s-hl-com">$1</span>')
        .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="s-hl-attr">$1</span>$2')
        .replace(/(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s)?\b)/g, '<span class="s-hl-num">$1</span>')
}

function highlightBash(src: string): string {
    let out = ''
    for (const line of src.split('\n')) {
        const trimmed = line.trimStart()
        if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
            out += `<span class="s-hl-com">${escapeHtml(line)}</span>\n`
            continue
        }
        out += escapeHtml(line)
            .replace(/(\$[\w-]+|\{[^}]*\})/g, '<span class="s-hl-attr">$1</span>')
            .replace(/("[^"]*"|'[^']*')/g, '<span class="s-hl-str">$1</span>')
            .replace(/^(\s*)(npm|npx|cd|git|node|app\.use|import)(?=\s|$)/, '$1<span class="s-hl-kwd">$2</span>')
        out += '\n'
    }
    return out.replace(/\n$/, '')
}

function highlightVue(src: string): string {
    // split SFC into sections; highlight template as xml, script as js, style as css
    const re = /(<(template|script|style)[^>]*>)([\s\S]*?)(<\/\2>)/g
    let out = ''
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(src)) !== null) {
        out += highlightXml(src.slice(last, m.index))
        out += highlightTag(m[1])
        out += m[2] === 'script' ? highlightJs(m[3]) : m[2] === 'style' ? highlightCss(m[3]) : highlightXml(m[3])
        out += highlightTag(m[4])
        last = m.index + m[0].length
    }
    out += highlightXml(src.slice(last))
    return out
}

export type CodeLang = 'vue' | 'js' | 'xml' | 'css' | 'bash' | 'json' | 'text'

/** Guess the language from a block title like "App.vue" or "Terminal". */
export function guessLang(title: string, code: string): CodeLang {
    const t = (title ?? '').toLowerCase()
    if (/\.(vue)$/.test(t)) {
        return 'vue'
    }
    if (/\.(js|ts|mjs|json)$/.test(t)) {
        return t.endsWith('json') ? 'json' : 'js'
    }
    if (/\.(css)$/.test(t)) {
        return 'css'
    }
    if (/terminal|bash|shell|opencode|mcp\.json|json/.test(t) || /^(npm|npx|cd|git) /m.test(code)) {
        return /mcp\.json|\.json/.test(t) ? 'json' : 'bash'
    }
    if (/^\s*[{[]/.test(code)) {
        return 'json'
    }
    if (/<[a-zA-Z][^>]*>/.test(code)) {
        return 'xml'
    }
    return 'js'
}

export function highlight(code: string, lang: CodeLang = 'js'): string {
    switch (lang) {
        case 'vue':
            return highlightVue(code)
        case 'xml':
            return highlightXml(code)
        case 'css':
            return highlightCss(code)
        case 'bash':
            return highlightBash(code)
        case 'json':
            return highlightJs(code)
        case 'text':
            return escapeHtml(code)
        default:
            return highlightJs(code)
    }
}
