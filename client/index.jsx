import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function FrontPage() {
    return (
        <div>
            <h1>Logging in</h1>
            <ul>
                <li><Link to={"/login"}>Log in</Link></li>
                <li><Link to={"/profile"}>Profile</Link></li>
            </ul>

            <h1>Movie db</h1>
            <ul>
                <li><Link to={"/movies"}>List movies</Link></li>
                <li><Link to={"/movies/new"}>Add movie</Link></li>
            </ul>
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


function Application() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<FrontPage />} />
                <Route path={"/movies"} element={<ListMovies />} />
                <Route path={"/movies/new"} element={<AddNewMovie />} />
                <Route path={"/login"} element={<Login/>} />
                <Route path={"/login/callback"} element={<h1>Login callback</h1>} />
                <Route path={"/profile"} element={<h1>Profile</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

function Login() {
    const [redirectUrl, setRedirectUrl] = useState();
    useEffect(async () => {
        const {authorization_endpoint} = await fetchJSON(
            "https://accounts.google.com/.well-known/openid-configuration"
        );

        const parameters = {
            response_type: "token",
            client_id: "677797491211-8egpen87auhal7pc5nv7mee5ri48rvfh.apps.googleusercontent.com",
            scope: "email profile",
            redirect_uri: window.location.origin + "/login/callback",
        };

        setRedirectUrl(
            authorization_endpoint + "?" + new URLSearchParams(parameters)
        );
    }, []);

    return (
        <div>
            <h1>Login updated</h1>
            <a href={redirectUrl}>Do login</a>
            <div>{redirectUrl}</div>
        </div>
        );
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