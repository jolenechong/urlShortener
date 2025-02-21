import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext, withUserContext } from '../../contexts/user-context';
import { ModelContext, withModalContext } from '../../contexts/modal-context';
import Modal from '../components/modals/index.jsx';
import api from "../../api"

function Home() {

    const [ui, setUI] = useContext(UserContext);
    const { modalInfo, dispatchModalEvent} = useContext(ModelContext);

    // query params
    const { accessLink } = useParams();
    if (accessLink != undefined) { // if access link is avail then "click" the link and redirect
        console.log("accessing link", accessLink)
        
        api.post('/api/access', {
            "url": "http://localhost:3001/access/" + accessLink
        }, {headers: {'content-type': 'application/json' }}).then(({ data }) => {
            console.log(data)
            window.location.href = data.long_url
        }).catch(({ response }) => {
            console.log(response)
        });
    }
    
    const [links, setLinks] = useState([]);
    const [link, setLink] = useState("");

    const handleSubmit = () => {
        console.log("submitting link", link)

        api.post('/api/shorten', {
            "url": link
        }, {headers: {'content-type': 'application/json' }}).then(({ data }) => {
            console.log(data)
            setLinks([...links, data])
        }).catch(({ response }) => {
            console.log(response)
        });
    }
    
    // set links
    useEffect(() => {
        api.get('/api/all').then(({ data }) => {
            console.log(data)
            setLinks(data)
        }).catch(({ response }) => {
            console.log(response)
        });
    }, []);

  return (
    <>
    {/* add a pretty login/signup button on to the top right */}
    <div className="flex justify-end p-4">
        <button onClick={() => dispatchModalEvent('openSignup')} className="p-2 bg-blue-500 text-white rounded-lg user-select">Sign Up</button>
        <button onClick={() => dispatchModalEvent('openLogin')} className="p-2 bg-blue-500 text-white rounded-lg ml-2">Login</button>
    </div>
    
    <section className="flex justify-center bg-slate-950">
        <div className="flex h-screen w-screen items-center justify-center flex-col px-4">
            <div className="p-4">
                <h1 className="text-3xl pb-2 font-bold text-white">URL Shortener</h1>
                <p className="pb-4 text-white">Shorten extra-long links today!</p>
            </div>
            <div className="p-4 w-full flex justify-center">
                <input 
                    type="text" 
                    name='url'
                    value={link} onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter your superrrrrrr long URL"
                    className="w-full max-w-[600px] min-w-[300px] p-3 mb-4 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" 
                />
                <button onClick={handleSubmit} >Submit</button>
            </div>
        </div>
    </section>

    <section className="bg-slate-950">
        <div className="max-w-[1000px] m-auto p-4 flex flex-col justify-center py-50">
        <h1 className="text-2xl font-bold">Past Shorterned Links</h1>
        <p>Developed by <a href="https://github.com/jolenechong" target="_blank" rel="noreferrer" className="underline">Jolene</a></p>
        <div className="flex flex-col">
            {links.length === 0 && <p>No links yet! Create one above :)</p>}
            {links.map((link, index) => {
                return (
                    <div key={index} className="flex justify-between p-2 border-b border-slate-700">
                        <p>{link.long_url}</p>
                        <a href={link.short_url} target="_blank" rel="noreferrer">{link.short_url}</a>
                        <p>{link.click_count}</p>
                    </div>
                )
            })}
        </div>
        </div>
    </section>

    <Modal />
      
    </>
  );
}

export default withUserContext(withModalContext(Home));