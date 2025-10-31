import { X, Calendar, Wrench, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useAgendamentos } from "../../hooks/useAgendamentos";
import { Tag } from "../Tag";

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

    const agendamentosCliente = agendamentos.filter((ag) =>
        ag.cliente_id === cliente?.id
    );

    if (!open || !cliente) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="rounded-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-auto flex flex-col"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground)' }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Histórico de Agendamentos</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cliente: <span className="font-semibold text-foreground">{cliente.nome}</span>
                        </p>
                    </div>
                    <div onClick={() => onOpenChange(false)}>
                        <X className="text-red-500 hover:text-red-700 cursor-pointer" size={22} />
                    </div>
                </div>

                {agendamentosCliente.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
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
                                                        <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{agendamento.horario}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag status={agendamento.status}/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total de agendamentos:</span>
                        <span className="font-semibold text-foreground">{agendamentosCliente.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}