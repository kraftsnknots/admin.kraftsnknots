import "./styles/AddButton.css";
const AddButton = (props) => {
    return (
        <button
            className="add-selected-btn"
            style={{ width: props.width }}
            onClick={props.delete}
        >
            <small><i className="fa-solid fa-trash"></i></small>
            <small> Add ({props.length})</small>
        </button>
    )
}

export default AddButton;