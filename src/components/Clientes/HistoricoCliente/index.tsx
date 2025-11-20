import { useEffect, useState } from "react";
import { Calendar, Wrench, Clock, FileText, CalendarOff } from "lucide-react";
import { CiFileOff } from "react-icons/ci";
import { Card, CardContent } from "../../ui/card";
import { useAgendamentos } from "../../../hooks/useAgendamentos";
import { useOrdemServico } from "../../../hooks/useOrdemServico";
import { Tag } from "../../Tag";
import { formatarData } from "../../../utils/formatarData";
import { ModalBase } from "../../Formulario/ModalBase";
import type {Cliente} from "../../../types"
import style from "./HistoricoCliente.module.css";

interface HistoricoClienteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cliente: Cliente;
}

type ViewType = "agendamentos" | "ordens";

export function HistoricoCliente({ open, onOpenChange, cliente }: HistoricoClienteProps) {
    const [activeView, setActiveView] = useState<ViewType>("agendamentos");
    const [isAnimating, setIsAnimating] = useState(false);
    const { agendamentos } = useAgendamentos();
    const { ordensServico } = useOrdemServico();

    const agendamentosCliente = agendamentos.filter((ag) => ag.cliente_id === cliente?.id);
    const ordensCliente = ordensServico.filter((os) => os.agendamento?.cliente === cliente?.nome);

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

    const handleViewChange = (newView: ViewType) => {
        if (newView === activeView || isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveView(newView);
            setTimeout(() => setIsAnimating(false), 300);
        }, 150);
    };

    const handleOverlayClick = (open: boolean) => {
        if (!open) {
            onOpenChange(false);
        } else {
            onOpenChange(open);
        }
    };

    if (!open || !cliente) return null;

    const currentData = activeView === "agendamentos" ? agendamentosCliente : ordensCliente;
    const currentTotal = currentData.length;

    return (
        <ModalBase
            open={open}
            onOpenChange={handleOverlayClick}
            title="Histórico do Cliente"
            showStatus={true}
            maxHeight="90vh"
        >
            <div className="mb-4 flex justify-center">
                <div
                    className="relative inline-flex p-1 rounded-lg"
                    style={{ backgroundColor: "var(--muted)" }}
                >
                    <div
                        className={`absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out ${style.switchIndicator}`}
                        style={{
                            left: activeView === "agendamentos" ? "4px" : "calc(50%)",
                            width: "calc(50% - 4px)",
                            backgroundColor: "var(--chart-3)"
                        }}
                    />

                    <button
                        onClick={() => handleViewChange("agendamentos")}
                        className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-300 cursor-pointer ${activeView === "agendamentos"
                            ? "text-white"
                            : ""
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Agendamentos
                        </div>
                    </button>

                    <button
                        onClick={() => handleViewChange("ordens")}
                        className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-300 cursor-pointer ${activeView === "ordens"
                            ? "text-white"
                            : ""
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Ordens de Serviço
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto space-y-3 pr-2 relative">
                <div
                    className={`${style.contentSlide} ${isAnimating ? style.slideOut : style.slideIn}`}
                >
                    {currentData.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-6">
                            {activeView === "agendamentos" ? (
                                <>
                                    <CalendarOff className="w-16 h-16 mb-4" />
                                    <p>Nenhum agendamento encontrado.</p>
                                </>
                            ) : (
                                <>
                                    <CiFileOff className="w-16 h-16 mb-4" />
                                    <p>Nenhuma ordem de serviço encontrada.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeView === "agendamentos"
                                ? agendamentosCliente.map((agendamento) => (
                                    <Card key={agendamento.id} className="transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3 flex-1">
                                                    <div className="mt-1">
                                                        <Wrench className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-base">
                                                            {agendamento.servico}
                                                        </h4>
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
                                                <Tag status={agendamento.status} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                                : ordensCliente.map((os) => (
                                    <Card key={os.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3 flex-1">
                                                    <div className="mt-1">
                                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-base">{os.nome}</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {os.agendamento?.servico}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{formatarData(os.agendamento.data)}</span>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold" style={{ color: "var(--chart-3)" }}>
                                                            R$ {os.valor?.toFixed(2).replace(".", ",")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Tag status={os.status} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Total de {activeView === "agendamentos" ? "agendamentos" : "ordens de serviço"}:
                    </span>
                    <span className="font-semibold text-foreground">{currentTotal}</span>
                </div>
            </div>
        </ModalBase>
    );
}