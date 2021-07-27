import { GOOGLE_COM, BING_COM } from './translateSource';
import { LANG_EN } from './langCode';
import { styleVarsList } from './defaultStyleVars';
import { defaultContextMenus } from './contextMenusIds';
import { DefaultOptions } from '../types';

const defaultOptions: DefaultOptions = {
    userLanguage: LANG_EN,
    defaultTranslateSource: GOOGLE_COM,
    defaultTranslateFrom: '',
    defaultTranslateTo: '',
    translateDirectly: false,
    translateBlackListMode: true,
    translateHostList: [],
    historyBlackListMode: false,
    historyHostList: [],
    showButtonAfterSelect: true,
    defaultAudioSource: GOOGLE_COM,
    translateWithKeyPress: false,
    useDotCn: false,
    multipleTranslateMode: false,
    multipleTranslateSourceList: [GOOGLE_COM, BING_COM],
    multipleTranslateFrom: '',
    multipleTranslateTo: '',
    enablePdfViewer: false,
    preferredLanguage: LANG_EN,
    secondPreferredLanguage: LANG_EN,
    styleVarsList: styleVarsList,
    styleVarsIndex: 0,
    btnPosition: { x: 5, y: 5 },
    audioVolume: 100,
    audioPlaybackRate: 1,
    hideButtonAfterFixedTime: false,
    hideButtonFixedTime: 1000,
    respondToSeparateWindow: false,
    // 'stw' means 'Separate translate Window'
    rememberStwSizeAndPosition: false,
    stwSizeAndPosition: { width: 286, height: 439, left: 550, top: 250 },
    pinThePanelWhileOpeningIt: false,
    rememberPositionOfPinnedPanel: false,
    positionOfPinnedPanel: { x: 5, y: 5 },
    translatePanelMaxHeight: { percentage: false, px: 500, percent: 50 },
    translatePanelWidth: { percentage: false, px: 250, percent: 10 },
    translatePanelFontSize: 14,
    recentTranslateFromList: [],
    recentTranslateToList: [],
    rememberHistoryPanelStatus: false,
    historyPanelStatus: { pin: false, width: 200 },
    translateDirectlyWhilePinning: false,
    doNotRespondInTextBox: false,
    autoTranslateAfterInput: true,
    contextMenus: defaultContextMenus,
    clipboardReadPermission: false,
    autoPasteInTheInputBox: false,
    enableInsertResult: false,
    autoInsertResult: false,
    textPreprocessingRegExpList: [],
    textPreprocessingPreset: { convertCamelCase: false }
};

export default defaultOptions;