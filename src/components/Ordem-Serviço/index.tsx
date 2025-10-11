import { useState } from "react";
import { Plus, Search, Download, Eye, FileText, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
// import { toast } from "sonner@2.0.3";

interface OS {
  id: number;
  numero: string;
  cliente: string;
  servico: string;
  data: Date;
  status: "Pendente" | "Em Andamento" | "Concluída" | "Cancelada";
  valor: number;
  tecnico: string;
  descricao: string;
}

export function OrdemServico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOS, setPreviewOS] = useState<OS | null>(null);
  const [formData, setFormData] = useState({
    cliente: "",
    servico: "",
    tecnico: "",
    descricao: "",
    valor: "",
  });

  const [ordens] = useState<OS[]>([
    {
      id: 1,
      numero: "OS-2025-001",
      cliente: "Maria Silva",
      servico: "Manutenção Preventiva",
      data: new Date(2025, 9, 8),
      status: "Concluída",
      valor: 350.00,
      tecnico: "Roberto Almeida",
      descricao: "Manutenção preventiva completa do sistema de climatização",
    },
    {
      id: 2,
      numero: "OS-2025-002",
      cliente: "João Santos",
      servico: "Instalação de Sistema",
      data: new Date(2025, 9, 9),
      status: "Em Andamento",
      valor: 1250.00,
      tecnico: "Fernando Costa",
      descricao: "Instalação de novo sistema de segurança com câmeras",
    },
    {
      id: 3,
      numero: "OS-2025-003",
      cliente: "Ana Costa",
      servico: "Reparo de Equipamento",
      data: new Date(2025, 9, 10),
      status: "Pendente",
      valor: 450.00,
      tecnico: "Ricardo Silva",
      descricao: "Reparo de equipamento de automação industrial",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "default";
      case "Em Andamento":
        return "default";
      case "Pendente":
        return "secondary";
      case "Cancelada":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredOrdens = ordens.filter((os) =>
    os.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // toast.success("Ordem de Serviço gerada com sucesso!");
    setDialogOpen(false);
    setFormData({
      cliente: "",
      servico: "",
      tecnico: "",
      descricao: "",
      valor: "",
    });
  };

  const handlePrint = (os: OS) => {
    // toast.success(`OS ${os.numero} enviada para impressão`);
  };

  const handleDownload = (os: OS) => {
    // toast.success(`OS ${os.numero} baixada com sucesso`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Ordem de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as ordens de serviço</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={formData.cliente}
                  onValueChange={(value: any) => setFormData({ ...formData, cliente: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">Maria Silva</SelectItem>
                    <SelectItem value="joao">João Santos</SelectItem>
                    <SelectItem value="ana">Ana Costa</SelectItem>
                    <SelectItem value="carlos">Carlos Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servico">Tipo de Serviço</Label>
                  <Select
                    value={formData.servico}
                    onValueChange={(value: any) => setFormData({ ...formData, servico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manutencao">Manutenção Preventiva</SelectItem>
                      <SelectItem value="instalacao">Instalação de Sistema</SelectItem>
                      <SelectItem value="reparo">Reparo de Equipamento</SelectItem>
                      <SelectItem value="consultoria">Consultoria Técnica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tecnico">Técnico Responsável</Label>
                  <Select
                    value={formData.tecnico}
                    onValueChange={(value: any) => setFormData({ ...formData, tecnico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roberto">Roberto Almeida</SelectItem>
                      <SelectItem value="fernando">Fernando Costa</SelectItem>
                      <SelectItem value="ricardo">Ricardo Silva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Serviço</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva detalhadamente o serviço a ser realizado"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Estimado (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Gerar OS</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Ordens de Serviço</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrdens.map((os) => (
              <div
                key={os.id}
                className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{os.numero}</h4>
                      <Badge variant={getStatusColor(os.status)}>{os.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">{os.cliente}</p>
                    <p className="text-muted-foreground text-sm">{os.servico}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">
                      R$ {os.valor.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {os.data.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewOS(os)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(os)}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(os)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewOS} onOpenChange={() => setPreviewOS(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visualização da Ordem de Serviço</DialogTitle>
          </DialogHeader>
          {previewOS && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    <div>
                      <h3>{previewOS.numero}</h3>
                      <p className="text-muted-foreground text-sm">
                        {previewOS.data.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(previewOS.status)} className="text-sm">
                    {previewOS.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p>{previewOS.cliente}</p>
                </div>
                <div>
                  <Label>Técnico Responsável</Label>
                  <p>{previewOS.tecnico}</p>
                </div>
              </div>

              <div>
                <Label>Tipo de Serviço</Label>
                <p>{previewOS.servico}</p>
              </div>

              <div>
                <Label>Descrição</Label>
                <p className="text-muted-foreground">{previewOS.descricao}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label>Valor Total</Label>
                <p className="text-green-600">
                  R$ {previewOS.valor.toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setPreviewOS(null)}>
                  Fechar
                </Button>
                <Button onClick={() => handlePrint(previewOS)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
