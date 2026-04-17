import React from 'react';

export default function FormInput({ label, labelClass, ...props }) {
    return (
        <div className="form-group">
            {label && <label htmlFor={props.id} className={labelClass}>{label}</label>}
            <input {...props} required />
        </div>
    );
}