import { MainLayout } from "./layouts/MainLayout"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App(){
    return(
        <BrowserRouter>
    <Routes>
        <Route element={<MainLayout/>}>
            <Route path="/" element={<h2>Hello World</h2>}/>
        </Route>
    </Routes>
    </BrowserRouter>
    );
}

export {App}