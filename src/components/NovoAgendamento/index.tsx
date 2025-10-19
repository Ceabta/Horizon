import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import style from './NovoAgendamento.module.css';

interface NovoAgendamentoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: () => void;
}

export function NovoAgendamento({
    open,
    onOpenChange,
    formData,
    setFormData,
    onSubmit
}: NovoAgendamentoProps) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Novo Agendamento</h2>
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
                                <SelectItem value="manutencao">Manutenção Preventiva</SelectItem>
                                <SelectItem value="instalacao">Instalação de Sistema</SelectItem>
                                <SelectItem value="reparo">Reparo de Equipamento</SelectItem>
                                <SelectItem value="consultoria">Consultoria Técnica</SelectItem>
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
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Informações adicionais sobre o agendamento"
                            rows={3}
                            className={`${style.textareaCustom} resize-none`}
                            style={{ height: '80px', overflow: 'auto'}}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button onClick={onSubmit} className={style.botao}>
                            Salvar Agendamento
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
