import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import Header from "../components/Header/Header";
import Loading from "../components/Loading/Loading";

import "../styles/globals.scss";
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
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
