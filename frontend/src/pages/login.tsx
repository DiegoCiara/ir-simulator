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
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { onLoading, offLoading } = useLoading();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
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
      if (data.email === '' || data.password === '') {
        toast.warn('Preencha as credenciais corretamnete')
      } else {
        const { email, password } = data;
        const response = await login(email, password);
        console.log(response)
        if (response.status === 200) {
          await navigate('/home');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await offLoading();
    }
    // setLoading(false)
  };

  const disabled = data.email === '' || data.password === ''

  return (
      <section className="flex flex-col gap-5 items-center h-[100vh] justify-center">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Faça o login com as credenciais da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setUser('password', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={disabled}>Entrar</Button>
            </CardFooter>
          </Card>
        </form>
        <ModeToggle />
      </section>
  );
}
