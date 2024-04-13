import { MouseEventHandler, useEffect, useState } from "react";
import FlashCard from "./flashCard";

interface Card {
  front: string;
  back: string;
}

interface HistoryEntry {
  card: Card;
  answeredCorrect: boolean;
  date: Date;
}

interface SessionStatistics {
  answeredCorrect: number;
  totalAnswered: number;
}

interface Options {
  shuffle: boolean;
}

enum StateValues {
  start = 0,
  started,
  finished,
}

function KanjiPractice() {
  const [currentCard, setCurrentCard] = useState(0);

  const [answerHistory, setAnswerHistory] = useState<HistoryEntry[]>([]);

  const [queue, setQueue] = useState<Card[]>([]);

  const [options, setOptions] = useState<Options>({ shuffle: false });

  const [state, setState] = useState<StateValues>(StateValues.start);

  const testSet: Card[] = [
    { front: "綺麗", back: "きれい" },
    { front: "優しい", back: "やさしい" },
    { front: "家", back: "いえ" },
    { front: "日本", back: "にほん" },
    { front: "可愛い", back: "かわいい" },
    { front: "甘い", back: "あまい" },
    { front: "赤い", back: "あかい" },
  ];

  useEffect(() => {
    setQueue(testSet);
  }, [])

  const handleStateChange = (newState: StateValues) => {
    switch (newState) {
      case StateValues.start:
        break;
      case StateValues.started:
        if (options.shuffle) {
          // shuffle code maybe refactor later
          let shuffledQueue = [...queue];
          for (var i = shuffledQueue.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[rand]] = [
              shuffledQueue[rand],
              shuffledQueue[i],
            ];
          }
          setQueue(shuffledQueue);
        }
        setState(newState);
        break;
      case StateValues.finished:
        setState(newState);
        break;
      default:
        break;
    }
    return;
  };

  const handleShuffleClick = () => {
    setOptions({ ...options, shuffle: !options.shuffle });
  };

  const renderStart = () => {
    return (
      <>
        <p>Reviewing INSERT DECK NAME</p>
        <label className="items-center cursor-pointer">
          <input
            type="checkbox"
            checked={options.shuffle}
            onClick={handleShuffleClick}
          />
          <span className="ms-3 text-sm font-medium">Shuffle</span>
        </label>
        <button onClick={() => handleStateChange(StateValues.started)}>
          Start
        </button>
      </>
    );
  };

  const renderReview = () => {
    return (
      <>
        <p className="text-xl">
          {getStatistics().answeredCorrect} / {getStatistics().totalAnswered}
        </p>
        <div className="flex grow items-center">
          <FlashCard
            front={queue[currentCard].front}
            back={queue[currentCard].back}
            cb={nextClick}
          />
        </div>
      </>
    );
  };

  // convert to memo hook !!
  const getStatistics = (): SessionStatistics => {
    let totalCorrect = 0;
    for (const answer of answerHistory) {
      if (answer.answeredCorrect) {
        totalCorrect++;
      }
    }
    return {
      answeredCorrect: totalCorrect,
      totalAnswered: answerHistory.length,
    };
  };

  const nextClick = (answeredCorrect: boolean) => {
    if (queue.length - 1 > currentCard) {
      setAnswerHistory([
        ...answerHistory,
        {
          card: queue[currentCard],
          answeredCorrect: answeredCorrect,
          date: new Date(),
        },
      ]);
      setCurrentCard((prev) => {
        return prev + 1;
      });
    } else {
      handleStateChange(StateValues.finished);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <p className="text-2xl font-bold">Kanji Practice Module</p>
      {state == StateValues.start ? (
        renderStart()
      ) : state == StateValues.started ? (
        renderReview()
      ) : (
        <p>Finished</p>
      )}
    </div>
  );
}

export default KanjiPractice;
