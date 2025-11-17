export const formatarData = (dataString: string | Date): string => {
  try {
    let dateStr: string;

    if (!dataString) {
      return 'Data não disponível';
    }

    if (typeof dataString === 'string') {
      if (dataString.includes('/')) {
        return dataString;
      }
      dateStr = dataString;
    } else if (dataString instanceof Date) {
      dateStr = dataString.toISOString().split('T')[0];
    } else {
      return 'Data inválida';
    }

    if (!dateStr.includes('-') || dateStr.split('-').length !== 3) {
      return 'Formato de data inválido';
    }

    const [year, month, day] = dateStr.split('-');
    
    if (!year || !month || !day) {
      return 'Data inválida';
    }

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error, dataString);
    return 'Data inválida';
  }
};

export const obterDataLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};