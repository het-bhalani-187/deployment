import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock, faGavel, faUser, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const ConsultationDetailsModal = ({ consultation, onClose }) => (
    <div className="modal">
        <div className="modal-content consultation-details">
            <div className="modal-header">
                <h3>Consultation Details</h3>
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className="consultation-detail-grid">
                <div className="detail-item">
                    <label>
                        <FontAwesomeIcon icon={faUser} /> Lawyer
                    </label>
                    <p>{consultation.lawyerId.name}</p>
                </div>
                <div className="detail-item">
                    <label>
                        <FontAwesomeIcon icon={faClock} /> Date & Time
                    </label>
                    <p>{new Date(consultation.date).toLocaleString()}</p>
                </div>
                <div className="detail-item">
                    <label>
                        <FontAwesomeIcon icon={faGavel} /> Type
                    </label>
                    <p>{consultation.type}</p>
                </div>
                <div className="detail-item">
                    <label>Status</label>
                    <p className={`status-${consultation.status.toLowerCase()}`}>
                        {consultation.status}
                    </p>
                </div>
                <div className="detail-item">
                    <label>Duration</label>
                    <p>{consultation.duration} minutes</p>
                </div>
                {consultation.documents && consultation.documents.length > 0 && (
                    <div className="detail-item full-width">
                        <label>
                            <FontAwesomeIcon icon={faFileAlt} /> Related Documents
                        </label>
                        <div className="related-documents">
                            {consultation.documents.map((doc, index) => (
                                <div key={index} className="related-document">
                                    <span>{doc.title}</span>
                                    <small>{doc.type}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="detail-item full-width">
                    <label>Notes</label>
                    <p>{consultation.notes || 'No notes available'}</p>
                </div>
                {consultation.outcome && (
                    <div className="detail-item full-width">
                        <label>Outcome</label>
                        <p>{consultation.outcome}</p>
                    </div>
                )}
                {consultation.nextSteps && (
                    <div className="detail-item full-width">
                        <label>Next Steps</label>
                        <p>{consultation.nextSteps}</p>
                    </div>
                )}
                {consultation.feedback && (
                    <div className="detail-item full-width">
                        <label>Feedback</label>
                        <div className="feedback-section">
                            <div className="rating">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`star ${i < consultation.feedback.rating ? 'filled' : ''}`}
                                    >★</span>
                                ))}
                            </div>
                            {consultation.feedback.comment && (
                                <p className="feedback-comment">{consultation.feedback.comment}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    </div>
);

export default ConsultationDetailsModal;
