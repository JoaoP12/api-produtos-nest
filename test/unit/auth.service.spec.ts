import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cliente } from '../../src/entities/cliente.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtExpiration } from '../../src/modules/auth/enum/jwtExpiration.enum';
import { ClienteService } from '../../src/modules/cliente/cliente.service';
import { MailService } from '../../src/modules/mailer/mail.service';
import { getClienteTeste } from '../utils/getClienteTeste';

describe('AuthService', () => {
  let authService: AuthService;
  let mailService: MailService;
  let clienteService: ClienteService;

  const OLD_ENV = process.env;
  const magicLinkSecret = 'magicLinkSecret';

  beforeEach(async () => {
    jest.resetModules();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: { sendMail: jest.fn().mockResolvedValue('email enviado') },
        },
        JwtService,
        ClienteService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    clienteService = module.get<ClienteService>(ClienteService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('authenticate()', () => {
    it('should call sendMagicLink() if cliente exists', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(clienteService, 'consultarPorEmailCpf').mockResolvedValueOnce(cliente as Cliente);
      jest.spyOn(authService, 'sendMagicLink').mockResolvedValueOnce();

      await authService.authenticate(cliente.email, cliente.cpf);

      expect(authService.sendMagicLink).toHaveBeenCalledWith(cliente.email);
    });

    it('should not call sendMagicLink() if cliente does not exist', async () => {
      jest.spyOn(clienteService, 'consultarPorEmailCpf').mockResolvedValueOnce(null);
      jest.spyOn(authService, 'sendMagicLink').mockResolvedValueOnce();

      await authService.authenticate('notexists@email.com', '12345678901');

      expect(authService.sendMagicLink).not.toHaveBeenCalled();
    });
  });

  describe('validateLoginToken()', () => {
    it('should return a session token if token is valid', async () => {
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      const cliente = getClienteTeste();
      const validToken = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);

      const sessionToken = 'sessiontoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(sessionToken);
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);

      const result = await authService.validateLoginToken(validToken);

      expect(result).toEqual(sessionToken);
    });

    it('should throw an error if token is invalid', async () => {
      const token = 'invalidtoken';

      const exec = authService.validateLoginToken(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if cliente does not exist', async () => {
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      const cliente = getClienteTeste();
      const validToken = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(null);

      const exec = authService.validateLoginToken(validToken);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if token is expired', async () => {
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      const cliente = getClienteTeste();
      const expiredToken = authService.generateToken(
        { email: cliente.email },
        magicLinkSecret,
        JwtExpiration._ONE_SECOND,
      );

      await new Promise((resolve) => setTimeout(resolve, 1001)); // waits 1.001 seconds
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('sessiontoken');

      const exec = authService.validateLoginToken(expiredToken);

      await expect(exec).rejects.toThrow();
    });
  });

  describe('sendMagicLink()', () => {
    it('should send an email with a magic link', async () => {
      const cliente = getClienteTeste();
      const token = 'magiclinktoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(token);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail');

      await authService.sendMagicLink(cliente.email);

      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: cliente.email, text: expect.stringContaining(token) }),
      );
    });

    it('should not throw an error if mail service fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('magiclinktoken');
      jest.spyOn(mailService, 'sendMail').mockRejectedValueOnce('error');

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).resolves.not.toThrow();
    });

    it('should throw an error if token generation fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockImplementationOnce(() => {
        throw new Error();
      });

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).rejects.toThrow();
    });
  });

  describe('sendEmailChangeConfirmationLink()', () => {
    it('should send an email with a magic link', async () => {
      const cliente = getClienteTeste();
      const token = 'magiclinktoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(token);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail');

      await authService.sendMagicLink(cliente.email);

      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: cliente.email, text: expect.stringContaining(token) }),
      );
    });

    it('should not throw an error if mail service fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('magiclinktoken');
      jest.spyOn(mailService, 'sendMail').mockRejectedValueOnce('error');

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).resolves.not.toThrow();
    });

    it('should throw an error if token generation fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockImplementationOnce(() => {
        throw new Error();
      });

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).rejects.toThrow();
    });
  });

  describe('sendAccountDeletionConfirmationLink()', () => {
    it('should send an email with a magic link', async () => {
      const cliente = getClienteTeste();
      const token = 'magiclinktoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(token);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail');

      await authService.sendMagicLink(cliente.email);

      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: cliente.email, text: expect.stringContaining(token) }),
      );
    });

    it('should not throw an error if mail service fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('magiclinktoken');
      jest.spyOn(mailService, 'sendMail').mockRejectedValueOnce('error');

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).resolves.not.toThrow();
    });

    it('should throw an error if token generation fails', async () => {
      const cliente = getClienteTeste();
      jest.spyOn(authService, 'generateToken').mockImplementationOnce(() => {
        throw new Error();
      });

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).rejects.toThrow();
    });
  });

  describe('confirmEmailChange()', () => {
    it('should throw an error if token is invalid', async () => {
      const token = 'invalid';

      const exec = authService.confirmEmailChange(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if token is expired', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration._ONE_SECOND);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      await new Promise((resolve) => setTimeout(resolve, 1001)); // waits 1.001 seconds

      const exec = authService.confirmEmailChange(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if cliente does not exist', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(null);

      const exec = authService.confirmEmailChange(token);

      await expect(exec).rejects.toThrow();
    });

    it('should call efetivarAtualizacaoEmail() if token is valid', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken(
        { email: cliente.email, emailNovo: 'novo@email.com' },
        magicLinkSecret,
        JwtExpiration.ONE_DAY,
      );
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);
      const efetivarAtualizacaoEmailSpy = jest
        .spyOn(clienteService, 'efetivarAtualizacaoEmail')
        .mockResolvedValueOnce(null);

      const exec = authService.confirmEmailChange(token);

      await expect(exec).resolves.not.toThrow();
      expect(efetivarAtualizacaoEmailSpy).toHaveBeenCalledWith(cliente.email, 'novo@email.com');
    });
  });

  describe('confirmAccountDeletion()', () => {
    it('should throw an error if token is invalid', async () => {
      const token = 'invalid';

      const exec = authService.confirmEmailChange(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if token is expired', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration._ONE_SECOND);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      await new Promise((resolve) => setTimeout(resolve, 1001)); // waits 1.001 seconds

      const exec = authService.confirmAccountDeletion(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if cliente does not exist', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(null);

      const exec = authService.confirmAccountDeletion(token);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if cliente has not requested deletion', async () => {
      const cliente = getClienteTeste();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);

      const exec = authService.confirmAccountDeletion(token);

      await expect(exec).rejects.toThrow();
    });

    it('should call efetivarExclusao() if token is valid', async () => {
      const cliente = getClienteTeste();
      cliente.dataRequisicaoExclusao = new Date();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);
      const efetivarExclusaoSpy = jest.spyOn(clienteService, 'efetivarExclusao').mockResolvedValueOnce(null);

      const exec = authService.confirmAccountDeletion(token);

      await expect(exec).resolves.not.toThrow();
      expect(efetivarExclusaoSpy).toHaveBeenCalledWith(cliente.idCliente);
    });

    it('should send an email with a confirmation message', async () => {
      const cliente = getClienteTeste();
      cliente.dataRequisicaoExclusao = new Date();
      const token = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      jest.spyOn(clienteService, 'consultarPorEmail').mockResolvedValueOnce(cliente as Cliente);
      jest.spyOn(clienteService, 'efetivarExclusao').mockResolvedValueOnce(null);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail');

      const exec = authService.confirmAccountDeletion(token);

      await expect(exec).resolves.not.toThrow();
      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: cliente.email,
          text: expect.stringMatching(/(?=.*\bconta\b)(?=.*\bexcluída\b).*/i),
        }),
      );
    });
  });
});
