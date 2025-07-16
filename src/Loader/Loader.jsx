import React from 'react';
import logo from '../images/logo/logo.png';
import styles from '../Loader/Loader.module.css';

export default function Loader(){
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <img src={logo} alt="Loading..." className={styles.logo} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    </div>
  );
};

