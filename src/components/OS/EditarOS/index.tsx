import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { X } from "lucide-react";
import style from '../NovaOS/NovaOS.module.css';

interface EditarOSProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ordemServico: any;
    onSave: (data: any) => void;
    onBack?: () => void;
}

export function EditarOS({
    open,
    onOpenChange,
    ordemServico,
    onSave,
    onBack
}: EditarOSProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nome: "",
        descricao: "",
        valor: 0,
        status: "Pendente" as "Pendente" | "Concluída" | "Cancelada"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (ordemServico) {
            setFormData({
                id: ordemServico.id,
                nome: ordemServico.nome || "",
                descricao: ordemServico.descricao || "",
                valor: ordemServico.valor || 0,
                status: ordemServico.status || "Pendente"
            });
        }
        setErrors({});
    }, [ordemServico]);

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
        if (!formData.valor || formData.valor <= 0) {
            newErrors.valor = "Valor deve ser maior que zero";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        onSave(formData);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Editar Ordem de Serviço</h2>
                    <div
                        onClick={() => onBack ? onBack() : onOpenChange(false)}
                        className={style.btnFechar}
                    >
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="valor">
                                Valor (R$) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                placeholder="0,00"
                                className={errors.valor ? "border-red-500" : ""}
                            />
                            {errors.valor && (
                                <span className="text-red-500 text-sm">{errors.valor}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                key={`status-${ordemServico?.id}-${formData.status}`}
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent className={style.servicos}>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Concluída">Concluída</SelectItem>
                                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-6">
                        <Button variant="outline" onClick={() => onBack ? onBack() : onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} className={style.botao}>
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}