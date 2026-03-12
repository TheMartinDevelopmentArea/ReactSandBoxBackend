import { useEffect, useState } from 'react';
import api from '../services/apiConfig';
import { ProductCard } from './ProductCard';
import './styles/home.css';
import { Loading } from './Loading';

export const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0); 
    };



    useEffect(() => {
        api.get('categories/').then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory ? `products/?category=${selectedCategory}` : 'products/';
                const response = await api.get(url);
                setProducts(response.data);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setTimeout(() => setLoading(false), 300);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>}

            <aside className={`category-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Departamentos</h3>
                    <button className="close-drawer" onClick={() => setIsDrawerOpen(false)}>&times;</button>
                </div>
                <div className="drawer-content">
                    <button
                        className={`drawer-pill ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => { setSelectedCategory(null); setIsDrawerOpen(false); }}
                    >
                        Todos os Produtos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`drawer-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => { setSelectedCategory(cat.id); setIsDrawerOpen(false); }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </aside>

            <div className="home-controls">
                <div className="search-row">
                    <button className="menu-toggle" onClick={() => setIsDrawerOpen(true)}>
                        Categorias
                    </button>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar hardware, periféricos e mais..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {selectedCategory && (
                    <div className="current-filter">
                        <span>Filtrando: <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
                        <button className="clear-filter-btn" onClick={() => setSelectedCategory(null)}>
                            Remover filtro &times;
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading-grid-container">
                    <Loading />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhum resultado para sua busca ou categoria.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};