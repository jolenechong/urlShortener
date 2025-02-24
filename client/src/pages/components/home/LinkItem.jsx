function LinkItem({ link }) {
    return (
        <div className="flex justify-between p-2 border-b border-slate-700">
            <p className="text-ellipsis max-w-[300px] overflow-hidden truncate">{link.long_url}</p>
            <a href={link.short_url} target="_blank" rel="noreferrer">{link.short_url}</a>
            <p>{link.click_count}</p>
        </div>
    );
};

export default LinkItem;