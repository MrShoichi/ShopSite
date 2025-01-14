import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import store from './store';
import { Provider } from 'react-redux'; // Don't forget to import Provider
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
