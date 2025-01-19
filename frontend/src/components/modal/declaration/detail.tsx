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
import { useEffect, useState, } from 'react';
import { Declaration } from '@/types/Declaration';
import { toast } from 'react-toastify';

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
    income: {
      wage: 0,
      rent: 0,
      investments: 0,
      others: 0,
    },
    deductions: {
      education: 0,
      health: 0,
      private_pension: 0,
      others: 0,
    },
    dependents: [],
    direct_goods: [],
    debts_liabilities: [],
    payments_donations: [],
    summary: {
      total_income: 0,
      total_deductions: 0,
      tax_due: 0,
      tax_paid: 0,
      balance: 0,
    },
  };
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Declaration>(defaultData);

  const { getDeclaration } = useDeclaration();

  async function fetchDeclarations() {
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
    fetchDeclarations();
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
            <Label htmlFor="name">Ano</Label><br/>
            <strong>{data.year}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Aluguéis</Label><br/>
            <strong>{data.income.rent}</strong>
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
