import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/loading-context';
import { useUser } from '@/context/user-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
  const { onLoading, offLoading } = useLoading();
  const { createUser } = useUser();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  function setUser(column: string, value: string) {
    setData({ ...data, [column]: value });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();
    try {
      e.preventDefault();
      if (data.name === '' || data.email === '') {
        toast.warn('Preencha as credenciais corretamnete');
      } else {
        const response = await createUser(data);
        console.log(response);
        if (response.status === 201) {
          await navigate(`/auth-2fa/${data.email}`);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  };

  const disabled = data.name === '' || data.email === '';

  return (
    <section className="flex flex-col gap-5 items-center h-[100vh] justify-center">
      <h1 className="font-medium text-[2.2rem]">IR Simulator</h1>
      <form onSubmit={handleSubmit}>
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Crie sua conta</CardTitle>
            <CardDescription>
              Crie sua conta preenchendo os dados abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="name"
                placeholder="Seu nome"
                value={data.name}
                onChange={(e) => setUser('name', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="">
                E-mail
              </Label>
              <Input
                id="email"
                placeholder="seuemail@domínio.com.br"
                autoFocus
                value={data.email}
                onChange={(e) => setUser('email', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="">
                Senha
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                autoFocus
                value={data.password}
                onChange={(e) => setUser('password', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={disabled}>
              Entrar
            </Button>
          </CardFooter>
          <CardFooter>
            <Button
              className="w-full"
              variant="link"
              onClick={() => navigate('/login')}
              type="button"
            >
              Já tem uma conta? Faça o login
            </Button>
          </CardFooter>
        </Card>
      </form>
      <ModeToggle />
    </section>
  );
}
