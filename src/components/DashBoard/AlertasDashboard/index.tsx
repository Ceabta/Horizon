import { useState } from "react";
import { Calendar, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useTheme } from "../../../hooks/theme-context";
import { DetalhamentoCard } from "../DetalhamentoCard";

interface AlertasDashboardProps {
  agendamentos: any[];
  ordensServico: any[];
}

export function AlertasDashboard({
  agendamentos,
  ordensServico
}: AlertasDashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const { theme } = useTheme();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const osValorAltoBruto = ordensServico.filter(os =>
    os.valor >= 1000 && os.status === 'Pendente'
  );

  const agendamentosSemOSBruto = agendamentos.filter(ag =>
    ag.status === 'Concluído' && !ag.os_gerada
  );

  const osValorAlto = ordensServico.filter(os =>
    os.valor >= 1000 && os.status === 'Pendente'
  ).length;

  const agendamentosSemOS = agendamentos.filter(ag =>
    ag.status === 'Concluído' && !ag.os_gerada
  ).length;

  const alertas = [
    {
      condicao: agendamentosSemOS > 0,
      icone: Calendar,
      cor: "card4",
      titulo: `${agendamentosSemOS} ${agendamentosSemOS === 1 ? 'agendamento concluído' : 'agendamentos concluídos'} sem OS`,
      subtitulo: "Gere as ordens de serviço",
      quantidade: agendamentosSemOS,
      dados: agendamentosSemOSBruto,
      tipo: "Agendamento",
    },
    {
      condicao: osValorAlto > 0,
      icone: FileWarning,
      cor: "card3",
      titulo: `${osValorAlto} OS de alto valor ${osValorAlto === 1 ? 'pendente' : 'pendentes'} (a partir de R$ 1000)`,
      subtitulo: "Priorize a conclusão",
      quantidade: osValorAlto,
      dados: osValorAltoBruto,
      tipo: "OS",
    }
  ];

  const alertasAtivos = alertas.filter(alerta => alerta.condicao);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Alertas e Notificações
          </CardTitle>
          {alertasAtivos.length > 0 && (
            <span
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: 'var(--chart-3)',
                color: 'white'
              }}
            >
              {alertasAtivos.length} {alertasAtivos.length === 1 ? 'alerta' : 'alertas'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {alertasAtivos.length > 0 ? (
            alertasAtivos.map((alerta, index) => {
              const Icone = alerta.icone;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: `var(--${alerta.cor}-bg)`,
                    borderColor: `var(--${alerta.cor}-icon)`
                  }}
                  onClick={() => {
                    setSelectedAlert(alerta);
                    setDialogOpen(true);
                  }}
                >
                  <Icone
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: `var(--${alerta.cor}-icon)` }}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${theme === 'light' ? "text-gray-900" : "text-gray-100"}`}
                    >
                      {alerta.titulo}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: `var(--${alerta.cor}-icon)` }}
                    >
                      {alerta.subtitulo}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <p className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                Tudo em ordem!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Não há alertas ou pendências no momento
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <DetalhamentoCard
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        titulo={selectedAlert?.titulo || ""}
        dados={selectedAlert?.dados || []}
        tipo={selectedAlert?.tipo || ""}
      />
    </Card>
  );
}