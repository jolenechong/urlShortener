import { useEffect } from 'react';
import LinkItem from './LinkItem';
import api from "../../../api";

function LinkList({ links, setLinks }) {

    // set list of links
    useEffect(() => {
        api.get('/api/all').then(({ data }) => {
            setLinks(data)
        }).catch(({ response }) => {
            console.log(response)
        });
    }, []);

    return (
        <div>
            {links.length === 0 && <p>No links yet! Create one above :)</p>}
            {links.map((link, index) => (
                <LinkItem key={index} link={link} />
            ))}
        </div>
    );
};

export default LinkList;