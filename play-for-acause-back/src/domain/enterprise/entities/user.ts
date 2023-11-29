import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'
export interface UserProps {
    name: string
    email: string
    password: string
}
export class User extends Entity<UserProps> {
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
    set name(name: string) {
        this.props.name = name
    }
    set email(email: string) {
        this.props.email = email
    }
    set password(password: string) {
        this.props.password = password
    }
    static create(props: UserProps, id?: UniqueEntityID) {
        const user = new User(
            {
                ...props,
            },
            id,
        )
        return user
    }
}
