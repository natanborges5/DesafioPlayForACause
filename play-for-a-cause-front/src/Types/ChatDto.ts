import { UserDto } from "./UserDto";

export interface ChatDto {
    id: string
    name: string;
    users: UserDto[];
    lastMessage: string
    createdAt: string;
    updatedAt: string;
} 