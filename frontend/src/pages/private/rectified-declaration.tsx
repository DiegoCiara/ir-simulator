import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useDeclaration } from '@/context/declaration-context';
import React, { useEffect, useState } from 'react';
import { Declaration } from '@/types/Declaration';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectInput } from '@/components/select-input/select-input';
import { formatCurrency } from '@/utils/formats';
import { CardContent } from '@mui/material';
import { yearsDeclaration } from '@/utils/mock';
import { AxiosError } from 'axios';

const defaultData = {
  year: '',
  values: {
    rent: 0,
    deduction: 0,
  },
};
export default function RectifiedDeclaration() {
  const { onLoading, offLoading } = useLoading();
  const [original, setOriginal] = useState<Declaration>(defaultData);
  const [data, setData] = useState<Declaration>(defaultData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { id } = useParams();
  const { rectifiedDeclaration, getDeclaration } = useDeclaration();
  const navigate = useNavigate();

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

    return errorMessage.length === 0
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
      const response = await rectifiedDeclaration(id!, data);
      if (response.status === 201) {
        toast.success('Declaração retificada com sucesso');
        navigate('/declarations');
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
      const { data } = await getDeclaration(id!);
      setOriginal(data);
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

  return (
    <main>
      <section className="flex flex-col gap-5 h-[100vh] items-center justify-start sm:justify-center">
        <CardHeader className="px-0 pb-0 sm:pb-5">
          <CardTitle>Retificar Declaração</CardTitle>
          <CardDescription>
            Informe os dados da retificação abaixo.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={handleSubmit}
          className="w-[85vw] max-w-[400px] sm:min-w-[60vw] sm:w-full sm:flex justify-center items-start"
        >
          <Card className="border-none shadow-none ">
            <CardHeader className="pb-0">
              <CardTitle className="text-[18px]">Dados Originais</CardTitle>
              <CardDescription>
                Abaixo estão os dados da retificação original
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Ano da declaração</Label>
                <SelectInput
                  options={yearsDeclaration}
                  value={original.year}
                  placeholder="Selecione um ano de declaração"
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rent">Salário</Label>
                <Input
                  type="text"
                  id="rent"
                  value={formatCurrency(original.values.rent.toString())}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="deduction">Deduções</Label>
                <Input
                  type="text"
                  id="deduction"
                  value={formatCurrency(original.values.deduction.toString())}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none ">
            <CardHeader className="pb-0">
              <CardTitle className="text-[18px]">Dados Retificados</CardTitle>
              <CardDescription>
                Insira os dados retificados da nova declaração.
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
                  onBlur={() =>
                    validateField('deduction', data.values.deduction)
                  }
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
      </section>
    </main>
  );
}
