import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UserService } from '../../src/modules/user/user.service';
import { getUserTeste } from '../utils/getUserTeste';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            isEmailDisponivel: jest.fn(),
            sendMagicLink: jest.fn(),
            sendEmailChangeConfirmationLink: jest.fn(),
            sendAccountDeletionConfirmationLink: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('cadastrar()', () => {
    it('should throw an error if email already exists', async () => {
      const userReq = getUserTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(false);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(new User());

      const exec = service.cadastrar(userReq);

      await expect(exec).rejects.toThrow(BadRequestException);
    });

    it('should save and return a new user if email do not exist', async () => {
      const userReq = getUserTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(true);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repo, 'save').mockResolvedValueOnce(userReq as User);

      const result = await service.cadastrar(userReq);

      expect(result).toEqual(userReq);
      expect(repo.save).toHaveBeenCalledWith(userReq);
    });
  });
});
