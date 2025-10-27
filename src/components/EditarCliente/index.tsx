import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import style from '../NovoAgendamento/NovoAgendamento.module.css';

interface EditarClienteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cliente: any;
    onSave: (data: any) => void;
    onDelete?: () => void;
}

export function EditarCliente({
    open,
    onOpenChange,
    cliente,
    onSave,
    onDelete
}: EditarClienteProps) {
    const [formData, setFormData] = useState({
        id: 0,
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        status: "Ativo" as "Ativo" | "Inativo"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (cliente) {
            setFormData({
                id: cliente.id,
                nome: cliente.nome || "",
                email: cliente.email || "",
                telefone: cliente.telefone || "",
                endereco: cliente.endereco || "",
                status: cliente.status || "Ativo"
            });
        }
        setErrors({});
    }, [cliente]);

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
            newErrors.nome = "Nome é obrigatório";
        }
        if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório";
        }
        if (!formData.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
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

        onSave(formData);
        toast.success("Cliente atualizado com sucesso!");
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto flex flex-col" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Editar Cliente</h2>
                    <div onClick={() => onOpenChange(false)} className={style.btnFechar}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">
                            Nome Completo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Nome do cliente"
                            className={errors.nome ? "border-red-500" : ""}
                        />
                        {errors.nome && (
                            <span className="text-red-500 text-sm">{errors.nome}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                            id="endereco"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            placeholder="Rua, número"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            key={`status-${cliente?.id}-${formData.status}`}
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className={style.servicos}>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
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