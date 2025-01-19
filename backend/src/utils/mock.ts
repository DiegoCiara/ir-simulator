import User from '@entities/User';
import bcrypt from 'bcryptjs';
import { users } from './dataMock';

const mocks = async (): Promise<void> => {
  try {

    const [hasUsers] = await Promise.all([
      User.count(),
    ]);

    if (hasUsers > 0 ) {
      console.log('Mocks ok');
      return;
    }

    for (const user of users) {
      const pass = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({ ...user, passwordHash: pass }).save();
      console.log(`Usuário ${newUser.name} criado`);
    }


  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;

