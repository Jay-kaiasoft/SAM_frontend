import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/js/dist/tooltip.js";
import './index.css';
import App from './App';
import store from './store'
import History from './history'
import "@fortawesome/fontawesome-pro/css/all.min.css";
import { unstable_createMuiStrictModeTheme } from '@mui/material/styles';
import {ThemeProvider} from "@mui/material/styles";
import "reactflow/dist/style.css";

const theme = unstable_createMuiStrictModeTheme();
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<Provider store={store}>
    <Router history={History}> {/*<BrowserRouter> */}
        <ThemeProvider theme={theme}>
            <Route component={App} />
        </ThemeProvider>
    </Router>
</Provider>);