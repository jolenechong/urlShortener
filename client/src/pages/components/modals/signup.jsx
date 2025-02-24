import React, { useContext, useState } from 'react';
import api from '../../../api';
import styles from './index.module.scss';
import { ModelContext } from '../../../contexts/modal-context.jsx';
import { UserContext } from '../../../contexts/user-context.jsx';

function SignUpModal() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { modalInfo, dispatchModalEvent} = useContext(ModelContext);
    const [ui, setUI] = useContext(UserContext);

    const handleOnClick = () => {
        api.post('/api/auth/signup', {
            name,
            email,
            password,
            confirmPassword
        }, {headers: {'content-type': 'application/json' }}).then(({ data }) => {
            setError(data.message)
            console.log(data.message)

            if (!data.message){
                dispatchModalEvent('close')
                data.isAuthenticated = true
                console.log(data)
                setUI(data)
            }
            
        }).catch(({ response }) => {
            console.log(response)
            setError(response.data.message)
        });

        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
    }
  
  return (
    <>
    <h1>Sign Up</h1>
    <p style={{'fontSize':'0.875rem', 'color':'#a7a7a7', 'paddingTop':'5px'}}>Sign Up to start getting your shorter links! (no password requirements and no email checking for simplicity of testing)</p>

    <label htmlFor="email">Email</label>
    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

    <label htmlFor="password">Password</label>
    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

    <label htmlFor="passwordConfirm">Confirm Your Password</label>
    <input type="password" name="passwordConfirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

    <button onClick={handleOnClick} className={styles.CTAButton}>Sign Up</button>

    <p className={styles.error}>{error}</p>
    <p>Already have an account? <button onClick={(() => dispatchModalEvent('openLogin'))} className={styles.link}>Login</button></p>


    </>
  );
}

export default SignUpModal;