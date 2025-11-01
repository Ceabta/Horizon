interface TituloPaginaProps {
    titulo: string;
    subtitulo?: string;
    children?: React.ReactNode;
}

export function TituloPagina({ titulo, subtitulo, children }: TituloPaginaProps) {
    return (
        <div className="flex items-center justify-between mb-6 w-full">
            <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {titulo}
                </h1>
                {subtitulo && (
                    <p style={{ color: 'var(--muted-foreground)' }}>
                        {subtitulo}
                    </p>
                )}
            </div>

            <div className="flex-shrink-0">
                {children}
            </div>
        </div>
    );
}
