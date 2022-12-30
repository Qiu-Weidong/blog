const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');

let viz = new Viz({ Module, render });

// const graphvizTab = async (args, content) => {
//     try {
//         const result = await viz.renderString(content);
//         return result;
//     }
//     catch (error) {
//         // viz = new Viz({ Module, render });
//         console.log(error);
//         return '';
//     }
// }

const graphvizTab = async (args, content) => {

    try {
        const result = await viz.renderString(content);
        return `<div
                    style="margin: 0 0 20px; 
                    text-align: center;"
                    >${result}</div>`;
    } catch (error) {
        console.log(error);
        viz = new Viz({ Module, render });
        return `<div
                    style="margin: 0 0 20px; 
                    text-align: center;"
                    >
                    ${content}
                    <b>${error}</b>
                    
                    </div>`;
    }

}

hexo.extend.tag.register('graphviz', graphvizTab, { ends: true, async: true });




