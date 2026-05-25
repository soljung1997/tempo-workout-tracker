export type User = {
    id: number;
    displayName: string;
    googleAccountId?: string;
    email?: string;
    sex?: "male" | "female" | "intersex" | "preferNotToSay";
    heightCm?: number;
    birthYear?: number;
    isActive: boolean;
    deletedAt?: string;
    scheduledHardDeleteAt?: string;
    createdAt: string;
    updatedAt: string;
};