import { faker } from '@faker-js/faker'
import { RegisterUserUseCase } from './register-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Create User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        fakeHasher = new FakeHasher()
        sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
    })

    it('Should be able to register a new user', async () => {
        const password = faker.internet.password()
        const result = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: password,
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[0],
        })
    })
    it('Should hash user password upon registration', async () => {
        const password = faker.internet.password()
        const result = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: password,
        })
        const hashedPassword = await fakeHasher.hash(password)
        expect(result.isRight()).toBe(true)
        expect(inMemoryUsersRepository.items[0].password).toEqual(
            hashedPassword,
        )
    })
})
