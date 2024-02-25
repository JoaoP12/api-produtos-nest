import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../src/entities/cliente.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ClienteService } from '../../src/modules/cliente/cliente.service';
import { getClienteTeste } from '../utils/getClienteTeste';

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: Repository<Cliente>;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(Cliente),
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

    service = module.get<ClienteService>(ClienteService);
    authService = module.get<AuthService>(AuthService);
    repo = module.get(getRepositoryToken(Cliente));
  });

  describe('cadastrar()', () => {
    it('should throw an error if email already exists', async () => {
      const clienteReq = getClienteTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(false);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(new Cliente());

      const exec = service.cadastrar(clienteReq);

      await expect(exec).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if cpf already exists', async () => {
      const clienteReq = getClienteTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(true);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(new Cliente());

      const exec = service.cadastrar(clienteReq);

      await expect(exec).rejects.toThrow(BadRequestException);
    });

    it('should save and return the client if email and cpf do not exist', async () => {
      const clienteReq = getClienteTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(true);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repo, 'save').mockResolvedValueOnce(clienteReq as Cliente);

      const result = await service.cadastrar(clienteReq);

      expect(result).toEqual(clienteReq);
      expect(repo.save).toHaveBeenCalledWith(clienteReq);
    });

    it('should send a magic link after saving the client', async () => {
      const clienteReq = getClienteTeste();
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValueOnce(true);
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repo, 'save').mockResolvedValueOnce(clienteReq as Cliente);
      const sendMagicLinkSpy = jest.spyOn(authService, 'sendMagicLink');

      await service.cadastrar(clienteReq);

      expect(sendMagicLinkSpy).toHaveBeenCalledWith(clienteReq.email);
    });
  });

  describe('requisitarAtualizacaoEmail()', () => {
    it('should throw an error if email is not available', async () => {
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValue(false);
      await expect(service.requisitarAtualizacaoEmail(1, 'test@test.com')).rejects.toThrow(BadRequestException);
    });

    it('should update the email and date if email is available', async () => {
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValue(true);
      const cliente = getClienteTeste();
      jest.spyOn(repo, 'findOne').mockResolvedValue(cliente);
      const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(null);

      await service.requisitarAtualizacaoEmail(1, 'emailnovo@test.com');

      expect(cliente.emailNovo).toBe('emailnovo@test.com');
      expect(cliente.dataRequisicaoEmailNovo).toBeDefined();
      expect(saveSpy).toHaveBeenCalledWith(cliente);
    });

    it('should send an email change confirmation link', async () => {
      jest.spyOn(service, 'isEmailDisponivel').mockResolvedValue(true);
      jest.spyOn(repo, 'findOne').mockResolvedValue(new Cliente());
      const sendEmailChangeConfirmationLinkSpy = jest.spyOn(authService, 'sendEmailChangeConfirmationLink');

      await service.requisitarAtualizacaoEmail(1, 'test@test.com');

      expect(sendEmailChangeConfirmationLinkSpy).toHaveBeenCalled();
    });
  });

  describe('efetivarAtualizacaoEmail()', () => {
    it('should throw an error if the client does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.efetivarAtualizacaoEmail('test@test.com', 'new@test.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update the email if the client exists', async () => {
      const cliente = new Cliente();
      jest.spyOn(repo, 'findOne').mockResolvedValue(cliente);
      const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(null);

      await service.efetivarAtualizacaoEmail('test@test.com', 'new@test.com');

      expect(cliente.email).toBe('new@test.com');
      expect(cliente.emailNovo).toBeNull();
      expect(cliente.dataRequisicaoEmailNovo).toBeNull();
      expect(saveSpy).toHaveBeenCalledWith(cliente);
    });

    it('should throw an error if the client does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.efetivarAtualizacaoEmail('test@test.com', 'new@test.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('requisitarExclusao()', () => {
    it('should throw an error if the client does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.requisitarExclusao(1)).rejects.toThrow();
    });

    it('should update the date of the exclusion request', async () => {
      const cliente = new Cliente();
      jest.spyOn(repo, 'findOne').mockResolvedValue(cliente);
      const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(null);

      await service.requisitarExclusao(1);

      expect(cliente.dataRequisicaoExclusao).toBeDefined();
      expect(saveSpy).toHaveBeenCalledWith(cliente);
    });

    it('should send an account deletion confirmation link', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(new Cliente());
      const sendAccountDeletionConfirmationLinkSpy = jest.spyOn(authService, 'sendAccountDeletionConfirmationLink');

      await service.requisitarExclusao(1);

      expect(sendAccountDeletionConfirmationLinkSpy).toHaveBeenCalled();
    });
  });

  describe('atualizarNome()', () => {
    it('should update the name of the client', async () => {
      const cliente = new Cliente();
      jest.spyOn(repo, 'findOne').mockResolvedValue(cliente);
      const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(null);

      await service.atualizarNome(1, 'Test');

      expect(cliente.nome).toBe('Test');
      expect(saveSpy).toHaveBeenCalledWith(cliente);
    });
  });
});
