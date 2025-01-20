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
import { useDeclaration } from '@/context/declaration-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Declaration } from '@/types/Declaration';
import { toast } from 'react-toastify';
import { formatCurrency } from '@/utils/formats';
import UpdateDeclarationModal from './update';
import SubmitDeclarationModal from './submited';
import { useNavigate } from 'react-router-dom';

interface DetailDeclarationModalProps {
  id: string;
  open: boolean;
  close: () => void;
}

export default function DetailDeclarationModal({
  id,
  open,
  close,
}: DetailDeclarationModalProps) {
  const defaultData = {
    year: '',
    status: '',
    values: {
      rent: 0,
      deduction: 0,
    },
  };
  const navigate = useNavigate()
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Declaration>(defaultData);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const { getDeclaration } = useDeclaration();

  async function fetchDeclaration() {
    await onLoading();
    try {
      const { data } = await getDeclaration(id);
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
    fetchDeclaration();
  }, []);

  useEffect(() => {
    setData(defaultData);
  }, [open]);

  function controlUpdateModal() {
    setUpdateModal(!updateModal);
  }
  function controlSubmit() {
    setSubmitModal(!submitModal);
  }

  return (
    <ModalContainer open={open} close={close}>
      {id && updateModal && (
        <UpdateDeclarationModal
          id={id}
          open={updateModal}
          close={controlUpdateModal}
          getData={fetchDeclaration}
        />
      )}

      {id && submitModal && (
        <SubmitDeclarationModal
          id={id}
          open={submitModal}
          close={controlSubmit}
          getData={fetchDeclaration}
        />
      )}
      <Card className="card-modal">
        <CardHeader>
          <CardTitle>Detalhes do usuário</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta do usuário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Ano</Label>
            <br />
            <strong>{data.year}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Salário</Label>
            <br />
            <strong>{formatCurrency(data.values.rent.toString())}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Deduções</Label>
            <br />
            <strong>{formatCurrency(data.values.deduction.toString())}</strong>
          </div>
        </CardContent>
        <CardFooter className="gap-10">
          {data.status === 'UNSUBMITED' ? (
            <>
              <Button
                className="w-full"
                variant={'secondary'}
                type="submit"
                onClick={() => controlUpdateModal()}
              >
                Editar
              </Button>
              <Button
                className="w-full"
                variant={'secondary'}
                type="submit"
                onClick={() => controlSubmit()}
              >
                Submeter
              </Button>
            </>
          ) : (
            <Button className="w-full" variant={'secondary'} type="submit" onClick={() => navigate(`/declarations/retification/${id}`)}>
              Retificar
            </Button>
          )}
        </CardFooter>
      </Card>
    </ModalContainer>
  );
}
