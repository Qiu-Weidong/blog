'use strict'

function parseArgs(args) {
    let result = {
        author: '',
        source: '',
        smoke: false
    };

    for (let i in args) {
        let arg = args[i];
        let pair = arg.split(':');
        if (pair.length >= 2) {
            if (pair[0] == 'author') { result.author = pair[1]; }
            else if (pair[0] == 'source') { result.source = pair[1]; }
            else if (pair[0] == 'smoke') { result.smoke = pair[1] == 'true' ? true: false; }
        }
    }

    return result;
}

function poemTag(args, content) {
    args = parseArgs(args);

    let result = '<blockquote id="poem-container" class="poem-container">';
    result += hexo.render.renderSync({ text: content, engine: 'markdown' });
    if (args.author != '') {
        result += `<footer style="text-align: right"><strong>${args.author}</strong>`;
        if (args.source != '') {
            result += `<cite>《${args.source}》</cite>`
        }
        result += "</footer>"
    }
    result += '</blockquote>';
    if (args.smoke)
        result += '<script src="/js/smoke.js"></script>';

    return result;
}

hexo.extend.tag.register('poem', poemTag, { ends: true })