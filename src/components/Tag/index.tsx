import { getStatusColor } from '../../utils/getStatusColor'
import style from './Tag.module.css'

export function Tag({ status, children }: { status?: string; children?: React.ReactNode }) {
    const cor = getStatusColor(status!);

    return (
        <>
            <span 
                className={style.estilo}
                style={{
                    backgroundColor: cor.bg,
                    color: cor.text
                }}
            >
                {status ? status : children}
            </span>
        </>
    )
}