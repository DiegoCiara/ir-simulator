import User from '@entities/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const mocks = async (): Promise<void> => {
  try {

    const [hasUsers] = await Promise.all([
      User.count(), // Conta quantos registros existem
    ]);

    if (hasUsers > 0 ) {
      console.log('Mocks ok');
      return;
    }

    const user = {
      name: 'Diego Ciara',
      email: 'diegociara.dev@gmail.com',
      role: 'FREE',
      password: 'die140401',
    };

    const pass = await bcrypt.hash(user.password, 10);

    const newUser = await User.create({ ...user, passwordHash: pass }).save();

    console.log(`Usuário ${newUser.name} criado`);

  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;

