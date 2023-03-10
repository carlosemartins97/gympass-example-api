import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare, hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'


describe('Authenticate Use Case', () => {

  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(userRepository)

    const email = 'jhon@teste.com'
    const password = '123456'

    await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6)
    })

    const { user } = await sut.execute({
      email,
      password
    })

    expect(user.email).toEqual(email);
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(userRepository)

    const email = 'jhon@teste.com'
    const password = '123456'

    await expect(async () => {
      await sut.execute({
        email,
        password
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(userRepository)

    const email = 'jhon@teste.com'
    const password = '123456'

    await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash('123123', 6)
    })

    expect(async () => {
      await sut.execute({
        email,
        password
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})