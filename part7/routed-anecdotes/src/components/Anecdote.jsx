/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom"
const Anecdote = ({anecdotes}) => {
    const id = useParams().id
    console.log('id in component ', id);
    const anecdote = anecdotes.find(anecdote => anecdote.id === Number(id))
    console.log('anecdote in component ', anecdote);
    return (
        <div>
            <h1>{anecdote.content}</h1>
            <p>has {anecdote.votes} votes</p>
            <p>for more information see <a href={anecdote.info}>{anecdote.info} </a></p>
        </div>
    )
}

export default Anecdote