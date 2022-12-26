import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login/Login"
import Terminal from "./page/Terminal";

const AppRoute = () => {
    return (
        <BrowserRouter basename="/treeview">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="terminal" element={<Terminal />} />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRoute