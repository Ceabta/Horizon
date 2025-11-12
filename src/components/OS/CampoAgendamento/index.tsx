import { useState, useRef, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { Agendamento } from "../../../types";
import { formatarData } from "../../../utils/formatarData";
import { useTheme } from "../../../hooks/theme-context";
import style from '../NovaOS/NovaOS.module.css';

interface CampoAgendamentoProps {
    value: string;
    onChange: (agendamento: Agendamento) => void;
    agendamentos: Agendamento[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

export function CampoAgendamento({
    value,
    onChange,
    agendamentos,
    error,
    required = false,
    disabled = false
}: CampoAgendamentoProps) {
    const [inputValue, setInputValue] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);

        if (newValue.trim().length > 0) {
            const filtered = agendamentos.filter(a => {
                const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "";
                const servicoDesc = (a as any).servico ?? (a as any).servico_descricao ?? "";
                const combined = `${clienteNome} ${servicoDesc} ${a.data ?? ""} ${a.horario ?? ""}`.toLowerCase();
                return combined.includes(newValue.toLowerCase());
            });
            setFilteredAgendamentos(filtered);
            setShowSuggestions(filtered.length > 0);
            setHighlightedIndex(-1);
        } else {
            setShowSuggestions(false);
            setFilteredAgendamentos([]);
            setHighlightedIndex(-1);
        }
    };

    const selectAgendamento = (a: Agendamento) => {
        const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "Cliente";
        const resumo = `${clienteNome} • ${formatarData(a.data)} • ${a.horario ?? ""} • ${(a as any).servico ?? ""}`;
        setInputValue(resumo);
        onChange(a);
        setShowSuggestions(false);
        setFilteredAgendamentos([]);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || filteredAgendamentos.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev < filteredAgendamentos.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredAgendamentos.length) {
                    selectAgendamento(filteredAgendamentos[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const hasAvailableAgendamentos = agendamentos.length > 0;

    return (
        <div className="space-y-2 relative">
            <Label htmlFor="agendamento">
                Agendamento {required && <span className="text-red-500">*</span>}
            </Label>

            {!hasAvailableAgendamentos ? (
                <div className={`p-3 border ${theme === 'light' ? "bg-yellow-100 border-yellow-400" : "bg-yellow-900/20 border-yellow-800"} rounded-md`}>
                    <p className={`text-sm ${theme === 'light' ? "text-yellow-900" : "text-yellow-200"}`}>
                        ⚠️ Não há agendamentos disponíveis
                    </p>
                </div>
            ) : (
                <div className="relative">
                    <Input
                        id="agendamento"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setTimeout(() => {
                                setShowSuggestions(false);
                                setHighlightedIndex(-1);
                            }, 200);
                        }}
                        onFocus={() => {
                            if (inputValue.trim().length > 0) {
                                const filtered = agendamentos.filter(a => {
                                    const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "";
                                    const servicoDesc = (a as any).servico ?? (a as any).servico_descricao ?? "";
                                    const combined = `${clienteNome} ${servicoDesc} ${a.data ?? ""} ${a.horario ?? ""}`.toLowerCase();
                                    return combined.includes(inputValue.toLowerCase());
                                });
                                setFilteredAgendamentos(filtered);
                                setShowSuggestions(filtered.length > 0);
                            }
                        }}
                        placeholder="Procure por cliente, serviço ou data"
                        className={error ? "border-red-500" : ""}
                        autoComplete="off"
                        disabled={disabled || !hasAvailableAgendamentos}
                    />

                    {showSuggestions && filteredAgendamentos.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-[60] w-full border mt-1 border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                            style={{ top: '100%', backgroundColor: 'var(--background)' }}
                        >
                            {filteredAgendamentos.map((a, index) => {
                                const clienteNome = (a as any).cliente ?? (a as any).cliente_nome ?? "Cliente";
                                return (
                                    <div key={(a as any).id ?? index}>
                                        <div
                                            onClick={() => selectAgendamento(a)}
                                            className={`px-4 py-2 cursor-pointer ${style.cliente} ${index === highlightedIndex ? "bg-muted" : ""}`}
                                        >
                                            <div className={`${style.cliente_nome} font-medium`}>{clienteNome}</div>
                                            <div className={`text-sm text-gray-500 ${style.cliente_nome}`}>
                                                {formatarData((a as any).data)} {a.horario ?? ""} • {(a as any).servico ?? ""}
                                            </div>
                                        </div>
                                        {index < filteredAgendamentos.length - 1 && (
                                            <hr className={style.linha} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
}