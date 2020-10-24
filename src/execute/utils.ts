import { store } from '../index';
import { ExecuteLog } from './state';

/* tslint:disable */
type AnyArgs = any[];
type AnyVoidFn = (...args: AnyArgs) => void;
/* tslint:enable */

export const ensureExecuteId = <F extends AnyVoidFn>(executeId: string, fn: F): F => {
    return ((...args: AnyArgs) => {
        const curExecuteId = store.getState().executeState.executeId;
        if (executeId === curExecuteId) {
            fn(...args);
        }
    }) as F;
};

export const processLog = (log: ExecuteLog): ExecuteLog => {
    return log.reduce((result, entry) => {
        const entryLines = entry.text.split('\n');
        return result.concat(entryLines.map((l) => ({ text: l, type: entry.type })));
    }, [] as ExecuteLog);
};

export const newExecuteId = () => {
    return Math.random().toString(36).substring(2);
};
