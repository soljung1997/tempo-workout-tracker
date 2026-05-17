export type User = {
    id: number;
    displayName: string;
    googleAccountId?: string;
    email?: string;
    sex?: "male" | "female" | "intersex" | "preferNotToSay";
    heightCm?: number;
    birthYear: number;
    createdAt: string;
    updatedAt: string;
};