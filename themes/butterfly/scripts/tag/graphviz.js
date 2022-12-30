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

const graphvizTab = (args, content) => {
    return new Promise(
        (resolve, reject) => {
            viz.renderString(content).then(result => {
            
            
                resolve(`<div
                style="margin: 0 0 20px; 
                text-align: center;"
                >${result}</div>`);
            
            
            }).catch(error => {
            
                viz = new Viz({Module, render});
                console.log(error);
                resolve(`<div
                style="margin: 0 0 20px; 
                text-align: center;"
                >${error}</div>`);
            
            
            })
        }
    )
    
}

hexo.extend.tag.register('graphviz', graphvizTab, { ends: true, async: true });


