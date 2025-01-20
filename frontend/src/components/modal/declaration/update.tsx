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
import { SelectInput } from '@/components/select-input/select-input';
import { Input } from '@/components/ui/input';
import { yearsDeclaration } from '@/utils/mock';
import { AxiosError } from 'axios';

interface UpdateDeclarationModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdateDeclarationModal({
  id,
  open,
  close,
  getData,
}: UpdateDeclarationModalProps) {
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (fieldName: string, value: string | number) => {
    let errorMessage = '';

    if (fieldName === 'year' &&  typeof value === 'string' && !value.trim()) {
      errorMessage = 'O ano de declaração é obrigatório.';
    }

    if (fieldName === 'rent' && (typeof value === 'number' && value <= 0)) {
      errorMessage = 'O valor do salário deve ser maior que 0.';
    }

    if (fieldName === 'deduction' && (typeof value === 'number' && value < 0)) {
      errorMessage = 'As deduções não podem ser negativas.';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.year.trim())
      newErrors.year = 'O ano de declaração é obrigatório.';
    if (!data.values.rent || data.values.rent <= 0) {
      newErrors.rent = 'O valor do salário deve ser maior que 0.';
    }
    if (data.values.deduction < 0) {
      newErrors.deduction = 'As deduções não podem ser negativas.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    await onLoading();
    try {
      const response = await updateDeclaration(id, data);
      if (response.status === 204) {
        toast.success('Declaração atualizada com sucesso');
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

  const handleChangeObject = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: keyof Declaration,
    subitem: string,
    type: string,
  ) => {
    const currentItem = data[item];

    if (typeof currentItem === 'object' && currentItem !== null) {
      if (type === 'currency') {
        const value = event.target.value.replace(/[^0-9]/g, '');
        setData({
          ...data,
          [item]: {
            ...currentItem,
            [subitem]: value ? parseFloat(value) / 100 : 0,
          },
        });
      } else {
        const value = event.target.value;
        setData({
          ...data,
          [item]: {
            ...currentItem,
            [subitem]: value,
          },
        });
      }
    }
  };

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

  return (
    <ModalContainer open={open} close={close}>
      <form
        onSubmit={handleSubmit}
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Atualizar declaração</CardTitle>
            <CardDescription>
              Atualize os dados da sua declaração abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Ano da declaração</Label>
              <SelectInput
                options={yearsDeclaration}
                value={data.year}
                onBlur={() => validateField('year', data.year)}
                placeholder="Selecione um ano de declaração"
                onChange={(e) => setData({ ...data, year: e })}
              />
              {errors.year && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.year}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="rent">Salário</Label>
              <Input
                type="text"
                id="rent"
                maxLength={25}
                onBlur={() => validateField('rent', data.values.rent)}
                value={formatCurrency(data.values.rent.toString())}
                onChange={(e) =>
                  handleChangeObject(e, 'values', 'rent', 'currency')
                }
              />
              {errors.rent && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.rent}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="deduction">Deduções</Label>
              <Input
                type="text"
                id="deduction"
                maxLength={25}
                onBlur={() => validateField('deduction', data.values.deduction)}
                value={formatCurrency(data.values.deduction.toString())}
                onChange={(e) =>
                  handleChangeObject(e, 'values', 'deduction', 'currency')
                }
              />
              {errors.deduction && (
                <span className="text-[12px] font-semibold text-red-600">
                  {errors.deduction}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
