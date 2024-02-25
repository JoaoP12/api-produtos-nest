import { Cliente } from '../../src/entities/cliente.entity';

export function getClienteTeste(): Cliente {
  return { email: 'test@test.com', cpf: '12345678901', nome: 'Test' };
}
