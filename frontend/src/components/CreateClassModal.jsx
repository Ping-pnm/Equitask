import { createClass } from "../services/classService";
import { useState } from 'react';
import { useAuth } from "./AuthContext";

export default function CreateClassModal({ onClassCreated, onClose }) {
    const { userId } = useAuth();
    const [modalInputs, setModalInputs] = useState({
        title: '',
        section: '',
        subject: ''
    });

    function handleChange(id, value) {
        setModalInputs(prev => ({
            ...prev,
            [id]: value
        }));
    }


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await createClass(
                userId, modalInputs.title, modalInputs.section, modalInputs.subject);

            // Since the service returns the data, we check for the ID
            if (response && response.classId) {
                onClassCreated();
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div id="modal-create-class" className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create class</h2>
                <form id="form-create-class" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" id="class-name" placeholder="Class name (required)" required
                            value={modalInputs.title}
                            onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input type="text" id="class-section" placeholder="Section"
                            value={modalInputs.section}
                            onChange={(e) => handleChange('section', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input type="text" id="class-subject" placeholder="Subject"
                            value={modalInputs.subject}
                            onChange={(e) => handleChange('subject', e.target.value)} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit blue-text">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );

}