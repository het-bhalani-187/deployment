import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PreferenceModal = ({ preference, onChange, onSubmit, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <div className="modal-header">
                <h3>Add Case Preference</h3>
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Type of Case</label>
                    <select
                        value={preference.type}
                        onChange={(e) => onChange({...preference, type: e.target.value})}
                        required
                    >
                        <option value="">Select Case Type</option>
                        <option value="Civil">Civil Law</option>
                        <option value="Criminal">Criminal Law</option>
                        <option value="Family">Family Law</option>
                        <option value="Corporate">Corporate Law</option>
                        <option value="Property">Property Law</option>
                        <option value="Employment">Employment Law</option>
                        <option value="Intellectual Property">Intellectual Property</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <select
                        value={preference.priority}
                        onChange={(e) => onChange({...preference, priority: e.target.value})}
                        required
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={preference.description}
                        onChange={(e) => onChange({...preference, description: e.target.value})}
                        placeholder="Describe your case preference..."
                        rows="4"
                        required
                    />
                </div>
                <div className="modal-actions">
                    <button type="submit" className="submit-btn">Add Preference</button>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>
);

export default PreferenceModal;
