import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap'
import { useLoginMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutApiCall] = useLoginMutation()

    const logoutHandler = async () => {
        try {
            axios
                .post("http://localhost:8000/api/users/logout", {}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                })
                .then((res) => console.log(res.data))
                .catch((err) => console.error(err));
            dispatch(logout())
            navigate('/')
        } catch (error) {
            console.log('logout err', error);
        }
    }
    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>MERN App</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            {userInfo ? (<>
                                <NavDropdown title={userInfo.name} id='username'  >
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown></>
                            ) : (<>
                                <LinkContainer to='/login'>
                                    <Nav.Link ><FaSignInAlt /> Sign In</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/register'>
                                    <Nav.Link ><FaSignOutAlt /> Sign Up</Nav.Link>
                                </LinkContainer></>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;