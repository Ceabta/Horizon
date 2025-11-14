import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import type { OS } from '../types';
import { formatarData } from './formatarData';

function formatarHorario(horario: string): string {
    if (!horario) return '-';
    const partes = horario.split(':');
    return `${partes[0]}:${partes[1]}`;
}

export const gerarDocumentoOS = async (os: OS) => {
    try {
        const response = await fetch('/templates/ordem-servico.docx');
        if (!response.ok) {
            throw new Error('Template não encontrado');
        }

        const arrayBuffer = await response.arrayBuffer();
        const zip = new PizZip(arrayBuffer);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        const dados = {
            nome_os: os.nome,
            data_emissao: new Date().toLocaleDateString('pt-BR'),
            status: os.status,

            cliente: os.agendamento.cliente,
            telefone: os.agendamento.telefone || '-',
            email: os.agendamento.email || '-',

            servico: os.agendamento.servico,
            data_servico: formatarData(os.agendamento.data),
            horario: formatarHorario(os.agendamento.horario),

            descricao: os.descricao || 'Nenhuma observação adicional.',

            itens: os.itens.map((item, index) => {
                const valorFormatado = item.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                return {
                    numero: String(index + 1).padStart(2, '0'), // "01", "02", etc
                    descricao: item.descricao,
                    valor_formatado: valorFormatado,
                    linha: `${String(index + 1).padStart(2, ' ')} │ ${item.descricao.padEnd(40, ' ')} │ ${valorFormatado.padStart(15, ' ')}`
                };
            }),

            valor_total: os.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),

            total_itens: os.itens.length
        };

        doc.render(dados);

        const blob = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        return blob;
    } catch (error) {
        console.error('Erro ao gerar documento:', error);
        throw error;
    }
};

export const downloadDocumentoOS = async (os: OS) => {
    const blob = await gerarDocumentoOS(os);
    saveAs(blob, `${os.nome}.docx`);
};
