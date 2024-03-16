export default function Testing() {
    return (
    <div className="flex w-screen h-screen flex-col items-center pt-4">
        <h1 className="text-2xl">Register new extension</h1>
        <br />
        <hr className="w-80"/>
        <br />
        <form action="/api/v1/extension" method="POST" className="flex flex-col w-96">
            <label htmlFor="name">Extension name: </label>
            <input type="text" name="name" id="name" placeholder="JavaScript" className="p-1 pl-2 text-black" required />
            <br />
            <label htmlFor="gitUrl">Git url:</label>
            <input type="url" name="gitUrl" id="gitUrl" placeholder="https://github.com/extensio-editor/ext-js.git" className="p-1 pl-2 text-black" required />
            <br />
            <input type="submit" className="m-auto mt-2 mb-2 border-0 p-2 cursor-pointer rounded-lg ease-linear duration-75 border-white w-min hover:border-2"/>
        </form>
    </div>
    )
}