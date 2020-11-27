import { createCanvas, Canvas, ReceiveEvent } from 'algorithmx';

import { store } from '../index';
import { ensureExecuteId } from './utils';

export type SubscribeFn = (event: ReceiveEvent) => void;

export interface AlgrXState {
    readonly canvas: Canvas;
    readonly subscriptions: ReadonlyArray<SubscribeFn>;
    readonly element: HTMLElement;
}

export const initAlgrx = (
    el: HTMLElement,
): AlgrXState => {
    const canvas = createCanvas(el);

    canvas.onreceive((event) => {
        const executeState = store.getState().executeState;
        if (executeState.algrxState) {
            const subscriptions = executeState.algrxState.subscriptions;
            subscriptions.forEach((fn) => fn(event));
        }
    });

    return { element: el, canvas, subscriptions: [] };
};

export const resizeCanvas = (algrxState: AlgrXState): AlgrXState => {
    const size = algrxState.element.getBoundingClientRect();
    algrxState.canvas.duration(0).withQ(null).size([size.width, size.height]);
    return algrxState;
};

export const clearCanvas = (algrxState: AlgrXState): AlgrXState => {
    const canvas = algrxState.canvas;
    canvas.duration(0).withQ(null).remove();
    canvas.queues().clear().start();
    return resizeCanvas(algrxState);
};
export const resetAlgrx = (algrxState: AlgrXState): AlgrXState => {
    return { ...clearCanvas(algrxState), subscriptions: [] };
};

export const pauseCanvas = (algrxState: AlgrXState): AlgrXState => {
    algrxState.canvas.queues().stop();
    return algrxState;
};
export const resumeCanvas = (algrxState: AlgrXState): AlgrXState => {
    algrxState.canvas.queues().start();
    return algrxState;
};
