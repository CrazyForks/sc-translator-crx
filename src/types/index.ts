import { StyleVarsList } from "../constants/defaultStyleVars";
import { SourceParams } from "../constants/sourceParams";

declare global {
    interface Window {
        Translator: Translator;
        LanguageDetector: LanguageDetector;
    }
}

interface Translator {
    availability: (params: { sourceLanguage: string; targetLanguage: string; }) => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
    create: (params: { sourceLanguage: string; targetLanguage: string; monitor?: (monitor: EventTarget) => void; }) => Promise<Translator>;
    translate: (input: string) => Promise<string>;
    destroy: () => void;
    ready: Promise<void>;
};

interface LanguageDetector {
    availability: (expectedInputLanguages?: string[]) => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
    create: (params?: { monitor?: (monitor: EventTarget) => void; }) => Promise<LanguageDetector>;
    detect: (input: string) => Promise<{ detectedLanguage: string; confidence: number; }[]>;
    destroy: () => void;
    ready: Promise<void>;
}

export type GetStorageKeys<T extends keyof DefaultOptions> = T[];

export type TranslateResult = {
    text: string;
    from: string;
    to: string;
    result: string[];
    dict?: string[];
    phonetic?: string;
    related?: string[];
    example?: string[];
};

export type TranslateRequestInit = {
    status: 'init';
}

export type TranslateRequestLoading = {
    status: 'loading';
}

export type TranslateRequestFinished = {
    status: 'finished';
    result: TranslateResult;
}

export type TranslateRequestError = {
    status: 'error';
    errorCode: string;
}

export type TranslateRequest = TranslateRequestInit | TranslateRequestLoading | TranslateRequestFinished | TranslateRequestError;

export type Translation = {
    source: string;
    translateRequest: TranslateRequest;
};

export type Position = {
    x: number;
    y: number;
};

export type HistoryPanelStatus = { pin: boolean; width: number };

export type OptionsContextMenuId =
    | 'OPEN_THIS_PAGE_WITH_PDF_VIEWER'
    | 'OPEN_SEPARATE_WINDOW'
    | 'TRANSLATE_SELECTION_TEXT'
    | 'LISTEN_SELECTION_TEXT'
    | 'TRANSLATE_CURRENT_PAGE';
export type OptionsContextMenu = { id: OptionsContextMenuId; enabled: boolean };

export type TextPreprocessingRegExp = { pattern: string; flags: string; replacement: string };
export type TextPreprocessingPreset = { convertCamelCase: boolean };

export type TranslateButtonsTL = {
    first: string;
    second: string;
    third: string;
};

export type CustomTranslateSource = {
    name: string;
    url: string;
    source: string;
};

export type DisplayOfTranslation = {
    result: boolean;
    dict: boolean;
    phonetic: boolean;
    related: boolean;
    example: boolean;
    phonetic_nonEnglish: boolean;
    maintainParagraphStructure: boolean;
    sourceLanguage: boolean;
};

export type DisplayModeEnhancement = {
    o_Hovering: boolean;
    oAndT_Underline: boolean;
    oAndT_NonDiscrete: boolean;
    oAndT_paragraphWrap: boolean;
    oAndT_hideSameLanguage: boolean;
    t_Hovering: boolean;
    t_hoveringWithKeyPressing: boolean;
};

export type ComparisonCustomization = {
    color: string;
    underlineColor: string;
    underlineStyle: string;
};

export type DefaultOptions = {
    userLanguage: string;
    translateDirectly: boolean;
    translateBlackListMode: boolean;
    translateHostList: string[];
    historyBlackListMode: boolean;
    historyHostList: string[];
    defaultAudioSource: string;
    translateWithKeyPress: boolean;
    useDotCn: boolean;
    multipleTranslateSourceList: string[];
    multipleTranslateFrom: string;
    multipleTranslateTo: string;
    enablePdfViewer: boolean;
    preferredLanguage: string;
    secondPreferredLanguage: string;
    styleVarsList: StyleVarsList;
    styleVarsIndex: number;
    btnPosition: Position;
    audioVolume: number;
    audioPlaybackRate: number;
    hideButtonAfterFixedTime: boolean;
    hideButtonFixedTime: number;
    respondToSeparateWindow: boolean;
    // 'stw' means 'Separate translate Window'
    rememberStwSizeAndPosition: boolean;
    stwSizeAndPosition: { width: number; height: number; left: number; top: number };
    pinThePanelWhileOpeningIt: boolean;
    rememberPositionOfPinnedPanel: boolean;
    positionOfPinnedPanel: Position;
    translatePanelMaxHeight: { percentage: boolean; px: number; percent: number };
    translatePanelWidth: { percentage: boolean; px: number; percent: number };
    translatePanelFontSize: number;
    recentTranslateFromList: string[];
    recentTranslateToList: string[];
    rememberHistoryPanelStatus: boolean;
    historyPanelStatus: HistoryPanelStatus;
    translateDirectlyWhilePinning: boolean;
    doNotRespondInTextBox: boolean;
    autoTranslateAfterInput: boolean;
    contextMenus: OptionsContextMenu[];
    autoPasteInTheInputBox: boolean;
    enableInsertResult: boolean;
    autoInsertResult: boolean;
    textPreprocessingRegExpList: TextPreprocessingRegExp[];
    textPreprocessingPreset: TextPreprocessingPreset;
    customizeStyleText: string;
    translateButtons: string[];
    webPageTranslateSource: string;
    webPageTranslateTo: string;
    webPageTranslateDisplayMode: number;
    webPageTranslateDirectly: boolean;
    noControlBarWhileFirstActivating: boolean;
    afterSelectingTextRegExpList: TextPreprocessingRegExp[];
    translateButtonsTL: TranslateButtonsTL;
    sourceParamsCache: SourceParams;
    customTranslateSourceList: CustomTranslateSource[];
    displayOfTranslation: DisplayOfTranslation;
    displayModeEnhancement: DisplayModeEnhancement;
    customWebpageTranslateSourceList: CustomTranslateSource[];
    translateDynamicContent: boolean;
    autoTranslateWebpageHostList: string[];
    enableAutoTranslateWebpage: boolean;
    keepUsingDefaultAudioSource: boolean;
    comparisonCustomization: ComparisonCustomization;
    translateIframeContent: boolean;
    translateRedirectedSameDomainPage: boolean;
    enablePageTranslationCache: boolean;
    autoPlayAudio: boolean;
    autoPlayAudioLangs: string[];
};

// Only work in "src/entry/background/install.ts".
// Use for updating and deal with the deprecated options in `initStorageOnInstalled()`.
export type DeprecatedOptions = {
    showButtonAfterSelect: boolean;
    enableContextMenus: boolean;
    clipboardReadPermission: boolean;
    multipleTranslateMode: boolean;
    defaultTranslateSource: string;
    defaultTranslateFrom: string;
    defaultTranslateTo: string;
};

export type SyncOptions = Omit<DefaultOptions, 'sourceParamsCache'>;