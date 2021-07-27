import React, { useCallback, useEffect, useRef } from 'react';
import IconFont from '../../../components/IconFont';
import LanguageSelection from '../../../components/LanguageSelection';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import RawText from '../../../components/RawText';
import { mtLangCode } from '../../../constants/langCode';
import { openOptionsPage, setLocalStorage } from '../../../public/chrome-call';
import { sendAudio, sendTranslate } from '../../../public/send';
import './style.css';
import '../../../components/PopupHeader/style.css';
import { useAppDispatch, useAppSelector, useOptions } from '../../../public/react-use';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { mtAddSource, mtRemoveSource, mtRequestError, mtRequestFinish, mtRequestStart, mtSetFromAndTo, mtSetText } from '../../../redux/slice/multipleTranslateSlice';
import { DefaultOptions } from '../../../types';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';

type PickedOptions = Pick<DefaultOptions, 'styleVarsList' | 'styleVarsIndex' | 'rememberStwSizeAndPosition' | 'autoTranslateAfterInput'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['styleVarsList', 'styleVarsIndex', 'rememberStwSizeAndPosition', 'autoTranslateAfterInput'];

const Separate: React.FC = () => {
    const { text, from, to, translations, translateId } = useAppSelector(state => state.multipleTranslate);
    const { focusFlag } = useAppSelector(state => state.panelStatus);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    const dispatch = useAppDispatch();

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source: string) => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(mtRequestStart({ source }));

        sendTranslate(preprocessedText, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            result.suc ? dispatch(mtRequestFinish({ source, result: result.data})) : dispatch(mtRequestError({ source, errorCode: result.data.code }));
        });
    }, [text, from, to, dispatch]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRemoveSource = useCallback((source: string) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleRetry = useCallback((source: string) => {
        handleTranslate(source);
    }, [handleTranslate]);

    const handleAddSource = useCallback((source: string, addType: number) => {
        dispatch(mtAddSource({ source, addType }));
        text && handleTranslate(source);
    }, [dispatch, text, handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        text && translations.map(({ source }) => (handleTranslate(source)));

        oldTranslateIdRef.current = translateId;
    }, [translateId, text, handleTranslate, translations, dispatch]);

    const { styleVarsList, styleVarsIndex, rememberStwSizeAndPosition, autoTranslateAfterInput } = useOptions<PickedOptions>(useOptionsDependency);

    const handleThemeToggle = useCallback(() => {
        setLocalStorage({'styleVarsIndex': styleVarsIndex >= styleVarsList.length - 1 ? 0 : styleVarsIndex + 1});
    }, [styleVarsList, styleVarsIndex]);

    useEffect(() => {
        const text = new URL(window.location.href).searchParams.get('text');
        text && dispatch(mtSetText({ text }));

        // read clipboard
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && dispatch(mtSetText({ text: clipboardText }));
            dispatch(callOutPanel());
        };

        if (getOptions().autoPasteInTheInputBox && !text) {
            chrome.permissions.contains({ permissions: ['clipboardRead'] }, result => result && readClipboardText());
        }
        else {
            dispatch(callOutPanel());
        }
    }, [dispatch]);

    useEffect(() => {
        if (!rememberStwSizeAndPosition) { return; }

        const onBeforeUnload = () => {
            const sizeAndPosition = {
                width: window.outerWidth,
                height: window.outerHeight,
                left: window.screenX,
                top: window.screenY
            };

            setLocalStorage({ 'stwSizeAndPosition': sizeAndPosition });
        };

        window.addEventListener('beforeunload', onBeforeUnload);

        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [rememberStwSizeAndPosition]);

    return (
        <div id="sc-translator-root" className='container'>
            <div className="title flex-justify-content-space-between">
                <div className='title-logo flex-align-items-center'>Sc</div>
                <div className='title-icons flex-align-items-center'>
                    <IconFont
                        iconName='#icon-theme'
                        className='title-icons-enable'
                        onClick={() => handleThemeToggle()}
                        title={getMessage('popupSwitchToTheNextTheme')}
                    />
                    <IconFont
                        iconName='#icon-MdSettings'
                        className='title-icons-enable'
                        onClick={openOptionsPage}
                        title={getMessage('popupOpenOptionsPage')}
                    />
                </div>
            </div>
            <div className="content">
                <RawText
                    defaultValue={text}
                    rawTextTranslate={handleSetText}
                    focusDependency={focusFlag}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                />
                <LanguageSelection
                    onChange={handleSelectionChange}
                    from={from}
                    to={to}
                    languageCodes={mtLangCode}
                />
                <div className='ts-mt-results ts-scrollbar'>
                    {translations.length === 0 ? 
                        <div className='ts-mt-result-add-translate-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                    translations.map(({ source, translateRequest }) => (
                        <MtResult
                            source={source}
                            translateRequest={translateRequest}
                            key={source}
                            remove={() => handleRemoveSource(source)}
                            readText={(text, from) => sendAudio(text, { source, from })}
                            retry={() => handleRetry(source)}
                            setText={handleSetText}
                        />
                    ))}
                </div>
                <MtAddSource translations={translations} addSource={handleAddSource} />
            </div>
        </div>
    );
};

export default Separate;