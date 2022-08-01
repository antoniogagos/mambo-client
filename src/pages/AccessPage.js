import React, { useContext, useEffect, useState } from 'react';
import { Route, Link, Redirect, useLocation } from 'react-router-dom';
import * as Api from '../firebase/api';
import styled from 'styled-components';
import GoogleLogo from '../images/google-logo.svg'
import AppleLogo from '../images/apple-logo.svg'
import Ripple from '../components/loading';
import { AuthContext } from '../firebase/auth';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const AuthErrorText = styled.div`
  margin: 20px 0;
  margin-top: 8px;
  text-align: center;
  color: #B71C1C;
  line-height: 20px;
`;

const SeparatorLine = styled.div`
  height: 2px;
  width: 100%;
  margin: 20px 0;
  background: ${props => props.theme.lowContrast};
  position: relative;
  opacity: 0.4;
  span {
    position: absolute;
    top: -19px;
    background: ${props => props.theme.main};
    right: calc(50% - 20px);
    padding: 6px;
    box-sizing: border-box;
    color: ${props => props.theme.lowContrast};
  }
`;

const Button = styled.button`
  border-radius: 6px;
  border: 3px solid;
  cursor: pointer;
  font-family: 'Helvetica';
  font-size: 16px;
  font-weight: bold;
  background: ${props => props.theme.name === 'light' ? "#fff" : "#fffffff2"};
  color: ${props => props.theme.primaryColor};
  border: 2px solid ${props => props.theme.name === 'light' ? "#ECEFF1" : "#859cb7"};;
  padding: 14px 16px;
  width: 100%;
`;

const LogButton = styled(Button)`
  align-items: center;
  background: ${props => props.theme.name === 'light' ? "#fff" : "#fffffff2"};
  height: 52px;
  border-radius: 5px;
  border: 2px solid ${props => props.theme.name === 'light' ? "#ECEFF1" : "#859cb7"};
  color: #263238;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  margin-bottom: 20px;
  padding: 10px;
  &#apple {
  }
  img {
    margin-right: 15px;
  }
  &.facebook-logo {
    color: #fff;
    padding: 3px;
    background: #1877F2;
  }
`;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  box-shadow: 0 0 2px rgba(0,0,0,0.14);
  height: 100%;
  margin: 0 auto;
  background: ${props => props.theme.main};
  color: ${props => props.theme.primaryColor};
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  box-sizing: border-box;
`;

const Section = styled.section`
  > input {
    padding: 16px;
    background: #fff;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
    font-family: inherit;
    width: 100%;
    margin-bottom: 12px;
    font-size: 14px;
    border-radius: 6px;
    &:invalid + span::before {
      content: '✖';
      color: #E91E63;
    }
    &:valid + span::before {
      content: '✓';
      color: #388e3c;
    }
    &:placeholder-shown + span::before {
      display: none;
    }
    & + span {
      position: relative;
    }
    & + span::before {
      font-weight: bold;
      position: absolute;
      right: 4px;
      top: 0px;
    }
  }
  > label {
    line-height: 28px;
  }
`;
const BottomFormText = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
`;

const StyledLink = styled(Link)`
  color: #ffa031;
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 2px solid #ffa031;
  margin-left: 8px;
  text-decoration: none;
`;

const RippleWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdefd56b;
  z-index: 1;
`;

function SignIn({ updateLoading, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const handleSignIn = async (evt) => {
    evt.preventDefault();
    try {
      updateLoading(true);
      await Api.signInCustom({ email, password });
      updateLoading(false);
    } catch(err) {
      setAuthError(err.message);
      updateLoading(false);
    }
  }

  const handleProviderLogIn = async (evt) => {
    evt.preventDefault();
    const provider = evt.target.id;
    try {
      updateLoading(true);
      await Api.signInProvider({ provider, email });
      updateLoading(false);
    } catch(err) {
      setAuthError(err.message);
      updateLoading(false);
    }
  }

  return (
    <>
    <Form onSubmit={handleSignIn}>
      <Title>Welcome Back!</Title>      
      <Section>
        <label htmlFor="email">Email</label>
        <input
            value={email} id="email" name="email" required
            onChange={(evt) => setEmail(evt.target.value)}
            autoCapitalize="off" tabIndex="0" autoComplete="email" type="email"></input>
      </Section>
      <Section>
        <label htmlFor="password">Password</label>
        <input
            value={password} tabIndex="0" autoComplete="current-password" required
            onChange={evt => setPassword(evt.currentTarget.value)}
            type="password" id="password" name="password"></input>
      </Section>
      {authError && <AuthErrorText>{authError}</AuthErrorText>}
      <Button disabled={isLoading}>Sign in</Button>
      <SeparatorLine><span>or</span></SeparatorLine>
      <LogButton onClick={handleProviderLogIn} type="submit" id="google">
          <img alt="Google Logo" src={GoogleLogo}/>Sign in with Google
        </LogButton>
      <LogButton onClick={handleProviderLogIn} type="submit" id="apple">
        <img alt="Apple Logo" src={AppleLogo}/>Sign in with Apple
      </LogButton>
    </Form>
    <BottomFormText>Don't have an account?<StyledLink to="/signup">Create one</StyledLink></BottomFormText>
    </>
  )
}

function SignUp({ updateLoading, isLoading }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState(null);
  
  const handleSignUp = async (evt) => {
    evt.preventDefault();
    updateLoading(true);
    const provider = evt.target.id;
    try {
      await Api.signInProvider({provider});
    } catch (err) {
      setAuthError(err.message);
      updateLoading(false);
    }
  };

  const handleCustomSignUp = async (evt) => {
    evt.preventDefault();
    updateLoading(true);
    try {
      await Api.createUser({name, email, password});
    } catch(err) {
      setAuthError(err.message);
      updateLoading(false);
    } 
  }

  return (
    <>
    <Form onSubmit={handleCustomSignUp}>
      <Title>Welcome!</Title>
      <Section>
        <label htmlFor="name">Name</label>
        <input
          placeholder=" " id="name"  tabIndex="0" autoCorrect="off" required
          value={name} onChange={(evt) => setName(evt.target.value)}
          name="name" autoComplete="name" type="text"></input>
        <span></span>
      </Section>
      <Section>
        <label htmlFor="email">Email</label>
        <input
          placeholder=" " id="email" tabIndex="0" autoCorrect="off" required
          value={email} onChange={(evt) => setEmail(evt.target.value)}
          name="email" autoComplete="username" autoCapitalize="off" type="email"></input>
        <span></span>
      </Section>
      <Section>
        <label htmlFor="password">Password</label>
        <input
          placeholder=" " id="password" tabIndex="0" required
          value={password} onChange={(evt) => setPassword(evt.target.value)}
          name="new-password" pattern="^.{6,}$" autoComplete="new-password" type="password"></input>
        <span></span>
      </Section>
      {Boolean(authError) && <AuthErrorText>{authError}</AuthErrorText>}
      <Button disabled={isLoading}>Sign Up</Button>
      <SeparatorLine><span>or</span></SeparatorLine>
      <LogButton type="button" id="google" onClick={handleSignUp}><img src={GoogleLogo} alt="Google logo"/>Sign up with Google</LogButton>
      <LogButton type="button" id="apple" onClick={handleSignUp}><img alt="Apple Logo" src={AppleLogo}/>Sign up with Apple</LogButton>      
    </Form>
    <BottomFormText>Already have an account?<StyledLink to="/signin">Sign in</StyledLink></BottomFormText>
    </>
  )
}

function AccessPage() {
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [locationState, setLocationState] = useState(null);

  useEffect(_ => {
    setLocationState(state);
  }, []);

  useEffect(_ => {
    if (user) {
      if (locationState?.from === 'invitation' && locationState?.tourneyId) {
        Api.joinTourney({ uid: user.uid, tourneyId: locationState?.tourneyId});
      }
      setAlreadyLogged(true);
    }
  }, [user]);

  if (alreadyLogged) {
    return ( <Redirect to="/tournaments"/> );
  }

  const updateLoading = status => {
    setLoading(status);
  }
  const from = state?.from?.pathname;
  return (
    <Wrapper>
      {loading && <RippleWrapper><Ripple color="#E65100"/></RippleWrapper>}
      <Route path="/signin">
        <SignIn from={from} updateLoading={updateLoading} isLoading={loading} />
      </Route>
      <Route path="/signup">
        <SignUp from={from} updateLoading={updateLoading} isLoading={loading} />
      </Route>
    </Wrapper>
  )
}

export default AccessPage;