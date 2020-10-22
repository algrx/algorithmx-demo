import * as React from 'react';
import { connect } from 'react-redux';
import Split from 'react-split';

import { EditorConnected } from './editor';
import { OutputConnected } from './output';
import { ConsoleConnected } from './console';
import { ToolbarConnected } from './toolbar';
import { OpenProjectConnected } from './openproject';

import { Popup, PopupState } from '../state/popup';
import { RootState } from '../state/root';
import './utils.scss';
import './app.scss';

export enum AppActionType {
    Resize = 'app/resize',
    ChangePLang = 'app/change-plang',
}

interface DispatchProps {
    readonly dispatchResize: () => void;
}
interface StateProps {
    readonly popupState: PopupState;
}

const App: React.FC<StateProps & DispatchProps> = (props) => {
    return (
        <>
            <div className="container">
                <Split
                    className="split-container-x"
                    direction="horizontal"
                    sizes={[60, 40]}
                    gutterSize={2}
                    onDrag={() => props.dispatchResize()}
                >
                    <div className="split">
                        <EditorConnected />
                    </div>

                    <div className="split" style={{ position: 'relative' }}>
                        <Split
                            className="split-container-y"
                            direction="vertical"
                            sizes={[70, 30]}
                            gutterSize={2}
                            onDrag={() => props.dispatchResize()}
                        >
                            <div className="split">
                                <OutputConnected />
                            </div>

                            <div className="split">
                                <ConsoleConnected />
                            </div>
                        </Split>
                    </div>
                </Split>
                <div className="toolbar-container">
                    <ToolbarConnected />
                </div>
            </div>
            {props.popupState.isOpen ? (
                props.popupState.popup === Popup.OpenProject ? (
                    <OpenProjectConnected />
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
        </>
    );
};

export const AppConnected = connect<StateProps, DispatchProps, {}, RootState>(
    (state) => ({ popupState: state.popupState }),
    (dispatch) => ({ dispatchResize: () => dispatch({ type: AppActionType.Resize }) })
)(App);
