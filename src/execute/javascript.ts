import * as Babel from '@babel/standalone';
import * as jsnx from 'jsnetworkx';

import { ExecuteArgs } from './execute';

type BaseMath = typeof Math;
interface SeededMath extends BaseMath {
    readonly seed: (seed: number) => void;
}

const originalMathRandom = Math.random;

const makeSeedFn = (self: typeof Math): ((i: number) => void) => {
    return (i) => {
        const mask = 0xffffffff;
        let m_w = (123456789 + i) & mask;
        let m_z = (987654321 - i) & mask;
        self.random = () => {
            m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
            m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
            let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
            result /= 4294967296;
            return result;
        };
    };
};

export const executeJS = (args: ExecuteArgs): void => {
    const newConsole = {
        ...console,
        log: (msg: unknown) => args.onOut(String(msg)),
        error: (msg: unknown) => args.onErr(String(msg)),
    };
    (Math as any).random = originalMathRandom;
    (Math as any).seed = makeSeedFn(Math);
    try {
        const compiled = Babel.transform(args.code, { presets: ['es2015'] }).code;
        const execFn = new Function('canvas', 'console', 'jsnx', compiled);
        execFn(args.canvas, newConsole, jsnx);
    } catch (err) {
        args.onErr(String(err));
    }
};
