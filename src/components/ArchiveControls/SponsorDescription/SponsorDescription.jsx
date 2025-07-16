import { Modal, Button } from 'react-bootstrap';
import styles from '../SponsorDescription/SponsorDescription.module.css';

export default function SponsorDescription ({ show, onHide, description }){
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      backdrop="static" 
      className={styles.modal}
      contentClassName={styles.modalContent}
    >
      <div className={`modal-header ${styles.modalHeader}`}>
        <button
          type="button"
          className={`btn-close ${styles.closeButton}`}
          onClick={onHide}
          aria-label="Close"
        ></button>
      </div>

      <div className={`modal-body ${styles.modalBody}`}>
        <div className={styles.descriptionContent}>
          {description || 'No description available'}
        </div>
      </div>
    </Modal>
  );
};


