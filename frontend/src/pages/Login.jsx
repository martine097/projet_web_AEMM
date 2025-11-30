import { Button, Form, Input, Card, List, Divider, Flex, Typography, Select } from 'antd';
import useSWR from 'swr';
import {API, fetcher} from "../api/api.js";
const { Title } = Typography;
const { Option } = Select;

// Le composant Login reçoit les fonctions de gestion de l'état (login/register/logout)
export default function Login({ onLogin, onRegister, user, onLogout }) {
    
    // La liste des utilisateurs est conservée ici pour l'exemple
    const {data,error,isLoading} = useSWR('/users',fetcher) 

    return (
        <section id="home">
            <Title style={{color:'white'}}>Bienvenue sur votre frontend</Title>
            <Flex gap='middle'>
                <Card>
                    {/* Le formulaire de connexion est affiché si l'utilisateur n'est PAS connecté */}
                    {user ?
                        <>
                            <Title level={4}>Bonjour {user.name}</Title>
                            <Button type="default" onClick={onLogout} danger>
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
                            onFinish={onLogin} // Appel la fonction passée par App.jsx
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Insérez votre adresse email !' }]}
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

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit">
                                    Se connecter
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                    
                    <Divider>Ou</Divider>
                    
                    {/* Formulaire d'enregistrement */}
                    <Form
                        name="register"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onRegister} // Appel la fonction passée par App.jsx
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Identifiant"
                            name="username"
                            rules={[{ required: true, message: 'Insérez votre identifiant !' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Insérez votre email !' }]}
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

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Créer un compte
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Liste utilisateurs (conservée de l'ancien App.jsx) */}
                <Card title="Liste utilisateurs">
                    {error?
                        <p>Échec du chargement</p>
                        :
                        <List
                            dataSource={data}
                            loading={isLoading}
                            renderItem={(item, index) => (
                                <List.Item key={index}>
                                    <List.Item.Meta
                                        title={item.name}
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