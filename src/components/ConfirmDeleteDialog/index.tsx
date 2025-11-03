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
    servico?: string;
    data?: string;
    horario?: string;
    tipo?: string;
    agendamentosPendentes?: number;
    osPendentes?: number;
    osNome?: string;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    clienteName,
    servico,
    data,
    horario,
    tipo,
    agendamentosPendentes = 0,
    osPendentes = 0,
    osNome,
}: ConfirmDeleteDialogProps) {

    function renderDetalhes() {
        switch (tipo) {
            case "agendamento":
                return (
                    <>
                        <p className="mt-2">🔧 Serviço: {servico}</p>
                        <p className="mt-1">📅 {data || "Data Indisponível"} às {horario}</p>
                    </>
                );

            case "OS":
                return (
                    <>
                        <p className="mt-2">🔧 Serviço: {servico}</p>
                        <p className="mt-1">
                            📄 OS: {osNome}
                            <span className="font-semibold">
                                {" "}
                                {osPendentes !== 0 && <span className="text-red-500"> *</span>}
                            </span>
                        </p>
                    </>
                );

            case "cliente":
            default:
                return (
                    <>
                        <p className="mt-2">
                            📅 Agendamentos pendentes:
                            <span className="font-semibold">
                                {" "}
                                {agendamentosPendentes}
                                {agendamentosPendentes !== 0 && <span className="text-red-500"> *</span>}
                            </span>
                        </p>
                        <p>
                            📋 OS pendentes:
                            <span className="font-semibold">
                                {" "}
                                {osPendentes}
                                {osPendentes !== 0 && <span className="text-red-500"> *</span>}
                            </span>
                        </p>
                    </>
                );
        }
    }


    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent style={{ backgroundColor: "var(--background)", border: "1px solid red" }}>
                <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            <p>Tem certeza que deseja excluir este(a) {tipo}?</p>
                            <hr className="mt-2" />
                            <div className="p-3 rounded-md bg-muted">
                                <p className="font-semibold">Cliente: {clienteName}</p>
                                {renderDetalhes()}
                            </div>
                            <hr className="mt-2" />
                            <p className="mt-2 text-destructive font-medium">
                                Esta ação não poderá ser desfeita!
                            </p>
                            {(agendamentosPendentes !== 0 || osPendentes !== 0) &&
                                <span className="text-red-500 text-xs font-semibold">
                                    {tipo === "cliente" ? (
                                        "* Finalize ou exclua o(s) agendamento(s) e/ou OS pendente(s) para excluir!"
                                    ):(
                                        "* Finalize ou cancele a OS pendente para excluir!"
                                    )}
                                </span>
                            }
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-between gap-3 mt-2 w-1/1">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirm}
                            className="btnExcluir"
                            disabled={(tipo === "cliente" || tipo === "OS") && (agendamentosPendentes > 0 || osPendentes > 0)}
                        >
                            Excluir
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}