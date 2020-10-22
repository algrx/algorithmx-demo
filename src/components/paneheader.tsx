import * as React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './paneheader.scss';

interface PaneHeaderProps {
    readonly title: string;
    readonly buttons: ReadonlyArray<{
        readonly icon: IconProp;
        readonly onClick: () => void;
    }>;
}

export const PaneHeader: React.FC<PaneHeaderProps> = (props) => (
    <div className="paneheader">
        <div className="paneheader-title">{props.title}</div>
        {props.buttons.map((button, i) => (
            <div key={i} className="paneheader-btn" onClick={button.onClick}>
                <FontAwesomeIcon className="paneheader-btn-icon" icon={button.icon} />
            </div>
        ))}
    </div>
);
