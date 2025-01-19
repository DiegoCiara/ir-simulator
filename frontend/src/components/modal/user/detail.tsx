import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useUser } from '@/context/user-context';
import ModalContainer from '..';
import { useEffect, useState, } from 'react';
import { User } from '@/types/User';
import { toast } from 'react-toastify';

interface DetailUserModalProps {
  id: string;
  open: boolean;
  close: () => void;
}

export default function DetailUserModal({
  id,
  open,
  close,
}: DetailUserModalProps) {
  const defaultData = {
    name: '',
    email: '',
  };
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<User>(defaultData);

  const { getUser } = useUser();

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

  return (
    <ModalContainer open={open} close={close}>
      <Card className="card-modal">
        <CardHeader>
          <CardTitle>Detalhes do usuário</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta do usuário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label><br/>
            <strong>{data.name}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label><br/>
            <strong>{data.email}</strong>
          </div>
        </CardContent>
        <CardFooter className="gap-10">
          <Button className="w-full" type="submit">
            Enviar
          </Button>
        </CardFooter>
      </Card>
    </ModalContainer>
  );
}
