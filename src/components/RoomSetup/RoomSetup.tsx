import { useEffect, useState, useMemo } from "react";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import UserInfo from "../UserInfo/UserInfo";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import Image from "next/image";
import wKnight from "../../assets/images/wKnight.png";
import bKnight from "../../assets/images/bKnight.png";

import styles from "../../styles/components/RoomSetup.module.scss";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

interface IRoomSetupProps {
  roomID: string;
  startGame: () => void;
  changeColor: () => void;
  user: User | null | undefined;
  roomDataSnapshot: DocumentData | undefined;
  setClock: (time: string) => void;
}

const RoomSetup: React.FC<IRoomSetupProps> = ({
  roomID,
  changeColor,
  startGame,
  user,
  roomDataSnapshot,
  setClock,
}) => {
  const [host, setHost] = useState<{ [key: string]: string }>();
  const [guest, setGuest] = useState<{ [key: string]: string }>();
  const [toggleColor, setToggleColor] = useState(false);
  const timeIndex = useMemo(() => ["", "1:00", "3:00", "5:00"], []);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const updateRoomInfo = async () => {
      if (roomDataSnapshot) {
        const hostSnap = await getDoc(doc(db, "users", roomDataSnapshot.host));
        setHost(hostSnap.data());
        if (roomDataSnapshot.guest) {
          const guestSnap = await getDoc(doc(db, "users", roomDataSnapshot.guest));
          setGuest(guestSnap.data());
        }
        setToggleColor(roomDataSnapshot.host === roomDataSnapshot.white ? false : true);
      }
    };
    updateRoomInfo();
  }, [roomDataSnapshot]);

  const w8ting = (
    <div className={styles.waiting}>
      <p>Share this room ID with a friend.</p>
      <input value={roomID} readOnly />
      <div onClick={() => navigator.clipboard.writeText(roomID)} className={styles.copyBtn}>
        Copy
      </div>
      <LoadingIndicator pulse={true} />
      <p>W8ing 4 some1 to join...</p>
    </div>
  );

  const changeTime = (increment: boolean) => {
    if (increment)
      setTime((prevValue) => {
        const newValue = prevValue === timeIndex.length - 1 ? 0 : prevValue + 1;
        setClock(timeIndex[newValue]);
        return newValue;
      });
    else
      setTime((prevValue) => {
        const newValue = prevValue === 0 ? timeIndex.length - 1 : prevValue - 1;
        setClock(timeIndex[newValue]);
        return newValue;
      });
  };

  return (
    <div className={styles.wrrraper}>
      <div className={styles.wraper}>
        <div className={styles.container}>
          <UserInfo user={host} />
          <div className={styles.hostFigure + " " + styles.center}>
            <Image
              src={toggleColor ? bKnight : wKnight}
              alt="chess piece"
              height="100%"
              width="100%"
              objectFit="contain"
            />
          </div>
        </div>
        <div className={styles.container}>
          {roomDataSnapshot?.guest ? (
            <>
              <UserInfo user={guest} />
              <div className={styles.guestFigure + " " + styles.center}>
                <Image
                  src={toggleColor ? wKnight : bKnight}
                  alt="chess piece"
                  height="100%"
                  width="100%"
                  objectFit="contain"
                />
              </div>
            </>
          ) : (
            w8ting
          )}
        </div>
      </div>
      {roomDataSnapshot?.guest && roomDataSnapshot?.host === user?.uid ? (
        <div className={styles.hostOptions}>
          <div className={styles.clock}>
            <div className={styles.clockBtn} onClick={() => changeTime(false)}>
              -
            </div>
            <p>{timeIndex[time]}</p>
            <div className={styles.clockBtn} onClick={() => changeTime(true)}>
              +
            </div>
          </div>
          <div className={styles.hostBtn} onClick={changeColor}>
            Change color
          </div>
          <div className={styles.hostBtn} onClick={startGame}>
            START GAME
          </div>
        </div>
      ) : null}
      {roomDataSnapshot?.guest === user?.uid ? (
        <div className={styles.loading}>
          <p>Waiting for host to start a game...</p>
          <LoadingIndicator pulse={true} />
          <p>{roomDataSnapshot?.clock.white}</p>
        </div>
      ) : null}
    </div>
  );
};

export default RoomSetup;
