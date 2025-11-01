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
    tipo?: string;
    agendamentosPendentes?: number;
    osPendentes?: number;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    clienteName,
    servico,
    data,
    horario,
    tipo = "agendamento",
    agendamentosPendentes = 0,
    osPendentes = 0,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent style={{ backgroundColor: "var(--background)", border: "1px solid red" }}>
                <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            <p>Tem certeza que deseja excluir este {tipo}?</p>
                            <div className="mt-4 p-3 rounded-md bg-muted">
                                <p className="font-semibold">Cliente: {clienteName}</p>
                                {tipo === "agendamento" ? (
                                    <>
                                        <p>Serviço: {servico}</p>
                                        <p className="mt-1">
                                            📅 {data || 'Data Indisponível'} às {horario}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mt-2">📅 Agendamentos pendentes: 
                                            <span className="font-semibold"> {agendamentosPendentes}
                                                {agendamentosPendentes !== 0 && <span className="text-red-500"> *</span>}
                                            </span>
                                        </p>
                                        <p>📋 OS pendentes: 
                                            <span className="font-semibold"> {osPendentes}
                                                {osPendentes !== 0 && <span className="text-red-500"> *</span>}
                                            </span>
                                        </p>
                                    </>
                                )}
                            </div>
                            <p className="mt-4 text-destructive font-medium">
                                Esta ação não poderá ser desfeita!
                            </p>
                            {agendamentosPendentes !== 0 && <span className="text-red-500 text-xs font-semibold">* Finalize os agendamentos e/ou OS pendentes para excluir o cliente!</span>}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-between gap-3 mt-2 w-1/1">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirm}
                            className="btnExcluir"
                            disabled={tipo === "cliente" && (agendamentosPendentes > 0 || osPendentes > 0)}
                        >
                            Excluir
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}