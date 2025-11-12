import { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Info, X, Paperclip } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import type { Agendamento, OSItem } from "../../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { formatarData } from "../../../utils/formatarData";
import { toast } from "sonner";
import { Acoes } from "../../Formulario/Acoes";
import { TabelaItensOS } from "../TabelaItensOS";
import { CampoAgendamento } from "../CampoAgendamento";
import style from './NovaOS.module.css';

interface NovaOSProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<any>;
    agendamento?: Agendamento[];
    proximoNumeroOS?: (clienteId: number) => Promise<number>;
}

const initialFormData = {
    nome: "",
    descricao: "",
    itens: [],
    agendamento: "",
};

export function NovaOS({
    open,
    onOpenChange,
    onSubmit,
    agendamento = [],
    proximoNumeroOS
}: NovaOSProps) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
    const [itens, setItens] = useState<OSItem[]>([]);

    const [hasAvailableAgendamentos, setHasAvailableAgendamentos] = useState(true);
    const agendamentosDisponiveis = agendamento.filter(a => !(a as any).os_gerada);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    useEffect(() => {
        setHasAvailableAgendamentos(agendamentosDisponiveis.length > 0);
    }, [agendamento]);

    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
            setItens([]);
            setErrors({});
            setShowSuggestions(false);
            setSelectedAgendamento(null);
            setFilteredAgendamentos([]);
            setHighlightedIndex(-1);
            setSelectedFile(null);
        }
    }, [open]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!hasAvailableAgendamentos) {
            newErrors.agendamento = "Não há agendamentos disponíveis";
        } else if (!formData.agendamento.trim()) {
            newErrors.agendamento = "Agendamento é obrigatório";
        }

        if (itens.length === 0) {
            newErrors.itens = "Adicione pelo menos um item";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);

        const valorTotal = itens.reduce((sum, item) => sum + item.valor, 0);

        let nomeOS = formData.nome.trim();
        if (!nomeOS && selectedAgendamento) {
            const ano = new Date().getFullYear();
            const agendamentoId = (selectedAgendamento as any).id;
            const numero = proximoNumeroOS
                ? await proximoNumeroOS(selectedAgendamento.cliente_id)
                : 1;
            nomeOS = `OS-${ano}-${agendamentoId}-${numero}`;
        } else if (!nomeOS) {
            nomeOS = `OS-${new Date().getFullYear()}-${Date.now()}`;
        }

        const payload = {
            ...formData,
            itens,
            valor: valorTotal,
            nome: nomeOS,
            agendamento_id: selectedAgendamento?.id ?? null,
            pdfFile: selectedFile
        };

        try {
            const result = await onSubmit(payload);
            if (result?.success) {
                onOpenChange(false);
            }
        } catch (err: any) {
            console.error("Erro onSubmit:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setErrors({});
        setShowSuggestions(false);
        setSelectedAgendamento(null);
        onOpenChange(false);
    };

    const handleAgendamentoChange = async (agendamento: Agendamento) => {
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
            nome: novoNome 
        });
        setSelectedAgendamento(agendamento);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Nova OS</h2>
                    <div onClick={handleCancel} className={style.btnFechar}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4 pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="nome">
                                    Nome da OS
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                className="p-1 rounded hover:bg-muted transition-colors flex items-center justify-center"
                                            >
                                                <Info className="w-4 h-4 text-blue-500 hover:text-blue-300" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center" className="max-w-xs p-3 text-sm text-left leading-snug bg-gray-50 text-gray-800 border border-gray-200">
                                            <p>
                                                💡 O nome será gerado automaticamente ao selecionar um agendamento:
                                            </p>
                                            <p className="font-medium mt-1">
                                                OS-{new Date().getFullYear()}-[ID_Agendamento]-[Número]
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Será gerado automaticamente"
                                className={errors.nome ? "border-red-500" : ""}
                            />
                            {errors.nome && (
                                <span className="text-red-500 text-sm">{errors.nome}</span>
                            )}
                        </div>

                        <div className="mt-2">
                            <CampoAgendamento
                                value={formData.agendamento}
                                onChange={handleAgendamentoChange}
                                agendamentos={agendamentosDisponiveis}
                                error={errors.agendamento}
                                required
                                disabled={!hasAvailableAgendamentos}
                            />
                        </div>
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
                            Descrição
                        </Label>
                        <Textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Descreva os detalhes da OS"
                            rows={4}
                            className={`${style.textareaCustom} ${errors.descricao ? "border-red-500" : ""} resize-none`}
                            style={{ height: '120px', overflow: 'auto' }}
                        />
                        {errors.descricao && (
                            <span className="text-red-500 text-sm">{errors.descricao}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pdf">
                            Anexar PDF (opcional)
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="pdf"
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
                                    }
                                }}
                                className="flex-1"
                            />
                            {selectedFile && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Paperclip className="w-4 h-4" />
                                    {selectedFile.name}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tamanho máximo: 5MB
                        </p>
                    </div>

                    <Acoes
                        onSave={handleSubmit}
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}