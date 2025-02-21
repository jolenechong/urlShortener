export default function Home() {

  return (
    <>
    <section className="flex justify-center bg-slate-950">
        <div className="flex h-screen w-screen items-center justify-center flex-col px-4">
            <div className="p-4">
                <h1 className="text-3xl pb-2 font-bold text-white">URL Shortener</h1>
                <p className="pb-4 text-white">Shorten extra-long links today!</p>
            </div>
            <div className="p-4 w-full flex justify-center">
                <input 
                    type="text" 
                    placeholder="Enter your superrrrrrr long URL"
                    className="w-full max-w-[600px] min-w-[300px] p-3 mb-4 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" 
                />
            </div>
        </div>
    </section>

    <section className="bg-slate-950">
        <div className="max-w-[1000px] m-auto p-4 flex flex-col justify-center py-50">
        <h1 className="text-2xl font-bold">Past Shorterned Links</h1>
        <p>Created by <a href="https://github.com/jolenechong" target="_blank" rel="noreferrer" className="underline">Jolene</a></p>




        </div>
    </section>
      
    </>
  );
}