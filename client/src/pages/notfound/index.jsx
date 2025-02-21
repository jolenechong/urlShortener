import React, {  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './index.module.scss'

export default function NotFound() {
    let navigate = useNavigate();
    const location = useLocation();
    
  return (
    <>
      <div className={styles.notfound}>
        <h1>Page Not Found :(</h1>
        <p className="pb-2">{location.state.notification}</p>
        <div className="flex">
          <button className={styles.button} onClick={(() => {navigate("/", { replace: true });})}>Back to Home</button>
          <button className={styles.button} onClick={(() => {navigate("/play", { replace: true });})}>Play Again</button>
        </div>
      </div>
    </>
  );
}