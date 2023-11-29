
import { Either, left, right } from '@/core/entities/either'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../cryptography/hasher-generator'
import { UsersRepository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'


interface RegisterUserUseCaseRequest {
    name: string
    email: string
    password: string
}
type RegisterUserUseCaseResponse = Either<
    UserAlreadyExistsError,
    {
        user: User
    }
>
@Injectable()
export class RegisterUserUseCase {
    constructor(
        private userRepository: UsersRepository,
        private hashGenerator: HashGenerator,
    ) {}
    async execute({
        name,
        email,
        password,
    }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
        const userWithSameEmail =
            await this.userRepository.findByEmail(email)
        if (userWithSameEmail) {
            return left(new UserAlreadyExistsError(email))
        }
        const hashedPassword = await this.hashGenerator.hash(password)
        const user = User.create({
            name,
            email,
            password: hashedPassword,
        })
        await this.userRepository.create(user)
        return right({
            user,
        })
    }
}
