export function formatCurrency(value: string) {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return 'R$ 0,00';
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

}


export function formatCurrencyInput(value: any) {
  try {
    let tmp = value + "";
    const isNegativeValue = tmp.indexOf("-") != -1;
    tmp = tmp.replace(/\D/g, "");
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    if (isNegativeValue && tmp) tmp = "-" + tmp;
    return tmp ? "R$ " + tmp : isNegativeValue ? "R$ -" : "";
  } catch (e) {
    return "R$ 0,00";
  }
}

