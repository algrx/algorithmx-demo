import * as React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction, Reducer } from 'redux';
import Ace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/python';

import { RootState } from '../state/root';
import { PLang, PLangID, ActionChangePLang } from '../state/plang';
import {
    projectStore,
    defaultProjectFiles,
    ProjectActionType,
    ActionOpenProject,
} from './openproject';
import { PaneHeader } from './paneheader';
import { AppActionType } from './app';
import './editor.scss';
import './editor.theme.scss';

(Ace as any)['define']('ace/theme/custom', {
    isDark: true,
    cssClass: 'ace-theme',
});

interface AceState {
    readonly editor: Ace.Editor;
    readonly sessions: { readonly [k in PLang]: Ace.IEditSession };
}
export interface EditorState {
    readonly aceState?: AceState;
    readonly savedCode?: { readonly [k in PLang]?: string };
}

interface DispatchProps {
    readonly dispatchInit: (aceState: AceState) => void;
    readonly dispatchSave: () => void;
}
interface StateProps {
    readonly editorState: EditorState;
    readonly curPLang: PLang;
}

export enum EditorActionType {
    Init = 'editor/init',
    Save = 'editor/save',
}

interface ActionInit extends Action {
    readonly type: EditorActionType.Init;
    readonly aceState: AceState;
}

const initAce = (el: HTMLElement, state: EditorState, curPLang: PLang): AceState => {
    const editor = Ace.edit(el);

    const createSession = (pLang: PLang): Ace.IEditSession => {
        const hasSavedCode = state.savedCode && state.savedCode[pLang] !== undefined;
        const session = new Ace.EditSession(
            hasSavedCode
                ? state.savedCode![pLang]!
                : projectStore[pLang].files[defaultProjectFiles[pLang]].code,
            `ace/mode/${PLangID[pLang]}`
        );
        session.setUndoManager(new Ace.UndoManager());
        return session;
    };

    const sessions = Object.keys(PLang).reduce((result, k) => {
        const pLang = PLang[k as keyof typeof PLang];
        return { ...result, [pLang]: createSession(pLang) };
    }, {} as AceState['sessions']);

    (editor.renderer as any).scrollBarV.width = 10;
    (editor.renderer as any).scrollBarH.height = 10;
    editor.$blockScrolling = Infinity;

    // options based on JSHint:
    // - asi: allow no semicolons in JS
    (sessions[PLang.JS] as any).$worker.send('changeOptions', [{ asi: true, esversion: 9 }]);

    editor.setTheme('ace/theme/custom');
    editor.setShowPrintMargin(false);
    editor.setSession(sessions[curPLang]);
    return { editor: editor, sessions: sessions };
};

const Editor: React.FC<StateProps & DispatchProps> = (props) => {
    return (
        <div className="editor-container">
            <PaneHeader title="EDITOR" buttons={[]} />
            <div
                className="editor"
                ref={(el) => {
                    if (el && !props.editorState.aceState)
                        props.dispatchInit(initAce(el, props.editorState, props.curPLang));
                    return el;
                }}
            ></div>
        </div>
    );
};

export const initEditorState: EditorState = {};
export const editorReducer: Reducer<EditorState> = (
    state = initEditorState,
    action: AnyAction
): EditorState => {
    if (action.type === EditorActionType.Init) {
        return { ...state, aceState: (action as ActionInit).aceState };
    }
    if (state.aceState) {
        const aceState = state.aceState;
        if (action.type === AppActionType.Resize) {
            aceState.editor.resize();
            return state;
        }
        if (action.type === AppActionType.ChangePLang) {
            aceState.editor.setSession(aceState.sessions[(action as ActionChangePLang).newPLang]);
            return state;
        }
        if (action.type === ProjectActionType.Open) {
            const files = projectStore[(action as ActionOpenProject).pLang].files;
            const code = files[(action as ActionOpenProject).file].code;
            aceState.editor.getSession().doc.setValue(code);
        }
    }
    return state;
};

export const EditorConnected = connect<StateProps, DispatchProps, {}, RootState>(
    (state) => ({ editorState: state.editorState, curPLang: state.pLang }),
    (dispatch) => ({
        dispatchInit: (aceState) => dispatch<ActionInit>({ type: EditorActionType.Init, aceState }),
        dispatchSave: () => dispatch({ type: EditorActionType.Save }),
    })
)(Editor);
