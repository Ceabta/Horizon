import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Acoes } from "../../Formulario/Acoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { getStatusColor } from "../../../utils/getStatusColor";
import { toast } from "sonner";

interface StatusOption {
    value: string;
    label: string;
}

interface ModalBaseProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;

    onSave?: () => void | Promise<void>;
    onCancel?: () => void;
    isSaving?: boolean;
    hasChanges?: boolean;
    saveLabel?: string;

    showStatus?: boolean;
    statusValue?: string;
    onStatusChange?: (value: string) => void;
    statusOptions?: StatusOption[];

    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    maxHeight?: string;
}

export function ModalBase({
    open,
    onOpenChange,
    title,
    children,
    onSave,
    onCancel,
    isSaving = false,
    hasChanges = false,
    saveLabel = "Salvar",
    showStatus = false,
    statusValue,
    onStatusChange,
    statusOptions = [],
    maxWidth = "2xl",
    maxHeight = "85vh"
}: ModalBaseProps) {

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

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            toast.info("Alterações descartadas");
        }
    };

    if (!open) return null;

    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl"
    }[maxWidth];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleOverlayClick}
        >
            <div
                className={`rounded-lg p-6 w-full ${maxWidthClass} overflow-auto flex flex-col`}
                style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--foreground)',
                    maxHeight: maxHeight
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">{title}</h2>

                        {showStatus && statusValue && onStatusChange && (
                            <div className="flex items-center gap-2">
                                <Select
                                    value={statusValue}
                                    onValueChange={onStatusChange}
                                >
                                    <SelectTrigger className="cursor-pointer w-auto h-auto border-0 px-3 py-1.5 rounded-full text-sm font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent style={{ backgroundColor: 'var(--background)' }}>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                                    style={{
                                                        backgroundColor: getStatusColor(option.value).bg,
                                                        color: getStatusColor(option.value).text
                                                    }}
                                                >
                                                    {option.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div onClick={() => onOpenChange(false)} className="btnFechar">
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                <div className="space-y-4">
                    {children}
                </div>

                {onSave && (
                    <div>
                        <Acoes
                            showUndo={hasChanges}
                            onUndo={handleCancel}
                            onSave={onSave}
                            isSaving={isSaving}
                            saveLabel={saveLabel}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}