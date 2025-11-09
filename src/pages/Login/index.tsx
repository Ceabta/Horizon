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
import style from "./Login.module.css";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Preencha todos os campos");
            return;
        }

        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);

        if (error) {
            toast.error("Credenciais inválidas");
        } else {
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
                            <img
                                src={Logo}
                                alt="Logo"
                                className={style.logo}
                            />
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