export type User = {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;   // ← string, not Date!
    updatedAt: string;
};