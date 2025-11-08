import { useEffect } from "react";
import { Edit, Download, Paperclip, Trash2 } from "lucide-react";
import { CiFileOff } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa6";
import { Button } from "../../ui/button";
import { Tag } from "../../Tag";
import { Label } from "../../ui/label";
import { formatarData } from "../../../utils/formatarData";
import type { OS } from "../../../types";
import style from './VisualizarOS.module.css';

interface VisualizarOSProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ordemServico: OS | null;
    onEdit: () => void;
    onPrint?: () => void;
    onDownloadPDF?: (os: OS) => void;
}

export function VisualizarOS({
    open,
    onOpenChange,
    ordemServico,
    onEdit,
    onDownloadPDF
}: VisualizarOSProps) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open || !ordemServico) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="rounded-lg p-6 w-full max-w-2xl max-h-[95vh] overflow-auto flex flex-col"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Visualização da Ordem de Serviço</h2>
                </div>

                <div
                    className="rounded-lg p-4 mb-4"
                    style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg">
                                {ordemServico.pdf_url ? (
                                    <FaRegFilePdf className="w-8 h-8" />
                                ) : (
                                    <CiFileOff className="w-8 h-8" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{ordemServico.nome}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatarData(ordemServico.agendamento.data)}
                                </p>
                            </div>
                        </div>
                        <Tag status={ordemServico.status} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                        <p className="text-lg font-semibold mt-1">{ordemServico.agendamento.cliente}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Técnico Responsável</label>
                        <p className="text-lg font-semibold mt-1">Roberto Almeida</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Serviço</label>
                    <p className="text-lg font-semibold mt-1">{ordemServico.agendamento.servico}</p>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <p className="text-base mt-1 text-muted-foreground">
                        {ordemServico.descricao || 'Sem descrição'}
                    </p>
                </div>

                {ordemServico.pdf_url && (
                    <div className="mb-6">
                        <Label className="text-sm font-medium text-muted-foreground">PDF Anexado</Label>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md mt-2 border border-border">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm flex-1 font-semibold">Documento anexado</span>
                            <Button
                                className="botao"
                                onClick={() => window.open(ordemServico.pdf_url, '_blank')}
                            >
                                <FaRegFilePdf className="w-4 h-4" />
                                Ver PDF
                            </Button>
                            {onDownloadPDF && (
                                <Button
                                    className="botao"
                                    onClick={() => onDownloadPDF(ordemServico)}
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <div
                    className="rounded-lg p-3 mb-6"
                    style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                    <label className="text-sm font-medium text-muted-foreground">Valor Total</label>
                    <p className="text-3xl font-bold mt-2" style={{ color: 'var(--chart-3)' }}>
                        R$ {ordemServico.valor?.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="flex justify-between gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Fechar
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            onClick={onEdit}
                            className="botao"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}