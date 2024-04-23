import { setFilter } from '../reducers/filterReducer'
import { useDispatch, useSelector } from 'react-redux'

const Filter = () => {
    const filterContent = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const style = {
        marginBottom: 10
      }

      
    const handleFilter = (event)=>{
        dispatch(setFilter(event.target.value))   
    }

    return (
        <div style={style}>
            filter <input value={filterContent} onChange={handleFilter}/>
        </div>
    )
}


export default Filter