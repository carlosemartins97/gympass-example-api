import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach } from 'vitest'
import { expect, describe, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository)
  })


  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Js Gym',
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Ts Gym',
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Js Gym' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Ts Gym ${i}`,
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null
      })
    }



    const { gyms } = await sut.execute({
      page: 2,
      query: 'Ts'
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Ts Gym 21' }),
      expect.objectContaining({ title: 'Ts Gym 22' }),
    ])
  })
})