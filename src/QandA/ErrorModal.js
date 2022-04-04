import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';
export default function ErrorModal() {
  return (
    <Modal>
      <SuccessMessage>
        <XMark></XMark> Error! Your message has not been posted.
      </SuccessMessage>
    </Modal>
  );
}

const XMark = styled.div`
  display: inline-block;
  margin-right: 10px;
  width: 15px;
  height: 15px;
  background: -webkit-linear-gradient(
      -45deg,
      transparent 0%,
      transparent 40%,
      #d8000c 46%,
      #d8000c 56%,
      transparent 56%,
      transparent 100%
    ),
    -webkit-linear-gradient(45deg, transparent 0%, transparent 40%, #d8000c 46%, #d8000c 56%, transparent
          56%, transparent 100%);
`;

const successAnimation = keyframes`
 0% {
   opacity: 0;
   transform: translateY(100px);
 }

 50% {
   opacity: .25;
 }

 100% {
   opacity: 1;
   transform: translateY(0px);
 }
`;

const SuccessMessage = styled.h3`
  background-color: #ffbaba;
  color: #d8000c;
  padding: 20px;
  border-radius: 5px;
  animation: ${successAnimation} 1s ease-in-out;
`;

const Modal = styled.div`
  text-align: center;
  position: fixed;
  margin-left: 25%;
  top: 5.5vh;
  width: 50%;
  z-index: 5;
`;
const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
`;
