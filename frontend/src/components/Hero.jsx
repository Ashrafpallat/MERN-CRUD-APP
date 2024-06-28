import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import image from "../assets/image.png";


const Hero = () => {
  // Get userInfo from the Redux state
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className='py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          {userInfo ? (
            <>
            <div className=" d-flex justify-content-center">
                <img
                  src={ userInfo.image || image}
                  alt="Profile Pic"
                  className="img-thumbnail rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h1 className='text-center mb-4'>Welcome {userInfo.name}!</h1>
              <p className='text-center mb-4'>
                Glad to have you back. You can manage your account and explore more features.
              </p>
            </>
          ) : (
            <>
              <h1 className='text-center mb-4'>MERN Authentication</h1>
              <p className='text-center mb-4'>
                This is a boilerplate for MERN authentication that stores a JWT in
                an HTTP-Only cookie. It also uses Redux Toolkit and the React
                Bootstrap library.
              </p>
              <div className='d-flex'>
                <LinkContainer to='/login'>
                  <Button variant='primary' className='me-3'>
                    Sign In
                  </Button>
                </LinkContainer>
                <LinkContainer to='/register'>
                  <Button variant='secondary'>
                    Sign Up
                  </Button>
                </LinkContainer>
              </div>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
