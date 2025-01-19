import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useUser } from '@/context/user-context';
import { useLoading } from '@/context/loading-context';
import ModalContainer from '..';
import { User } from '@/types/User';
import { useEffect, useState } from 'react';

interface DeleteUserModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DeleteUserModal({
  open,
  close,
  id,
  getData,
}: DeleteUserModalProps) {
  const defaultData = {
    name: '',
    email: '',
  };
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<User>(defaultData);

  const { getUser, deleteUser } = useUser();

  async function fetchUsers() {
    await onLoading();
    try {
      const { data } = await getUser(id);
      setData(data);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response.data.message ||
          'Não foi possível buscar os usuários tente novamente.',
      );
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setData(defaultData);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await deleteUser(id);
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Usuário deletado com sucesso.');
        await getData()
        await close();
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || 'Algo deu errado, tente novamente.',
      );
      console.log(error);
    } finally {
      await offLoading();
    }
  };

  return (
    <div>
      <ModalContainer open={open} close={close}>
        <form className="w-[400px]" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-red-600">Atenção</CardTitle>
              <CardDescription>
                Você está deletando o usuário {data.name}, ao confirmar, este
                usuário não terá mais acesso a plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <strong>Deseja prosseguir?</strong>
            </CardContent>
            <CardFooter className="gap-10">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => close()}
              >
                Cancelar
              </Button>
              <Button className="w-full" variant="destructive" type="submit">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </ModalContainer>
    </div>
  );
}
