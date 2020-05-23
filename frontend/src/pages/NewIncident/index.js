import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css'

import logoImg from '../../assets/logo.svg';
import { useState } from 'react';

export default function NewIncident() {

    const history = useHistory();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState(''); 
    const [value, setValue] = useState('');

    //const ongId = localStorage.getItem('ongId');
    const userId = localStorage.getItem('userId');

    const handleChange = e => {
        if (e.target.files[0]) {              
            //var url = URL.createObjectURL(e.target.files[0]);
            //console.log("wowo ",url);
            //setImage(URL.createObjectURL(e.target.files[0]));
            setImage(e.target.files[0]);
        }        
    };

    async function handleNewIncident(e) {
        e.preventDefault();

        const data = {
            title,
            description,
            image,
            value,
            userId,
        };    

        try{
            await api.post('incidents', data, {
                headers: {
                    Authorization: userId,/*ongId,*/
                }
            })
            history.push('/profile');
        }catch(err) {
            alert('Error al registrar el caso, intente nuevamente');
        }
    }

if (image!=null ) {
console.log("image1: ",image, window.btoa(image.webkitRelativePath))
}
    return(
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be the Hero"/>

                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>

                    <Link className="back-link" to="/profile">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para home
                    </Link>   
                </section>
                <form onSubmit={handleNewIncident} >
                    <input 
                        placeholder="Título do caso" 
                        value={title}
                        onChange={e=>setTitle(e.target.value)}
                    />
                    <textarea 
                        placeholder="Descricao" 
                        value={description}
                        onChange={e=>setDescription(e.target.value)}
                    />
                    <input 
                        type="file"                               
                        onChange={handleChange}                        
                    />
                    <input 
                        placeholder="Valor em reais" 
                        value={value}
                        onChange={e=>setValue(e.target.value)}
                    />
                    <button className="button" type="submit" >Cadastrar</button>                   
                </form>
            </div>
        </div>
    );
}