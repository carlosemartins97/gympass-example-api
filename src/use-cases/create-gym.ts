import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {

  constructor(private gymsRepository: GymsRepository) { }

  async execute({ description, title, latitude, longitude, phone }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {

    const gym = await this.gymsRepository.create({
      description, title, latitude, longitude, phone
    });

    return {
      gym
    }
  }
}

