import { useEffect, useState } from 'react';
import api from '../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import { Loading } from './Loading';
import './styles/cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); 
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const fetchCart = async () => {
        try {
            const response = await api.get('cart/');
            setCart(response.data[0]);
        } catch (err) {
            console.error("Erro ao carregar carrinho:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async () => {
        setIsProcessing(true); 

        setTimeout(async () => {
            try {
                await api.post('orders/');
                navigate('/orders');
            } catch (err) {
                toast.error("Erro ao finalizar pedido. O carrinho pode estar vazio.");
                setIsProcessing(false);
            }
        }, 2000);
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`cart-items/${itemId}/`);
            fetchCart();
        } catch (err) {
            toast.error("Não foi possível remover o item.");
        }
    };

    if (loading) return <Loading/>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-container empty-cart-msg">
                <h2>Seu carrinho está vazio.</h2>
                <button className="back-store-btn" onClick={() => navigate('/')}>
                    Voltar à loja
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Meu Carrinho</h1>
            
            <div className="cart-box">
                {cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <strong>{item.product_details.name}</strong>
                            <p>Quantidade: {item.quantity}</p>
                            <p>Unidade: {formatCurrency(item.product_details.price)}</p>
                        </div>
                        
                        <div className="item-actions">
                            <p className="item-price">
                                {formatCurrency(item.product_details.price * item.quantity)}
                            </p>
                            <button 
                                className="remove-btn" 
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isProcessing}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}

                <div className="cart-summary">
                    <span className="total-value">
                        <small style={{fontSize: '1rem', color: '#888'}}>Total: </small>
                        {formatCurrency(cart.total_price)}
                    </span>
                    <button 
                        className={`checkout-btn ${isProcessing ? 'processing' : ''}`} 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Validando Transação...' : 'Finalizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};