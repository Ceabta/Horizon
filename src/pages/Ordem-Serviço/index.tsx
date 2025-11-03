import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TituloPagina } from "../../components/TituloPagina";
import { ListaOS } from "../../components/OS/ListaOS";
import { VisualizarOS } from "../../components/OS/VisualizarOS";
import { EditarOS } from "../../components/OS/EditarOS";
import { NovaOS } from "../../components/OS/NovaOS";
import { useOrdemServico } from "../../hooks/useOrdemServico";
import type { OS } from "../../types";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";

export function OrdemServico() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [OSToDelete, setOSToDelete] = useState<OS | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS | null>(null);

  const { ordensServico, addOrdemServico, deleteOrdemServico, updateOrdemServico } = useOrdemServico();

  const handleSubmit = async (data: any) => {
    const result = await addOrdemServico(data);
    if (result.success) {
      setDialogOpen(false);
      toast.success("OS criada com sucesso!");
    }
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
      setDeleteDialogOpen(false);
      setOSToDelete(null);
      setSelectedOS(null);
      toast.success("OS excluído com sucesso!");
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

  const handleDownloadPDF = (os: OS) => {
    toast.info("Funcionalidade de download em desenvolvimento");
  };

  return (
    <div className="p-8">
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
        />
      </div>

      <ListaOS
        ordemServico={ordensServico}
        onView={handleView}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        onDelete={handleDeleteClick}
      />

      <VisualizarOS
        open={viewOpen}
        onOpenChange={setViewOpen}
        ordemServico={selectedOS}
        onEdit={handleEditFromView}
        onPrint={() => selectedOS && handlePrint(selectedOS)}
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