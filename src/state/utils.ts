import { RootState, InitStateFn } from './root';
import { PLang } from './plang';

interface SavedState {
    readonly pLang: PLang;
    readonly code: string;
}

const storageKey = 'algorithmx-demo';

export const saveState = (state: RootState): void => {
    const aceState = state.editorState.aceState;
    if (!aceState) return;

    const savedState: SavedState = {
        pLang: state.pLang,
        code: aceState.editor.getValue(),
    };
    localStorage.setItem(storageKey, JSON.stringify(savedState));
};

export const loadState = (initState: InitStateFn): RootState => {
    const savedStateStr = localStorage.getItem(storageKey);
    if (savedStateStr) {
        const savedState = JSON.parse(savedStateStr) as SavedState;
        const pLang = savedState.pLang;
        const code = savedState.code;

        const defaultState = initState(pLang);
        return {
            ...defaultState,
            editorState: { ...defaultState.editorState, savedCode: { [pLang]: code } },
        };
    }
    return initState(PLang.JS);
};
