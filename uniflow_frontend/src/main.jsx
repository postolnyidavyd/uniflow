import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "./router/index.js";
import {Provider} from "react-redux";
import store from "./store/store.js";
import {AppToaster} from "./components/ui/AppToaster.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
          <AppToaster/>
          <RouterProvider router={router}/>
      </Provider>
  </StrictMode>,
)
