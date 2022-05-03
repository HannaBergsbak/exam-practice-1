import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";

const ProfileContext = React.createContext({
    userinfo: undefined,
});

function FrontPage() {
    const { userinfo } = useContext(ProfileContext);

    async function handleLogout() {
        await fetch("/api/login", { method: "delete" });
        reload();
    }

    return (
        <div>
            <h1>Front Page</h1>
            {!userinfo && (
                <div>
                    <Link to={"/login"}>Log in</Link>
                </div>
            )}

            {userinfo && (
                <div>
                    <Link to={"/profile"}>Profile for {userinfo.name}</Link>
                </div>
            )}
            {userinfo && (
                <div>
                    <Link to={"/movies"}>List movies</Link>
                </div>
            )}
            {userinfo && (
                <div>
                    <Link to={"/movies/new"}>Add new movie</Link>
                </div>
            )}
            {userinfo && (
                <div>
                    <button onClick={handleLogout}>Log out</button>
                </div>
            )}
        </div>
    );
}

/* JOHANNES FRONT PAGE
function FrontPage() {
    return (
        <div>
            <h1>Front page</h1>
            <ul>
                <li><Link to={"/login"}>List movies</Link></li>
                <li><Link to={"/profile"}>Add movie</Link></li>
            </ul>
        </div>
    );
}
*/
function useLoading(loadingFunction) {
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState();
    const [ data, setData] = useState();

    async function load(){
        try{
            setLoading(true);
            setData(await loadingFunction());
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        }, []);
    return { loading, error, data };
}

async function fetchJSON(url){
    const res = await fetch(url);
    if (!res.ok){
        throw new Error(`Failed to load${res.status}: ${res.statusText}`);
    }
    return await res.json();
}
/* Johannes sin fetchJSON
async function fetchJSON(url){
    const res = await fetch(url);
    if (!res.ok){
        throw new Error(`Failed to load${res.status}`);
    }
    return await res.json();
}
*/

function MovieCard ({ movie: { title, year, poster }}) {
        return  (
            <>
            <h3>{title}</h3>
            {poster && <img src={poster} width={100} alt={"Movie poster"}/>}
            <div>{year}</div>
            </>
        );
}

function ListMovies() {
    const { loading, error, data } = useLoading(
        async () => fetchJSON("/api/movies")
    );
    if (loading){
        return <div>Loading..</div>;
    }
    if (error){
        return (
            <div>
                <h1>Error</h1>
                <div>{error.toString()}</div>
            </div>
        );
    }

    return (
        <div>
            <h1>Movies in the db</h1>
                {data.map((movie) => (
                    <MovieCard key={movie.title} movie={movie}/>
                ))}

        </div>
    );
}

function AddNewMovie() {
    return (
        <form>
            <h1>Add new movie</h1>
        </form>
    );
}


function LoginCallback({ reload }) {
    const navigate = useNavigate();
    async function test() {
        const { access_token } = Object.fromEntries(
            new URLSearchParams(window.location.hash.substring(1))
        );
        const res = await fetch("/api/login", {
            method: "post",
            body: new URLSearchParams({ access_token }),
        });
        if (res.ok) {
            reload();
            navigate("/");
        }
    }
    useEffect(() => {
        test();
    });
    return <h1>Please wait</h1>;
}

function Profile() {
    const { userinfo } = useContext(ProfileContext);

    return (
        <>
            <h1>
                User profile: {userinfo.name} ({userinfo.email})
            </h1>
            {userinfo.picture && (
                <img src={userinfo.picture} alt={userinfo.name + " profile picture"} />
            )}
        </>
    );
}

function Application() {
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState();
    useEffect(loadLoginInfo, []);

    async function loadLoginInfo() {
        setLoading(true);
        setLogin(await fetchJSON("/api/login"));
        setLoading(false);
    }

    useEffect(() => {
        console.log({ login });
    }, [login]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ProfileContext.Provider value={login}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<FrontPage reload={loadLoginInfo}/>} />
                    <Route path={"/movies"} element={<ListMovies />} />
                    <Route path={"/movies/new"} element={<AddNewMovie />} />
                    <Route path={"/login"} element={<Login/>} />
                    <Route path={"/login/callback"} element={<LoginCallback reload={loadLoginInfo}/>} />
                    <Route path={"/profile"} element={<Profile/>} />
                </Routes>
            </BrowserRouter>
        </ProfileContext.Provider>
    );
}

function Login() {
    const { oauth_config } = useContext(ProfileContext);
    useEffect(async () => {
        const { discovery_url, client_id, scope } = oauth_config;
        const discoveryDocument = await fetchJSON(discovery_url);
        const { authorization_endpoint } = discoveryDocument;
        const params = {
            response_type: "token",
            response_mode: "fragment",
            scope,
            client_id,
            redirect_uri: window.location.origin + "/login/callback",
        };
        window.location.href =
            authorization_endpoint + "?" + new URLSearchParams(params);
    }, []);
    return <h1>Please wait</h1>;
}

/* JOHANNES SIN APPLICATION
function Application() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<FrontPage />} />
                <Route path={"/login"} element={<Login/>} />
                <Route path={"/login/callback"} element={<h1>Login callback</h1>} />
                <Route path={"/profile"} element={<h1>Profile</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
*/

ReactDOM.render(<Application />, document.getElementById("app"));