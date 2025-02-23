const Header = ({ dispatchModalEvent }) => (
    <div className="flex justify-end p-4 bg-slate-950">
        <button onClick={() => dispatchModalEvent('openSignup')} className="p-2 bg-blue-500 text-white rounded-lg user-select">
            Sign Up
        </button>
        <button onClick={() => dispatchModalEvent('openLogin')} className="p-2 bg-blue-500 text-white rounded-lg ml-2">
            Login
        </button>
    </div>
);

export default Header;