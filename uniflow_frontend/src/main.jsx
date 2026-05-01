import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider} from "react-router-dom";
import router from "./router/index.js";
import {Provider} from "react-redux";
import store from "./store/store.js";
import {AppToaster} from "./components/AppToaster.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
          <AppToaster/>
          <RouterProvider router={router}/>
      </Provider>
    <App />
  </StrictMode>,
)
