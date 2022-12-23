import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login/Login"
import Terminal from "./page/Terminal/Terminal"

const AppRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login/:id" element={<Login />} />
                <Route path="terminal" element={<Terminal />} />
            </Routes>
        </>
    )
}
export default AppRoute