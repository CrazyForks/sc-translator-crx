export const GOOGLE_COM = 'google.com';
export const BING_COM = 'bing.com';
export const BAIDU_COM = 'baidu.com';
export const MOJIDICT_COM = 'mojidict.com';
export const MICROSOFT_COM = 'microsofttranslator.com';
export const BROWSER_AI = 'browser_ai';

export type TranslateSource = {
    source: string;
    url: string;
    name?: string;
};

export const translateSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' },
    { source: BAIDU_COM, url: 'fanyi.baidu.com' },
    { source: MOJIDICT_COM, url: 'www.mojidict.com' },
    { source: BROWSER_AI, url: 'browser.ai' }
];

export const audioSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' }
];

export const webPageTranslateSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: MICROSOFT_COM, url: 'microsofttranslator.com' }
];