import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { TituloPagina } from "../../components/TituloPagina";
import { ListaClientes } from "../../components/ListaClientes";
import { NovoCliente } from "../../components/NovoCliente";
import { EditarCliente } from "../../components/EditarCliente";
import { HistoricoCliente } from "../../components/HistoricoCliente";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { useClientes } from "../../hooks/useClientes";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "Ativo" | "Inativo";
  totalOS?: number;
}

export function Clientes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [clienteHistorico, setClienteHistorico] = useState<Cliente | null>(null);

  const { clientes, addCliente, updateCliente, deleteCliente, toggleStatus } = useClientes();

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
    }
  };

  const handleToggleStatus = async (cliente: Cliente) => {
    await toggleStatus(cliente);
  };

  const handleViewHistory = (cliente: Cliente) => {
    setClienteHistorico(cliente);
    setHistoricoOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <TituloPagina
            titulo="Clientes"
            subtitulo="Gerencie o cadastro de clientes"
          />
        </div>
        <Button
          className="botao"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>

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
      />

      {selectedCliente && (
        <EditarCliente
          open={!!selectedCliente}
          onOpenChange={() => setSelectedCliente(null)}
          cliente={selectedCliente}
          onSave={handleUpdate}
          onDelete={() => handleDeleteClick(selectedCliente)}
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
        servico="Cliente"
        data=""
        horario=""
      />
    </div>
  );
}