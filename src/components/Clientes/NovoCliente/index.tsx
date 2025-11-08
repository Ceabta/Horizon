import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { X } from "lucide-react";
import style from './NovoCliente.module.css';
import { toast } from "sonner";

interface NovoClienteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

const initialFormData = {
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    status: "Ativo" as "Ativo" | "Inativo"
};

export function NovoCliente({
    open,
    onOpenChange,
    onSubmit
}: NovoClienteProps) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
        if (!open) {
            setFormData(initialFormData);
            setErrors({});
        }
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

        onSubmit(formData);
        toast.success("Cliente cadastrado com sucesso!");
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
                    <h2 className="text-xl font-bold">Novo Cliente</h2>
                    <div onClick={handleCancel} className={style.btnFechar}>
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

                    <div className="flex justify-end gap-3 mt-2">
                        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                        <Button onClick={handleSubmit} className={style.botao}>
                            Salvar Cliente
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}