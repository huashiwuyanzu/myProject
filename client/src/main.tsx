import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import Root from '@/pages/Root/Root.tsx'
import '@/configs/globalStyle/global.css'




ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Root></Root>
        </BrowserRouter>
    </React.StrictMode>,
)
