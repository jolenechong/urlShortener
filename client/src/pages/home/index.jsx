import { useState, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext, withUserContext } from '../../contexts/user-context';
import { ModelContext, withModalContext } from '../../contexts/modal-context';
import Modal from '../components/modals/index.jsx';
import api from "../../api"

function Home() {

    const [ui, setUI] = useContext(UserContext);
    const { modalInfo, dispatchModalEvent } = useContext(ModelContext);
    const [links, setLinks] = useState([]);
    const [llink, setLLink] = useState(""); // keep track of long link
    const [link, setLink] = useState(""); // keep track of short link

    // submit link and get back shortened url
    const handleSubmit = (e) => {
        e.preventDefault();

        // if user is not authenticated, prompt them to login
        if (!ui.isAuthenticated) {
            dispatchModalEvent('openSignup');
            return;
        }

        // if input is empty, return
        if (!llink) { return; }

        api.post('/api/shorten', {
            "url": llink
        }, { headers: { 'content-type': 'application/json' } }).then(({ data }) => {
            console.log(data)
            setLinks([...links, data])
            setLink(data.short_url)
        }).catch(({ response }) => {
            console.log(response)
        });
    }

    // to also respond to enter keys
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);  // Trigger the submit on pressing Enter
        }
    };

    // query params to handle redirection when accessing long urls through short urls
    const { accessLink } = useParams();
    // query params to handle redirection when accessing long urls through short urls
    useEffect(() => {
        if (!accessLink) return;
    
        const controller = new AbortController(); // To cancel request if needed
    
        api.post("/api/access", 
          { url: `http://localhost:3001/access/${accessLink}` }, 
          { signal: controller.signal }
        )
        .then(({ data }) => {
          window.location.href = data.long_url;
        })
        .catch((error) => {
            console.error(error);
        });
    
        // Cleanup function: cancel API request if component unmounts
        return () => {
          controller.abort();
        };
      }, [accessLink]);

    // set list of links
    useEffect(() => {
        api.get('/api/all').then(({ data }) => {
            setLinks(data)
        }).catch(({ response }) => {
            console.log(response)
        });
    }, []);

    return (
        <>
            {/* add a pretty login/signup button on to the top right */}
            <div className="flex justify-end p-4 bg-slate-950">
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
                        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-screen-sm">
                            <input
                                type="text"
                                id="url"
                                name="url"
                                value={llink}
                                onChange={(e) => setLLink(e.target.value)}
                                placeholder="Enter your superrrrrrr long URL"
                                onKeyDown={handleKeyDown}  // Listen for the Enter key
                                className="w-[90%] max-w-[600px] min-w-[300px] p-3 mb-4 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                                aria-label="Long URL input"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Submit URL"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                    <div className="p-4">
                        {/* show only if short url has been set */}
                        {link && <p className="text-white">Shortened URL: <a href={link} target="_blank" rel="noreferrer">{link}</a></p>}
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
                                    <p className='text-ellipsis max-w-[300px] overflow-hidden truncate'>{link.long_url}</p>
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