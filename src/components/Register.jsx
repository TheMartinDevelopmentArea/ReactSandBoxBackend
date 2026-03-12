import { useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";
import './styles/register.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/register/", formData);
            toast.success('Conta criada com sucesso!');
            navigate('/login');
        } catch (err) {
            toast.error("Erro ao cadastrar usuário: Verifique os dados.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Criar Conta</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <input 
                        placeholder="Nome de usuário"
                        required
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button className="register-btn" type="submit">Cadastrar</button>
                </form>
                <p className="login-link">
                    Já tem uma conta? <span onClick={() => navigate('/login')}>Faça login</span>
                </p>
            </div>
        </div>
    );
};