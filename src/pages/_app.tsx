import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import Loading from "../components/Loading/Loading";
import Login from "./login";

import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const storeUserDetails = async () => {
      if (user) {
        const usersRef = collection(db, "users");
        await setDoc(
          doc(usersRef, user.uid),
          {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          { merge: true }
        );
      }
    };
    storeUserDetails().catch(console.error);
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
