import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { afterEach, beforeEach, vi } from 'vitest'
import { expect, describe, it } from 'vitest'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate inexistence check in', async () => {

    await expect(async () => {
      await sut.execute({
        checkInId: 'inexistance'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to not validate check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })
    const time = 1000 * 60 * 21 //minutes

    vi.advanceTimersByTime(time)

    await expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})