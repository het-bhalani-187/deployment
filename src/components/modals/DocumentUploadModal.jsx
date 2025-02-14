import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DocumentUploadModal = ({ document, onChange, onSubmit, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <div className="modal-header">
                <h3>Upload Legal Document</h3>
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Document Title</label>
                    <input
                        type="text"
                        value={document.title}
                        onChange={(e) => onChange({...document, title: e.target.value})}
                        placeholder="Enter document title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Document Type</label>
                    <select
                        value={document.type}
                        onChange={(e) => onChange({...document, type: e.target.value})}
                        required
                    >
                        <option value="">Select Document Type</option>
                        <option value="Contract">Contract</option>
                        <option value="Court Filing">Court Filing</option>
                        <option value="Affidavit">Affidavit</option>
                        <option value="Legal Notice">Legal Notice</option>
                        <option value="Power of Attorney">Power of Attorney</option>
                        <option value="Agreement">Agreement</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={document.description}
                        onChange={(e) => onChange({...document, description: e.target.value})}
                        placeholder="Enter document description"
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <label>Document File</label>
                    <input
                        type="file"
                        onChange={(e) => onChange({...document, file: e.target.files[0]})}
                        accept=".pdf,.doc,.docx"
                        required
                    />
                    <small className="file-hint">Supported formats: PDF, DOC, DOCX (Max size: 10MB)</small>
                </div>
                <div className="modal-actions">
                    <button type="submit" className="submit-btn">Upload Document</button>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>
);

export default DocumentUploadModal;
