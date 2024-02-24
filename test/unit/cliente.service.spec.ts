import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../src/entities/cliente.entity';
import { ClienteService } from '../../src/modules/cliente/cliente.service';
import { BadRequestException } from '@nestjs/common';

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: Repository<Cliente>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    repo = module.get(getRepositoryToken(Cliente));
  });

  it('should throw an error if email already exists', async () => {
    const clienteReq = { email: 'test@test.com', cpf: '12345678901', nome: 'Test' };
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(new Cliente());

    const exec = service.cadastrar(clienteReq);

    await expect(exec).rejects.toThrow(BadRequestException);
  });

  it('should throw an error if cpf already exists', async () => {
    const clienteReq = { email: 'test@test.com', cpf: '12345678901', nome: 'Test' };
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(new Cliente());

    const exec = service.cadastrar(clienteReq);

    await expect(exec).rejects.toThrow(BadRequestException);
  });

  it('should save and return the client if email and cpf do not exist', async () => {
    const clienteReq = { email: 'test@test.com', cpf: '12345678901', nome: 'Test' };
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(clienteReq as Cliente);

    const result = await service.cadastrar(clienteReq);

    expect(result).toEqual(clienteReq);
    expect(repo.save).toHaveBeenCalledWith(clienteReq);
  });
});
