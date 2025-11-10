import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import Logo from "../../assets/Logo(dark).png";
import Fundo from "../../assets/Fundo.png";
import { supabase } from "../../lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";
import style from "./Login.module.css";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const logLoginAttempt = async (email: string, success: boolean) => {
        try {
            await supabase.from('login_attempts').insert({
                email,
                success,
                ip_address: '',
                user_agent: navigator.userAgent
            });
        } catch (error) {
            console.error('Erro ao registrar tentativa:', error);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    useEffect(() => {
        const attempts = localStorage.getItem('loginAttempts');
        const blocked = localStorage.getItem('blockedUntil');

        if (attempts) setLoginAttempts(parseInt(attempts));
        if (blocked) {
            const blockedTime = parseInt(blocked);
            if (Date.now() < blockedTime) {
                setBlockedUntil(blockedTime);
            } else {
                localStorage.removeItem('blockedUntil');
                localStorage.removeItem('loginAttempts');
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Preencha todos os campos");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("E-mail inválido");
            return;
        }

        if (blockedUntil && Date.now() < blockedUntil) {
            const remainingTime = Math.ceil((blockedUntil - Date.now()) / 1000 / 60);
            toast.error(`Muitas tentativas. Tente novamente em ${remainingTime} minuto(s)`);
            return;
        }

        if (loginAttempts >= 3 && !captchaToken) {
            toast.error("Complete o CAPTCHA");
            return;
        }

        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);

        await logLoginAttempt(email, !error);

        if (error) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            localStorage.setItem('loginAttempts', newAttempts.toString());

            if (newAttempts >= 5) {
                const blockTime = Date.now() + 15 * 60 * 1000;
                setBlockedUntil(blockTime);
                localStorage.setItem('blockedUntil', blockTime.toString());
                toast.error("Muitas tentativas falhas. Bloqueado por 15 minutos");
            } else {
                toast.error(`Credenciais inválidas (${newAttempts}/5 tentativas)`);
            }
        } else {
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('blockedUntil');
            setLoginAttempts(0);
            toast.success("Login realizado com sucesso!");
            navigate("/dashboard");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative text-white"
            style={{
                backgroundImage: `url(${Fundo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="w-full max-w-md relative z-10">
                <div
                    className="rounded-xl p-8 shadow-2xl backdrop-blur-xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        borderRadius: "20px"
                    }}
                >
                    <div className="text-center mb-8">
                        <div className="w-1/1 h-10 rounded-lg flex items-center justify-center">
                            <img src={Logo} alt="Logo" className={style.logo} />
                        </div>
                        <h1 className="text-3xl font-bold mt-6 mb-2">Bem-vindo</h1>
                        <p className="text-muted-foreground">Entre com suas credenciais</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoFocus
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative text-white">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="bg-background/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                                    style={{ color: 'rgb(44, 156, 197)' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {loginAttempts >= 3 && (
                            <div className="flex justify-center">
                                <ReCAPTCHA
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                                    onChange={(token) => setCaptchaToken(token)}
                                    theme="dark"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full font-semibold"
                            disabled={loading}
                            style={{ backgroundColor: 'rgb(44, 156, 197)', color: 'white' }}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm font-semibold text-white">
                        <p>Horizon - Sistema de Gestão de Serviços</p>
                    </div>
                </div>
            </div>
        </div>
    );
}