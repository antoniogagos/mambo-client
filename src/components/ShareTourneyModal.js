import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { TourneyContext } from '../pages/TourneyPage';
import { motion } from 'framer-motion';
import { ReactComponent as BoxingGlovesIcon } from '../images/boxing-gloves.svg';
import { ReactComponent as CopyIcon } from '../images/copy.svg';

function ShareTourneyModal({ setShowModal }) {
  const { tourney } = useContext(TourneyContext);
  const [shareLink, setShareLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareAvailable, setShareAvailable] = useState(null);
  const { tourneyId, name } = tourney;
  const [exitAnimation, setExitAnimation] = useState(false);
  const hostNode = useRef();
  const modalNode = useRef();

  const generateShareLink = () => {
    let shareLink = `https://project-mambo-6abfa.web.app/invite/${tourneyId}?name=${name}`.replace(' ', '%20');
    setShareLink(shareLink);
  }

  useEffect(_ => {
    generateShareLink();
    setShareAvailable('share' in navigator);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);


  useEffect(_ => {
    if (exitAnimation) {
      const animation = modalNode.current.animate([
        { transform: 'translate3d(0, 0, 0)', opacity: 1},
        { transform: 'translate3d(0, 100%, 0)', opacity: 0.6},
      ], { duration: 125 });
      animation.onfinish = _ => {
        setShowModal(false);
      }
    }
  }, [exitAnimation]);

  const handleClick = evt => {
    if (evt.target === hostNode.current) {
      setExitAnimation(true);
    }
  };

  const copyToClipboard = () => {
    requestAnimationFrame(_ => {
      const el = document.createElement('textarea');
      el.value = shareLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
    });
  };


  useEffect(_ => {
    if (shareAvailable) {
      const shareData = {
        url: shareLink,
        title: 'Mambo',
        text: `Hey! 😄 - Join ${name} tournament on Mambo!`
      }
      navigator.share(shareData).then(_ => {
        setShowModal(false);
      }).catch(err => {
        setShareAvailable(false);  
      });
    }
  }, [shareAvailable]);

  return (
    <Wrapper ref={hostNode}>
      <Modal
          ref={modalNode}
          initial={{ y: '90%', opacity: 0.8}}
          animate={{ y: 0, opacity: 1}}
          transition={{ ease: 'easeOut' }}
          shareAvailable={shareAvailable}>
        <ModalContainer>
          <BorderTop/>
          <BoxingGlovesIconStyled width="40" height="40" alt="astronaut" />
          <Text>Invite your friends sharing this link.</Text>
          <LinkWrapper>
            <CopyIconStyled width="20" height="20"/>
            <LinkInput onClick={copyToClipboard} defaultValue={shareLink} readOnly/>
          </LinkWrapper>
          {copied && <SmallText initial={{opacity: 0 }} animate={{opacity: 1}}>Copied</SmallText>}
        </ModalContainer>
      </Modal>
    </Wrapper>
  )
}

const SmallText = styled(motion.div)`
  opacity: 1;
  color: #5b8c5e;
  font-size: 16px;
  text-align: center;
`;

const Modal = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.noContrast};
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  box-sizing: border-box;
  min-height: 235px;
  bottom: 0;
  position: absolute;
`;

const CopyIconStyled = styled(CopyIcon)`
  fill: ${props => props.theme.primaryColor};
  position: absolute;
  bottom: 18.55px;
  padding: 8px;
  right: 36px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  pointer-events: none;
  background: ${props => props.theme.lowContrast};
`;

const LinkWrapper = styled.div`
  position: relative;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  background: #0f1826bd;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
`;

const ModalContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  align-items: center;
  padding: 10px 0;
`;

const BorderTop = styled.div`
  width: 34px;
  height: 6px;
  background: #e4e4e4;
  border-radius: 15px;
  margin: 0 auto;
`;

const BoxingGlovesIconStyled = styled(BoxingGlovesIcon)`
  margin: 20px auto;
  background: #f5de83;
  border-radius: 6px;
  padding: 4px;
  box-shadow: inset 0px -1px 1px rgba(0,0,0,0.14);
`;

const Text = styled.div`
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
  text-align: center;
  font-size: 18px;
`;

const LinkInput = styled.input`
  cursor: inherit;
  font-family: monospace;
  color: #788b94;
  background: ${props => props.theme.lowContrast};
  border: none;
  padding: 12px;
  border-radius: 6px;
  text-overflow: ellipsis;
  width: 80%;
  border: 2px dashed #d8d8d8;
  margin: 15px auto;
`;

export default ShareTourneyModal;