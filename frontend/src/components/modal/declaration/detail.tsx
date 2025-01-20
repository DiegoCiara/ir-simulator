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
import DeleteDeclarationModal from './delete';
import { AxiosError } from 'axios';

interface DetailDeclarationModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailDeclarationModal({
  id,
  open,
  close,
  getData,
}: DetailDeclarationModalProps) {
  const defaultData = {
    year: '',
    status: '',
    values: {
      rent: 0,
      deduction: 0,
    },
  };
  const navigate = useNavigate();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Declaration>(defaultData);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const { getDeclaration } = useDeclaration();

  async function fetchDeclaration() {
    await onLoading();
    try {
      const { data } = await getDeclaration(id);
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
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

  function controlDelete() {
    setDeleteModal(!deleteModal);
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

      {id && deleteModal && (
        <DeleteDeclarationModal
          id={id}
          open={deleteModal}
          close={controlDelete}
          getData={async () => {
            await getData();
            await close();
          }}
        />
      )}
      <Card className="card-modal">
        <CardHeader>
          <CardTitle>Detalhes da declaração</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta da declaração.
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
        <CardFooter className="gap-2 flex flex-col">
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
              <Button
                className="w-full"
                variant={'destructive'}
                type="submit"
                onClick={() => controlDelete()}
              >
                Remover
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              variant={'secondary'}
              type="submit"
              onClick={() => navigate(`/declarations/retification/${id}`)}
            >
              Retificar
            </Button>
          )}
        </CardFooter>
      </Card>
    </ModalContainer>
  );
}
