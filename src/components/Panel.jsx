const Panel = (props) => {
    const { 
        children,
        classname
     } = props;

    return(
        <div className={`panel ${classname}`}>
            { children }
        </div>
    )
}

export default Panel;