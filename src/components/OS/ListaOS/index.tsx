import { useState } from "react";
import { Search, Filter, Eye, Download, Trash2, Paperclip } from "lucide-react";
import { FaRegFilePdf, FaRegFileWord } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Tag } from "../../Tag";
import { formatarData } from "../../../utils/formatarData";
import type { OS } from "../../../types";
import style from "./ListaOS.module.css";

interface ListaOSProps {
  ordemServico: OS[];
  onDelete: (os: OS) => void;
  onView?: (os: OS) => void;
  onDownloadPDF?: (os: OS) => void;
  onViewPDF?: (os: OS) => void;
  onGerarDocumento?: (os: OS) => void;
}

const getFileType = (url: string | null): 'pdf' | 'docx' | null => {
  if (!url) return null;

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('.pdf')) return 'pdf';
  if (lowerUrl.includes('.docx') || lowerUrl.includes('.doc')) return 'docx';

  return null;
};

const renderAttachmentTag = (fileType: 'pdf' | 'docx' | null) => {
  if (!fileType) return null;

  if (fileType === 'pdf') {
    return (
      <Tag>
        <div className="flex items-center gap-1">
          <Paperclip className="w-3 h-3" />
          <p className="font-semibold">PDF</p>
        </div>
      </Tag>
    );
  }

  if (fileType === 'docx') {
    return (
      <Tag>
        <div className="flex items-center gap-1">
          <FaRegFileWord className="w-3 h-3" />
          <p className="font-semibold">Word</p>
        </div>
      </Tag>
    );
  }

  return null;
};

export function ListaOS({
  ordemServico,
  onDelete,
  onView,
  onDownloadPDF,
  onViewPDF,
  onGerarDocumento
}: ListaOSProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc'>('data_desc');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

    let matchDate = true;
    if (startDate || endDate) {
      if (!os.agendamento?.data) {
        matchDate = false;
      } else {
        const osDate = new Date(os.agendamento.data);
        const osTime = new Date(osDate.getFullYear(), osDate.getMonth(), osDate.getDate()).getTime();

        if (startDate) {
          const s = new Date(startDate);
          const sTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
          if (osTime < sTime) matchDate = false;
        }

        if (endDate) {
          const e = new Date(endDate);
          const eTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
          if (osTime > eTime) matchDate = false;
        }
      }
    }

    return matchSearch && matchStatus && matchDate;
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
    setStartDate(null);
    setEndDate(null);
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
                      <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        Data início
                      </label>
                      <input
                        type="date"
                        value={startDate ?? ''}
                        onChange={(e) => setStartDate(e.target.value || null)}
                        className="w-full p-2 rounded border"
                        style={{ backgroundColor: "var(--background)" }}
                      />
                    </div>

                    <div>
                      <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        Data fim
                      </label>
                      <input
                        type="date"
                        value={endDate ?? ''}
                        onChange={(e) => setEndDate(e.target.value || null)}
                        className="w-full p-2 rounded border"
                        style={{ backgroundColor: "var(--background)" }}
                      />
                    </div>

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
            {sortedOS.map((os) => {
              const fileType = getFileType(os.pdf_url!);
              const isPDF = fileType === 'pdf';

              return (
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
                        {renderAttachmentTag(fileType)}
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

                      {onGerarDocumento && (
                        <Button
                          onClick={() => onGerarDocumento(os)}
                          className="botao"
                        >
                          <FaRegFileWord className="w-4 h-4" />
                          Gerar Documento
                        </Button>
                      )}

                      {onViewPDF && isPDF && (
                        <Button onClick={() => onViewPDF(os)} className="botao">
                          <FaRegFilePdf className="w-4 h-4" />
                          Ver PDF
                        </Button>
                      )}

                      {onDownloadPDF && isPDF && (
                        <Button
                          onClick={() => onDownloadPDF(os)}
                          className="botao"
                        >
                          <Download className="w-4 h-4" />
                          Baixar PDF
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}