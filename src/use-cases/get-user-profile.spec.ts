import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare, hash } from 'bcryptjs'
import { beforeEach } from 'vitest'
import { expect, describe, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'


let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get Profile Use Case', () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const email = 'jhon@teste.com'
    const password = '123456'

    const createdUser = await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John')
  })

  it('should not be able to get user profile with wrong id', async () => {
    const email = 'jhon@teste.com'
    const password = '123456'

    const createdUser = await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6)
    })



    await expect(async () => {
      const { user } = await sut.execute({
        userId: 'non-existing-id'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})