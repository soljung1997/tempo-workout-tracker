import type { CreateUserInput, UpdateUserInput, UserRepository } from "./userRepository";
import { db } from "../../db/database";

export const sqliteUserRepository:UserRepository = {
    async create(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async softDelete(id) {
        throw new Error("Not Implemented");
    },
    async hardDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async findCurrent() {
        throw new Error("Not Implemented");
    },
};