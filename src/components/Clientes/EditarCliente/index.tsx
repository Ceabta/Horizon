import { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { ModalBase } from "../../Formulario/ModalBase";
import style from '../NovoCliente/NovoCliente.module.css';

interface EditarClienteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cliente: any;
    onSave: (data: any) => void;
}

export function EditarCliente({
    open,
    onOpenChange,
    cliente,
    onSave
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
    const [isSaving, setIsSaving] = useState(false);
    const [originalData, setOriginalData] = useState({
        id: 0,
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        status: "Ativo" as "Ativo" | "Inativo"
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (cliente) {
            const initialData = {
                id: cliente.id,
                nome: cliente.nome || "",
                email: cliente.email || "",
                telefone: cliente.telefone || "",
                endereco: cliente.endereco || "",
                status: cliente.status || "Ativo"
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
        setErrors({});
    }, [cliente]);

    useEffect(() => {
        const dataChanged =
            formData.nome !== originalData.nome ||
            formData.email !== originalData.email ||
            formData.telefone !== originalData.telefone ||
            formData.endereco !== originalData.endereco ||
            formData.status !== originalData.status;

        setHasChanges(dataChanged);
    }, [formData, originalData]);

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setErrors({});
        toast.info("Alterações descartadas");
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
            title="Editar Cliente"
            onSave={handleSubmit}
            onCancel={handleCancel}
            isSaving={isSaving}
            hasChanges={hasChanges}
            saveLabel="Salvar Alterações"
            showStatus={true}
            statusValue={formData.status}
            onStatusChange={(value: any) => setFormData({ ...formData, status: value })}
            statusOptions={[
                { value: "Ativo", label: "Ativo" },
                { value: "Inativo", label: "Inativo" },
            ]}
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
        </ModalBase >
    );
}