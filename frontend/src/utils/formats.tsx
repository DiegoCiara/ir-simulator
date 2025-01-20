export function formatCurrency(value: string) {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return 'R$ 0,00';
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

}

export function formatStatus(value: string){
  if(value === 'UNSUBMITED'){
    return 'Não submetida'
  } else {
    return 'Submetida'
  }

}