import { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { Acoes } from "../../Formulario/Acoes";
import style from './NovoCliente.module.css';
import { ModalBase } from "../../Formulario/ModalBase";

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSaving(false);
            toast.success("Cliente cadastrado com sucesso!");
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setErrors({});
        onOpenChange(false);
    };

    const handleOverlayClick = (open: boolean) => {
        if (!open) {
            onOpenChange(false);
        } else {
            onOpenChange(open);
        }
    };

    if (!open) return null;

    return (
        <ModalBase
            open={open}
            onOpenChange={handleOverlayClick}
            title="Novo Cliente"
            onSave={handleSubmit}
            onCancel={handleCancel}
            isSaving={isSaving}
            saveLabel="Salvar"
            maxHeight="90vh"
        >

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
            </div>
        </ModalBase>
    );
}