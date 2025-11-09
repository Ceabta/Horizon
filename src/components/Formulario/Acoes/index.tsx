import { Save } from "lucide-react";
import { Button } from "../../ui/button";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

interface AcoesProps {
    showUndo?: boolean;
    onUndo?: () => void;
    onSave: () => void;
    isSaving?: boolean;
    saveLabel?: string;
    undoLabel?: string;
    className?: string;
}

export function Acoes({
    showUndo = false,
    onUndo,
    onSave,
    isSaving = false,
    saveLabel = "Salvar",
    undoLabel = "Desfazer alterações",
    className = ""
}: AcoesProps) {
    return (
        <div className={`flex gap-3 mt-2 ${showUndo ? 'justify-between': 'justify-end'} ${className}`}>
            {showUndo && onUndo && (
                <Button variant="outline" onClick={onUndo} className="transition-transform">
                    <MdOutlineSettingsBackupRestore className="w-4 h-4" />
                    {undoLabel}
                </Button>
            )}

            <Button onClick={onSave} className="botao" disabled={isSaving}>
                <Save />
                {isSaving ? "Salvando..." : saveLabel}
            </Button>
        </div>
    );
}