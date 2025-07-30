import React from 'react'

const Alert = (props) => {
    const capitalize= (word)=>{
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{height:'50px'}}>
            {props.alert && (
                <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                    <strong>
                        <span>
                            {props.alert.type === "success" && <span style={{ color: "#38d46a" }}>{capitalize(props.alert.type)}</span>}
                            {props.alert.type === "danger" && <span style={{ color: "#ff4c4c" }}>{capitalize(props.alert.type)}</span>}
                            {props.alert.type === "error" && <span style={{ color: "#ff4c4c" }}>{capitalize(props.alert.type)}</span>}
                            {props.alert.type === "warning" && <span style={{ color: "#ffd600" }}>{capitalize(props.alert.type)}</span>}
                            {props.alert.type === "info" && <span style={{ color: "#38b6ff" }}>{capitalize(props.alert.type)}</span>}
                            {["success", "danger", "error", "warning", "info"].indexOf(props.alert.type) === -1 && capitalize(props.alert.type)}
                        </span>
                    </strong>
                    : {props.alert.msg}
                </div>
            )}
        </div>
    )
}

export default Alert