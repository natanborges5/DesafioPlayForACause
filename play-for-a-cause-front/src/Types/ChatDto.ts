import { UserDto } from "./UserDto";

export interface ChatDto {
    id: string
    name: string;
    users: string[];
    lastMessage: string
    createdAt: string;
    updatedAt: string;
} 