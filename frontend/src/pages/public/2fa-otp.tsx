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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Otp() {
  const { onLoading, offLoading } = useLoading();
  const { verifySecret, signIn } = useAuth();
  const { email } = useParams();
  const [secret, setSecret] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();

    try {
      e.preventDefault();
      const response = await verifySecret({ email: email!, secret });
      console.log(response);
      if (response.status === 200) {
        await signIn(response.data.token, response.data.user);
        await navigate('/declarations');
      }
    } catch (error) {
      console.error(error);
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

  return (
    <section className="flex flex-col gap-5 items-center h-[100vh] justify-center">
      <h1 className="font-medium text-[2.2rem]">IR Simulator</h1>
      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Autenticação 2 fatores</CardTitle>
            <CardDescription>
              Insira o código presente no Google Authenticator (ou similar)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 flex flex-col items-center">
            <div className="space-y-1">
              <InputOTP
                maxLength={6}
                value={secret}
                onChange={(e) => setSecret(e)}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={false}>
              Enviar
            </Button>
          </CardFooter>
          <CardFooter>
            <Button
              className="w-full"
              variant="link"
              onClick={() => navigate(`/auth-2fa/${email}`)}
              type="button"
            >
              Não escaneou o QR Code? Obtenha-o aqui
            </Button>
          </CardFooter>
        </Card>
      </form>
      <ModeToggle />
    </section>
  );
}
