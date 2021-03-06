import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { App, AppActionType } from './components/app';
import { createStore } from './state/root';
import { saveState } from './state/utils';

export const store = createStore();

/* tslint:disable */
window.onresize = () => {
    store.dispatch({ type: AppActionType.Resize });
};

window.onbeforeunload = () => {
    saveState(store.getState());
};
/* tslint:enable */

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
