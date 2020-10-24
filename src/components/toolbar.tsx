import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJs, faPython } from '@fortawesome/free-brands-svg-icons';

import { RootState } from '../state/root';
import { PLang, PLangName, ChangePLangProps, mapChangePLangToProps } from '../state/plang';
import { Popup, OpenPopupProps, mapOpenPopupToProps } from '../state/popup';
import { ToggleBtn } from './togglebtn';
import { Btn } from './btn';
import './toolbar.scss';

interface ToolbarProps extends ChangePLangProps, OpenPopupProps {
    readonly curPLang: PLang;
}
interface PLangBtnProps {
    readonly btnPLang: PLang;
    readonly icon: IconProp;
}

const PLangBtn: React.FC<ToolbarProps & PLangBtnProps> = (props) => {
    return (
        <div
            className="toolbar-plang-btn"
            onClick={() => props.dispatchChangePLang(props.btnPLang)}
        >
            <ToggleBtn on={props.curPLang === props.btnPLang} />
            <FontAwesomeIcon className="toolbar-plang-btn-icon" icon={props.icon} />
            <span className="toolbar-plang-btn-text">{PLangName[props.btnPLang]}</span>
        </div>
    );
};

const Toolbar: React.FC<ToolbarProps> = (props) => {
    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <PLangBtn {...props} btnPLang={PLang.JS} icon={faJs} />
                <PLangBtn {...props} btnPLang={PLang.Python} icon={faPython} />
            </div>
            <div className="toolbar-right">
                <Btn
                    text="Open Examples"
                    onClick={() => props.dispatchOpenPopup(Popup.OpenProject)}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (root: RootState) => ({
    curPLang: root.pLang,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    ...mapChangePLangToProps(dispatch),
    ...mapOpenPopupToProps(dispatch),
});

export const ToolbarConnected = connect(mapStateToProps, mapDispatchToProps)(Toolbar);
