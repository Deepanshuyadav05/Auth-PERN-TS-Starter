import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router";
import Login from "../pages/login.tsx";
import Signup from "../pages/signup.tsx";
import Dashboard from "../pages/dashboard.tsx";
import VerifyEmail from "../pages/verify-email.tsx";
import ResetPassword from "../pages/reset-password.tsx";
import ForgotPassword from "../pages/forgot-password.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login/>}  />
            <Route path="/signup" element={<Signup/>}  />
            <Route path="/dashboard" element={<Dashboard/>}  />
            <Route path="/verify-email" element={<VerifyEmail/>}  />
            <Route path="/reset-password" element={<ResetPassword/>}  />
            <Route path="/forgot-password" element={<ForgotPassword/>}  />

            <Route path="*" element={<div>404 – Page not found</div>} />
        </Route>
    )
)

export default router