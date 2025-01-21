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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function QrCode2Fa() {
  const { onLoading, offLoading } = useLoading();
  const { verifySecret, get2FaQrCode, signIn } = useAuth();
  const { email } = useParams();
  const [secret, setSecret] = useState<string>('');
  const [code, setCode] = useState<string>('');
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

  async function fetchQrCode() {
    await onLoading();
    try {
      const { data } = await get2FaQrCode(email!);
      setCode(data);
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
  }

  useEffect(() => {
    fetchQrCode();
  }, []);

  return (
    <section className="flex flex-col gap-5 items-center h-[100vh] justify-center">
      <h1 className="font-medium text-[2.2rem]">IR Simulator</h1>
      <form onSubmit={handleSubmit}>
        <Card className="border-none">
          <CardHeader className="">
            <CardTitle>Autenticação 2 fatores</CardTitle>
            <CardDescription>
              Siga os passos abaixo para habilitar a autenticação em 2 fatores.
            </CardDescription>
          </CardHeader>
          <div className="w-full flex flex-col items-center pb-5">
            <CardDescription>
              1. Instale o aplicativo Google Authenticator ou similar;
            </CardDescription>
            <CardDescription>
              2. No aplicativo, escaneie o QR Code abaixo;
            </CardDescription>
          </div>
          <CardContent className="space-y-2 flex flex-col items-center">
            <img className="w-[200px] h-[200px] rounded-lg" src={code} />
            <CardDescription>
              3. Cole abaixo o token gerado no aplicativo;
            </CardDescription>
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
        </Card>
      </form>
      <ModeToggle />
    </section>
  );
}
