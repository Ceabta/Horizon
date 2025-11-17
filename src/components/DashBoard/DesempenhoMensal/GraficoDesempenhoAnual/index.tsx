import { useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GraficoDesempenhoAnualProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientes: any[];
    ordensServico: any[];
}

export function GraficoDesempenhoAnual({
    open,
    onOpenChange,
    clientes,
    ordensServico
}: GraficoDesempenhoAnualProps) {
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    if (!open) return null;

    const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const dadosGrafico = meses.map((mes, index) => {
        const mesNumero = index + 1;
        
        const clientesMes = clientes.filter(cliente => {
            if (!cliente.created_at) return false;
            const data = new Date(cliente.created_at);
            return data.getFullYear() === anoSelecionado && data.getMonth() === index;
        }).length;

        const osMes = ordensServico.filter(os => {
            if (!os.agendamento?.data || os.status !== 'Concluída') return false;
            const data = new Date(os.agendamento.data);
            return data.getFullYear() === anoSelecionado && data.getMonth() === index;
        }).length;

        const valorMes = ordensServico
            .filter(os => {
                if (!os.agendamento?.data) return false;
                const data = new Date(os.agendamento.data);
                return data.getFullYear() === anoSelecionado && data.getMonth() === index;
            })
            .reduce((acc, os) => acc + (os.valor || 0), 0);

        return {
            mes,
            clientes: clientesMes,
            os: osMes,
            valor: valorMes
        };
    });

    const anosDisponiveis = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onOpenChange(false);
            }}
        >
            <div
                className="rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-auto"
                style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)'
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="w-6 h-6" style={{ color: 'var(--chart-3)' }} />
                        <h2 className="text-2xl font-bold">Desempenho Anual</h2>
                        
                        <select
                            value={anoSelecionado}
                            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                            className="ml-4 px-2 py-1 rounded-md border"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)'
                            }}
                        >
                            {anosDisponiveis.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                    </div>

                    <X className="cursor-pointer w-6 h-6 text-red-500" onClick={() => onOpenChange(false)}/>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Faturamento por Mês (R$)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="mes" stroke="var(--muted-foreground)" />
                                <YAxis stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="valor"
                                    stroke="rgb(22, 163, 74)"
                                    strokeWidth={2}
                                    name="Faturamento"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">OS Concluídas por Mês</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="mes" stroke="var(--muted-foreground)" />
                                <YAxis stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="os"
                                    stroke="rgb(147, 51, 234)"
                                    strokeWidth={2}
                                    name="OS Concluídas"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>                    

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Novos Clientes por Mês</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="mes" stroke="var(--muted-foreground)" />
                                <YAxis stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="clientes"
                                    stroke="rgb(37, 99, 235)"
                                    strokeWidth={2}
                                    name="Clientes"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}