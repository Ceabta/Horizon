import { useEffect } from "react";
import { X, Calendar, Wrench, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useAgendamentos } from "../../hooks/useAgendamentos";
import { Tag } from "../Tag";
import { formatarData } from "../../utils/formatarData";

interface HistoricoClienteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cliente: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
    } | null;
}

export function HistoricoCliente({ open, onOpenChange, cliente }: HistoricoClienteProps) {
    const { agendamentos } = useAgendamentos();

    const agendamentosCliente = agendamentos.filter((ag) => ag.cliente_id === cliente?.id);

    useEffect(() => {
        if (!open) return;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const prevOverflow = document.body.style.overflow;
        const prevPaddingRight = document.body.style.paddingRight;

        document.body.style.overflow = "hidden";
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            document.body.style.overflow = prevOverflow || "";
            document.body.style.paddingRight = prevPaddingRight || "";
        };
    }, [open]);

    if (!open || !cliente) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="rounded-lg p-6 w-full max-w-3xl max-h-[85vh] flex flex-col"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--foreground)" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold">Histórico de Agendamentos</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cliente: <span className="font-semibold text-foreground">{cliente.nome}</span>
                        </p>
                    </div>
                    <button onClick={() => onOpenChange(false)} aria-label="Fechar">
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto space-y-3 pr-2">
                    {agendamentosCliente.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-6">
                            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Nenhum agendamento encontrado para este cliente.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {agendamentosCliente.map((agendamento) => (
                                <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3 flex-1">
                                                <div className="mt-1">
                                                    <Wrench className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-base">{agendamento.servico}</h4>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatarData(agendamento.data)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{agendamento.horario}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tag status={agendamento.status} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total de agendamentos:</span>
                        <span className="font-semibold text-foreground">{agendamentosCliente.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}