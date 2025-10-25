interface TituloPaginaProps {
    titulo: string;
    subtitulo?: string;
}

export function TituloPagina({ titulo, subtitulo }: TituloPaginaProps) {
    return(
        <>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{titulo}</h1>
            <p style={{ color: 'var(--muted-foreground)' }}>{subtitulo}</p>
        </>
    )
}
