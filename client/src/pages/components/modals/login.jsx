import { useContext, useState } from 'react';
import api from '../../../api';
import styles from './index.module.scss';
import { ModelContext } from '../../../contexts/modal-context.jsx';
import { UserContext } from '../../../contexts/user-context.jsx';

function LoginModal() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [ui, setUI] = useContext(UserContext);

    const { modalInfo, dispatchModalEvent} = useContext(ModelContext);

    const handleOnClick = () => {
        api.post('/api/auth/login', {
            email,
            password,
        }, {headers: {'content-type': 'application/json' }}).then(({ data }) => {

            console.log(data)
            setError(data.message)

            if (!data.message){
                dispatchModalEvent('close')
                data.isAuthenticated = true
                console.log(data)
                setUI(data)
            }
            
        }).catch(({ response }) => {
            setError(response.data.message)
        });
    }
  
  return (
    <>
    <h1>Login</h1>
    <label htmlFor="email">Email</label>
    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

    <label htmlFor="password">Password</label>
    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

    <button onClick={handleOnClick} className={styles.CTAButton}>Login</button>

    <p className={styles.error}>{error}</p>
    <p>Don't have an account yet? <button onClick={(() => dispatchModalEvent('openSignup'))} className={styles.link}>Sign Up</button></p>

    </>
  );
}

export default LoginModal;