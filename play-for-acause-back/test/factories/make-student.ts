import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'
export function makeUser(
    override: Partial<UserProps> = {},
    id?: UniqueEntityID,
) {
    const user = User.create(
        {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            ...override,
        },
        id,
    )
    return user
}
