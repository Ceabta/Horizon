import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";
import style from '../NovoAgendamento/NovoAgendamento.module.css';

interface EditarAgendamentoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agendamento: any;
    onSave: (data: any) => void;
    onDelete?: () => void;
}

export function EditarAgendamento({
    open,
    onOpenChange,
    agendamento,
    onSave,
    onDelete
}: EditarAgendamentoProps) {
    const [formData, setFormData] = useState({
        id: 0,
        cliente: "",
        servico: "",
        data: "",
        horario: "",
        telefone: "",
        status: "Em Andamento",
        observacoes: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (agendamento) {
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

            const servicoTexto =
                typeof agendamento.servico === 'string' ? agendamento.servico :
                    agendamento.servicos?.descricao ? agendamento.servicos.descricao :
                        agendamento.servico_id ? String(agendamento.servico_id) :
                            '';

            setFormData({
                id: agendamento.id,
                cliente: agendamento.cliente,
                servico: servicoTexto,
                data: dataFormatada,
                horario: agendamento.horario,
                telefone: agendamento.telefone,
                status: agendamento.status,
                observacoes: agendamento.observacoes || "",
            });
        }
        setErrors({});
    }, [agendamento]);


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

        if (!formData.cliente.trim()) {
            newErrors.cliente = "Cliente é obrigatório";
        }
        if (!formData.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
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
        if (!formData.status) {
            newErrors.status = "Status é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

        onSave({
            ...formData,
            data: dataCorreta
        });

        toast.success("Agendamento atualizado com sucesso!");

        onOpenChange(false);
        
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Editar Agendamento</h2>
                    <div onClick={() => onOpenChange(false)} className={style.btnFechar}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cliente">
                                Cliente <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cliente"
                                value={formData.cliente}
                                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                placeholder="Nome do cliente"
                                className={errors.cliente ? "border-red-500" : ""}
                            />
                            {errors.cliente && (
                                <span className="text-red-500 text-sm">{errors.cliente}</span>
                            )}
                        </div>
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="servico">
                            Serviço <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            key={`servico-${agendamento?.id}-${formData.servico}`}
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
                        <Label htmlFor="status">
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            key={`status-${agendamento?.id}-${formData.status}`}
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className={style.servicos}>
                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <span className="text-red-500 text-sm">{errors.status}</span>
                        )}
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
                        {onDelete && (
                            <Button
                                variant="outline"
                                onClick={onDelete}
                                className="btnExcluir"
                            >
                                Excluir
                            </Button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit} className={style.botao}>
                                Salvar Alterações
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}