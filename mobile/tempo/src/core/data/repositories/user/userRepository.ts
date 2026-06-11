import type { User } from "../../../domain/models/user";

export type CreateUserInput = {
    displayName: string;
    googleAccountId?: string;
    email?: string;
    sex?: User["sex"];
    heightCm?: number;
    birthYear?: number;
};

export type UpdateUserInput = {
    id: User["id"];
    displayName?: string;
    googleAccountId?: string;
    email?: string;
    sex?: User["sex"];
    heightCm?: number;
    birthYear?: number;
};

export type UserRepository = {
    create(input: CreateUserInput): Promise<User>;
    update(input: UpdateUserInput): Promise<User>;
    softDelete(id: User["id"]): Promise<void>;
    hardDelete(id: User["id"]): Promise<void>;
    findById(id: User["id"]): Promise<User | null>;
    findCurrent(): Promise<User | null>;
};