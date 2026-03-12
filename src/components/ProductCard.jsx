import api from '../services/apiConfig';
import './styles/productcard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ProductCard = ({ product }) => {

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const handleAddToCart = async () => {
        if (isOutOfStock) return;
        
        try {
            const response = await api.post('cart/add_item/', {
                product_id: product.id,
                quantity: 1
            });

            if (response.status === 201) {
                toast.success(`Boa! ${product.name} adicionado ao carrinho.`);
            }
        } catch (err) {
            console.error("Erro na action add_item:", err);
            toast.error("Erro ao adicionar. Verifique sua conexão ou login.");
        }
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/150';
        if (url.startsWith('http')) return url;
        return `http://127.0.0.1:8000${url}`;
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className={`product-card ${isOutOfStock ? 'out-of-stock-card' : ''}`}>
            <div className="product-info-top">
                <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
            </div>

            <div className="product-info-bottom">
                <p className="product-price">{formatCurrency(product.price)}</p>
                
                <p className={`product-stock ${isOutOfStock ? 'empty' : ''}`}>
                    {isOutOfStock ? 'Indisponível' : `Disponível: ${product.stock} un.`}
                </p>

                <button 
                    className="add-to-cart-btn" 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock} 
                >
                    {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        </div>
    );
};