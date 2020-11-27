import * as React from 'react';
import { connect } from 'react-redux';
import Split from 'react-split';

import { Editor } from './editor';
import { Output } from './output';
import { Console } from './console';
import { Toolbar } from './toolbar';
import { OpenProject } from './openproject';

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

const AppFC: React.FC<StateProps & DispatchProps> = (props) => {
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
                        <Editor />
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
                                <Output />
                            </div>

                            <div className="split">
                                <Console />
                            </div>
                        </Split>
                    </div>
                </Split>
                <div className="toolbar-container">
                    <Toolbar />
                </div>
            </div>
            {props.popupState.isOpen ? (
                props.popupState.popup === Popup.OpenProject ? (
                    <OpenProject />
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
        </>
    );
};

export const App = connect<StateProps, DispatchProps, {}, RootState>(
    (state) => ({ popupState: state.popupState }),
    (dispatch) => ({ dispatchResize: () => dispatch({ type: AppActionType.Resize }) })
)(AppFC);
