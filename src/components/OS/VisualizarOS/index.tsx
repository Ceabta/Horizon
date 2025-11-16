import { useEffect } from "react";
import { Edit, Download, Paperclip, X } from "lucide-react";
import { CiFileOff } from "react-icons/ci";
import { FaRegFilePdf, FaRegFileWord } from "react-icons/fa6";
import { Button } from "../../ui/button";
import { Tag } from "../../Tag";
import { Label } from "../../ui/label";
import { formatarData } from "../../../utils/formatarData";
import type { OS } from "../../../types";
import { toast } from "sonner";
import { downloadDocumentoOS } from "../../../utils/gerarDocumento";

interface VisualizarOSProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ordemServico: OS | null;
    onEdit: () => void;
    onPrint?: () => void;
    onDownloadPDF?: (os: OS) => void;
}

const getFileType = (url: string | null): 'pdf' | 'docx' | null => {
    if (!url) return null;

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('.pdf')) return 'pdf';
    if (lowerUrl.includes('.docx') || lowerUrl.includes('.doc')) return 'docx';

    return null;
};

export function VisualizarOS({
    open,
    onOpenChange,
    ordemServico,
    onEdit,
    onDownloadPDF
}: VisualizarOSProps) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [open]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    };

    if (!open || !ordemServico) return null;

    const fileType = getFileType(ordemServico.pdf_url!);
    const isPDF = fileType === 'pdf';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleOverlayClick}
        >
            <div
                className="rounded-lg p-6 w-full max-w-2xl max-h-[95vh] overflow-auto flex flex-col"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Visualização da Ordem de Serviço</h2>
                    <div
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
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

                {isPDF && ordemServico.pdf_url && (
                    <div className="mb-6">
                        <Label className="text-sm font-medium text-muted-foreground">
                            PDF Anexado
                        </Label>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md mt-2 border border-border">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm flex-1 font-semibold">
                                Documento PDF anexado
                            </span>

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
                                    Baixar PDF
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <Button
                        onClick={async () => {
                            try {
                                toast.info("Gerando documento...");
                                await downloadDocumentoOS(ordemServico);
                                toast.success("Documento gerado!");
                            } catch (error) {
                                toast.error("Erro ao gerar documento");
                            }
                        }}
                        className="botao w-full"
                    >
                        <FaRegFileWord className="w-4 h-4 mr-2" />
                        Gerar Word
                    </Button>
                </div>

                <div
                    className="rounded-lg p-3 mb-6"
                    style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                    <label className="text-sm font-medium text-muted-foreground">Valor Total</label>
                    <p className="text-3xl font-bold mt-2" style={{ color: 'var(--chart-3)' }}>
                        R$ {ordemServico.valor?.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="flex justify-end gap-3">
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