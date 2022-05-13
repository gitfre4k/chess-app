import { useEffect, useState } from "react";
import useRoomSetup from "../../hooks/useRoomSetup";

import { db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

import Button from "../Button/Button";
import User from "./User";
import WaitingForGuest from "./WaitingForGuest";
import WaitingForHost from "./WaitingForHost";
import HostScreen from "./HostScreen";

import styles from "../../styles/components/RoomSetup.module.scss";
import { User as IUser } from "firebase/auth";

interface IRoomSetupProps {
  roomID: string;
  user: IUser;
  roomState: DocumentData;
}

const RoomSetup: React.FC<IRoomSetupProps> = ({ roomID, user, roomState }) => {
  const [hostUser, setHostUser] = useState<DocumentData>();
  const [guestUser, setGuestUser] = useState<DocumentData>();
  const { host, guest } = roomState;
  const toggleColor = host !== roomState.white;

  useEffect(() => {
    (async () => {
      setHostUser((await getDoc(doc(db, "users", host))).data());
      guest && setGuestUser((await getDoc(doc(db, "users", guest))).data());
    })();

    if (!guest && user.uid !== host) {
      const docRef = doc(db, "rooms", roomID);
      updateDoc(docRef, {
        guest: user.uid,
        black: user.uid,
      });
      addDoc(collection(db, "messages"), {
        timestamp: serverTimestamp(),
        user: "SERVER",
        roomID: roomID,
        msg: user?.displayName + " has joined the room.",
      });
    }
  }, [guest, host, user, roomID]);

  return (
    <div className={styles.container}>
      <div className={styles.roomSetup}>
        <div className={styles.roomSetupUsers}>
          <fieldset>
            <legend>Players ({roomState.guest ? "2" : "1"}/2)</legend>
            <User user={hostUser} toggleColor={toggleColor} rotate={true} />
            {guest ? <User user={guestUser} toggleColor={!toggleColor} /> : null}
          </fieldset>
          {guest ? null : <WaitingForGuest roomID={roomID} />}
        </div>
        {guest && host === user.uid ? <HostScreen user={user} roomState={roomState} /> : null}
        {guest === user.uid ? <WaitingForHost clock={`${roomState.clock}`} /> : null}
      </div>
      <div className={styles.btn}>
        <Button name="Go Back" action={useRoomSetup(user, roomState).goBack} style="dark" />
      </div>
    </div>
  );
};

export default RoomSetup;
