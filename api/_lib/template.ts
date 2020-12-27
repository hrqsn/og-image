
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');
const rglrJP = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Regular.otf`).toString('base64');
const boldJP = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Bold.otf`).toString('base64');
const logo = 'https://user-images.githubusercontent.com/25542189/103164942-cbe27200-4854-11eb-8cd7-07d6833e7b28.png';

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'Noto Sans JP';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${rglrJP}) format('opentype');
    }

    @font-face {
        font-family: 'Noto Sans JP';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/otf;charset=utf-8;base64,${boldJP}) format('opentype');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    .wrapper {
        width: calc(100% - 160px);
        height: calc(100% - 160px);
        background: #fff;
        border-radius: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .meta {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 72px 60px 0;
        display: flex; 
        align-items: center;
    }

    .author {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        padding-right: 60px;
        font-size: 60px;
        margin-top: 16px;
        font-style: normal;
        font-weight: normal;
    }

    .logo {
        height: 72px;
        width: auto;
    }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        background-color: #6366F1;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: bold;
        color: ${foreground};
        line-height: 1.6;
        padding: 80px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, author } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="wrapper">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="meta">
                <span class="author">${author}</span>
                <img src="${sanitizeHtml(logo)}" alt="osiete" class="logo" />
            </div>
        </div>
    </body>
</html>`;
}
