import { useState, useContext } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/login.css';

export const Login = () => {
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('token/', { 
                username: identifier, 
                password 
            });

            const { access, refresh } = response.data;
            login(access, refresh);

            toast.success('Login realizado com sucesso!');
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || "Usuário ou senha incorretos.";
            toast.error(`Erro ao logar: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Acesse sua conta</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text" 
                        placeholder="Usuário ou E-mail"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button className="login-btn" type="submit" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar na Loja'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Ainda não tem uma conta?</p>
                    <span
                        className="register-link"
                        onClick={() => navigate('/register')}
                        style={{
                            color: '#00d1ff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            marginTop: '10px',
                            display: 'inline-block'
                        }}
                    >
                        Cadastre-se aqui
                    </span>
                </div>
            </div>
        </div>
    );
};