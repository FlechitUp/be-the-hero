import React, { useState } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';
//97fa575b

import './styles.css';

import logoImg from '../../assets/logo.svg';
import heroesImg from '../../assets/heroes.png';

export default function Logon(){

    //const [id, setId] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
   
    const history = useHistory();
    

    async function handleLogin(e) {
        e.preventDefault(); //USar em todo formulario
        
        try {
            const response = await api.post('sessions', { email, password });
            //Salvar no almacenamento local
            /*
            Verificar no browser console:  Application -> Local Storage -> localhost:3000
            voce verao ongId e ongName
             */            
            localStorage.setItem('userId', response.data.token);
            //localStorage.setItem('ongName', response.data.name);
            
            history.push('/profile');
            //console.log(response.data.name);
        }catch(err){
            alert('Falha no login');
        }
    }

    return (
       <div className="logon-container">
           <section className="form">
               <img src={logoImg} alt="Be the hero"/>

                <form onSubmit={handleLogin}>
                    <h1>Faca seu Logon</h1>
                   
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={e => setEmail(e.target.value) }
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={e => setPassword(e.target.value) }
                    />
                    

                    <button type="submit" className="button" >Entrar</button>                

                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        nao tenho cadastro
                    </Link>                   
                </form>
           </section>

           <img src={ heroesImg } alt="Heroes" />
       </div>
    );
}