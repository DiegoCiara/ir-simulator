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


export function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}