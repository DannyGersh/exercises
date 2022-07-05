import "./styles.css";

function Tag(props){
    return(
        <button className="tag">{props.children}</button>
    )
}
export default Tag;