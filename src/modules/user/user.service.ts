import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async cadastrar(userReq: User): Promise<User> {
    const { email, nome } = userReq;
    const emailDisponivel = await this.isEmailDisponivel(email);

    if (!emailDisponivel) {
      throw new BadRequestException('Email já foi cadastrado');
    }

    const user: User = await this.userRepository.save({ email, nome });
    return user;
  }

  async consultarPorEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async isEmailDisponivel(email: string): Promise<boolean> {
    return !(await this.userRepository.exists({
      where: { email },
    }));
  }
}
