import { User } from '../../src/entities/user.entity';

export function getUserTeste(): User {
  return { email: 'test@test.com', nome: 'Test' };
}
