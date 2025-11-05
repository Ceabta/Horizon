import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useTheme } from "../../../hooks/theme-context";

interface AlertasDashboardProps {
  formattedDate: string;
  osPendentes: number;
}

export function AlertasDashboard({ formattedDate, osPendentes }: AlertasDashboardProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Alertas até:
          <span style={{ color: 'var(--chart-3)', fontWeight: 'bold' }}> {formattedDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {osPendentes > 0 ? (
            <div className="flex items-start gap-3 p-3 rounded-lg border" style={{ backgroundColor: "var(--card3-bg)", borderColor: "var(--card3-icon)" }}>
              <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: "var(--card3-icon)" }} />
              <div>
                <p className={`${theme === 'light' ? "text-orange-900" : "text-orange-100"}`}>
                  {osPendentes} OS {osPendentes === 1 ? 'pendente' : 'pendentes'} de conclusão
                </p>
                <p className="text-sm" style={{ color: "var(--card3-icon)" }}>
                  Requer atenção prioritária
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-semibold text-muted-foreground">
                ✅ Não há OS pendentes
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Todos os serviços estão em dia!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}