import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from 'react-redux';
// import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";


import React from 'react'
import axios from "axios";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  // const [register, { isLoading }] = useRegisterMutation()
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      console.log('password do not match');
    } else {
      try {
        // const res = await register({ name, email, password }).unwrap();
        // dispatch(setCredentials({ ...res }));
        // navigate('/');
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
          name,
          email,
          password,
          image:'',
        });
        dispatch(setCredentials(data));
        navigate("/login");
        toast.success('User Registered, Login Now')
        console.log('reg successful');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        toast.error(err.message)
        console.log('error',err);
      }
    }
  };
  return (
    <FormContainer>
      <h1>Sing Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="Confirmpassword">
          <Form.Label>Confim password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Sign UP
        </Button>
        <Row className="py-3">
          <Col>
            Already have an Account? <Link to='/login'>Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default RegisterScreen
