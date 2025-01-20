export function formatCurrency(value = "") {
  try {
    let tmp = value + "";
    const isNegativeValue = tmp.indexOf("-") != -1;
    tmp = tmp.replace(/\D/g, "");  // Remove qualquer coisa que não seja número
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1"); // Adiciona vírgula para as casas decimais

    // Adiciona ponto como separador de milhar, milhão, etc.
    while (/(\d+)(\d{3})/.test(tmp)) {
      tmp = tmp.replace(/(\d+)(\d{3})/, "$1.$2");
    }

    // Insere o sinal negativo, caso necessário
    if (isNegativeValue && tmp) tmp = "-" + tmp;

    return tmp ? "R$ " + tmp : isNegativeValue ? "R$ -" : "";
  } catch (e) {
    return "R$ 0,00";
  }
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

