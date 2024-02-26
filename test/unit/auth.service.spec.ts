import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtExpiration } from '../../src/modules/auth/enum/jwtExpiration.enum';
import { UserService } from '../../src/modules/user/user.service';
import { MailService } from '../../src/modules/mailer/mail.service';
import { getUserTeste } from '../utils/getUserTeste';

describe('AuthService', () => {
  let authService: AuthService;
  let mailService: MailService;
  let userService: UserService;

  const OLD_ENV = process.env;
  const magicLinkSecret = 'magicLinkSecret';

  beforeEach(async () => {
    jest.resetModules();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
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
        UserService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    userService = module.get<UserService>(UserService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('authenticate()', () => {
    it('should call sendMagicLink() if cliente exists', async () => {
      const user = getUserTeste();
      jest.spyOn(userService, 'consultarPorEmail').mockResolvedValueOnce(user as User);
      jest.spyOn(authService, 'sendMagicLink').mockResolvedValueOnce();

      await authService.authenticate(user.email);

      expect(authService.sendMagicLink).toHaveBeenCalledWith(user.email);
    });

    it('should not call sendMagicLink() if cliente does not exist', async () => {
      jest.spyOn(userService, 'consultarPorEmail').mockResolvedValueOnce(null);
      jest.spyOn(authService, 'sendMagicLink').mockResolvedValueOnce();

      await authService.authenticate('notexists@email.com');

      expect(authService.sendMagicLink).not.toHaveBeenCalled();
    });
  });

  describe('validateLoginToken()', () => {
    it('should return a session token if token is valid', async () => {
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      const cliente = getUserTeste();
      const validToken = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);

      const sessionToken = 'sessiontoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(sessionToken);
      jest.spyOn(userService, 'consultarPorEmail').mockResolvedValueOnce(cliente as User);

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
      const cliente = getUserTeste();
      const validToken = authService.generateToken({ email: cliente.email }, magicLinkSecret, JwtExpiration.ONE_DAY);
      jest.spyOn(userService, 'consultarPorEmail').mockResolvedValueOnce(null);

      const exec = authService.validateLoginToken(validToken);

      await expect(exec).rejects.toThrow();
    });

    it('should throw an error if token is expired', async () => {
      process.env.MAGIC_LINK_SECRET = magicLinkSecret;
      const cliente = getUserTeste();
      const expiredToken = authService.generateToken(
        { email: cliente.email },
        magicLinkSecret,
        JwtExpiration._ONE_SECOND,
      );

      await new Promise((resolve) => setTimeout(resolve, 1001)); // waits 1.001 seconds
      jest.spyOn(userService, 'consultarPorEmail').mockResolvedValueOnce(cliente as User);
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('sessiontoken');

      const exec = authService.validateLoginToken(expiredToken);

      await expect(exec).rejects.toThrow();
    });
  });

  describe('sendMagicLink()', () => {
    it('should send an email with a magic link', async () => {
      const cliente = getUserTeste();
      const token = 'magiclinktoken';
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(token);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail');

      await authService.sendMagicLink(cliente.email);

      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: cliente.email, text: expect.stringContaining(token) }),
      );
    });

    it('should not throw an error if mail service fails', async () => {
      const cliente = getUserTeste();
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce('magiclinktoken');
      jest.spyOn(mailService, 'sendMail').mockRejectedValueOnce('error');

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).resolves.not.toThrow();
    });

    it('should throw an error if token generation fails', async () => {
      const cliente = getUserTeste();
      jest.spyOn(authService, 'generateToken').mockImplementationOnce(() => {
        throw new Error();
      });

      const exec = authService.sendMagicLink(cliente.email);

      await expect(exec).rejects.toThrow();
    });
  });
});
