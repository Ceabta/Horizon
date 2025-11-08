import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TituloPagina } from "../../components/TituloPagina";
import { ListaOS } from "../../components/OS/ListaOS";
import { VisualizarOS } from "../../components/OS/VisualizarOS";
import { EditarOS } from "../../components/OS/EditarOS";
import { NovaOS } from "../../components/OS/NovaOS";
import type { OS } from "../../types";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { storageHelper } from "../../lib/storage";
import { useOrdemServico } from "../../hooks/useOrdemServico";
import { useAgendamentos } from "../../hooks/useAgendamentos";

export function OrdemServico() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [OSToDelete, setOSToDelete] = useState<OS | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS | null>(null);

  const { ordensServico, addOrdemServicoComPDF, deleteOrdemServico, updateOrdemServico } = useOrdemServico();
  const { agendamentos, nextAgendamentoNumberForCliente, refetch: refetchAgendamentos } = useAgendamentos();

  const handleSubmit = async (data: any) => {
    const { pdfFile, ...osData } = data;
    const result = await addOrdemServicoComPDF(osData, pdfFile);

    if (result.success) {
      setTimeout(() => {
        refetchAgendamentos();
      }, 300);
      setDialogOpen(false);
      toast.success(pdfFile ? "OS criada e PDF anexado com sucesso!" : "OS criada com sucesso!");
    } else {
      toast.error(result.error ?? "Erro ao criar OS");
    }
    return result;
  };

  const handleUpdate = async (data: any) => {
    const result = await updateOrdemServico(data);

    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setEditOpen(false);
      setSelectedOS(prev => ({ ...prev!, ...data }));
      toast.success("OS atualizada com sucesso!");
    } else {
      toast.error(`Erro ao atualizar OS: ${result.error}`);
    }
  };

  const handleDeleteClick = async (os: OS) => {
    setOSToDelete(os);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (OSToDelete) {
      await deleteOrdemServico(OSToDelete.id);
      setTimeout(() => {
        refetchAgendamentos();
      }, 300);
      setDeleteDialogOpen(false);
      setOSToDelete(null);
      setSelectedOS(null);
      toast.success("OS excluída com sucesso!");
    }
  };

  const handleView = (os: OS) => {
    setSelectedOS(os);
    setViewOpen(true);
  };

  const handleEditFromView = () => {
    setViewOpen(false);
    setEditOpen(true);
  };

  const handleBackToView = () => {
    setEditOpen(false);
    setViewOpen(true);
  };

  const handlePrint = (os: OS) => {
    toast.info("Funcionalidade de impressão em desenvolvimento");
  };

  const handleViewPDF = async (os: OS) => {
    if (!os.pdf_url) {
      toast.error("Esta OS não possui PDF anexado");
      return;
    }

    window.open(os.pdf_url, '_blank');
  };

  const handleDownloadPDF = async (os: OS) => {
    if (!os.pdf_url || !os.pdf_path) {
      toast.error("Esta OS não possui PDF anexado");
      return;
    }

    try {
      const result = await storageHelper.downloadPDF(os.pdf_path);

      if (result.success && result.blob) {
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${os.nome}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

      } else {
        toast.error("Erro ao baixar PDF");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao baixar PDF");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <TituloPagina
          titulo="Ordens de Serviço"
          subtitulo="Gerencie as OS dos clientes"
        >
          <Button className="botao" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        </TituloPagina>

        <NovaOS
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          agendamento={agendamentos}
          proximoNumeroOS={nextAgendamentoNumberForCliente}
        />
      </div>

      <ListaOS
        ordemServico={ordensServico}
        onView={handleView}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        onViewPDF={handleViewPDF}
        onDelete={handleDeleteClick}
      />

      <VisualizarOS
        open={viewOpen}
        onOpenChange={setViewOpen}
        ordemServico={selectedOS}
        onEdit={handleEditFromView}
        onPrint={() => selectedOS && handlePrint(selectedOS)}
        onDownloadPDF={handleDownloadPDF}
      />

      {selectedOS && (
        <EditarOS
          open={editOpen}
          onOpenChange={setEditOpen}
          ordemServico={selectedOS}
          onSave={handleUpdate}
          onBack={handleBackToView}
        />
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        clienteName={OSToDelete?.agendamento.cliente || ""}
        servico={OSToDelete?.agendamento.servico || ""}
        tipo="OS"
        osPendentes={OSToDelete?.status === "Pendente" ? 1 : 0}
        osNome={OSToDelete?.nome || ""}
      />
    </div>
  );
}