import * as React from 'react';

import './btn.scss';

interface BtnProps {
    readonly text: string;
    readonly onClick: () => void;
}

export const Btn: React.FC<BtnProps> = (props) => (
    <div className="btn" onClick={props.onClick}>
        {props.text}
    </div>
);
