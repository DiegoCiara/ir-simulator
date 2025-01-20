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
import { useDeclaration } from '@/context/declaration-context';
import { useLoading } from '@/context/loading-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Declaration } from '@/types/Declaration';
import { AxiosError } from 'axios';

interface DeleteDeclarationModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function SubmitDeclarationModal({
  open,
  close,
  id,
  getData,
}: DeleteDeclarationModalProps) {
  const defaultData = {
    year: '',
    status: '',
    values: {
      rent: 0,
      deduction: 0,
    },
  };
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Declaration>(defaultData);

  const { getDeclaration, updateDeclaration } = useDeclaration();

  async function fetchDeclarations() {
    await onLoading();
    try {
      const { data } = await getDeclaration(id);
      setData(data);
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
    fetchDeclarations();
  }, []);

  useEffect(() => {
    setData(defaultData);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await updateDeclaration(id, {
        ...data,
        status: 'SUBMITED',
      });
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 204) {
        toast.success('Declaração submetida com sucesso.');
        await getData();
        await close();
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

  return (
    <div>
      <ModalContainer open={open} close={close}>
        <form className="w-[400px]" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">Atenção</CardTitle>
              <CardDescription>
                Você está submetendo uma declaração do ano de {data.year}, ao
                confirmar, esta ação não poderá ser revertida.
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
              <Button
                className="w-full bg-green-700 hover:bg-green-900 text-white"
                type="submit"
              >
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </ModalContainer>
    </div>
  );
}
