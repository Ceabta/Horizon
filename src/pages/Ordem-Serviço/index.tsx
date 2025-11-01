import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TituloPagina } from "../../components/TituloPagina";
import { ListaClientes } from "../../components/Clientes/ListaClientes";
import { NovoCliente } from "../../components/Clientes/NovoCliente";
import { EditarCliente } from "../../components/Clientes/EditarCliente";
import { HistoricoCliente } from "../../components/Clientes/HistoricoCliente";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { useClientes } from "../../hooks/useClientes";
import { useAgendamentos } from "../../hooks/useAgendamentos";
import { toast } from "sonner";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "Ativo" | "Inativo";
  totalOS?: number;
}

export function OrdemServico() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [clienteHistorico, setClienteHistorico] = useState<Cliente | null>(null);

  const { clientes, addCliente, updateCliente, deleteCliente, toggleStatus } = useClientes();
  const { agendamentos } = useAgendamentos();

  const handleSubmit = async (data: any) => {
    const result = await addCliente(data);
    if (result.success) {
      setDialogOpen(false);
    }
  };

  const handleUpdate = async (data: any) => {
    const result = await updateCliente(data);
    if (result.success) {
      setSelectedCliente(null);
      toast.success("Cliente atualizado com sucesso!");
    }
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (clienteToDelete) {
      await deleteCliente(clienteToDelete.id);
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
      setSelectedCliente(null);
      toast.success("Cliente excluído com sucesso!");
    }
  };

  const handleToggleStatus = async (cliente: Cliente) => {
    await toggleStatus(cliente);
  };

  const handleViewHistory = (cliente: Cliente) => {
    setClienteHistorico(cliente);
    setHistoricoOpen(true);
  };

  const getAgendamentosPendentes = (clienteNome: string) => {
    return agendamentos.filter(
      ag => ag.cliente === clienteNome && ag.status === "Em Andamento"
    ).length;
  };

  const getOsPendentes = (clienteNome: string) => {
    // Se você tiver um hook de OS, use aqui
    // return ordens.filter(os => os.cliente === clienteNome && os.status !== "Concluída").length;
    return 0; // Por enquanto retorna 0
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <TituloPagina
          titulo="Nova OS"
          subtitulo="Gerencie as OS dos clientes"
        >
          <Button className="botao" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        </TituloPagina>

        <NovoCliente
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
        />
      </div>

      <ListaClientes
        clientes={clientes}
        onEdit={(cliente) => setSelectedCliente(cliente)}
        onViewHistory={handleViewHistory}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
      />

      {selectedCliente && (
        <EditarCliente
          open={!!selectedCliente}
          onOpenChange={() => setSelectedCliente(null)}
          cliente={selectedCliente}
          onSave={handleUpdate}
        />
      )}

      <HistoricoCliente
        open={historicoOpen}
        onOpenChange={setHistoricoOpen}
        cliente={clienteHistorico}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        clienteName={clienteToDelete?.nome || ""}
        servico=""
        data=""
        horario=""
        tipo="cliente"
        agendamentosPendentes={clienteToDelete ? getAgendamentosPendentes(clienteToDelete.nome) : 0}
        osPendentes={clienteToDelete ? getOsPendentes(clienteToDelete.nome) : 0}
      />
    </div>
  );
}