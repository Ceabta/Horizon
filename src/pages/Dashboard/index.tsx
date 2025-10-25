import { Calendar, Users, FileText, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import type { Page } from "../../App";
import { AgendamentosDashboard } from "../../components/AgendamentosDashboard";
import style from './Dashboard.module.css';
import { TituloPagina } from "../../components/TituloPagina";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: Calendar,
      color: "--card1-icon",
      bgColor: "--card1-bg",
    },
    {
      title: "Clientes Ativos",
      value: "248",
      icon: Users,
      color: "--card2-icon",
      bgColor: "--card2-bg",
    },
    {
      title: "OS Pendentes",
      value: "8",
      icon: FileText,
      color: "--card3-icon",
      bgColor: "--card3-bg",
    },
    {
      title: "Atendimentos em Andamento",
      value: "3",
      icon: Clock,
      color: "--card4-icon",
      bgColor: "--card4-bg",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <TituloPagina 
          titulo="Dashboard"
          subtitulo="Bem-vindo ao Horizon - Sistema de Gestão de Atendimentos"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className={style.cardContainer}>
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

      <AgendamentosDashboard 
        onVerTodos={() => onNavigate("agendamentos")}
      />
      
    </div>
  );
}