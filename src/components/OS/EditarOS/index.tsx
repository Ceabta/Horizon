import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Paperclip, Trash2, X } from "lucide-react";
import style from '../NovaOS/NovaOS.module.css';
import { toast } from "sonner";
import { FaRegFilePdf } from "react-icons/fa6";

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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [removePDF, setRemovePDF] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (ordemServico) {
            setFormData({
                id: ordemServico.id,
                nome: ordemServico.nome || "",
                descricao: ordemServico.descricao || "",
                valor: ordemServico.valor || 0,
                status: ordemServico.status || "Pendente"
            });
            setSelectedFile(null);
            setRemovePDF(false);
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

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await onSave({
                ...formData,
                pdfFile: selectedFile,
                removePDF: removePDF
            });
        } finally {
            setIsSaving(false);
        }
    };


    const handleRemovePDF = () => {
        setRemovePDF(true);
        setSelectedFile(null);
        toast.info("PDF será removido ao salvar");
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

                    <div className="space-y-2">
                        <Label>PDF Anexado</Label>

                        {ordemServico.pdf_url && !removePDF && !selectedFile && (
                            <div className="flex items-center gap-4 p-3 bg-muted rounded-md border">
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm flex-1">Documento atual</span>
                                <Button
                                    className="botao"
                                    onClick={() => window.open(ordemServico.pdf_url, '_blank')}
                                >
                                    <FaRegFilePdf className="w-4 h-4" />
                                    Ver
                                </Button>
                                <div className="w-0.5 self-stretch bg-gray-500" />
                                <Button
                                    className="btnExcluir"
                                    onClick={handleRemovePDF}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Input
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
                                        setRemovePDF(false);
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

                        {removePDF && (
                            <p className="text-sm text-red-500">PDF será removido ao salvar</p>
                        )}
                    </div>

                    <div className="flex justify-between gap-3 mt-6">
                        <Button variant="outline" onClick={() => onBack ? onBack() : onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={style.botao}
                            disabled={isSaving}
                        >
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}