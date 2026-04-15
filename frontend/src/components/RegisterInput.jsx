import React from 'react';

export default function RegisterInput(props) {
    return(
        <div class="form-group">
            <label for={props.id} className={props.labelClass}>{props.labelContent}</label>
            <input type={props.type} id={props.id} placeholder={props.placeholder} autoComplete={props.autoComplete} required/>
        </div>
    );
}