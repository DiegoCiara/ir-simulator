import { Input } from '@/components/ui/input';
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
import ModalContainer from '../..';
import React, { useState } from 'react';
import { Declaration } from '@/types/Declaration';
import { toast } from 'react-toastify';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';

interface CreateDeclarationModalProps {
  open: boolean;
  getData: () => void;
  close: () => void;
}

export default function CreateDeclarationModal({
  open,
  close,
  getData,
}: CreateDeclarationModalProps) {
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
  const [step, setStep] = React.useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { createDeclaration } = useDeclaration();

  function setDeclaration(column: string, value: string) {
    setData({ ...data, [column]: value });
  }

  function nextStep() {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  function prevStep() {
    if (step > 0) {
      setStep(step - 1)
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await createDeclaration(data);
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 201) {
        await getData();
        await close();
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
  };

  React.useEffect(() => {
    setData(defaultData);
    setErrors({});
  }, [open]);

  const mapStep = [
    {
      title: 'Dados da integração',
    },
    {
      title: 'Base URL',
    },
    {
      title: 'Cabeçalhos',
    },
    {
      title: 'Corpo',
    },
    {
      title: 'Confirmação',
    },
  ];

  function stepReturn() {
    switch (step) {
      case 0:
        return {
          title: (
            <>
              <CardTitle>Dados da Declaração</CardTitle>
              <CardDescription>
                Insira os dados principais da função para ser reconhecida por
                sua assistente
              </CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="number"
                  id="name"
                  placeholder="Digite o nome (Exemplo: Criar tarefa)"
                  value={data.year}
                  onChange={(e) => setData({ ...data, year: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="number"
                  id="name"
                  placeholder="Digite o nome (Exemplo: Criar tarefa)"
                  value={data.year}
                  onChange={(e) => setData({ ...data, year: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Descrição</Label>

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
              <CardTitle>Base URL</CardTitle>
              <CardDescription>
                Insira o endpoint da API que deseja integrar
              </CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-1">
                <Label htmlFor="description">URL</Label>
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Método</Label>
                {/* <SelectInput
                  options={options}
                  id="description"
                  placeholder="Selecione um método de requisição"
                  value={data.method}
                  onChange={(e) => setData({ ...data, method: e })}
                /> */}
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
              <CardTitle>Cabeçalhos</CardTitle>
              <CardDescription>
                Insira os cabeçalhos(headers) para integrar com sua API
              </CardDescription>
            </>
          ),
          component: (
            <>
              <div className="space-y-4 flex flex-col items-start">
                <div
                  className={`flex flex-col items-start w-full min-h-12 gap-4 max-h-[220px] p-4 listItems ${
                     'overflow-auto'
                  } scroll-custom`}
                >
                  {/* {data.headers.map((property, index) => (
                    <Card
                      key={index}
                      className="flex p-4 items-center w-full gap-2 Animated"
                    >
                      <div className="space-y-1  w-full">
                        <Label htmlFor="description">Chave</Label>
                        <Input
                          type="text"
                          placeholder='Por exemplo: "apiKey"'
                          className="w-full"
                          value={property.key}
                          onChange={(e) =>
                            updateHeader(index, e.target.value, property.value)
                          }
                        />
                      </div>
                      <div className="space-y-1  w-full">
                        <Label htmlFor="description">Valor</Label>
                        <Input
                          type="text"
                          placeholder="Valor"
                          value={property.value}
                          className="w-full"
                          onChange={(e) =>
                            updateHeader(index, property.key, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        className="error mr-2"
                        onClick={() => removeHeader(index)}
                      >
                        <Trash2 />
                      </Button>
                    </Card>
                  ))}
                  {data.headers.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      Adicione itens ao cabeçalho da sua requisição
                    </span>
                  )} */}
                </div>
                {/* <Button type="button" onClick={addHeader}>
                  Adicionar item
                </Button> */}
                <CardDescription className="text-xs">
                  Para sua segurança, seus headers serão encriptados.
                </CardDescription>
              </div>
            </>
          ),
          // disabled: data.headers.some(
          //   (header) => header.key.trim() === '' || header.value.trim() === '',
          // ), // Verifica se algum cabeçalho está incompleto
        };
        break;
      case 3:
        return {
          title: (
            <>
              <CardTitle>Corpo</CardTitle>
              <CardDescription>
                Insira os dados corpo(body) para integrar com sua API
              </CardDescription>
            </>
          ),
          component: (
            <>
              {/* <BodyStep data={data} setData={setData} setScroll={setScroll} /> */}
            </>
          ),
          // disabled: data.body.some(
          //   (header) =>
          //     header.property.trim() === '' || header.description.trim() === '',
          // ),
        };
        break;
      case 4:
        return {
          title: (
            <>
              <CardTitle>Confirmação</CardTitle>
              <CardDescription>
                Verifique os detalhes da requisição e confirme suas informações
              </CardDescription>
            </>
          ),
          component: (
            <div className="flex space-y-4 flex-col items-start max-h-[300px] overflow-auto">
              <div className="flex items-center w-full">
                <div className="space-y-1 flex w-full flex-col items-start">
                  <Label
                    htmlFor="description"
                    className="text-muted-foreground"
                  >
                    Ano
                  </Label>
                  <span className="text-xs">{data.year}</span>
                </div>
                <div className="space-y-1 flex w-full flex-col items-start">
                  <Label
                    htmlFor="description"
                    className="text-muted-foreground"
                  >
                    Nome da função
                  </Label>
                  <span className="text-xs">{data.year}</span>
                </div>
              </div>
            </div>
          ),
        };
        break;
      default:
        break;
    }
  }

  return (
    <ModalContainer open={open} close={close}>
      <form className="FormIntegration" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="MainText">Adicionar Integração</CardTitle>
            <CardDescription>
              As integrações são requisições http que sua assistente pode
              executar para se conectar com outros sistemas via API, basta
              adicionar a integração e pedir para ela executa-la de acordo com o
              funcionName.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-[70vh]">
            <div className="flex gap-5 justify-start  h-[100%]">
              <div
                className="flex flex-col w-[300px] h-[100%] pr-4"
                style={{ borderRight: '1px solid var(--card-background)' }}
              >
                {mapStep.map((e, index) => (
                  <SidebarMenuButton
                    disabled={step != index}
                    type="button"
                    className="cursor-auto"
                    style={
                       step === index ? {backgroundColor:'var(--card-background)'} : { }
                    }
                  >
                    {e.title}
                  </SidebarMenuButton>
                ))}
              </div>
              <CardContent className="w-full space-y-4">
                <CardTitle className="MainText">{stepReturn()!.title}</CardTitle>
                {stepReturn()!.component}
              </CardContent>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={() => prevStep()}>
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
    </ModalContainer>
  );
}
