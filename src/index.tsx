import React from 'react';
import ReactDOM from 'react-dom';
import { asyncWithDVCProvider } from "@devcycle/devcycle-react-sdk";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


(async () => {
    const DVCProvider = await asyncWithDVCProvider({
        envKey: 'client-e9c6c873-9c09-43e0-9454-4e70aef1acb8'
    })

    ReactDOM.render(
        <React.StrictMode>
            <DVCProvider>
                <App />
            </DVCProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
})();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
