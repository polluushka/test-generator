const Panel = (props) => {
    const { 
        children,
        onClick
     } = props;

    return(
        <div className="panel" onClick={ onClick }>
            { children }
        </div>
    )
}

export default Panel;