import { Injectable } from '@nestjs/common';
import { UserRepository } from './store/user.repository';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string) {
    return this.userRepository.findById(id);
  }
}
