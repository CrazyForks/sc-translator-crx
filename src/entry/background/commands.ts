import { getCurrentTab, getLocalStorageAsync } from '../../public/utils';
import {
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED,
    SCTS_TRANSLATE_CURRENT_PAGE,
    SCTS_SWITCH_WT_DISPLAY_MODE
} from '../../constants/chromeSendMessageTypes';
import {
    SC_AUDIO,
    SC_TRANSLATE,
    SC_CALL_OUT,
    SC_OPEN_SEPARATE_WINDOW,
    SC_CLOSE,
    SC_TOGGLE_AUTO_INSERT_RESULT,
    SC_TRANSLATE_CURRENT_PAGE,
    SC_SWITCH_WT_DISPLAY_MODE
} from '../../constants/commandsName';
import { createSeparateWindow } from './separate-window';
import { setLocalStorage } from '../../public/chrome-call';
import { DefaultOptions } from '../../types';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_COMMAND_KEY_PRESSED }));
            break;
        case SC_AUDIO:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_AUDIO_COMMAND_KEY_PRESSED }));
            break;
        case SC_CALL_OUT:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED }));
            break;
        case SC_OPEN_SEPARATE_WINDOW:
            createSeparateWindow();
            break;
        case SC_CLOSE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_CLOSE_COMMAND_KEY_PRESSED }));
            break;
        case SC_TOGGLE_AUTO_INSERT_RESULT:
            getLocalStorageAsync<Pick<DefaultOptions, 'autoInsertResult'>>(['autoInsertResult']).then(data => setLocalStorage({ 'autoInsertResult': !data.autoInsertResult }));
            break;
        case SC_TRANSLATE_CURRENT_PAGE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_CURRENT_PAGE }));
            break;
        case SC_SWITCH_WT_DISPLAY_MODE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_SWITCH_WT_DISPLAY_MODE }));
            break;
        default: break;
    }
});