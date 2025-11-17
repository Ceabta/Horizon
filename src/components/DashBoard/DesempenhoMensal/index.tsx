import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "../../ui/button";
import { GraficoDesempenhoAnual } from "./GraficoDesempenhoAnual";
import { TrendingUp, UserPlus, ArrowUp, ArrowDown } from "lucide-react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DesempenhoMensalProps {
    selectedDate: Date;
    percentualCliente: number;
    percentualOS: number;
    percentualValorOS: number;
    clientesMesAtual: number;
    clientesMesAnterior: number;
    OSMesAtual: number;
    OSMesAnterior: number;
    OSValorMesAtual: number;
    OSValorMesAnterior: number;
    clientes: any[];
    ordensServico: any[];
}

export function DesempenhoMensal({
    selectedDate,
    percentualCliente,
    percentualOS,
    percentualValorOS,
    clientesMesAtual,
    clientesMesAnterior,
    OSMesAtual,
    OSMesAnterior,
    OSValorMesAtual,
    OSValorMesAnterior,
    clientes,
    ordensServico
}: DesempenhoMensalProps) {
    const [graficoOpen, setGraficoOpen] = useState(false);

    const previousMonth = subMonths(selectedDate, 1);
    const formattedMonth = format(selectedDate, "MMMM", { locale: ptBR }).charAt(0).toUpperCase() + format(selectedDate, "MMMM", { locale: ptBR }).slice(1);
    const monthNamePrev = format(previousMonth, "MMMM", { locale: ptBR });
    const formattedPreviousMonth = monthNamePrev.charAt(0).toUpperCase() + monthNamePrev.slice(1);

    const diferencaClientes = clientesMesAtual - clientesMesAnterior;
    const diferencaOS = OSMesAtual - OSMesAnterior;
    const diferencaValor = OSValorMesAtual - OSValorMesAnterior;

    const isPositivoClientes = percentualCliente >= 0;
    const isPositivoOS = percentualOS >= 0;
    const isPositivoValor = percentualValorOS >= 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between ">
                    <CardTitle>
                        Desempenho de
                        <span style={{ color: 'var(--chart-3)', fontWeight: 'bold' }}> {formattedMonth} </span>
                        em relação a
                        <span style={{ color: 'var(--chart-3)', fontWeight: 'bold' }}> {formattedPreviousMonth} </span>
                    </CardTitle>
                    <Button
                        className="botao"
                        onClick={() => setGraficoOpen(true)}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Ver Gráfico Anual
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                                <th className="text-left py-3 px-2 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    Métrica
                                </th>
                                <th className="text-center py-3 px-2 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    {formattedMonth}
                                </th>
                                <th className="text-center py-3 px-2 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    {formattedPreviousMonth}
                                </th>
                                <th className="text-right py-3 px-2 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    Variação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-muted/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillTrendUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                                                Valores Recebidos
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                                Ganhos de OS
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                                        R$ {OSValorMesAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>
                                        R$ {OSValorMesAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="text-right py-4 px-2">
                                    <div className="flex items-center justify-end gap-2">
                                        {isPositivoValor ? (
                                            <ArrowUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                        <div className="text-right">
                                            <span className={`font-bold text-lg ${isPositivoValor ? "text-green-600" : "text-red-500"}`}>
                                                {isPositivoValor ? '+' : ''}{percentualValorOS}%
                                            </span>
                                            <p className={`text-xs ${isPositivoValor ? "text-green-600" : "text-red-500"}`}>
                                                ({isPositivoValor ? '+' : ''}R$ {Math.abs(diferencaValor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr className="border-b hover:bg-muted/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                                                Taxa de Conclusão
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                                OS finalizadas
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                                        {OSMesAtual}
                                    </span>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>
                                        {OSMesAnterior}
                                    </span>
                                </td>
                                <td className="text-right py-4 px-2">
                                    <div className="flex items-center justify-end gap-2">
                                        {isPositivoOS ? (
                                            <ArrowUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                        <div className="text-right">
                                            <span className={`font-bold text-lg ${isPositivoOS ? "text-green-600" : "text-red-500"}`}>
                                                {isPositivoOS ? '+' : ''}{percentualOS}%
                                            </span>
                                            <p className={`text-xs ${isPositivoOS ? "text-green-600" : "text-red-500"}`}>
                                                ({isPositivoOS ? '+' : ''}{diferencaOS} OS)
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-muted/50 transition-colors">
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                                                Taxa de Clientes
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                                Clientes Novos
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
                                        {clientesMesAtual}
                                    </span>
                                </td>
                                <td className="text-center py-4 px-2">
                                    <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>
                                        {clientesMesAnterior}
                                    </span>
                                </td>
                                <td className="text-right py-4 px-2">
                                    <div className="flex items-center justify-end gap-2">
                                        {isPositivoClientes ? (
                                            <ArrowUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                        <div className="text-right">
                                            <span className={`font-bold text-lg ${isPositivoClientes ? "text-green-600" : "text-red-500"}`}>
                                                {isPositivoClientes ? '+' : ''}{percentualCliente}%
                                            </span>
                                            <p className={`text-xs ${isPositivoClientes ? "text-green-600" : "text-red-500"}`}>
                                                ({isPositivoClientes ? '+' : ''}{diferencaClientes} clientes)
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
            <GraficoDesempenhoAnual
                open={graficoOpen}
                onOpenChange={setGraficoOpen}
                clientes={clientes}
                ordensServico={ordensServico}
            />
        </Card>
    );
}