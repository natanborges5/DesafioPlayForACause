import { UserDto } from "./UserDto";

export interface ChatDto {
    id: string
    name: string;
    users: UserDto[];
    createdAt: string;
    updatedAt: string;
} 