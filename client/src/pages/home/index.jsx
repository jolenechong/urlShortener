import { useState, useContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext, withUserContext } from '../../contexts/user-context';
import { ModelContext, withModalContext } from '../../contexts/modal-context';
import Modal from '../components/modals/index.jsx';
import api from "../../api"
import ShortenForm from '../components/home/ShortenForm.jsx';
import LinkList from '../components/home/LinkList.jsx';
import Header from '../components/home/Header.jsx';

function Home() {

    const { modalInfo, dispatchModalEvent } = useContext(ModelContext);
    const [links, setLinks] = useState([]);
    const [link, setLink] = useState(""); // keep track of short link

    // shorten with, submit link and get back shortened url
    const handleShorten = useCallback((url) => {
        if (!url.trim()) return; // prevent empty requests
        api.post('/api/shorten', { url }, { headers: { 'content-type': 'application/json' } })
            .then(({ data }) => {
                setLinks((prev) => [...prev, data]);
                setLink(data.short_url);
            })
            .catch(console.error);
    });

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

    return (
        <>
            <Header dispatchModalEvent={dispatchModalEvent} />

            <section className="flex justify-center bg-slate-950">
                <div className="flex h-screen w-screen items-center justify-center flex-col px-4">
                    <div className="p-4">
                        <h1 className="text-3xl pb-2 font-bold text-white">URL Shortener</h1>
                        <p className="pb-4 text-white">Shorten extra-long links today!</p>
                    </div>
                    <div className="p-4 w-full flex justify-center">
                        <ShortenForm onShorten={handleShorten} />
                    </div>
                    <div className="p-4">
                        {link && <p className="text-white">Shortened URL: <a href={link} target="_blank" rel="noreferrer">{link}</a></p>}
                    </div>
                </div>
            </section>

            <section className="bg-slate-950">
                <div className="max-w-[1000px] m-auto p-4 flex flex-col justify-center py-50">
                    <h1 className="text-2xl font-bold">Past Shortened Links</h1>
                    <p>Developed by <a href="https://github.com/jolenechong" target="_blank" rel="noreferrer" className="underline">Jolene</a></p>
                    <div className="flex flex-col">
                        <LinkList links={links} setLinks={setLinks} />                
                    </div>
                </div>
            </section>

            <Modal />
        </>
    );
}

export default withUserContext(withModalContext(Home));