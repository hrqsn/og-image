
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
const logo = 'https://user-images.githubusercontent.com/25542189/103164508-85d6df80-484f-11eb-8450-2d3aecdf9ea9.png'

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap')

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
        width: calc(100vw - 80px);
        height: calc(100vh - 80px);
        background: #fff;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .meta {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 40px 32px 0;
        display: flex; 
        align-items: center;
    }

    .author {
        padding-right: 40px;
        font-size: 32px;
        margin-top: 8px;
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

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
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
        padding: 40px;
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
                <img src="${sanitizeHtml(logo)}" alt="osiete" />
            </div>
        </div>
    </body>
</html>`;
}
