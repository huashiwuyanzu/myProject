import {app, BrowserWindow} from 'electron'
const createWindow = () => {
    const win = new BrowserWindow({
        width:1000,
        height:800
    })
    win.loadURL('http://127.0.0.1:5173/login')
}

app.whenReady().then(()=>{
    createWindow()
})
