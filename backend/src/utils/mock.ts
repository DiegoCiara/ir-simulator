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
     


  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;

