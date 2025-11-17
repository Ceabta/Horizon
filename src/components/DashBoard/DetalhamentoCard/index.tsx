import { useEffect } from "react";
import { ModalBase } from "../../Formulario/ModalBase";
import { Clock, Phone, FileUser } from "lucide-react";
import { formatarData } from "../../../utils/formatarData";
import { getStatusColor } from "../../../utils/getStatusColor";
import { Card, CardContent } from "../../ui/card";
import { Tag } from "../../Tag";

interface DetalhamentoCardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    titulo: string;
    dados: any[];
}

export function DetalhamentoCard({
    open,
    onOpenChange,
    titulo,
    dados
}: DetalhamentoCardProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [open]);

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
            title={titulo}
            maxHeight="90vh"
        >
            <Card className="overflow-y-auto p-2" style={{ maxHeight: '60vh' }}>
                <CardContent className={`flex-1 overflow-y-auto p-4`}>
                    {dados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-lg font-semibold text-muted-foreground mb-2">
                                Nenhum dado encontrado
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Não há registros para exibir nesta categoria
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dados.map((dado) => {
                                const isCliente = titulo === "Clientes Ativos";
                                const isOS = titulo === "OS Pendentes";
                                const isAgendamento = titulo === "Agendamentos Hoje" || titulo === "Agendamentos Em Andamento";

                                const colors = getStatusColor(dado.status);

                                return (
                                    <div
                                        key={dado.id}
                                        className="itemAgendamento"
                                        style={{
                                            borderLeft: `4px solid ${colors.borderLeft}`,
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 4px 12px ${colors.borderLeft}66`;
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                                    {isCliente ? dado.nome : isOS ? dado.nome : dado.cliente}
                                                </h4>
                                                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                                    {isCliente ? dado.email : isOS ? (dado.agendamento?.cliente || "Cliente não informado") : dado.servico}
                                                </p>
                                            </div>
                                            <Tag status={dado.status} />
                                        </div>

                                        <div className="flex flex-col gap-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                            {isCliente && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{dado.telefone}</span>
                                                </div>
                                            )}

                                            {isOS && (
                                                <div className="flex items-center gap-2">
                                                    <FileUser className="w-4 h-4" />
                                                    <span>Valor: R$ {dado.valor?.toFixed(2).replace('.', ',')}</span>
                                                </div>
                                            )}

                                            {isAgendamento && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{formatarData(dado.data)} às {dado.horario}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{dado.telefone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileUser className="w-4 h-4" />
                                                        OS Gerada?:
                                                        {dado.os_gerada === true ? (
                                                            <span className="font-medium text-green-600">Sim</span>
                                                        ) : (
                                                            <span className="font-medium text-red-600">Não</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </ModalBase>
    );
}