import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import TsBtn from '../../components/TsBtn';
import TsHistory from '../../components/TsHistory';
import ResultBox from './ResultBox';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import '../../styles/global.css';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import WebPageTranslate from './WebPageTranslate';
import scOptions from '../../public/sc-options';
import { initHighlight } from './highlight';

scOptions.init().then((options) => {
    initTranslation({
        sourceList: options.multipleTranslateSourceList,
        from: options.multipleTranslateFrom,
        to: options.multipleTranslateTo
    });

    const root = document.createElement('div');
    root.id = 'sc-translator-shadow';
    root.setAttribute('style', 'all: initial;');
    document.documentElement.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: 'open' });

    const contentStyle = document.createElement('link');
    contentStyle.rel = 'stylesheet';
    contentStyle.href = chrome.runtime.getURL('/static/css/content.css');
    shadowRoot.appendChild(contentStyle);

    appendColorVarsStyle(shadowRoot);
    appendFontSizeStyle(shadowRoot);
    appendCustomizeStyle(shadowRoot);

    initHighlight();

    const rootWrapper = document.createElement('div');
    rootWrapper.setAttribute('style', 'all: initial;');
    shadowRoot.appendChild(rootWrapper);

    const rootElement = document.createElement('div');
    rootElement.id = 'sc-translator-root';
    rootWrapper.appendChild(rootElement);

    const enableWebpageTranslation = chrome.runtime.getURL('') !== `${window.origin}/`;

    contentStyle.onload = () => ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <TsBtn />
            <TsHistory />
            <ResultBox />
            {enableWebpageTranslation && <WebPageTranslate />}
        </Provider>
    );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse({ host: window.location.host });
});