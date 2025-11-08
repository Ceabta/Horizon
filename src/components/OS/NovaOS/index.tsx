import { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Info, X, Paperclip } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import type { Agendamento } from "../../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { formatarData } from "../../../utils/formatarData";
import { useTheme } from "../../../hooks/theme-context";
import style from './NovaOS.module.css';
import { toast } from "sonner";

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
    valor: "",
    agendamento: "",
};

function formatCurrencyFromDigits(digits: string) {
    if (!digits) return "";
    digits = digits.replace(/^0+/, "");
    if (digits === "") digits = "0";
    if (digits.length === 1) digits = "0" + digits;
    if (digits.length === 2) digits = "0" + digits;
    const cents = digits.slice(-2);
    let intPart = digits.slice(0, -2);
    if (intPart === "") intPart = "0";
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${intPart},${cents}`;
}

function parseCurrencyToNumber(masked: string) {
    if (!masked) return 0;
    const cleaned = masked.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
}

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
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

    const [hasAvailableAgendamentos, setHasAvailableAgendamentos] = useState(true);
    const agendamentosDisponiveis = agendamento.filter(a => !(a as any).os_gerada);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { theme } = useTheme();

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

        if (!formData.valor || parseCurrencyToNumber(formData.valor) <= 0) {
            newErrors.valor = "Valor é obrigatório";
        }
        if (!formData.descricao.trim()) {
            newErrors.descricao = "Descrição é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

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
            valor: parseCurrencyToNumber(formData.valor),
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
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setErrors({});
        setShowSuggestions(false);
        setSelectedAgendamento(null);
        onOpenChange(false);
    };

    const handleAgendamentoChange = (value: string) => {
        setFormData({ ...formData, agendamento: value });
        setSelectedAgendamento(null);

        if (value.trim().length > 0) {
            const filtered = agendamentosDisponiveis.filter(a => {
                const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "";
                const servicoDesc = (a as any).servico ?? (a as any).servico_descricao ?? "";
                const combined = `${clienteNome} ${servicoDesc} ${a.data ?? ""} ${a.horario ?? ""}`.toLowerCase();
                return combined.includes(value.toLowerCase());
            });
            setFilteredAgendamentos(filtered);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
        } else {
            setShowSuggestions(false);
            setFilteredAgendamentos([]);
            setHighlightedIndex(-1);
        }
    };

    const selectAgendamento = (a: Agendamento) => {
        const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "Cliente";
        const resumo = `${clienteNome} • ${formatarData(a.data)} • ${a.horario ?? ""} • ${(a as any).servico ?? ""}`;
        setFormData({ ...formData, agendamento: resumo });
        setSelectedAgendamento(a);
        setShowSuggestions(false);
        setFilteredAgendamentos([]);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || filteredAgendamentos.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev < filteredAgendamentos.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredAgendamentos.length) {
                    selectAgendamento(filteredAgendamentos[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const handleValorInput = (rawValue: string) => {
        const digits = rawValue.replace(/\D/g, "");
        if (!digits) {
            setFormData({ ...formData, valor: "" });
            return;
        }
        const masked = formatCurrencyFromDigits(digits);
        setFormData({ ...formData, valor: masked });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Nova OS</h2>
                    <div onClick={handleCancel} className={style.btnFechar}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="nome">
                                Nome da OS <span className="text-red-500">*</span>
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
                                            💡 Se deixar em branco, o nome será gerado automaticamente como:
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
                            placeholder="Ex: OS-2025-001 (deixe em branco para gerar automaticamente)"
                            className={errors.nome ? "border-red-500" : ""}
                        />
                        {errors.nome && (
                            <span className="text-red-500 text-sm">{errors.nome}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="valor">
                                Valor (R$) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="valor"
                                type="text"
                                inputMode="numeric"
                                value={formData.valor}
                                onChange={(e) => handleValorInput(e.target.value)}
                                placeholder="0,00"
                                className={errors.valor ? "border-red-500" : ""}
                            />
                            <p className="text-xs text-muted-foreground">Digite apenas números; os centavos são automáticos (ex.: 1234 → 12,34)</p>
                            {errors.valor && (
                                <span className="text-red-500 text-sm">{errors.valor}</span>
                            )}
                        </div>

                        <div className="space-y-2 relative">
                            <Label htmlFor="agendamento">
                                Agendamento <span className="text-red-500">*</span>
                            </Label>
                            {!hasAvailableAgendamentos ? (
                                <div className={`mb-2 p-3 border ${theme === 'light' ? "bg-yellow-100 border-yellow-400" : "bg-yellow-900/20 border-yellow-800"} rounded-md`}>
                                    <p className={`text-sm ${theme === 'light' ? "text-yellow-900" : "text-yellow-200"}`}>
                                        ⚠️ Não há agendamentos disponíveis. Todos os agendamentos já possuem OS gerada.
                                    </p>
                                </div>
                            )
                                : (
                                    <Input
                                        ref={inputRef}
                                        id="agendamento"
                                        value={formData.agendamento}
                                        onChange={(e) => handleAgendamentoChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setShowSuggestions(false);
                                                setHighlightedIndex(-1);
                                            }, 150);
                                        }}
                                        onFocus={() => {
                                            if (formData.agendamento.trim().length > 0) {
                                                const filtered = agendamentosDisponiveis.filter(a => {
                                                    const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "";
                                                    const servicoDesc = (a as any).servico ?? (a as any).servico_descricao ?? "";
                                                    const combined = `${clienteNome} ${servicoDesc} ${a.data ?? ""} ${a.horario ?? ""}`.toLowerCase();
                                                    return combined.includes(formData.agendamento.toLowerCase());
                                                });
                                                setFilteredAgendamentos(filtered);
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        placeholder={"Procure por cliente, serviço ou data"}
                                        className={errors.agendamento ? "border-red-500" : ""}
                                        autoComplete="off"
                                        disabled={!hasAvailableAgendamentos}
                                    />
                                )
                            }

                            {errors.agendamento && (
                                <span className="text-red-500 text-sm">{errors.agendamento}</span>
                            )}

                            {showSuggestions && filteredAgendamentos.length > 0 && (
                                <div
                                    ref={suggestionsRef}
                                    className="absolute z-50 w-full border -mt-5 border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                                    style={{ top: '100%', backgroundColor: 'var(--background)' }}
                                >
                                    {filteredAgendamentos.map((a, index) => {
                                        const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "Cliente";
                                        return (
                                            <div key={(a as any).id ?? index}>
                                                <div
                                                    onClick={() => selectAgendamento(a)}
                                                    className={`px-4 py-2 cursor-pointer flex items-center justify-between ${style.cliente} ${index === highlightedIndex ? "bg-muted" : ""}`}
                                                >
                                                    <div>
                                                        <div className={`${style.cliente_nome} font-medium`}>{clienteNome}</div>
                                                        <div className={`text-sm text-gray-500 ${style.cliente_nome}`}>
                                                            {formatarData((a as any).data)} {a.horario ?? ""} • {(a as any).servico ?? ""}
                                                        </div>
                                                    </div>
                                                </div>
                                                {index < filteredAgendamentos.length - 1 && (
                                                    <center><hr className={style.linha} /></center>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descricao">
                            Descrição <span className="text-red-500">*</span>
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

                    <div className="flex justify-between gap-3 mt-2">
                        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                        <Button
                            onClick={handleSubmit}
                            className={style.botao}
                            disabled={!hasAvailableAgendamentos}
                        >
                            Salvar OS
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
