//Header负责显示课程的名称
const Header = ({name}) => {

  return <h1>{name}</h1>;
};
const Part = ({part}) => {
  return [
    <p>
      {part.name} {part.number}
    </p>
  ];
};
//Content显示各部分及其练习的数量
const Content = ({parts}) => {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  );
};
// const Content = (props) => {
//   return [
//     <p>
//       {props.parts[0].name} {props.parts[0].number}
//     </p>,
//     <p>
//       {props.parts[1].name} {props.parts[1].number}
//     </p>,
//     <p>
//       {props.parts[2].name} {props.parts[2].number}
//     </p>,
//   ];
// };

//Total显示练习的总数量。
const Total = ({parts}) => {
  return (
    <>
      <p>Number of exercises {parts[0].number+parts[1].number+parts[2].number} </p>
    </>
  );
};

const App = () => {
  // const-definitions
  const course = {
    name:"Half Stack application development",
    parts:[
      { name: "Fundamentals of React", number: 10 },
      { name: "Using props to pass data", number: 7 },
      { name: "State of a component", number: 14 },
    ]
  }
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

//original code
// const App = () => {
//   const course = 'Half Stack application development'
//   const part1 = 'Fundamentals of React'
//   const exercises1 = 10
//   const part2 = 'Using props to pass data'
//   const exercises2 = 7
//   const part3 = 'State of a component'
//   const exercises3 = 14

//   return (
//     <div>
//       <h1>{course}</h1>
//       <p>
//         {part1} {exercises1}
//       </p>
//       <p>
//         {part2} {exercises2}
//       </p>
//       <p>
//         {part3} {exercises3}
//       </p>
//       <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
//     </div>
//   )
// }

// export default App
export default App;
