const Panel = (props) => {
    const { 
        children,
        classname
     } = props;

    return(
        <div className="panel">
            { children }
        </div>
    )
}

export default Panel;