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
import { downloadDocumentoOS } from "../../utils/gerarDocumento";

export function OrdemServico() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [OSToDelete, setOSToDelete] = useState<OS | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS | null>(null);

  const { ordensServico, addOrdemServicoComPDF, deleteOrdemServico, updateOrdemServico } = useOrdemServico();
  const { agendamentos, nextAgendamentoNumberForCliente, updateOsGerada, refetch: refetchAgendamentos } = useAgendamentos();

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
      if (data.mudouAgendamento && data.agendamentoOriginalId) {
        await updateOsGerada(data.agendamentoOriginalId, false);

        if (data.agendamento_id) {
          await updateOsGerada(data.agendamento_id, true);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      refetchAgendamentos();
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

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      setViewOpen(true);
    }, 10);
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
      toast.error("Esta OS não possui arquivo anexado");
      return;
    }

    try {
      const isWord = os.pdf_url.toLowerCase().includes('.docx') ||
        os.pdf_url.toLowerCase().includes('.doc');

      const fileExtension = isWord ? '.docx' : '.pdf';
      const fileType = isWord
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf';

      const result = await storageHelper.downloadPDF(os.pdf_path);

      if (result.success && result.blob) {
        const blob = new Blob([result.blob], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${os.nome}${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`Arquivo baixado com sucesso!`);
      } else {
        toast.error("Erro ao baixar arquivo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao baixar arquivo");
    }
  };

  const handleGerarDocumento = async (os: OS) => {
    try {
      toast.info("Gerando documento...");

      await downloadDocumentoOS(os);

      toast.success("Documento gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar documento");
    }
  };

  return (
    <div className="p-6 pt-4">
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
        onDownloadPDF={handleDownloadPDF}
        onViewPDF={handleViewPDF}
        onDelete={handleDeleteClick}
        onGerarDocumento={handleGerarDocumento}
      />

      <VisualizarOS
        open={viewOpen}
        onOpenChange={setViewOpen}
        ordemServico={selectedOS}
        onEdit={handleEditFromView}
        onDownloadPDF={handleDownloadPDF}
      />

      {selectedOS && (
        <EditarOS
          open={editOpen}
          onOpenChange={setEditOpen}
          ordemServico={selectedOS}
          onSave={handleUpdate}
          onBack={handleBackToView}
          agendamentos={agendamentos}
          proximoNumeroOS={nextAgendamentoNumberForCliente}
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