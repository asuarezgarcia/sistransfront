import React, { useState } from 'react';
import axios from "axios";
import './Reqs.css';

function Reqs() {
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [inputData, setInputData] = useState({});
    const [result, setResult] = useState('');


    const handleButtonClick = (buttonIndex) => {
        setSelectedButton(buttonIndex);
        setSelectedSubMenu(null); // Reset sub menu when a new button is selected
        setInputData({});
        setResult('');
    };

    const handleSubMenuClick = (subMenuIndex) => {
        setSelectedSubMenu(subMenuIndex);
        setInputData({});
        setResult('');
    };
    
    const handleInputChange = (e, inputIndex) => {
        setInputData({
            ...inputData,
            [inputIndex]: e.target.value
        });
    };

    /*
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Perform some operation with inputData and set the result
        setResult(`Result for button ${selectedButton}: ${JSON.stringify(inputData)}`);
    };*/

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            switch (selectedButton) {
                case 0: // RF1 Crear Ciudad
                    response = await axios.post('http://localhost:8080/superandes/ciudades/new/save', {
                        nombre: inputData[0]
                    });
                    break;
                case 1: // RF2 Crear Sucursal
                    response = await axios.post('http://localhost:8080/superandes/sucursales/new/save', {
                        nombre: inputData[0],
                        direccion: inputData[1],
                        telefono: inputData[2],
                        ciudad_Asociada: {
                            idCiudad: parseInt(inputData[3])
                        }
                    });
                    break;
                case 2: // RF3 Crear o Borrar Bodega
                if (selectedSubMenu === 0) { // Crear Bodega
                    const tamanio = parseInt(inputData[1]);
                    if (isNaN(tamanio) || tamanio <= 0) {
                        setResult('Error: El tamaño debe ser un número mayor que 0');
                        return;
                    }
                    response = await axios.post('http://localhost:8080/superandes/bodegas/new/save', {
                        nombre: inputData[0],
                        tamano: tamanio,
                        idsucursal: {
                            idSucursal: parseInt(inputData[2])
                        }
                    });
                } else if (selectedSubMenu === 1) { // Borrar Bodega
                    response = await axios.delete(`http://localhost:8080/superandes/bodegas/${inputData[0]}/delete`);
                }
                break;
                case 3: // RF4 Crear proveedor y actualizarlo
                if (selectedSubMenu === 0) { // Crear proveedor
                    response = await axios.post('http://localhost:8080/superandes/proveedores/new/save', {
                        nit: parseInt(inputData[0]),
                        nombre: inputData[1],
                        direccion: inputData[2],
                        nombreContacto: inputData[3],
                        telefonoContacto: inputData[4]
                    });
                }
                else if (selectedSubMenu === 1) { // Actualizar proveedor
                    response = await axios.put(`http://localhost:8080/superandes/proveedores/${inputData[0]}/update`, {
                        nit: inputData[0],
                        nombre: inputData[1],
                        direccion: inputData[2],
                        nombreContacto: inputData[3],
                        telefonoContacto: inputData[4]
                    });
                }
                break;
                case 4: // RF5 Crear categoría y leer
                if (selectedSubMenu === 0) { // Crear categoría
                    response = await axios.post('http://localhost:8080/superandes/categorias/new/save', {
                        nombre: inputData[0],
                        descripcion: inputData[1],
                        caracteristicas: inputData[2]
                    });
                }
                else if (selectedSubMenu === 1) { // Leer por ID
                    response = await axios.get(`http://localhost:8080/superandes/categorias/${inputData[0]}`);
                }
                else if (selectedSubMenu === 2) { // Leer por nombre
                    response = await axios.get(`http://localhost:8080/superandes/categorias/nom/${inputData[0]}`);
                }
                break;
                case 5: // RF6 Crear, leer (código o nombre) y actualizar un producto
                if (selectedSubMenu === 0) { // Crear
                    response = await axios.post('http://localhost:8080/superandes/productos/new/save', {
                        nombre: inputData[0],
                        precioVenta: parseInt(inputData[1]),
                        presentacion: inputData[2],
                        unidadMedida: inputData[3],
                        espEmpacado: inputData[4],
                        fechaExp: inputData[5],
                        categoria: {
                            codigo: parseInt(inputData[6])
                        }
                    });
                }
                else if (selectedSubMenu === 1) { // Leer por ID
                    response = await axios.get(`http://localhost:8080/superandes/productos/${inputData[0]}`);
                }
                else if (selectedSubMenu === 2) { // Leer por nombre
                    response = await axios.get(`http://localhost:8080/superandes/productos/nombre/${inputData[0]}`);
                }
                else if (selectedSubMenu === 3) { // Actualizar
                    response = await axios.put(`http://localhost:8080/superandes/productos/${inputData[7]}/update`, {
                        nombre: inputData[0],
                        precioVenta: inputData[1],
                        presentacion: inputData[2],
                        unidadMedida: inputData[3],
                        empacado: inputData[4],
                        fechaExp: inputData[5],
                        idCategoria: {
                            idCategoria: inputData[6]
                        }
                    });
                }
                break;
                case 6: // RF7 Crear Orden para una sucursal
                    response = await axios.post('http://localhost:8080/superandes/ordenes/new/save', {
                        fechaEntrega: inputData[0],
                        estado: inputData[1],
                        idSucursalEnvio: parseInt(inputData[2]),
                        nitProveedor: parseInt(inputData[3]),
                        productos: inputData[4]
                    });
                    break;
                case 7: // RF8 Anular orden
                    response = await axios.put(`http://localhost:8080/superandes/ordenes/${inputData[0]}/update`, {
                        estado: "anulada"
                    });
                    break;
                case 8: // RF9 Obtener todas las órdenes
                    response = await axios.get('http://localhost:8080/superandes/ordenes');
                    setResult(JSON.stringify(response.data, null, 2));
                    break;
                case 9: // RF10 Crear ingreso
                    response = await axios.post('http://localhost:8080/superandes/ingresos/nuevo?idBodega=' + inputData[0] + "&idOrden=" + inputData[1]);
                    break;
                case 10: // RFC1 Índice ocupación de cada bodega
                    response = await axios.get('http://localhost:8080/superandes/inventarios/consultaRC1?codbarras=' + inputData[0]);
                    setResult(response.data);
                    break;
                case 11: // RFC2 Ver productos que cumplen cierta característica
                    let params = [];
                    if (selectedSubMenu === 0) { // Sucursal
                        params = ["sucursal", parseInt(inputData[0])];
                    } else if (selectedSubMenu === 1) { // Precio
                        params = ["precio", inputData[0], inputData[1]];
                    } else if (selectedSubMenu === 2) { // Fechas
                        params = ["fecha", inputData[0], inputData[1]];
                    } else if (selectedSubMenu === 3) { // Categoría
                        params = ["categoria", inputData[0]];
                    }
                    response = await axios.post('http://localhost:8080/superandes/productos/consulta', params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setResult(response.data);
                    break;
                case 12: // RFC3 Inventario productos en una bodega
                    response = await axios.get('http://localhost:8080/superandes/inventarios/consultaRC3?bodega=' + inputData[1] + "&idsucursal=" + inputData[0]);
                    setResult(response.data);
                    break;
                case 13: // RFC4 Sucursales con disponibilidad de un producto
                    let url = 'http://localhost:8080/superandes/sucursales/consulta';
                    if (selectedSubMenu === 0) { // ID
                        url += `?CodBarras=${inputData[0]}`;
                    } else if (selectedSubMenu === 1) { // Nombre
                        url += `?nombre=${inputData[0]}`;
                    }
                    response = await axios.get(url);
                    setResult(JSON.stringify(response.data, null, 2)); // Formatear la respuesta como JSON
                    break;
                case 14: // RFC5 Productos que requieren orden de compra
                    response = await axios.get('http://localhost:8080/superandes/inventarios/RFC5');
                    setResult(JSON.stringify(response.data, null, 2)); // Formatear la respuesta como JSON
                    break;
                case 15: // RFC6 Ingresos últimos 30 días (S)
                    let paramss = [inputData[0], inputData[1]];
                    response = await axios.post('http://localhost:8080/superandes/bodegas/RFC6', paramss, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setResult(JSON.stringify(response.data, null, 2));
                    break;
                case 16: // RFC7 Ingresos últimos 30 días (RC)
                let paramsss = [inputData[0], inputData[1]];
                response = await axios.post('http://localhost:8080/superandes/bodegas/RFC7', paramsss, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setResult(JSON.stringify(response.data, null, 2));
                    break;

                default:
                    return null;
            }
            setResult(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                setResult(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
            } else {
                setResult('Error :(');
            }
        }
    };

    const renderInputs = () => {
        switch (selectedButton) {
            case 0: // RF1 Crear Ciudad
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre Ciudad" />
                    </>
                );
            case 1: // RF2 Crear Sucursal
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre Sucursal" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Dirección" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Teléfono" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="ID ciudad asociada" />
                    </>
                );
            case 2: // RF3 Crear Bodega y borrarla
                if (selectedSubMenu === 0){
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre bodega" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Tamanio" />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID sucursal" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1){
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID bodega" />
                         </>
                        );
                }
                break;
            case 3: // RF4 Crear proveedor y actualizarlo
                if (selectedSubMenu === 0){
                    return (
                        <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="NIT proveedor" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Nombre " />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Dirección" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Nombre contacto" />
                        <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Teléfono contacto" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1){
                    return (
                        <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="NIT proveedor" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Nombre " />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Dirección" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Nombre contacto" />
                        <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Teléfono contacto" />
                        </>
                        );
                }
                break;
            case 4: // RF5 Crear categoría y leer
                if (selectedSubMenu === 0) {
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Descripción " />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Características" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1) {
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID" />
                        </>
                    );
                }
                else if (selectedSubMenu === 2) {
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                        </>
                    );
                }
                break;                    
            case 5: // RF6 Crear, leer (código o nombre) y actualizar un producto
                if (selectedSubMenu === 0) { // Crear
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Precio Venta " />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Presentación" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Unidad Medida" />
                            <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Empacado" />
                            <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="Fecha Exp (YYYY-MM-DD)" />
                            <input type="text" value={inputData[6] || ''} onChange={(e) => handleInputChange(e, 6)} placeholder="ID categoría" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1) { // Leer por ID
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID" />
                        </>
                    );
                }
                else if (selectedSubMenu === 2) { // Leer por nombre
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                        </>
                    );
                }
                else if (selectedSubMenu === 3) { // Actualizar
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Precio Venta " />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Presentación" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Unidad Medida" />
                            <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Empacado" />
                            <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="Fecha Exp (YYYY-MM-DD)" />
                            <input type="text" value={inputData[6] || ''} onChange={(e) => handleInputChange(e, 6)} placeholder="ID categoría" />
                            <input type="text" value={inputData[7] || ''} onChange={(e) => handleInputChange(e, 7)} placeholder="ID producto" />
                        </>
                    );
                }
                break; 
            case 6: // RF7 Crear Orden para una sucursal
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Fecha entrega (YYYY-MM-DD)" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Estado: Poner Vigente" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID sucursal envío" />
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="NIT proveedor" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Falta lógica productos" />
                    </>
                );
            case 7: // RF8 Anular orden
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID orden" />
                    </>
                );
            case 8: // RF9 Obtener todas las órdenes
                return (
                    <> 
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="No insertar nada; solo submit" />
                    </>
                );
            case 9: // RF10 Crear ingreso
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID bodega" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="ID Orden" />
                    </>
                );
            case 10: // RFC1 Índice ocupación de cada bodega
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Código producto" />
                    </>
                );
            case 11: // RFC2 Productos que cumplen cierta característica
                if (selectedSubMenu === 0) { // Sucursal
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID Sucursal" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1) { // Precio
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Precio mínimo" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Precio máximo" />

                        </>
                    );
                }
                else if (selectedSubMenu === 2) { // Fechas
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Fecha (YYYY-MM-DD)" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="mayor o menor" />
                        </>
                    );
                }
                else if (selectedSubMenu === 3) { // Categoría
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID categoría" />
                        </>
                    );
                }
                break; 
            case 12: // RFC3 Inventario productos en una bodega
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID sucursal" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="ID bodega" />
                    </>
                );
            case 13: // RFC4 Sucursales con disponibilidad de un producto
                if (selectedSubMenu === 0) { // ID
                    return (
                        <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID producto" />
                        </>
                    );
                }
                else if (selectedSubMenu === 1) { // Nombre
                    return (
                        <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre producto" />
                        </>
                    );
                }
                break;
            case 14: // RFC5 Productos que requieren orden de compra
                return (
                    <>
                    <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="No insertar nada; solo submit" />
                    </>
                );
            case 15: // RFC6 Ingresos últimos 30 días (S)
                return (
                    <>
                    <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID sucursal" />
                    <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="ID bodega" />
                    </>
                );
            case 16: // RFC7 Ingresos últimos 30 días (RC)
            return (
                <>
                <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID sucursal" />
                <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="ID bodega" />
                </>
            );
            
            default:
                return null;
        }
    };

    // Este pone el nombre del submenu arribita del form
    const getSubMenuName = () => {
        switch(selectedButton){
            case 0: // RF1
                return 'Crear Ciudad';
            case 1: // RF2
                return 'Crear Sucursal';
            case 2: // RF3
                if (selectedSubMenu === 0) {
                    return 'Crear Bodega';
                } else if (selectedSubMenu === 1) {
                    return 'Borrar Bodega';
                }
                break;
            case 3: // RF4
                if (selectedSubMenu === 0) {
                    return 'Crear proveedor';
                } else if (selectedSubMenu === 1) {
                    return 'Actualizar proveedor';
                }
                break;
            case 4: // RF5
                if (selectedSubMenu === 0) {
                    return 'Crear categoría';
                } else if (selectedSubMenu === 1) {
                    return 'Leer categoría';
                } else if (selectedSubMenu === 2) {
                    return 'Leer categoría';
                }
                break;
            case 5: // RF6
                if (selectedSubMenu === 0) {
                    return 'Crear producto';
                } else if (selectedSubMenu === 1) {
                    return 'Leer producto ID';
                } else if (selectedSubMenu === 2) {
                    return 'Leer producto Nombre';
                } else if (selectedSubMenu === 3) {
                    return 'Actualizar producto';
                }
                break;
            case 6: // RF7
                return 'Crear Orden para una sucursal';
            case 7: // RF8
                return "Anular orden";
            case 8: // RF9
                return "Obtener todas las órdenes";
            case 9: // RF10
                return "Crear ingreso";
            case 10: // RFC1
                return "Índice ocupación de cada bodega";
            case 11: // RFC2
                if (selectedSubMenu === 0) {
                    return 'Productos por sucursal';
                } else if (selectedSubMenu === 1) {
                    return 'Productos por precio';
                } else if (selectedSubMenu === 2) {
                    return 'Productos por fecha';
                } else if (selectedSubMenu === 3) {
                    return 'Productos por categoría';
                }
                break;
            case 12: // RFC3
                return "Inventario productos en una bodega";
            case 13: // RFC4
                if (selectedSubMenu === 0) {
                    return 'Sucursales con disponibilidad de un producto (ID)';
                } else if (selectedSubMenu === 1) {
                    return 'Sucursales con disponibilidad de un producto (Nombre)';
                }
                break;
            case 14: // RFC5
                return "Productos que requieren orden de compra";
            case 15: // RFC6
                return "Ingresos últimos 30 días (S)";
            case 16: // RFC7
                return "Ingresos últimos 30 días (RC)";
                
            default:
                return null;
        }
    };

    // Este pone los botones de acceso a los submenus
    const renderSubMenu = () => {
        switch (selectedButton) {
            case 0: // RF1
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Ciudad</button>
                    </div>
                );
            case 1: // RF2
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Sucursal</button>
                    </div>
                );
            case 2: // RF3
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Bodega</button>
                        <button onClick={() => handleSubMenuClick(1)}>Borrar Bodega</button>
                    </div>
                );
            case 3: // RF4
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Proveedor</button>
                        <button onClick={() => handleSubMenuClick(1)}>Actualizar Proveedor</button>
                    </div>
                );
            case 4: // RF5
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear categoría</button>
                        <button onClick={() => handleSubMenuClick(1)}>Leer categoría ID</button>
                        <button onClick={() => handleSubMenuClick(2)}>Leer categoría Nombre</button>
                    </div>
                );
            case 5: // RF6
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear producto</button>
                        <button onClick={() => handleSubMenuClick(1)}>Leer producto ID</button>
                        <button onClick={() => handleSubMenuClick(2)}>Leer producto Nombre</button>
                        <button onClick={() => handleSubMenuClick(3)}>Actualizar producto</button>
                    </div>
                );
            case 6: // RF7
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Orden para una sucursal</button>
                    </div>
                );
            case 7: // RF8
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Anular orden</button>
                    </div>
                );
            case 8: // RF9
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Obtener todas las órdenes</button>
                    </div>
                );
            case 9: // RF10
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear ingreso</button>
                    </div>
                );
            case 10: // RFC1
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Índice ocupación de cada bodega</button>
                    </div>
                );
            case 11: // RFC2
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Productos por sucursal</button>
                        <button onClick={() => handleSubMenuClick(1)}>Productos por precio</button>
                        <button onClick={() => handleSubMenuClick(2)}>Productos por fecha</button>
                        <button onClick={() => handleSubMenuClick(3)}>Productos por categoría</button>
                    </div>
                );
            case 12: // RFC3
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Inventario productos en una bodega</button>
                    </div>
                );
            case 13: // RFC4
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Sucursales con disponibilidad de un producto (ID)</button>
                        <button onClick={() => handleSubMenuClick(1)}>Sucursales con disponibilidad de un producto (Nombre)</button>
                    </div>
                );
            case 14: // RFC5
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Productos que requieren orden de compra</button>
                    </div>
                );
            case 15: // RFC6
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Ingresos últimos 30 días (S)</button>
                    </div>
                );
            case 16: // RFC7
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Ingresos últimos 30 días (RC)</button>
                    </div>
                );

            default:
                return null;
        }
    };

    const getReqName = () => {
        if (selectedButton < 10) {
            return `RF${selectedButton + 1}`;
        } else {
            return `RFC${selectedButton - 9}`;
        }
    };

    return (
        <div className="Reqs">
            <header>
                <h1>Requerimientos</h1>
            </header>
            <div className="container">
                <div className="menu">
                    {[...Array(10)].map((_, index) => (
                        <button key={index} onClick={() => handleButtonClick(index)}>
                            RF{index + 1}
                        </button>
                    ))}
                    {[...Array(7)].map((_, index) => (
                        <button key={index + 10} onClick={() => handleButtonClick(index + 10)}>
                            RFC{index + 1}
                        </button>
                    ))}
                </div>
                <div className="panel">
                    {selectedButton !== null && (
                        <div>
                            <h2>{getReqName()}</h2>
                            {renderSubMenu()}
                            {selectedSubMenu !== null && (
                                <>
                                    <h3>{getSubMenuName()}</h3>
                                    <form onSubmit={handleFormSubmit}>
                                        {renderInputs()}
                                        <button type="submit">Submit</button>
                                    </form>
                                    <div className="result">
                                        <pre>{result}</pre> {/* Mostrar el resultado en un elemento <pre> */}                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reqs;