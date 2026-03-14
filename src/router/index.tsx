import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import Layout from "../components/Layout";
import Chat from "../pages/Chat";
import ChatRoom from "../pages/ChatRoom";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/*Rutele externe*/}
                <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                </Route>

                {/*Rutele interne*/}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                    <Route path="chatroom" element={<ChatRoom />}/>
                    <Route path="chat/:id" element={<Chat />}/>
                    

                    </Route>
                </Route>

                {/*Rutele pagina inexistenta*/}
                <Route path="*" element={<div><h1>404- Pagina nu exista</h1></div>}/>

            </Routes>
        </BrowserRouter>
    )
}