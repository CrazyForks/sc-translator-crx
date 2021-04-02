import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../IconFont';
import { useIsEnable, useOptions } from '../../public/react-use';
import './style.css';
import { getMessage } from '../../public/i18n';
import HistoryResultPanel from './HistoryResultPanel';
import HistoryItem from './HistoryItem';
import { removeHistory } from '../../redux/actions/translateHistoryActions';
import { mouseDrag } from '../../public/utils';
import { setLocalStorage } from '../../public/chrome-call';

const midInThree = (min, num, max) => (Math.min(max, Math.max(min, num)));

const useOptionsDependency = ['rememberHistoryPanelStatus', 'historyPanelStatus'];

const TsHistory = () => {
    const [pinning, setPinning] = useState(false);
    const [fold, setFold] = useState(true);
    const [panelTranslations, setPanelTranslations] = useState([]);
    const [panelTop, setPanelTop] = useState(5);
    const [historyWidth, setHistoryWidth] = useState(200);

    const translateHistoryState = useSelector(state => state.translateHistoryState);

    const { rememberHistoryPanelStatus, historyPanelStatus } = useOptions(useOptionsDependency);

    const isEnableHistory = useIsEnable('history', window.location.host);
    const isEnableTranslate = useIsEnable('translate', window.location.host);

    const foldTimeDelay = useRef(null);

    const dispatch = useDispatch();

    const handleShowResultPanel = useCallback((translations, y) => {
        setPanelTop(y);
        setPanelTranslations(translations);
    }, []);

    const handleRemoveHistory = useCallback((translateId) => {
        dispatch(removeHistory({ translateId }));
    }, [dispatch]);

    useEffect(() => {
        if (rememberHistoryPanelStatus) {
            setPinning(historyPanelStatus.pin);
            setHistoryWidth(historyPanelStatus.width);
            setFold(!historyPanelStatus.pin);
        }
    }, [rememberHistoryPanelStatus, historyPanelStatus]);

    return (
        <div
            className={`ts-history${fold ? '' : ' ts-history-show'}`}
            style={{display: isEnableHistory && isEnableTranslate ? 'block' : 'none', width: `${historyWidth}px`}}
            onMouseEnter={() => {
                if (pinning) { return; }

                foldTimeDelay.current && clearTimeout(foldTimeDelay.current);
                setFold(false);
            }}
            onMouseLeave={() => {
                setPanelTranslations([]);

                foldTimeDelay.current = setTimeout(() => !pinning && setFold(true), 500);
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div className='ts-history-unfold'>
                <IconFont iconName='#icon-GoChevronRight' />
                <span className='ts-history-unfold-text'>Sc</span>
            </div>
            <div className='ts-history-head'>
                {getMessage('contentHistoryTitle')}
                <IconFont
                    iconName='#icon-GoPin'
                    className={`ts-history-head-icons${pinning ? ' ts-history-head-icons-check' : ''}`}
                    onClick={() => {
                        const nextPinning = !pinning;
                        rememberHistoryPanelStatus && setLocalStorage({ 'historyPanelStatus': { ...historyPanelStatus, pin: nextPinning } });
                        setPinning(nextPinning);
                        !nextPinning && setFold(true);
                    }}
                />
            </div>
            <div
                className='ts-history-e-resize'
                onMouseDown={({ clientX }) => (mouseDrag(({ x }) => (
                    x !== clientX && setHistoryWidth(midInThree(100, x - 1 + historyWidth - clientX, 300))
                ), ({ x }) => {
                    if (x !== clientX) {
                        const nextWidth = midInThree(100, x - 1 + historyWidth - clientX, 300);
                        setHistoryWidth(nextWidth);
                        rememberHistoryPanelStatus && setLocalStorage({ 'historyPanelStatus': { ...historyPanelStatus, width: nextWidth } });
                    }
                }))}
            ></div>
            <div className='ts-history-content ts-scrollbar'>
                {translateHistoryState.length === 0 ? <div className='ts-history-norecord'>
                        {getMessage('contentNoRecord')}
                </div> : translateHistoryState.map((v) => (
                    <HistoryItem historyItem={v} key={v.translateId} showResultPanel={handleShowResultPanel} removeHistory={handleRemoveHistory} />
                ))}
                <HistoryResultPanel translations={panelTranslations} top={panelTop} historyWidth={historyWidth} />
            </div>
        </div>
    );
};

export default TsHistory;