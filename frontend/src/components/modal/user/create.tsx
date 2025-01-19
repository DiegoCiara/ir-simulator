import { Input } from '@/components/ui/input';
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
import React, { useState } from 'react';
import { User } from '@/types/User';
import { emailValidator } from '@/utils/emailValidator';
import { toast } from 'react-toastify';

interface CreateUserModalProps {
  open: boolean;
  getData: () => void;
  close: () => void;
}

export default function CreateUserModal({
  open,
  close,
  getData,
}: CreateUserModalProps) {
  const defaultData = {
    name: '',
    email: '',
    password: '',
  };
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<User>(defaultData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { createUser } = useUser();

  function setUser(column: string, value: string) {
    setData({ ...data, [column]: value });
  }

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!data.email.trim()) newErrors.email = 'O e-mail é obrigatório.';
    else if (!emailValidator(data.email))
      newErrors.email = 'Insira um e-mail válido.';
    if (!data.password!.trim()) newErrors.password = 'A senha é obrigatória.';
    else if (data.password!.length < 8)
      newErrors.password = 'A senha deve conter pelo menos 8 dígitos.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    await onLoading();
    try {
      const response = await createUser(data);
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 201) {
        toast.success('Usuário criado com sucesso!');
        await getData();
        await close();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response.data.message ||
          'Não foi possível buscar os usuários tente novamente.',
      );
    } finally {
      await offLoading();
    }
  };

  React.useEffect(() => {
    setData(defaultData);
    setErrors({});
  }, [open]);

  return (
    <ModalContainer open={open} close={close}>
      <form className="card-modal" onSubmit={handleSubmit}>
        <Card className="card-modal">
          <CardHeader>
            <CardTitle>Adicionar usuário</CardTitle>
            <CardDescription>
              Insira o e-mail do usuário que deseja adicionar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome do usuário"
                value={data.name}
                onChange={(e) => setUser('name', e.target.value)}
              />
              {errors.name && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                placeholder="email@example.com"
                value={data.email}
                onChange={(e) => setUser('email', e.target.value)}
              />
              {errors.email && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                id="password"
                placeholder="Senha de 8 dígitos"
                value={data.password!.trim()}
                onChange={(e) => setUser('password', e.target.value)}
              />
              {errors.password && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.password}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-10">
            <Button className="w-full" type="submit">
              Enviar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
