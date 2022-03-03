import Image from "next/image";
import loadingImage from "../../assets/images/loading.jpg";

import Head from "next/head";
import styled from "styled-components";

const Loading = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <Container>
        <Image src={loadingImage} alt="blured image of chessboard" />
        <Header>Loading...</Header>
      </Container>
    </>
  );
};

export default Loading;

const Container = styled.div`
  height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Header = styled.h1`
  position: absolute;
  font-size: 60px;
  z-index: 9;
`;
