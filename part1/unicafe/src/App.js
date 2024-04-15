import { useState } from "react";

const Button = ({ clickEvent, text }) => (
  <button onClick={clickEvent}>{text}</button>
);
const StatisticLine = ({ text, value }) => (
  <tr>
    <th>{text}</th>
    <td>{value}</td>
  </tr>
);

const Positive = ({ text, value }) => (
  <tr>
    <th>{text}</th>
    <td>{value}%</td>
  </tr>
);
const Statistics = ({ comments }) => {
  if (comments[0].amount + comments[1].amount + comments[2].amount === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  } else {
    return (
      <table>
        <StatisticLine text={comments[0].text} value={comments[0].amount} />
        <StatisticLine text={comments[1].text} value={comments[1].amount} />
        <StatisticLine text={comments[2].text} value={comments[2].amount} />
        <StatisticLine
          text="average"
          value={
            (comments[0].amount * 1 + comments[2].amount * -1) /
            (comments[0].amount + comments[1].amount + comments[2].amount)
          }
        />
        <Positive text='positive' value={comments[0].amount/(comments[0].amount+comments[1].amount+comments[2].amount)*100}/>
      </table>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => setGood(good + 1);
  const increaseNeutral = () => setNeutral(neutral + 1);
  const increaseBad = () => setBad(bad + 1);
  const comments = [
    { text: "good", amount: good },
    { text: "neutral", amount: neutral },
    { text: "bad", amount: bad },
  ];

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button clickEvent={increaseGood} text="good" />
        <Button clickEvent={increaseNeutral} text="neutral" />
        <Button clickEvent={increaseBad} text="bad" />
      </div>
      <div>
        <h1>statistics</h1>
        <Statistics comments={comments} />
      </div>
    </div>
  );
};

export default App;
