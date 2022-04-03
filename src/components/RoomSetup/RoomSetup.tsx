import { useEffect, useState } from "react";
import useRoomSetup from "../../hooks/useRoomSetup";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import User from "./User";
import WaitingForGuest from "./WaitingForGuest";
import WaitingForHost from "./WaitingForHost";
import HostScreen from "./HostScreen";
import Image from "next/image";
import back from "../../assets/images/back.png";

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
  const { goBack } = useRoomSetup();

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
    <>
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
          <WaitingForHost clock={`${roomDataSnapshot?.clock.white}`} />
        ) : null}
      </div>
      <div className={styles.back} onClick={goBack}>
        <Image src={back} alt="back icon" />
      </div>
    </>
  );
};

export default RoomSetup;
