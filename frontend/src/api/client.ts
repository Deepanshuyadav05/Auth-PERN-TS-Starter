import axios from "axios";
import {useAuthStore} from "../store/auth-store.ts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   // http://localhost:3000/api
    withCredentials: true,                   // send/receive the refresh cookie
    headers: { "Content-Type": "application/json" },
})

//Request Interceptor: Runs before every request is sent
api.interceptors.request.use((config) => {
    //pull token from storage
    const token = useAuthStore.getState().accessToken;
    // If token exists, attach it to the Authorization header
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;  //must return config, or the request is never sent
})

// SHARED REFRESH: only one /refresh at a time
let refreshPromise: Promise<string> | null = null;  //module-level: survives unmount/remount

export const refreshAccessToken = (): Promise<string> => {
    if(!refreshPromise) {
        refreshPromise = api
            .post("/auth/refresh")
            .then((res) => {
                // the first .data is axios's response body, and the second is the data field from your ApiResponseClass
                const newToken: string = res.data.data.accessToken;
                useAuthStore.getState().setAccessToken(newToken);
                return newToken;
            })
            // runs on success and failure. Everyone already waiting holds a reference to the promise, so resetting the variable doesn't affect them. It only means the next expiry, 15 minutes later,
            //     starts a fresh refresh
            .finally(() => refreshPromise = null);  // reset so the NEXT expiry can refresh again
    }
    return refreshPromise;  //// callers 2, 3… get the same promise
}

//Response Interceptor: Runs after a response is received
//Your access token is like an entry pass that expires every 15 minutes.
//
//   1. The page asks the backend for something, like "give me my profile".
//   2. The backend says "401 – your pass expired".
//   3. Instead of showing an error, this code quietly goes to /refresh and gets a new pass.
//   4. Then it sends the same request again with the new pass.
//   5. The page gets its data and never knows anything happened.
api.interceptors.response.use(
    // Any status code within the range of 2xx triggers this function
    // Request succeeded → do nothing, just give the response bac
    (response) => response,

    // Request failed → this function runs
    // Any status codes outside the range of 2xx trigger this function
    async(error) => {
        const request = error.config; // the request that failed

        // Not a 401? Then it's some other error (like 400 or 500). Give it back to the page.
        //The _retry property is not a built-in feature of Axios. It is a custom, arbitrary flag that developers create manually to prevent an infinite loop when handling token refreshes.
        if (error.response?.status !== 401 || request._retry) {
            // This means "I'm not handling this error, so give it back to the page." The page's try/catch then receives it. For example, the login page can show "Wrong password"
            return Promise.reject(error);
        }
        // This is a sticky note on the request saying "already retried once." If the retried request also gets 401, the code sees the note and stops, instead of refreshing again and again forever
        request._retry = true;

        // Login, refresh and logout can return 401 for other reasons
        // (wrong password, no cookie), so don't try to refresh for them.
        if (
            request.url === "/auth/login" ||
            request.url === "/auth/refresh" ||
            request.url === "/auth/logout"
        ) {
            return Promise.reject(error);
        }

        try {
            await refreshAccessToken();   // get a new pass (it's saved in the store)
            // This means "send the same request again." You don't need to add the new token yourself: the request interceptor (the first one) runs again and attaches the new token from the store
            return api(request);          // send the same request again
        } catch (refreshError) {
            useAuthStore.getState().clearAuth();   // refresh failed → log the user out
            return Promise.reject(refreshError);
        }

    }


)
