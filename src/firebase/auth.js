import React, { useState, useEffect } from "react";
import { firebase } from "./config";
import { getUser, addDbUser } from "./api";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  useEffect(_ => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        user = await getUser({uid: user.uid});
        setUser(user);
      } else {
        setUser(user);
      }
    });
  }, []);

  useEffect(_ => {
    firebase.auth()
    .getRedirectResult()
    .then(result => {
      if (!result || !result?.user) return;
      const { name, email } = result.additionalUserInfo.profile;
      const { uid } = result.user;
      addDbUser({ uid, name, email }).then(user => {
        setUser(user);
      });
    })
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}