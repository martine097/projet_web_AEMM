import { Card, Typography, Button, Layout, Menu, Space } from 'antd';
import { UserOutlined, SettingOutlined, CarOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function HomePage({ user, onLogout }) {
    
    // Structure de navigation Ant Design (à adapter selon vos besoins)
    const items = [
      { key: '1', icon: <CarOutlined />, label: 'Tableau de bord' },
      { key: '2', icon: <SettingOutlined />, label: 'Paramètres' },
    ];
    
    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                    Parking App | Page Principale
                </div>
                <Space>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        items={items}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <div style={{ color: 'white' }}>
                        <UserOutlined /> {user.name} ({user.role})
                    </div>
                    <Button onClick={onLogout} danger>
                        Se déconnecter
                    </Button>
                </Space>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>
                    
                    <Title level={2}>
                        Contenu Principal de l'Application 🚗
                    </Title>
                    
                    <p>
                        **C'est ici que vous devez placer les composants de votre application de parking.** Par exemple, une liste de places de parking, un formulaire de réservation, etc.
                    </p>
                    
                        Ceci est un exemple de page principale après la connexion.
                    
                    <Card title="Espace de travail" style={{ marginTop: 20 }}>
                        <p>Exemple de widget Ant Design pour votre contenu.</p>
                    </Card>

                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Parking App ©2024 Créé pour le projet.
            </Footer>
        </Layout>
    );
}