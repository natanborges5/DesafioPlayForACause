import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ApiProperty } from '@nestjs/swagger'
export interface UserProps {
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt?: Date | null
}
export class User extends AggregateRoot<UserProps> {
    @ApiProperty({
        example: 'natan borges',
        description: 'The name of the user',
    })
    get name() {
        return this.props.name
    }
    @ApiProperty({
        example: 'natanborges@gmail.com',
        description: 'The email of the user',
    })
    get email() {
        return this.props.email
    }
    @ApiProperty({ example: '123123', description: 'The password of the user' })
    get password() {
        return this.props.password
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }
    set name(name: string) {
        this.props.name = name
        this.touch()
    }
    set email(email: string) {
        this.props.email = email
        this.touch()
    }
    set password(password: string) {
        this.props.password = password
        this.touch()
    }
    touch() {
        this.props.updatedAt = new Date()
    }
}
