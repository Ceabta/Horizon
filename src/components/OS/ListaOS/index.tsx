import { useState } from "react";
import { Search, Filter, Eye, Printer, Download, Trash2, Paperclip, FileText } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Tag } from "../../Tag";
import { formatarData } from "../../../utils/formatarData";
import type { OS } from "../../../types";
import style from "./ListaOS.module.css";

interface ListaOSProps {
  ordemServico: OS[];
  onEdit?: (os: OS) => void;
  onDelete: (os: OS) => void;
  onView?: (os: OS) => void;
  onPrint?: (os: OS) => void;
  onDownloadPDF?: (os: OS) => void;
  onViewPDF?: (os: OS) => void;
  onGerarDocumento?: (os: OS) => void;
}

export function ListaOS({
  ordemServico,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onDownloadPDF,
  onViewPDF,
  onGerarDocumento
}: ListaOSProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc'>('data_desc');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  const filteredOS = ordemServico.filter((os) => {
    const searchLower = searchTerm.toLowerCase();
    const nome = (os.nome || '').toLowerCase();
    const descricao = (os.descricao || '').toLowerCase();
    const status = (os.status || '').toLowerCase();
    const cliente = (os.agendamento?.cliente || '').toLowerCase();

    const matchSearch = nome.includes(searchLower) ||
      descricao.includes(searchLower) ||
      status.includes(searchLower) ||
      cliente.includes(searchLower);

    const matchStatus = filterStatus === 'Todos' || os.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const sortedOS = [...filteredOS].sort((a, b) => {
    switch (sortBy) {
      case 'data_asc':
        return new Date(a.agendamento?.data || 0).getTime() - new Date(b.agendamento?.data || 0).getTime();
      case 'data_desc':
        return new Date(b.agendamento?.data || 0).getTime() - new Date(a.agendamento?.data || 0).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSortBy('data_desc');
    setFilterStatus('Todos');
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg">Lista de Ordens de Serviços</CardTitle>
          <div className="flex gap-3 mt-4 items-start">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-gray-400"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
            <div className="relative">
              <Button
                size="icon"
                className="botao"
                onClick={() => setShowFilter((s) => !s)}
                aria-expanded={showFilter}
                aria-haspopup="dialog"
              >
                <Filter className="w-4 h-4" />
              </Button>

              {showFilter && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-md shadow-lg z-40"
                  style={{ background: 'var(--card)', padding: '0.75rem', border: '1px solid var(--border)' }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full p-2 rounded border"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>Ordenar por</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-2 rounded border"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <option value="data_asc">Data (mais antiga → mais nova)</option>
                        <option value="data_desc">Data (mais nova → mais antiga)</option>
                      </select>
                    </div>

                    <div className="flex gap-6 justify-end mt-7">
                      <button
                        className="px-3 py-1 rounded border"
                        onClick={clearFilters}
                        type="button"
                      >
                        Limpar
                      </button>
                      <button
                        className="px-3 py-1 rounded botao"
                        onClick={() => applyFilters()}
                        type="button"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedOS.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma OS encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOS.map((os) => (
              <Card
                key={os.id}
                className="hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl">{os.nome}</h3>
                      <Tag status={os.status} />
                      {os.pdf_url && (
                        <Tag>
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <p className="font-semibold">PDF</p>
                          </div>
                        </Tag>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--chart-3)' }}>
                        R$ {os.valor?.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatarData(os.agendamento.data)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-base font-semibold">{os.agendamento.cliente}</p>
                    <p className="text-sm text-muted-foreground">{os.agendamento.servico}</p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    {onView && (
                      <Button onClick={() => onView(os)} className="botao">
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </Button>
                    )}

                    {onViewPDF && os.pdf_url && (
                      <Button onClick={() => onViewPDF(os)} className="botao">
                        <FaRegFilePdf className="w-4 h-4" />
                        Ver PDF
                      </Button>
                    )}

                    {onPrint && os.pdf_url && (
                      <Button onClick={() => onPrint(os)} className="botao">
                        <Printer className="w-4 h-4" />
                        Imprimir
                      </Button>
                    )}

                    {onDownloadPDF && os.pdf_url && (
                      <Button
                        onClick={() => onDownloadPDF(os)}
                        className="botao"
                        disabled={!os.pdf_url}
                      >
                        <Download className="w-4 h-4" />
                        Baixar PDF
                      </Button>
                    )}

                    {onGerarDocumento && (
                      <Button
                        onClick={() => onGerarDocumento(os)}
                        className="botao"
                      >
                        <FileText className="w-4 h-4" />
                        Gerar Documento
                      </Button>
                    )}

                    {onDelete && (
                      <div className="flex flex-1 items-center justify-end cursor-pointer">
                        <Trash2 className="w-6 h-6 text-red-700" onClick={() => onDelete(os)} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}