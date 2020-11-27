import * as React from 'react';
import { connect } from 'react-redux';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ClosePopupProps, mapClosePopupToProps } from '../state/popup';
import { PaneHeader } from './paneheader';
import './popup.scss';

type DispatchProps = ClosePopupProps;

interface OwnProps {
    readonly title: string;
    readonly children: React.ReactNode;
}

const PopupFC: React.FC<DispatchProps & OwnProps> = (props) => {
    return (
        <div className="popup">
            <div className="popup-window">
                <PaneHeader
                    title={props.title}
                    buttons={[{ icon: faTimes, onClick: props.dispatchClosePopup }]}
                />
                <div className="popup-inner">{props.children}</div>
            </div>
        </div>
    );
};

export const Popup = connect<{}, DispatchProps, OwnProps>(
    () => ({}),
    mapClosePopupToProps
)(PopupFC);
