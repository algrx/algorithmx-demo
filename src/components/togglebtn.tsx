import * as React from 'react';

import './togglebtn.scss';

export const ToggleBtn: React.FC<{ readonly on: boolean }> = (props) => (
    <div className={`togglebtn ${props.on ? 'togglebtn-on' : ''}`}>
        <svg className="togglebtn-svg">
            <circle className="togglebtn-circle" />
            <circle className="togglebtn-overlay" />
        </svg>
    </div>
);
