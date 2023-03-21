import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";


const App = () => {
    const [tareas, setTareas] = useState([]);
    const [descripcion, setDescripcion] = useState("");

    //Realiza peticion del tipo GET 
    const mostrarTareas = async () => {
        try {
            const response = await fetch("api/tarea/Lista");
            if (!response.ok) {
                console.log(`Status Code: ${response.status}`);
                return;
            }
            const data = await response.json();
            setTareas(data);
        } catch (error) {
            console.log(error);
        }
    };


    //Petision del tipo POST
    const guardarTarea = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("api/tarea/Guardar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ descripcion }),
            });
            if (response.ok) {
                setDescripcion("");
                await mostrarTareas();
            } else {
                console.log(`Status Code: ${response.status}`);
            }
        } catch (error) {
            console.log(error);
        }
    };


    //Petision del tipo DELETE
    const cerrarTarea = async (id) => {
        try {
            const response = await fetch("api/tarea/Cerrar/" + id, {
                method: "DELETE"
            });
            if (response.ok) {
                await mostrarTareas();
            } else {
                console.log(`Status Code: ${response.status}`);
            }
        } catch (error) {
            console.log(error);
        }
    };


    //Funcion auxiliar para convertir la fecha en una cadena con formato legible
    const formatDate = (string) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const fecha = new Date(string).toLocaleDateString("es-Pe", options);
        const hora = new Date(string).toLocaleTimeString();
        return `${fecha} | ${hora}`;
    };


    useEffect(() => {
        mostrarTareas();
    }, []);

    return (
        <div className="container bg-dark p-4 vh-100">
            <h2 className="text-white">Lista de tareas</h2>
            <div className="row">
                <div className="col-sm-12">
                    <form onSubmit={guardarTarea}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la descripcion de la tarea"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <button className="btn btn-success" type="submit">
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-12">
                    <div className="list-group">
                        {tareas.map((item) => (
                            <div key={item.idTarea} className="list-group-item list-group-item-action">
                                <h5 className="text-primary">{item.descripcion}</h5>
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">{formatDate(item.fechaRegistro)}</small>
                                    <button onClick={() => cerrarTarea(item.idTarea)} className="btn btn-sm btn-outline-danger">Cerrar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
