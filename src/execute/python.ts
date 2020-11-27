import { version as brythonVersion } from '../../brython/version.json';
import { ExecuteArgs } from './execute';

export const loadBrython = (onLoad: () => void): void => {
    const globalOnLoadId = '__brython_load__';
    (window as any)[globalOnLoadId] = onLoad;
    let el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = `brython.${brythonVersion}.js`;
    document.head.append(el);

    el.onload = () => {
        brython({ indexedDB: true });
        const loadScript = `
from browser import window
from algorithmx import *
from networkx import *

window['${globalOnLoadId}']()
`;
        __BRYTHON__.run_script(loadScript, 'load', 'main');
    };
};

type BrythonOutput = typeof __BRYTHON__['stdout'];
const createOutput = (onOut: (msg: string) => void): BrythonOutput => ({
    write: onOut,
    flush: () => {
        /* */
    },
});

export const executePython = (args: ExecuteArgs): void => {
    const globalCanvasId = '__algorithmx_canvas__';
    const globalCodeId = '__algorithmx_code__';
    (window as any)[globalCanvasId] = args.canvas;
    (window as any)[globalCodeId] = args.code;
    __BRYTHON__.stdout = createOutput(args.onOut);
    __BRYTHON__.stderr = createOutput(args.onErr);
    window.addEventListener('error', function (event) {
        const err = event.error;
        if (err.args && err.args.__brython__) {
            const errStr =
                (err.__class__.$infos.__name__ + ':', err.args.length > 0 ? err.args[0] : '');
            args.onErr(errStr);
        }
    });

    const fullScript = `
from browser import window
from algorithmx import create_canvas

real_canvas = window['${globalCanvasId}']
code = window['${globalCodeId}']

canvas = create_canvas()
canvas.ondispatch(real_canvas.dispatch)
real_canvas.onreceive(lambda e: canvas.receive(e.to_dict()))

exec(code, globals(), {'canvas': canvas})
`;
    try {
        __BRYTHON__.run_script(fullScript, 'demo', 'main');
    } catch (err) {
        args.onErr(String(err));
    }
};
