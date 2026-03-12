import { useEffect, useState } from 'react';
import api from '../services/apiConfig';
import { Loading } from './Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/orders.css'; 



export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('orders/');
            setOrders(response.data);
        } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setOrders(currentOrders => 
                currentOrders.map(order => {
                    if (order.status === 'Pendente') return { ...order, status: 'Pago' };
                    if (order.status === 'Pago') return { ...order, status: 'Enviado' };
                    return order;
                })
            );
        }, 10000); 

        return () => clearInterval(interval);
    }, []); 

    const handleCancelOrder = async (id) => {
        if (window.confirm("Deseja cancelar este pedido?")) {
            try {
                await api.patch(`orders/${id}/`, { status: 'Cancelado' });
                fetchOrders();
            } catch (err) { 
                toast.error("Erro ao cancelar."); 
            }
        }
    };

    if (loading) return <Loading/>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">Histórico de Operações</h1>
            
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>Nenhum registro de pedido no seu sandbox.</p>
                </div>
            ) : (
                orders.map(order => (
                    <div key={order.id} className={`order-card status-${order.status.toLowerCase()}`}>
                        <div className="order-header">
                            <span className="order-id">ID de Rastreio: {order.id}</span>
                            <span>{order.date_formatted}</span>
                        </div>
                        
                        <div className="order-items-list">
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <span>{item.quantity}x {item.product_name}</span>
                                    <span>{formatCurrency(item.price_at_purchase)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="status-container">
                                <span className={`status-badge tag-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                                
                                {order.status === 'Pendente' && (
                                    <button onClick={() => handleCancelOrder(order.id)} className="btn-cancel-mini">
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            <div className="order-total">
                                <small>TOTAL: </small>
                                {formatCurrency(order.total_price)}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};