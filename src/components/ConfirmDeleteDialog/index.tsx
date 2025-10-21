import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    clienteName: string;
    servico: string;
    data: string;
    horario: string;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    clienteName,
    servico,
    data,
    horario,
}: ConfirmDeleteDialogProps) {
    const formatarData = (dataString: string) => {
        if (!dataString) return '';
        return new Date(dataString).toLocaleDateString('pt-BR');
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent style={{ backgroundColor: "var(--background)", border: "1px solid red" }}>
                <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir este agendamento?
                        <div className="mt-4 p-3 rounded-md bg-muted">
                            <p className="font-semibold">Cliente: {clienteName}</p>
                            <p>Serviço: {servico}</p>
                            <p className="mt-1">
                                📅 {data ? formatarData(data) : 'Data Indisponível'} às {horario}
                            </p>
                        </div>
                        <p className="mt-4 text-destructive font-medium">
                            Esta ação não poderá ser desfeita!
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="btnExcluir"
                    >
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}