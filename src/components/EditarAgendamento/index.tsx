import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
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
        id: agendamento?.id || 0,
        cliente: agendamento?.cliente || "",
        servico: agendamento?.servico || "",
        data: agendamento?.data ? agendamento.data.toISOString().split('T')[0] : "",
        horario: agendamento?.horario || "",
        telefone: agendamento?.telefone || "",
        status: agendamento?.status || "Em Andamento",
        observacoes: agendamento?.observacoes || "",
    });

    useEffect(() => {
        if (agendamento) {
            setFormData({
                id: agendamento.id,
                cliente: agendamento.cliente,
                servico: agendamento.servico,
                data: agendamento.data ? agendamento.data.toISOString().split('T')[0] : "",
                horario: agendamento.horario,
                telefone: agendamento.telefone,
                status: agendamento.status,
                observacoes: agendamento.observacoes || "",
            });
        }
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

    const handleSubmit = () => {
        onSave(formData);
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
                            <Label htmlFor="cliente">Cliente</Label>
                            <Input
                                id="cliente"
                                value={formData.cliente}
                                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                placeholder="Nome do cliente"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="servico">Serviço</Label>
                        <Select
                            value={formData.servico}
                            onValueChange={(value: any) => setFormData({ ...formData, servico: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                            <SelectContent className={style.servicos}>
                                <SelectItem value="Manutenção Preventiva">Manutenção Preventiva</SelectItem>
                                <SelectItem value="Instalação de Sistema">Instalação de Sistema</SelectItem>
                                <SelectItem value="Reparo de Equipamento">Reparo de Equipamento</SelectItem>
                                <SelectItem value="Consultoria Técnica">Consultoria Técnica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="data">Data</Label>
                            <Input
                                id="data"
                                type="date"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="horario">Horário</Label>
                            <Input
                                id="horario"
                                type="time"
                                value={formData.horario}
                                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.servico}
                            onValueChange={(value: any) => setFormData({ ...formData, servico: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                            <SelectContent className={style.servicos}>
                                <SelectItem value="Manutenção Preventiva">Manutenção Preventiva</SelectItem>
                                <SelectItem value="Instalação de Sistema">Instalação de Sistema</SelectItem>
                                <SelectItem value="Reparo de Equipamento">Reparo de Equipamento</SelectItem>
                                <SelectItem value="Consultoria Técnica">Consultoria Técnica</SelectItem>
                            </SelectContent>
                        </Select>
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