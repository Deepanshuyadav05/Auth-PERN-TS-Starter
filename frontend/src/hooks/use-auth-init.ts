import {useEffect} from "react";
import {useAuthStore} from "../store/auth-store.ts";
import {refreshAccessToken} from "../api/client.ts";
import {getMe} from "../api/auth-api.ts";

export function useAuthInit() {
    useEffect(() => {
        const { setAuth, clearAuth, setIsLoading } = useAuthStore.getState();

        const init = async () => {
            try {
                const token = await refreshAccessToken();   // get a new access token
                const res = await getMe();                  // get the user
                //getMe() already returns axios's body ({ success, message, data }), so res.data is the user.
                setAuth(res.data, token);                   // logged in ✅
            } catch {
                clearAuth();                                // no valid cookie → guest
            } finally {
                setIsLoading(false);                        // done either way
            }
        };

        init();
    }, []);   // [] = run once when the app opens
}