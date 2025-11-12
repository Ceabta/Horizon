import { useState, useEffect, useMemo } from "react";
import { getStatusColor } from "../../../utils/getStatusColor";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Paperclip, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { FaRegFilePdf } from "react-icons/fa6";
import { Acoes } from "../../Formulario/Acoes";
import { TabelaItensOS } from "../TabelaItensOS";
import type { Agendamento, OSItem } from "../../../types";
import { formatarData } from "../../../utils/formatarData";
import { CampoAgendamento } from "../CampoAgendamento";
import style from '../NovaOS/NovaOS.module.css';

interface EditarOSProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ordemServico: any;
    onSave: (data: any) => void;
    onBack?: () => void;
    agendamentos?: Agendamento[];
    proximoNumeroOS?: (clienteId: number) => Promise<number>;
}

export function EditarOS({
    open,
    onOpenChange,
    ordemServico,
    onSave,
    onBack,
    agendamentos = [],
    proximoNumeroOS
}: EditarOSProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nome: "",
        descricao: "",
        itens: [] as OSItem[],
        agendamento_id: null as number | null,
        agendamento: "",
        status: "Pendente" as "Pendente" | "Concluída" | "Cancelada"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [removePDF, setRemovePDF] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalData, setOriginalData] = useState({
        id: 0,
        nome: "",
        descricao: "",
        itens: [] as OSItem[],
        agendamento_id: null as number | null,
        agendamento: "",
        valor: 0,
        status: "Pendente" as "Pendente" | "Concluída" | "Cancelada"
    });

    const [itens, setItens] = useState<OSItem[]>([]);
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
    const [agendamentoOriginalId, setAgendamentoOriginalId] = useState<number | null>(null);
    const agendamentosDisponiveis = agendamentos.filter(a =>
        !(a as any).os_gerada || (a as any).id === formData.agendamento_id
    );

    const hasChanges = useMemo(() => {
        const valorTotal = itens.reduce((sum, item) => sum + item.valor, 0);

        return (
            formData.nome !== originalData.nome ||
            formData.descricao !== originalData.descricao ||
            valorTotal !== originalData.valor ||
            formData.status !== originalData.status ||
            formData.agendamento_id !== originalData.agendamento_id ||
            JSON.stringify(itens) !== JSON.stringify(originalData.itens) ||
            selectedFile !== null ||
            removePDF
        );
    }, [
        formData.nome,
        formData.descricao,
        formData.status,
        formData.agendamento_id,
        itens,
        originalData.nome,
        originalData.descricao,
        originalData.valor,
        originalData.status,
        originalData.agendamento_id,
        originalData.itens,
        selectedFile,
        removePDF
    ]);

    useEffect(() => {
        if (ordemServico && ordemServico.id) {
            const agendamentoTexto = ordemServico.agendamento
                ? `${ordemServico.agendamento.cliente} • ${formatarData(ordemServico.agendamento.data)} • ${ordemServico.agendamento.horario} • ${ordemServico.agendamento.servico}`
                : "";

            const initialData = {
                id: ordemServico.id,
                nome: ordemServico.nome || "",
                descricao: ordemServico.descricao || "",
                itens: ordemServico.itens || [],
                agendamento_id: ordemServico.agendamento_id,
                agendamento: agendamentoTexto,
                valor: ordemServico.valor,
                status: ordemServico.status || "Pendente"
            };

            setFormData(initialData);
            setOriginalData(initialData);
            setItens(ordemServico.itens || []);
            setAgendamentoOriginalId(ordemServico.agendamento_id);
            setSelectedFile(null);
            setRemovePDF(false);

            if (ordemServico.agendamento_id && agendamentos.length > 0) {
                const agendamento = agendamentos.find(a => (a as any).id === ordemServico.agendamento_id);
                setSelectedAgendamento(agendamento || null);
            }

            setErrors({});
        }
    }, [ordemServico?.id, agendamentos.length]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome da OS é obrigatório";
        }
        if (!formData.descricao.trim()) {
            newErrors.descricao = "Descrição é obrigatória";
        }
        if (itens.length === 0) {
            newErrors.itens = "Adicione pelo menos um item";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const valorTotal = itens.reduce((sum, item) => sum + item.valor, 0);

        setIsSaving(true);
        try {
            const mudouAgendamento = agendamentoOriginalId !== formData.agendamento_id;

            await onSave({
                ...formData,
                itens,
                valor: valorTotal,
                pdfFile: selectedFile,
                removePDF: removePDF,
                agendamentoOriginalId: mudouAgendamento ? agendamentoOriginalId : null,
                mudouAgendamento
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemovePDF = () => {
        setRemovePDF(true);
        setSelectedFile(null);
        toast.info("PDF será removido ao salvar");
    };

    const handleCancel = () => {
        setFormData(originalData);
        setSelectedFile(null);
        setRemovePDF(false);
        setErrors({});
        toast.info("Alterações descartadas");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">Editar Ordem de Serviço</h2>

                        <div className="flex items-center gap-2">
                            <Select
                                key={`status-${ordemServico?.id}-${formData.status}`}
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="cursor-pointer w-auto h-auto border-0 px-3 py-1.5 rounded-full text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent style={{ backgroundColor: 'var(--background)' }}>
                                    <SelectItem value="Pendente" className="cursor-pointer">
                                        <span
                                            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: getStatusColor('Pendente').bg,
                                                color: getStatusColor('Pendente').text
                                            }}
                                        >
                                            Pendente
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Concluída" className="cursor-pointer">
                                        <span
                                            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: getStatusColor('Concluída').bg,
                                                color: getStatusColor('Concluída').text
                                            }}
                                        >
                                            Concluída
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Cancelada" className="cursor-pointer">
                                        <span
                                            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: getStatusColor('Cancelada').bg,
                                                color: getStatusColor('Cancelada').text
                                            }}
                                        >
                                            Cancelada
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div
                        onClick={() => onBack ? (setFormData(originalData), onBack()) : onOpenChange(false)}
                        className={style.btnFechar}
                    >
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">
                                Nome da OS <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Ex: OS-2025-001"
                                className={errors.nome ? "border-red-500" : ""}
                            />
                            {errors.nome && (
                                <span className="text-red-500 text-sm">{errors.nome}</span>
                            )}
                        </div>

                        <CampoAgendamento
                            key={`agendamento-${ordemServico?.id}`}
                            value={formData.agendamento}
                            onChange={async (agendamento) => {
                                const clienteNome = (agendamento as any).cliente ?? "Cliente";
                                const resumo = `${clienteNome} • ${formatarData(agendamento.data)} • ${agendamento.horario ?? ""} • ${(agendamento as any).servico ?? ""}`;

                                let novoNome = formData.nome;
                                if (proximoNumeroOS && agendamento) {
                                    const ano = new Date().getFullYear();
                                    const agendamentoId = (agendamento as any).id;
                                    const numero = await proximoNumeroOS((agendamento as any).cliente_id);
                                    novoNome = `OS-${ano}-${agendamentoId}-${numero}`;
                                }

                                setFormData({
                                    ...formData,
                                    agendamento: resumo,
                                    agendamento_id: (agendamento as any).id,
                                    nome: novoNome
                                });
                                setSelectedAgendamento(agendamento);
                            }}
                            agendamentos={agendamentosDisponiveis}
                            error={errors.agendamento}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Itens da OS <span className="text-red-500">*</span>
                        </Label>
                        <TabelaItensOS
                            itens={itens}
                            onChange={setItens}
                            errors={errors.itens}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descricao">
                            Descrição <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Descreva os serviços realizados"
                            rows={4}
                            className={`${errors.descricao ? "border-red-500" : ""} resize-none`}
                        />
                        {errors.descricao && (
                            <span className="text-red-500 text-sm">{errors.descricao}</span>
                        )}
                    </div>

                    {ordemServico.pdf_url && !removePDF && !selectedFile && (
                        <div className="space-y-2">
                            <Label>PDF Atual</Label>
                            <div className="flex items-center gap-4 p-3 bg-muted rounded-md border">
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm flex-1">Documento atual</span>
                                <Button
                                    className="botao"
                                    onClick={() => window.open(ordemServico.pdf_url, '_blank')}
                                >
                                    <FaRegFilePdf className="w-4 h-4" />
                                    Ver
                                </Button>
                                <div className="w-0.5 self-stretch bg-gray-500" />
                                <Button
                                    className="btnExcluir"
                                    onClick={handleRemovePDF}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    )}

                    {removePDF && (
                        <p className="text-sm text-red-500 mb-2">✓ PDF será removido ao salvar</p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="pdf-upload">
                            {ordemServico.pdf_url && !removePDF ? "Substituir PDF" : "Anexar PDF (opcional)"}
                        </Label>

                        <label
                            htmlFor="pdf-upload"
                            className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <Paperclip className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {selectedFile
                                    ? selectedFile.name
                                    : "Clique para escolher arquivo PDF"
                                }
                            </span>
                        </label>

                        <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        toast.error("Arquivo muito grande! Máximo 5MB");
                                        return;
                                    }
                                    setSelectedFile(file);
                                    setRemovePDF(false);
                                    toast.success(`Arquivo "${file.name}" selecionado`);
                                }
                            }}
                            className="hidden"
                        />

                        {selectedFile && (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                <Paperclip className="w-4 h-4 text-green-500" />
                                <span className="text-sm flex-1">{selectedFile.name}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Tamanho máximo: 5MB • Formato: PDF
                        </p>
                    </div>

                    <Acoes
                        showUndo={hasChanges}
                        onUndo={handleCancel}
                        onSave={handleSubmit}
                        isSaving={isSaving}
                        saveLabel="Salvar Alterações"
                    />
                </div>
            </div>
        </div>
    );
}