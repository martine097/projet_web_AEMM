import { Button, Form, Input, Card, List, Divider, Flex, Typography, Select, message } from 'antd';
import useSWR, { useSWRConfig } from 'swr'; // Ajout de useSWRConfig
import { API, fetcher } from "../api/api.js";

const { Title } = Typography;
const { Option } = Select;

// Le composant Login reçoit les fonctions de gestion de l'état
export default function Login({ onLogin, onRegister, user, onLogout }) {
    
    // 1. Récupération des utilisateurs avec SWR
    const { data, error, isLoading } = useSWR('/users/', fetcher);
    
    // 2. Récupération de la fonction mutate pour forcer le rechargement
    const { mutate } = useSWRConfig();

    // Fonction wrapper pour l'inscription qui gère l'actualisation de la liste
    const handleRegister = async (values) => {
        try {
            // Appel à la fonction onRegister passée en prop (si elle gère l'appel API)
            // OU appel direct à l'API ici si onRegister ne fait que des logs
            await onRegister(values); 
            
            // 3. ACTUALISATION MAGIQUE : On force le rechargement de la liste des utilisateurs
            mutate('/users/'); 
            
            message.success("Utilisateur créé et liste mise à jour !");
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de la création.");
        }
    };

    return (
        <section id="home">
            <Title style={{color:'white', textAlign: 'center'}}>Bienvenue sur votre frontend</Title>
            <Flex gap='middle' justify="center" align="start" wrap>
                <Card style={{ minWidth: 400 }}>
                    {/* Le formulaire de connexion est affiché si l'utilisateur n'est PAS connecté */}
                    {user ?
                        <>
                            <Title level={4}>Bonjour {user.name}</Title>
                            <Button type="default" onClick={onLogout} danger block>
                                Se déconnecter
                            </Button>
                        </>
                        :
                        <Form
                            name="login"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onLogin}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Identifiant"
                                name="username"
                                rules={[
                                    { required: true, message: 'Insérez votre identifiant !' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mot de passe"
                                name="password"
                                rules={[{ required: true, message: 'Insérez votre mot de passe !' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" block>
                                    Se connecter
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                    
                    {!user && (
                        <>
                            <Divider>Ou Créer un compte</Divider>
                            
                            {/* Formulaire d'enregistrement */}
                            <Form
                                name="register"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true, role: 'user' }}
                                onFinish={handleRegister} // On utilise notre wrapper handleRegister
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Identifiant"
                                    name="username" // Attention : Assurez-vous que le backend attend 'username' ou 'name'
                                    rules={[{ required: true, message: 'Insérez votre identifiant !' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Insérez votre email !' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Mot de passe"
                                    name="password"
                                    rules={[{ required: true, message: 'Insérez votre mot de passe !' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    label="Rôle"
                                    name="role"
                                    rules={[{ required: true, message: 'Sélectionnez un rôle !' }]}
                                >
                                    <Select>
                                        <Option value="user">Utilisateur</Option>
                                        <Option value="admin">Administrateur</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" block>
                                        Créer un compte
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </Card>

                {/* Liste utilisateurs */}
                <Card title="Liste utilisateurs" style={{ minWidth: 300 }}>
                    {error ?
                        <p style={{ color: 'red' }}>
                            Impossible de charger la liste. <br/>
                            (Vérifiez que le backend tourne et que la route est publique)
                        </p>
                        :
                        <List
                            dataSource={data}
                            loading={isLoading}
                            renderItem={(item, index) => (
                                <List.Item key={item.id || index}> {/* Utilisation de l'ID si dispo */}
                                    <List.Item.Meta
                                        title={item.name}
                                        description={`${item.email} - ${item.role}`} // Ajout d'infos utiles
                                    />
                                </List.Item>
                            )}
                        />
                    }
                </Card>
            </Flex>
        </section>
    )
}