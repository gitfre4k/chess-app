import { useEffect, useState } from "react";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import User from "./User";
import WaitingForGuest from "./WaitingForGuest";
import HostScreen from "./HostScreen";

import styles from "../../styles/components/RoomSetup.module.scss";
import { User as IUser } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

interface IRoomSetupProps {
  roomID: string;
  user: IUser | null | undefined;
  roomDataSnapshot: DocumentData | undefined;
}

const RoomSetup: React.FC<IRoomSetupProps> = ({ roomID, user, roomDataSnapshot }) => {
  const [host, setHost] = useState<{ [key: string]: string }>();
  const [guest, setGuest] = useState<{ [key: string]: string }>();
  const [toggleColor, setToggleColor] = useState(false);

  useEffect(() => {
    const updateRoomInfo = async () => {
      if (roomDataSnapshot?.host) {
        const hostSnap = await getDoc(doc(db, "users", roomDataSnapshot.host));
        setHost(hostSnap.data());
      }
      if (roomDataSnapshot?.guest) {
        const guestSnap = await getDoc(doc(db, "users", roomDataSnapshot.guest));
        setGuest(guestSnap.data());
      }
      setToggleColor(roomDataSnapshot?.host === roomDataSnapshot?.white ? false : true);
    };
    updateRoomInfo();
  }, [roomDataSnapshot?.host, roomDataSnapshot?.guest, roomDataSnapshot?.white]);

  return (
    <div className={styles.wrrraper}>
      <div className={styles.wraper}>
        <User user={host} toggleColor={toggleColor} rotate={true} />
        {roomDataSnapshot?.guest ? (
          <User user={guest} toggleColor={!toggleColor} />
        ) : (
          <WaitingForGuest roomID={roomID} />
        )}
      </div>
      {roomDataSnapshot?.guest && roomDataSnapshot?.host === user?.uid ? <HostScreen /> : null}
      {roomDataSnapshot?.guest === user?.uid ? (
        <div className={styles.loading}>
          <p>Waiting for host to start a game...</p>
          <LoadingIndicator pulse={true} />
          <div>
            <p>Settings:</p>
            <p>
              Clock: {roomDataSnapshot?.clock.white ? roomDataSnapshot?.clock.white : "No Timer"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RoomSetup;
