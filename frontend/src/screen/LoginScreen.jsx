import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from "../components/FormContainer";
import { setCredentials } from "../slices/authSlice";
import axios from "axios";
import { toast } from 'react-toastify'

const LoginScreen = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const dispathch = useDispatch()

    // const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            // const res = await login({ email, password }).unwrap()
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/auth`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log(data);
            dispathch(setCredentials(data))
            toast.success('Login successfully')
            navigate('/')
        } catch (err) {
            if (err.response) {
                // Server responded with a status code other than 2xx
                const errorMessage = err.response.data || 'Login failed';
                toast.error(errorMessage);
            } else if (err.request) {
                // No response was received from the server
                toast.error('No response received');
            } else {
                // Error setting up the request
                toast.error(err.message);
            }
        }
    }
    return (
        <FormContainer>
            <h1>Sing In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="my-2" controlId="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">
                    Sign In
                </Button>
                <Row className="py-3">
                    <Col>
                        New Customer? <Link to='/register'>Register</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default LoginScreen
