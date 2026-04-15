import React from 'react';

export default function FormInput(props) {
    return(
        <input 
            type={props.type}
            id={props.id}
            placeholder={props.placeholder} 
            autoComplete={props.autoComplete}
            required 
        />
    );
}