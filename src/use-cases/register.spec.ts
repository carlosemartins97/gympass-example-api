import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'


describe('Register Use Case', () => {

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon',
      email: 'jhon@teste.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);

  })


  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository)

    await registerUseCase.execute({
      name: 'Jhon',
      email: 'jhon@teste.com',
      password: '123456'
    })

    await expect(() => registerUseCase.execute({
      name: 'Jhon',
      email: 'jhon@teste.com',
      password: '123456'
    })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register ', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon',
      email: 'jhon@teste.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
})