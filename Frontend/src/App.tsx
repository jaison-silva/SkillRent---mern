import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../src/routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
        <Toaster position="top-center" />
        <AppRoutes />
    </BrowserRouter>
  );
}

export { App };
