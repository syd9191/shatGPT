import {useState} from "react";

interface Props{
    items: String[];
    heading: String;
    onSelectItem: (item: String)=>void;   //when defining functions we need a name for the argument and its type, along with return value

}
function ListGroup({items, heading, onSelectItem}:Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    return (
        <>
            <h1>{heading}</h1>
            <ul className="list-group">
            {items.length===0&&<p>No Items Found</p>}
                {items.map((items, index)=> <li
                className={index===selectedIndex?"list-group-item active": "list-group-item"}
                key={items}
                onClick={()=>{
                    setSelectedIndex(index)
                    onSelectItem(items)
                }}>  
                    {items}</li>)}
                </ul>
        </>);
}

export default ListGroup;

