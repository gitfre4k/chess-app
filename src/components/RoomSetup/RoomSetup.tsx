import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import wKnight from "../../assets/images/wKnight.png";
import bKnight from "../../assets/images/bKinght.png";

import styles from "../../styles/components/RoomSetup.module.scss";

interface IRoomSetupProps {
  roomID: string;
  startGame: () => void;
}

const RoomSetup: React.FC<IRoomSetupProps> = ({ roomID, startGame }) => {
  const [host, setHost] = useState<{ [key: string]: string }>();
  const [guest, setGuest] = useState<{ [key: string]: string }>();
  const [user] = useAuthState(auth);
  const roomDocRef = doc(db, "rooms", roomID);
  const [roomDataSnapshot] = useDocumentData(roomDocRef);

  useEffect(() => {
    const getHostSnap = async () => {
      if (roomDataSnapshot) {
        const hostSnap = await getDoc(doc(db, "users", roomDataSnapshot.host));
        setHost(hostSnap.data());
        if (roomDataSnapshot.guest) {
          const guestSnap = await getDoc(doc(db, "users", roomDataSnapshot.guest));
          setGuest(guestSnap.data());
        }
      }
    };
    getHostSnap();
  }, [roomDataSnapshot]);

  // useEffect(() => {
  //   console.log(host?.photoURL);
  // }, [host]);

  const w8ting = (
    <div className={styles.waiting}>
      <p>Share this room ID with a friend.</p>
      <input value={roomID} readOnly />
      <button onClick={() => navigator.clipboard.writeText(roomID)}>Copy</button>
      <p>W8ing 4 some1 to join...</p>
    </div>
  );

  return (
    <div className={styles.wrrraper}>
      <div className={styles.wraper}>
        <div className={styles.container}>
          <div className={styles.userInfo}>
            {host?.photoURL ? (
              <div className={styles.image}>
                <Image
                  src={host.photoURL}
                  alt="user photo"
                  height="50%"
                  width="50%"
                  objectFit="contain"
                />
              </div>
            ) : null}
            <p>{host?.name}</p>
          </div>
          <div className={styles.hostFigure}>
            <Image src={wKnight} alt="chess piece" height="100%" width="100%" objectFit="contain" />
          </div>
        </div>
        <div className={styles.container}>
          {roomDataSnapshot?.guest ? (
            <>
              <div className={styles.userInfo}>
                {guest?.photoURL ? (
                  <Image src={guest.photoURL} alt="user photo" height="50%" width="50%" />
                ) : null}
                <p>{guest?.name}</p>
              </div>
              <Image
                src={bKnight}
                alt="chess piece"
                height="100%"
                width="100%"
                objectFit="contain"
              />
            </>
          ) : (
            w8ting
          )}
        </div>
      </div>
      {roomDataSnapshot?.guest ? (
        <button className={styles.btn} onClick={startGame}>
          START GAME
        </button>
      ) : null}
    </div>
  );
};

export default RoomSetup;
