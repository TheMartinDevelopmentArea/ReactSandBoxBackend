import { useEffect, useState } from 'react';
import api from '../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import './styles/dashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: 0, image_url: '', description: '' });
    const [newCategory, setNewCategory] = useState('');
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('products/'),
                api.get('categories/')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error("Erro ao carregar dados do sandbox");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                image_url: newProduct.image_url.trim() === '' ? null : newProduct.image_url
            };

            await api.post('products/', payload);
            toast.success("Produto adicionado com sucesso!");
            setNewProduct({ name: '', price: '', category: '', stock: 0, image_url: '', description: '' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data 
                ? Object.values(err.response.data).flat().join(' - ') 
                : "Erro ao adicionar produto.";
            toast.error(errorMsg); 
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Remover este item?")) {
            await api.delete(`products/${id}/`);
            fetchData();
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('categories/', { name: newCategory });
            setNewCategory('');
            fetchData();
        } catch (err) { toast.error("Erro ao criar categoria."); }
    };

    const deleteCategory = async (id) => {
        if (window.confirm("Isso deixará os produtos desta categoria sem classificação. Confirmar?")) {
            try {
                await api.delete(`categories/${id}/`);
                fetchData();
            } catch (err) { toast.error("Erro ao deletar categoria."); }
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("CUIDADO: Isso apagará tudo permanentemente. Confirmar?")) {
            try {
                await api.delete('user/me/');
                localStorage.clear();
                navigate('/register');
            } catch (err) { toast.error("Erro ao deletar conta."); }
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Sandbox</h1>
                <button onClick={handleDeleteAccount} className="btn-delete-account">Deletar Conta</button>
            </header>

            <section>
                <h3>Gerenciar Categorias</h3>
                <form onSubmit={handleAddCategory} className="form-group">
                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Ex: Hardware, Periféricos..." required />
                    <button type="submit">Criar Categoria</button>
                </form>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {categories.map(c => (
                        <span key={c.id} style={{
                            background: '#1a1a1a',
                            padding: '5px 12px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #333'
                        }}>
                            {c.name}
                            <button
                                onClick={() => deleteCategory(c.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h3>Novo Produto</h3>
                <form onSubmit={handleAddProduct} className="form-group">
                    <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Nome do Produto" required />
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Preço" required />
                    <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Descrição do produto" />
                    <input value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="URL da Imagem" />

                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Quantidade" style={{ width: '70px' }} required />

                    <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required>
                        <option value="">Selecione a Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="submit">Adicionar</button>
                </form>

                <div className="products-grid">
                    {products.map(p => (
                        <div key={p.id} className="product-card">
                            <h4>{p.name}</h4>
                            <p style={{ color: '#00ff41', fontSize: '1.2rem' }}>
                                {formatCurrency(p.price)}
                            </p>
                            <small style={{ color: '#888' }}>Estoque: {p.stock}</small>
                            <br /><br />
                            <button onClick={() => deleteProduct(p.id)} className="btn-delete-item">Excluir</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};