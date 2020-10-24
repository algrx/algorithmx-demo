import { Action, AnyAction, Dispatch, Reducer } from 'redux';

import { PLang, ActionChangePLang } from '../state/plang';
import { AlgrXState, resetAlgrx, resizeCanvas, pauseCanvas, resumeCanvas } from './algorithmx';
import { InitExecuteArgs, getPLangLogInfo, execute } from './execute';
import { processLog } from './utils';
import { AppActionType } from '../components/app';

export enum LogType {
    Normal = 'normal',
    Error = 'error',
}

export type ExecuteLog = ReadonlyArray<{ readonly text: string; readonly type: LogType }>;

export interface ExecuteState {
    readonly algrxState?: AlgrXState;
    readonly executeId?: string;
    readonly running: boolean;
    readonly paused: boolean;
    readonly log: ExecuteLog;
    readonly loadedBrython: boolean;
}

export enum ExecuteActionType {
    Algrx = 'execute/algrx',
    Execute = 'execute/execute',
    LoadedBrython = 'execute/loaded-brython',
    Pause = 'execute/pause',
    Resume = 'execute/resume',
    Restart = 'execute/restart',
    Log = 'execute/log',
}

export interface ExecuteDispatchProps {
    readonly dispatchAlgrx: (algrxState: AlgrXState) => void;
    readonly dispatchExecute: (executeId: string) => void;
    readonly dispatchLoadedBrython: () => void;
    readonly dispatchPause: () => void;
    readonly dispatchResume: () => void;
    readonly dispatchLog: (text: string, type: LogType) => void;
}

interface ActionAlgrx extends Action {
    readonly type: ExecuteActionType.Algrx;
    readonly algrxState: AlgrXState;
}
interface ActionExecute extends Action {
    readonly type: ExecuteActionType.Execute;
    readonly executeId: string;
}
interface ActionLog extends Action {
    readonly type: ExecuteActionType.Execute;
    readonly text: string;
    readonly logType: LogType;
}

export const mapExecuteDispatchToProps = (dispatch: Dispatch): ExecuteDispatchProps => ({
    dispatchAlgrx: (algrxState) =>
        dispatch<ActionAlgrx>({ type: ExecuteActionType.Algrx, algrxState }),
    dispatchExecute: (executeId) =>
        dispatch<ActionExecute>({ type: ExecuteActionType.Execute, executeId }),
    dispatchLoadedBrython: () => dispatch({ type: ExecuteActionType.LoadedBrython }),
    dispatchResume: () => dispatch({ type: ExecuteActionType.Resume }),
    dispatchPause: () => dispatch({ type: ExecuteActionType.Pause }),
    dispatchLog: (text, logType) => dispatch({ type: ExecuteActionType.Log, text, logType }),
});

const reset = (state: ExecuteState): ExecuteState => {
    return {
        ...state,
        algrxState: state.algrxState ? resetAlgrx(state.algrxState) : undefined,
        running: false,
        paused: false,
        log: [],
    };
};

const getPLangLog = (pLang: PLang) =>
    processLog([{ text: getPLangLogInfo(pLang), type: LogType.Normal }]);

export const initExecuteState = (pLang: PLang): ExecuteState => ({
    running: false,
    paused: false,
    log: getPLangLog(pLang),
    loadedBrython: false,
});
export const executeReducer: Reducer<ExecuteState> = (
    state = initExecuteState(PLang.JS),
    action: AnyAction
): ExecuteState => {
    if (action.type === ExecuteActionType.Algrx) {
        return { ...state, algrxState: (action as ActionAlgrx).algrxState };
    }
    if (action.type === ExecuteActionType.Log) {
        return {
            ...state,
            log: state.log.concat(
                processLog([
                    {
                        text: (action as ActionLog).text,
                        type: (action as ActionLog).logType,
                    },
                ])
            ),
        };
    }
    if (state.algrxState) {
        if (action.type === AppActionType.ChangePLang) {
            return { ...reset(state), log: getPLangLog((action as ActionChangePLang).newPLang) };
        }
        if (action.type === AppActionType.Resize) {
            return { ...state, algrxState: resizeCanvas(state.algrxState) };
        }
        if (action.type === ExecuteActionType.Execute) {
            return {
                ...reset(state),
                executeId: (action as ActionExecute).executeId,
                running: true,
            };
        }
        if (action.type === ExecuteActionType.Pause) {
            return { ...state, paused: true, algrxState: pauseCanvas(state.algrxState) };
        }
        if (action.type === ExecuteActionType.Resume) {
            return { ...state, paused: false, algrxState: resumeCanvas(state.algrxState) };
        }
        if (action.type === ExecuteActionType.LoadedBrython) {
            return { ...state, loadedBrython: true };
        }
    }
    return state;
};
