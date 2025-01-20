import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useDeclaration } from '@/context/declaration-context';
import React, { useState } from 'react';
import { Declaration } from '@/types/Declaration';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SelectInput } from '@/components/select-input/select-input';
import { formatCurrency } from '@/utils/formatCurrency';
import { Trash2 } from 'lucide-react';

const defaultData = {
  year: '',
  income: {
    wage: 0,
    rent: 0,
    investments: 0,
    others: 0,
  },
  dependents: [],
  direct_goods: [],
};

export default function CreateDeclaration() {
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Declaration>(defaultData);
  const [step, setStep] = React.useState(0);

  const { createDeclaration } = useDeclaration();

  const navigate = useNavigate();

  function nextStep() {
    if (step < 4) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
    } else {
      await onLoading();
      try {
        const response = await createDeclaration(data);
        console.log(response?.status, 'status');
        console.log(response.data);
        if (response.status === 201) {
          toast.success('Declaração criada com sucesso');
          navigate('/declarations');
        }
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            'Não foi possível buscar os usuários tente novamente.',
        );
      } finally {
        await offLoading();
      }
    }
  };

  const options = [
    {
      title: 'Selecione um ano',
      items: [
        {
          value: '2024',
          label: '2024',
        },
        {
          value: '2023',
          label: '2023',
        },
        {
          value: '2022',
          label: '2022',
        },
        {
          value: '2020',
          label: '2020',
        },
      ],
    },
  ];
  const relationships = [
    {
      title: 'Selecione a relação',
      items: [
        {
          value: 'child',
          label: 'Filho(a)',
        },
        {
          value: 'spouse',
          label: 'Cônjuge',
        },
        {
          value: 'father',
          label: 'Pai',
        },
        {
          value: 'mother',
          label: 'Mãe',
        },
        {
          value: 'other',
          label: 'Outro',
        },
      ],
    },
  ];

  const handleChangeObject = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: keyof Declaration,
    subitem: string,
    type: string,
  ) => {
    const currentItem = data[item];

    if (typeof currentItem === 'object' && currentItem !== null) {
      if (type === 'currency') {
        const valueNumeric = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        setData({
          ...data,
          [item]: {
            ...currentItem,
            [subitem]: valueNumeric ? parseFloat(valueNumeric) / 100 : 0,
          },
        });
      } else {
        if (type === 'currency') {
          const value = event.target.value; // Remove todos os caracteres não numéricos

          setData({
            ...data,
            [item]: {
              ...currentItem,
              [subitem]: value,
            },
          });
        }
      }
    } else {
      console.error(`Invalid item or subitem: ${item}, ${subitem}`);
    }
  };

  const addItem = (column: keyof Declaration, type: string) => {
    const columnKey = Array.isArray(data[column]) ? data[column] : [];
    const newItem =
      type === 'dependents'
        ? { name: '', relationship: '' }
        : { type: '', value: 0 };
    setData({
      ...data,
      [column]: [...columnKey, newItem], // Add the new dependent
    });
  };

  const removeItem = (index: number, column: keyof Declaration) => {
    const columnKey = Array.isArray(data[column]) ? data[column] : [];
    setData({
      ...data,
      [column]: columnKey.filter((_, i) => i !== index),
    });
  };

  function stepReturn() {
    switch (step) {
      case 0:
        return {
          title: (
            <>
              <span className="text-muted-foreground">Passo 1</span>
              <CardTitle className="mt-0">Ano da Declaração</CardTitle>
              <CardDescription>
                Selecione o ano qual deseja declarar
              </CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-1">
                <Label htmlFor="name">Ano da declaração</Label>
                <SelectInput
                  options={options}
                  value={data.year}
                  placeholder="Selecione um ano de declaração"
                  onChange={(e) => setData({ ...data, year: e })}
                />
              </div>
            </>
          ),
          disabled: data.year === '',
        };
        break;
      case 1:
        return {
          title: (
            <>
              <span className="text-muted-foreground">Passo 2</span>
              <CardTitle>Renda</CardTitle>
              <CardDescription>Informe os dados da sua renda</CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-1">
                <Label htmlFor="name">Salário</Label>
                <Input
                  type="text"
                  id="Salario"
                  maxLength={25}
                  value={formatCurrency(data.income.wage.toString())}
                  onChange={(e) =>
                    handleChangeObject(e, 'income', 'wage', 'currency')
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Alugueis</Label>

                <Input
                  type="text"
                  id="rent"
                  maxLength={25}
                  value={formatCurrency(data.income.rent.toString())}
                  onChange={(e) =>
                    handleChangeObject(e, 'income', 'rent', 'currency')
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Investimentos</Label>

                <Input
                  type="text"
                  id="investments"
                  maxLength={25}
                  value={formatCurrency(data.income.investments.toString())}
                  onChange={(e) =>
                    handleChangeObject(e, 'income', 'investments', 'currency')
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Outros</Label>

                <Input
                  type="text"
                  id="investments"
                  maxLength={25}
                  value={formatCurrency(data.income.others.toString())}
                  onChange={(e) =>
                    handleChangeObject(e, 'income', 'others', 'currency')
                  }
                />
              </div>
            </>
          ),
          disabled: false,
        };
        break;
      case 2:
        return {
          title: (
            <>
              <CardTitle>Dependentes</CardTitle>
              <CardDescription>Insira os dependentes</CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-2">
                {data.dependents.map((dependent, index) => (
                  <div
                    key={index}
                    className="flex gap-5 justify-between items-center"
                  >
                    <div className="w-full">
                      <Label htmlFor={`dependent-${index}`}>Nome</Label>
                      <Input
                        type="text"
                        id={`dependent-${index}`}
                        value={dependent.name}
                        placeholder="Nome do dependente"
                        onChange={(e) => {
                          const updatedDependents = [...data.dependents];
                          updatedDependents[index].name = e.target.value;
                          setData({
                            ...data,
                            dependents: updatedDependents,
                          });
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor={`dependent-${index}`}>Relação</Label>
                      <SelectInput
                        options={relationships}
                        value={dependent.relationship}
                        placeholder="Selecione"
                        onChange={(e) => {
                          const updatedDependents = [...data.dependents];
                          updatedDependents[index].relationship = e;
                          setData({
                            ...data,
                            dependents: updatedDependents,
                          });
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-700 mt-5"
                      size="icon"
                      onClick={() => removeItem(index, 'dependents')}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => addItem('dependents', 'dependents')}
              >
                Adicionar Dependente
              </Button>
            </>
          ),
          disabled: false,
        };
        break;
      case 3:
        return {
          title: (
            <>
              <CardTitle>Bens diretos</CardTitle>
              <CardDescription>Informe seus bens</CardDescription>
            </>
          ),

          component: (
            <>
              <div className="space-y-2">
                {data.direct_goods.map((dependent, index) => (
                  <div
                    key={index}
                    className="flex gap-5 justify-between items-center"
                  >
                    <div className="w-full">
                      <Label htmlFor={`dependent-${index}`}>Relação</Label>
                      <SelectInput
                        options={relationships}
                        value={dependent.type}
                        placeholder="Selecione"
                        onChange={(e) => {
                          const updatedDependents = [...data.direct_goods];
                          updatedDependents[index].type = e;
                          setData({
                            ...data,
                            direct_goods: updatedDependents,
                          });
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor={`dependent-${index}`}>Valor</Label>
                      <Input
                        type="text"
                        id={`dependent-${index}`}
                        value={formatCurrency(dependent.value.toString())}
                        placeholder="Valor"
                        onChange={(e) => {
                          const valueNumeric = e.target.value.replace(
                            /\D/g,
                            '',
                          );
                          const updatedGoods = [...data.direct_goods];
                          updatedGoods[index].value = valueNumeric
                            ? parseFloat(valueNumeric) / 100
                            : 0;
                          setData({
                            ...data,
                            direct_goods: updatedGoods,
                          });
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-700 mt-5"
                      size="icon"
                      onClick={() => removeItem(index, 'direct_goods')}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => addItem('direct_goods', 'direct_goods')}
              >
                Adicionar Dependente
              </Button>
            </>
          ),
        };
        break;
      default:
        break;
    }
  }

  return (
    <main>
      <section className={`flex flex-col gap-5 items-center justify-start`}>
        <form
          onSubmit={handleSubmit}
          className="w-[85vw] max-w-[400px] sm:w-full"
        >
          <div className="flex flex-col py-10 text-center">
            <h1 className="text-2xl font-semibold">Adicionar Declaração</h1>
            <span className="text-sm text-muted-foreground">
              Faça a sua declaração do imposto de renda.
            </span>
          </div>
          <Card className="border-none w-full space-y-4">
            {stepReturn()!.title}
            {stepReturn()!.component}
            <CardFooter className="w-full flex justify-end items-center gap-4">
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => prevStep()}
                >
                  Voltar
                </Button>
              )}
              <Button
                type="submit"
                variant={stepReturn()!.disabled ? 'ghost' : 'default'}
                disabled={stepReturn()!.disabled}
              >
                {step === 4 ? 'Enviar' : 'Avançar'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </section>
    </main>
  );
}
