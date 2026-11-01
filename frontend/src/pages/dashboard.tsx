import {useAuthStore} from "../store/auth-store.ts";

export default Dashboard

function Dashboard() {
    const load = useAuthStore((s) => s.isLoading)
    return (
        <>
            <div>Dashboard</div>
            <h1>{load ? "loading..." : "Here is ur data"}</h1>
        </>


)
}
