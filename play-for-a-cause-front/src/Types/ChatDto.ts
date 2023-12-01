import { UserDto } from "./UserDto";

export interface ChatDto {
    name: string;
    users: UserDto[];
    createdAt: string;
    updatedAt: string;
} 