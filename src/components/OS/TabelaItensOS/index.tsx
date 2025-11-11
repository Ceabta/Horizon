import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../../ui/input";
import { v4 as uuidv4 } from 'uuid';
import type { OSItem } from "../../../types";

interface TabelaItensOSProps {
  itens: OSItem[];
  onChange: (itens: OSItem[]) => void;
  errors?: string;
}

export function TabelaItensOS({ itens, onChange, errors }: TabelaItensOSProps) {
  const [novoItem, setNovoItem] = useState({ descricao: "", valor: "" });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [valorEditando, setValorEditando] = useState("");

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    const number = parseInt(digits) / 100;
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  const handleAddItem = () => {
    if (!novoItem.descricao.trim()) return;

    const valor = parseCurrency(novoItem.valor);
    if (valor <= 0) return;

    const item: OSItem = {
      id: uuidv4(),
      descricao: novoItem.descricao.trim(),
      valor
    };

    onChange([...itens, item]);
    setNovoItem({ descricao: "", valor: "" });
  };

  const handleRemoveItem = (id: string) => {
    onChange(itens.filter(item => item.id !== id));
  };

  const handleEditDescricao = (id: string, novaDescricao: string) => {
    const itensAtualizados = itens.map(item =>
      item.id === id ? { ...item, descricao: novaDescricao } : item
    );
    onChange(itensAtualizados);
  };

  const handleEditValor = (id: string, novoValor: string) => {
    const valor = parseCurrency(novoValor);
    const itensAtualizados = itens.map(item =>
      item.id === id ? { ...item, valor } : item
    );
    onChange(itensAtualizados);
    setEditandoId(null);
    setValorEditando("");
  };

  const iniciarEdicaoValor = (id: string, valorAtual: number) => {
    setEditandoId(id);
    setValorEditando(valorAtual.toFixed(2).replace('.', ','));
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'descricao' | 'valor') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'descricao' && novoItem.descricao.trim()) {
        const valorInput = document.getElementById('valor-input') as HTMLInputElement;
        valorInput?.focus();
      } else if (field === 'valor') {
        handleAddItem();
      }
    }
  };

  const total = itens.reduce((sum, item) => sum + item.valor, 0);

  return (
    <div className="space-y-2" style={{ maxHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="border rounded-lg overflow-hidden flex-1" style={{ borderColor: 'var(--border)', minHeight: '200px', maxHeight: '350px', overflowY: 'auto' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--muted)' }}>
            <tr>
              <th className="text-left p-3 font-semibold text-sm">Produto/Serviço</th>
              <th className="text-right p-3 font-semibold text-sm w-40">Valor (R$)</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-muted-foreground text-sm">
                  Nenhum item adicionado. Use a linha abaixo para adicionar.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-muted/50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) => handleEditDescricao(item.id, e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-3 text-right font-medium">
                    {editandoId === item.id ? (
                      <input
                        type="text"
                        value={valorEditando}
                        onChange={(e) => {
                          const formatted = formatCurrency(e.target.value);
                          setValorEditando(formatted);
                        }}
                        onBlur={() => handleEditValor(item.id, valorEditando)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleEditValor(item.id, valorEditando);
                          } else if (e.key === 'Escape') {
                            setEditandoId(null);
                            setValorEditando("");
                          }
                        }}
                        autoFocus
                        className="w-full text-right bg-transparent border border-primary outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
                      />
                    ) : (
                      <div
                        onClick={() => iniciarEdicaoValor(item.id, item.valor)}
                        className="cursor-text hover:bg-muted/50 rounded px-2 py-1"
                      >
                        R$ {item.valor.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="cursor-pointer text-red-500 hover:text-red-800 transition-colors p-1 rounded"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}

            <tr className="border-t bg-muted/30" style={{ borderColor: 'var(--border)' }}>
              <td className="p-2">
                <Input
                  placeholder="Digite a descrição..."
                  value={novoItem.descricao}
                  onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                  onKeyDown={(e) => handleKeyPress(e, 'descricao')}
                  className="border-0 bg-transparent focus-visible:ring-1"
                />
              </td>
              <td className="p-2">
                <Input
                  id="valor-input"
                  placeholder="0,00"
                  value={novoItem.valor}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setNovoItem({ ...novoItem, valor: formatted });
                  }}
                  onKeyDown={(e) => handleKeyPress(e, 'valor')}
                  className="border-0 bg-transparent focus-visible:ring-1 text-right"
                  inputMode="numeric"
                />
              </td>
              <td className="p-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!novoItem.descricao.trim() || !novoItem.valor}
                  className="w-full h-full flex items-center justify-center text-white hover:opacity-80 disabled:opacity-40 transition-opacity rounded"
                  style={{ backgroundColor: 'var(--chart-3)' }}
                  title="Adicionar item (Enter)"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>

          <tfoot className="border-t-2" style={{ borderColor: 'var(--border)' }}>
            <tr style={{ backgroundColor: 'var(--muted)' }}>
              <td className="p-3 font-bold">Total</td>
              <td className="p-3 text-right font-bold text-lg" style={{ color: 'var(--chart-3)' }}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {errors && (
        <span className="text-red-500 text-sm">{errors}</span>
      )}

      <p className="text-xs text-muted-foreground">
        💡 Dica: Pressione Enter para navegar entre os campos e adicionar rapidamente
      </p>
    </div>
  );
}