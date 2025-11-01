import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";
import styleAgendamento from '../EditarAgendamento/EditarAgendamento.module.css';
import style from './NovoAgendamento.module.css';

interface Cliente {
    id: number;
    nome: string;
    telefone?: string;
}

interface NovoAgendamentoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agendamento: any;
    onSubmit: (data: any) => void;
    clientes?: Cliente[];
}

const initialFormData = {
    id: 0,
    cliente: "",
    servico: "",
    data: "",
    horario: "",
    telefone: "",
    email: "",
    status: "Em Andamento",
    observacoes: "",
};

export function NovoAgendamento({
    open,
    onOpenChange,
    agendamento,
    onSubmit,
    clientes = []
}: NovoAgendamentoProps) {

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const [isNovoCliente, setIsNovoCliente] = useState(false);

    useEffect(() => {
        if (open && agendamento) {
            let dataFormatada = '';
            if (agendamento.data) {
                if (typeof agendamento.data === 'string') {
                    dataFormatada = agendamento.data;
                } else {
                    const dataStr = agendamento.data.toISOString().split('T')[0];
                    const [year, month, day] = dataStr.split('-').map(Number);
                    dataFormatada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                }
            }

            setFormData({
                id: agendamento.id || 0,
                cliente: agendamento.cliente || "",
                servico: agendamento.servico || "",
                data: dataFormatada,
                horario: agendamento.horario || "",
                telefone: agendamento.telefone || "",
                email: agendamento.email || "",
                status: agendamento.status || "Em Andamento",
                observacoes: agendamento.observacoes || "",
            });
        } else if (open && !agendamento) {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [open, agendamento]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.cliente.trim()) {
            newErrors.cliente = "Cliente é obrigatório";
        }
        if (!formData.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
        }
        if (isNovoCliente && !formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório";
        }
        if (!formData.servico) {
            newErrors.servico = "Serviço é obrigatório";
        }
        if (!formData.data) {
            newErrors.data = "Data é obrigatória";
        }
        if (!formData.horario) {
            newErrors.horario = "Horário é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClienteChange = (value: string) => {
        setFormData({ ...formData, cliente: value });

        if (value.trim().length > 0) {
            const filtered = clientes.filter(cliente =>
                cliente.nome.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredClientes(filtered);
            setShowSuggestions(true);
            setHighlightedIndex(-1);

            const existe = clientes.some(c => c.nome.toLowerCase() === value.toLowerCase());
            setIsNovoCliente(!existe);

            if (!existe) {
                setFormData(prev => ({ ...prev, telefone: '', email: '' }));
            }
        } else {
            setShowSuggestions(false);
            setFilteredClientes([]);
            setIsNovoCliente(false);
        }
    };

    const selectCliente = (cliente: Cliente) => {
        setFormData({
            ...formData,
            cliente: cliente.nome,
            telefone: cliente.telefone || formData.telefone
        });
        setShowSuggestions(false);
        setFilteredClientes([]);
        setIsNovoCliente(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || filteredClientes.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredClientes.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredClientes.length) {
                    selectCliente(filteredClientes[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const applyPhoneMask = (value: string) => {
        const numbers = value.replace(/\D/g, '');

        if (numbers.length <= 10) {
            return numbers
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            return numbers
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const [year, month, day] = formData.data.split('-');
        const dataCorreta = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        onSubmit({
            ...formData,
            data: dataCorreta,
            isNovoCliente: isNovoCliente
        });
        setFormData(initialFormData);
        toast.success("Agendamento criado com sucesso!");
        onOpenChange(false);
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setErrors({});
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Novo Agendamento</h2>
                    <div onClick={handleCancel} className={style.btnFechar}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2 relative">
                        <Label htmlFor="cliente">
                            Cliente <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            ref={inputRef}
                            id="cliente"
                            value={formData.cliente}
                            onChange={(e) => handleClienteChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                setTimeout(() => {
                                    setShowSuggestions(false);
                                    setHighlightedIndex(-1);
                                }, 200);
                            }}
                            onFocus={() => {
                                if (formData.cliente.trim().length > 0) {
                                    const filtered = clientes.filter(cliente =>
                                        cliente.nome.toLowerCase().includes(formData.cliente.toLowerCase())
                                    );
                                    setFilteredClientes(filtered);
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Digite o nome do cliente"
                            className={errors.cliente ? "border-red-500" : ""}
                            autoComplete="off"
                        />
                        {errors.cliente && (
                            <span className="text-red-500 text-sm">{errors.cliente}</span>
                        )}

                        {showSuggestions && filteredClientes.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute z-50 w-full mt-1 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                                style={{ top: '100%', backgroundColor: 'var(--background)' }}
                            >
                                {filteredClientes.map((cliente, index) => (
                                    <>
                                        <div
                                            key={cliente.id}
                                            onClick={() => selectCliente(cliente)}
                                            className={`px-4 py-2 cursor-pointer flex items-center justify-between ${styleAgendamento.cliente}`}
                                        >
                                            <div>
                                                <div className={`${styleAgendamento.cliente_nome} font-medium`}>{cliente.nome}</div>
                                                {cliente.telefone && (
                                                    <div className={`${styleAgendamento.cliente_telefone} text-sm text-gray-500`}>
                                                        {cliente.telefone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {index < filteredClientes.length - 1 && (
                                            <center><hr className={styleAgendamento.linha} /></center>
                                        )}
                                    </>
                                ))}
                            </div>
                        )}

                        {isNovoCliente && (
                            <div className="font-semibold text-sm mt-1" style={{ color: "var(--chart-3)" }}>
                                ✨ Novo cliente será criado
                            </div>
                        )}
                    </div>

                    {isNovoCliente && (
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px dashed var(--chart-3)' }}>
                            <div className="space-y-2">
                                <Label htmlFor="telefone">
                                    Telefone <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={(e) => {
                                        const masked = applyPhoneMask(e.target.value);
                                        setFormData({ ...formData, telefone: masked });
                                    }}
                                    placeholder="(00) 00000-0000"
                                    className={errors.telefone ? "border-red-500" : ""}
                                    maxLength={15}
                                />
                                {errors.telefone && (
                                    <span className="text-red-500 text-sm">{errors.telefone}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    E-mail <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm">{errors.email}</span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="servico">
                            Serviço <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.servico}
                            onValueChange={(value: any) => setFormData({ ...formData, servico: value })}
                        >
                            <SelectTrigger className={errors.servico ? "border-red-500" : ""}>
                                <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                            <SelectContent className={style.servicos}>
                                <SelectItem value="Manutenção geral">Manutenção geral</SelectItem>
                                <SelectItem value="Instalação de equipamentos">Instalação de equipamentos</SelectItem>
                                <SelectItem value="Reparo de equipamentos">Reparo de equipamentos</SelectItem>
                                <SelectItem value="Consultoria técnica">Consultoria técnica</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.servico && (
                            <span className="text-red-500 text-sm">{errors.servico}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="data">
                                Data <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="data"
                                type="date"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                className={errors.data ? "border-red-500" : ""}
                            />
                            {errors.data && (
                                <span className="text-red-500 text-sm">{errors.data}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="horario">
                                Horário <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="horario"
                                type="time"
                                value={formData.horario}
                                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                                className={errors.horario ? "border-red-500" : ""}
                            />
                            {errors.horario && (
                                <span className="text-red-500 text-sm">{errors.horario}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Informações adicionais sobre o agendamento"
                            rows={3}
                            className={`${style.textareaCustom} resize-none`}
                            style={{ height: '80px', overflow: 'auto' }}
                        />
                    </div>

                    <div className="flex justify-between gap-3 mt-2">
                        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                        <Button onClick={handleSubmit} className={style.botao}>
                            Salvar Agendamento
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}