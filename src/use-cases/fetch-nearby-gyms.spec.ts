import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach } from 'vitest'
import { expect, describe, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })


  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Js Gym',
      latitude: -23.9472137,
      longitude: -46.333695,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Ts Gym',
      latitude: -23.9475567,
      longitude: -46.334073,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Teste Gym',
      latitude: -13.9882822,
      longitude: -50.4563499,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.9466493,
      userLongitude: -46.3336273
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Js Gym' }),
      expect.objectContaining({ title: 'Ts Gym' }),
    ])
  })
})