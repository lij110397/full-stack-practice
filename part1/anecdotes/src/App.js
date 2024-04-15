import { useState } from "react";

// const MostVote = ({ vote, max, anecdotes, setMax }) => {
//   let maxVote = Math.max(...vote);
//   let maxIndex = vote.indexOf(maxVote);
//   if (maxIndex !== max) {
//     setMax(maxIndex);
//   }
//   return (
//     <div>
//       <p>{anecdotes[maxIndex]}</p>
//       <p>has {vote[maxIndex]} votes</p>
//     </div>
//   );
// };

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState([0, 0, 0, 0, 0, 0, 0]);
  //const [max, setMax] = useState(0);

  const maxVote = Math.max(...vote)
  const maxVoteAnecDotes = anecdotes[vote.findIndex(vote => vote === maxVote)]

  const random = () => {
    let randomNumber = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomNumber);
  };
  
  const voteFunction = () => {
    const copy = [...vote];
    copy[selected] += 1;
    setVote(copy);
  };

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <button onClick={voteFunction}>vote</button>
        <button onClick={random}>next anecdote</button>
      </div>
      <div>
        <h1>Anecdote with the most votes</h1>
        <p>{maxVoteAnecDotes}</p>
        <p>has {maxVote} votes</p>
        {/* <MostVote
          anecdotes={anecdotes}
          vote={vote}
          max={max}
          setMax={() => setMax}
        /> */}
      </div>
    </div>
  );
};

export default App;
