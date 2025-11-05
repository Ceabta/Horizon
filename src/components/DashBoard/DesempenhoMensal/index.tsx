import { TrendingUp, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DesempenhoMensalProps {
    selectedDate: Date;
    clientesMesAtual: number;
    clientesMesAnterior: number;
    percentualMudanca: number;
}

export function DesempenhoMensal({
    selectedDate,
    clientesMesAtual,
    clientesMesAnterior,
    percentualMudanca
}: DesempenhoMensalProps) {
    const previousMonth = subMonths(selectedDate, 1);
    const formattedMonth = format(selectedDate, "MMMM", { locale: ptBR }).charAt(0).toUpperCase() + format(selectedDate, "MMMM", { locale: ptBR }).slice(1);
    const monthNamePrev = format(previousMonth, "MMMM", { locale: ptBR });
    const formattedPreviousMonth = monthNamePrev.charAt(0).toUpperCase() + monthNamePrev.slice(1);
    const isPositivo = percentualMudanca >= 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Desempenho de
                    <span style={{ color: 'var(--chart-3)', fontWeight: 'bold' }}> {formattedMonth} </span>
                    em relação a
                    <span style={{ color: 'var(--chart-3)', fontWeight: 'bold' }}> {formattedPreviousMonth} </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-10">
                    <div className="flex items-center justify-between pt-5">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                                <p style={{ color: 'var(--foreground)' }}>Taxa de Conclusão</p>
                                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    Atendimentos finalizados
                                </p>
                            </div>
                        </div>
                        <span className="text-green-600"><b>92%</b></span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserPlus className="w-5 h-5 text-blue-500" />
                            <div>
                                <p style={{ color: 'var(--foreground)' }}>Taxa de Clientes</p>
                                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    Clientes Novos
                                </p>
                            </div>
                        </div>
                        <span className={isPositivo ? "text-blue-500" : "text-red-500"}>
                            <b>{isPositivo ? '+' : ''}{percentualMudanca}%</b>
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}