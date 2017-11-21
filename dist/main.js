"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const app_events_1 = require("./common/app-events");
const querystring_1 = require("querystring");
class Applicaton {
    constructor() {
        this.instance = electron_1.app;
        this.instance.on(app_events_1.AppEvent.WindowAllClosed, this.onAllWindowsClosed);
        this.instance.on(app_events_1.AppEvent.Ready, this.onReady);
    }
    static start() { new Applicaton(); }
    ;
    onReady() {
        if (!this.mainWindow) {
            this.mainWindow = new Promise((resolve, reject) => {
                try {
                    resolve(new electron_1.BrowserWindow({
                        width: 800,
                        height: 600
                    }));
                }
                catch (error) {
                    reject(error);
                }
            });
            this.mainWindow.then(mw => {
                mw.loadURL(url.format({
                    pathname: path.resolve('pages', 'index.html'),
                    protocol: 'file:',
                    slashes: true
                }));
                console.log('Application has been started.');
            }).catch(e => console.log(querystring_1.stringify(e)));
        }
    }
    onAllWindowsClosed() {
        if (process.platform !== 'darwin') {
            this.instance.quit();
        }
        console.log('All window has been closed.');
    }
    onWindowClosed() {
        this.mainWindow = null;
        console.log('Window has been closed.');
    }
}
Applicaton.start();
//# sourceMappingURL=main.js.map