import { useState } from "react";
import { Calendar, Users, FileText, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { AgendamentosDashboard } from "../../components/DashBoard/AgendamentosDashboard";
import { TituloPagina } from "../../components/TituloPagina";
import { useAgendamentos } from "../../hooks/useAgendamentos";
import { useClientes } from "../../hooks/useClientes";
import { useNavigate } from "react-router-dom";
import { useOrdemServico } from "../../hooks/useOrdemServico";
import style from './Dashboard.module.css';
import { DetalhamentoCard } from "../../components/DashBoard/DetalhamentoCard";
import { obterDataLocal } from "../../utils/formatarData";

export function Dashboard() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<any>(null);

  const { agendamentos, loading: loadingAgendamentos } = useAgendamentos();
  const { clientes, loading: loadingClientes } = useClientes();
  const { ordensServico, loading: loadingOS } = useOrdemServico();

  const hoje = obterDataLocal(new Date());
  const agendamentosHoje = agendamentos.filter(ag => ag.data === hoje);
  const clientesAtivos = clientes.filter(cliente => cliente.status === 'Ativo');
  const osPendentes = ordensServico.filter(os => os.status === 'Pendente');
  const agendamentoEmAndamento = agendamentos.filter(ag => ag.status === 'Em Andamento');

  const totalAgendamentosHoje = agendamentosHoje.length;
  const totalClientesAtivos = clientesAtivos.length;
  const totalOsPendentes = osPendentes.length;
  const totalEmAndamento = agendamentoEmAndamento.length;

  const stats = [
    {
      title: "Agendamentos Hoje",
      data: agendamentosHoje,
      value: totalAgendamentosHoje.toString(),
      icon: Calendar,
      color: "--card1-icon",
      bgColor: "--card1-bg",
    },
    {
      title: "Clientes Ativos",
      data: clientesAtivos,
      value: totalClientesAtivos.toString(),
      icon: Users,
      color: "--card2-icon",
      bgColor: "--card2-bg",
    },
    {
      title: "OS Pendentes",
      data: osPendentes,
      value: totalOsPendentes.toString(),
      icon: FileText,
      color: "--card3-icon",
      bgColor: "--card3-bg",
    },
    {
      title: "Agendamentos Em Andamento",
      data: agendamentoEmAndamento,
      value: totalEmAndamento.toString(),
      icon: Clock,
      color: "--card4-icon",
      bgColor: "--card4-bg",
    },
  ];

  if (loadingAgendamentos || loadingClientes || loadingOS) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TituloPagina
        titulo="Dashboard"
        subtitulo="Bem-vindo ao Horizon - Sistema de Gestão de Atendimentos"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={style.cardContainer}
            onClick={() => {
              setSelectedStat(stat);
              setDialogOpen(true);
            }}
          >
            <CardContent className={style.card_conteudo}>
              <div className={style.card_icone_container}>
                <div className={`${style.card_icone}`} style={{ backgroundColor: `var(${stat.bgColor})` }}>
                  <stat.icon className="w-6 h-6" style={{ color: `var(${stat.color})` }} />
                </div>
              </div>
              <div className={style.card_info}>
                <p className={style.card_texto}>{stat.title}</p>
                <h2 className={style.card_valor}>{stat.value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DetalhamentoCard
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        titulo={selectedStat?.title || ""}
        dados={selectedStat?.data || []}
      />

      <AgendamentosDashboard
        onVerTodos={() => navigate("/agendamentos")}
      />
    </div>
  );
}