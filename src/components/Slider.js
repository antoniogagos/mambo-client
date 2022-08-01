import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import Champions from '../images/competitions/football_champions_league.svg';
import SpainLeague from '../images/competitions/football_spain_league_1.webp';
import EnglandLeague from '../images/competitions/football_england_league_1.webp';
import styled from 'styled-components';
import { ReactComponent as LeftArrow } from '../images/left-arrow.svg';
import { ReactComponent as RightArrow } from '../images/right-arrow.svg';

const images = [Champions, SpainLeague, EnglandLeague];

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default ({ competitions, selectedCompetition }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);
  const [competitionsData, setCompetitionsData] = useState([]);
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(_ => {
    if (!competitionsData) return;
    var competition = competitionsData.find(c => c.order === imageIndex);
    if (competition) {
      selectedCompetition(competition);
    }
  }, [imageIndex]);

  useEffect(_ => {
    if (!competitions.length) return;
    const staticCompData = [{
      'competitionId': 'football_champions_league',
      'name': '🇪🇺 Champions League',
      'subtitle':  'Round of 16 (1/2)',
      'order': 0
    },
    {
      'competitionId': 'football_spain_league_1',
      'name': '🇪🇸 La Liga',
      'subtitle': 'Matchday 13',
      'order': 1
    },
    {
      'competitionId': 'football_england_league_1',
      'name': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League',
      'subtitle': 'Matchday 12',
      'order': 2
    }];
    for (let competition of competitions) {
      const found = staticCompData.find(c => c.competitionId === competition.competitionId);
      competition.name = found.name;
      competition.order = found.order;
      setCompetitionsData(prevState => [...prevState, competition]);
    }
   
  }, [competitions]);
  
  if (competitionsData.length === 3) {
    var competition = competitionsData.find(c => c.order === imageIndex);
    var { name, currentMatchday, competitionId } = competition;
    var matchdayText;
    if (competitionId === 'football_champions_league') { 
      const rounds = {
        7: 'Round of 16 (1/2)',
        8: 'Round of 16 (2/2)',
        9: 'Quarterfinals (1/2)',
        10: 'Quarterfinals (2/2)',
      }
      matchdayText = rounds[currentMatchday];
    } else {
      matchdayText = `Matchday ${currentMatchday}`;
    }
  }
  
  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <Image
          src={images[imageIndex]}
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
        {competitionId && (
          <CompetitionData animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Name>{name}</Name>
            <Subtitle>{matchdayText}</Subtitle>
            {/* <NextGame>Next game starts in </NextGame> */}
          </CompetitionData>
        )
        }

      </AnimatePresence>
      <SideButtons className="next" onClick={() => paginate(1)}>
        <RightArrow fill="#e4e4e4" width="18" height="18" />
      </SideButtons>
      <SideButtons className="prev" onClick={() => paginate(-1)}>
        <LeftArrow fill="#e4e4e4" width="18" height="18"/>
      </SideButtons>
      <Dots>
        <Dot className={imageIndex === 0 ? 'selected' : ''}></Dot>
        <Dot className={imageIndex === 1 ? 'selected' : ''}></Dot>
        <Dot className={imageIndex === 2 ? 'selected' : ''}></Dot>
      </Dots>
    </>
  );
};


const SideButtons = styled.div`
  top: calc(50% - 20px);
  position: absolute;
  background: inherit;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  font-weight: bold;
  font-size: 18px;
  z-index: 2;
  &.next {
    right: 10px;
  }
  &.prev {
    left: 10px;
  }
`;

const Image = styled(motion.img)`
  position: absolute;
  width: 150px;
  height: 150px;
`;


const Dots = styled.div`
  display: flex;
  position: absolute;
  bottom: -55px;
`;

const Dot = styled.div`
  background: #90a4ae42;
  height: 7px;
  width: 7px;
  margin: 0 5px;
  border-radius: 100%;
  &.selected {
    background: #4caf519e;
  }
`;

const NextGame = styled.div``;

const CompetitionData = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  position: absolute;
  bottom: 0;
  line-height: 34px;
  flex-direction: column;
  transform: scale(0);
  opacity: 0;
`;

const Subtitle = styled.div`
  color: #565656f7;
  font-size: 16px;
  text-align: center;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;