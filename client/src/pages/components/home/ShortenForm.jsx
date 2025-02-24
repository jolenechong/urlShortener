import { useState, useContext } from 'react';

function ShortenForm({ ui, onShorten, dispatchModalEvent }) {
    const [llink, setLLink] = useState(''); // keep track of long link

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(ui);
        if (ui == null || !ui.isAuthenticated) return dispatchModalEvent('openSignup');
        if (!llink.trim()) return;
        onShorten(llink);
        setLLink('');
    };

    // to also respond to enter keys
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);  // Trigger the submit on pressing Enter
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-screen-sm">
            <input
                type="text"
                id="url"
                name="url"
                value={llink}
                onChange={(e) => setLLink(e.target.value)}
                placeholder="Enter your superrrrrrr long URL"
                onKeyDown={handleKeyDown}
                className="w-[90%] max-w-[600px] min-w-[300px] p-3 mb-4 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                aria-label="Long URL input"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Submit
            </button>
        </form>
    );
}

export default ShortenForm;