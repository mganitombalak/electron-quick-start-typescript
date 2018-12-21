import { app, BrowserWindow, Event, BrowserWindowConstructorOptions, Menu } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { AppEvent } from './common/app-events';
import { stringify } from 'querystring';

class Applicaton {
    static start(): void { new Applicaton() };

    
    private readonly instance: Electron.App = app;
    private mainWindow: Promise<BrowserWindow>;
    constructor() {
        this.instance.on(AppEvent.WindowAllClosed, this.onAllWindowsClosed);
        this.instance.on(AppEvent.Ready, this.onReady);

        
    }

    private onReady(): void {
        if (!this.mainWindow) {
            this.mainWindow = new Promise<BrowserWindow>((resolve, reject) => {
                try {
                    resolve(new BrowserWindow(<BrowserWindowConstructorOptions>{
                        width: 800,
                        height: 600
                    }));
                } catch (error) {
                    reject(error);
                }

            });
            this.mainWindow.then(mw => {
                mw.loadURL(url.format(<url.UrlObject>{
                    pathname: path.resolve('pages', 'index.html'),
                    protocol: 'file:',
                    slashes: true
                }));
                console.log('Application has been started.');
            }).catch(e => console.log(stringify(e)));
        }
    }

    private onAllWindowsClosed(): void {
        if (process.platform !== 'darwin') {
            this.instance.quit()
        }
        console.log('All window has been closed.');
    }

    private onWindowClosed(): void {
        this.mainWindow = null;
        console.log('Window has been closed.');
    }

    private prepareMenu():void{
        const template = [
            {
              label: 'Edit',
              submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'pasteandmatchstyle'},
                {role: 'delete'},
                {role: 'selectall'}
              ]
            },
            {
              label: 'View',
              submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
              ]
            },
            {
              role: 'window',
              submenu: [
                {role: 'minimize'},
                {role: 'close'}
              ]
            },
            {
              role: 'help',
              submenu: [
                {
                  label: 'Learn More',
                  click () { require('electron').shell.openExternal('https://electronjs.org') }
                }
              ]
            }
          ]
          
          if (process.platform === 'darwin') {
            template.unshift({
              label: app.getName(),
              submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
              ]
            })
          
            // Window menu
            template[3].submenu = [
              {role: 'close'},
              {role: 'minimize'},
              {role: 'zoom'},
              {type: 'separator'},
              {role: 'front'}
            ]
          };
          
          const menu = Menu.buildFromTemplate(template)
          Menu.setApplicationMenu(menu)
    }
}
Applicaton.start();