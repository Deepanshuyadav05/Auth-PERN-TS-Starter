import api from './client.ts'

export const loginUser = async (body: { email: string; password: string }) => {
    const res = await api.post("/auth/login", body);
    return res.data;
}

export const signupUser = async (body: { name: string; email: string; password: string }) => {
    const res = await api.post("/auth/signup", body);
    return res.data;
}

export const verifyEmail = async (token: string) => {
    const res = await api.post("/auth/verify-email", {token});
    return res.data;
}

export const refreshToken = async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
};

export const forgotPassword = async (email: string) => {
    const res = await api.post("/auth/forgot-password", {email});
    return res.data;
}

export const resetPassword = async (token: string, newPassword: string) => {
    const res = await api.post("/auth/reset-password", {token, newPassword});
    return res.data;
}

export const logoutUser = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
}

export const resendVerifyEmail = async (email: string) => {
    const res = await api.post("/auth/resend-verification", {email});
    return res.data;
}

export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};