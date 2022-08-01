import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './firebase/auth';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import Checkbox from './components/Checkbox';
import themesMap from './css/themes.json';
import RouteMiddleware from './components/RouteMiddleware';
import LandingPage from './pages/LandingPage';
import './css/App.css';

function App() {
  const [currentTheme, setCurrentTheme] = useState('lightTheme');
  const theme = { ...themesMap['global'], colors: themesMap[currentTheme] };

  return (
    <ThemePreferenceContext.Provider value={{ currentTheme, setCurrentTheme }}>
      <ThemeProvider theme={theme}>
        <Wrapper>
          <CheckboxStyled/>
          <Router>
            <AuthProvider>
              <Switch>
                <Route exact path="/">
                  <LandingPage/>
                </Route>
                <Route path={["/signin", "/signup", "/tournaments", "/invite/:tourneyId"]}>
                  <RouteMiddleware/>
                </Route>
              </Switch>
            </AuthProvider>
          </Router>
        </Wrapper>
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}

const Wrapper = styled.div`
  background: ${props => props.theme.main};
  color: ${props => props.theme.primaryColor};
  height: 100vh;
  overflow: hidden;
  transition: 250ms background ease-in;
  width: 100vw;
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  animation: 575ms ${fade};
`;

export const ThemePreferenceContext = React.createContext();
export default App;