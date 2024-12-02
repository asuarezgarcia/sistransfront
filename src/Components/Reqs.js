import React, { useState } from 'react';
import axios from "axios";
import './Reqs.css';

function Reqs() {
    // Estos son para el manejo de los componentes de la interfaz
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


    // Desde aquí es para manejar los inputs del req 6
    const [products, setProducts] = useState([]);
    const [productInput, setProductInput] = useState({});
    const handleProductInputChange = (e, attribute) => { // Maneja los inputs de productos
        setProductInput({
            ...productInput,
            [attribute]: isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)
        });
    };

    const handleAddProduct = () => {
        setProducts([...products, productInput]); // Agrega el producto a la lista de productos y la limpia
        setProductInput({});
    };

    const handleSubmit = () => { // Agrega la lista de productos a la lista de inputs
        setInputData({
            ...inputData,
            4: products
        });

        setProducts([]);
        setProductInput({});
    }


    // Desde aquí es para manejar los inputs del req 1
    const [inventarios, setInventarios] = useState([]);
    const [inventarioInput, setInventarioInput] = useState({});

    const handleInventarioInputChange = (e, attribute) => {
        const value = parseInt(e.target.value, 10);
        setInventarioInput({
            ...inventarioInput,
            [attribute]: isNaN(value) ? '' : value
        });
    };

        const handleAddInventario = () => {
        const newInventario = {
            _id: parseInt(inventarioInput._id, 10),
            CODIDIGOBARRAS: parseInt(inventarioInput.CODIDIGOBARRAS, 10),
            IDBODEGA: parseInt(inventarioInput.IDBODEGA, 10),
            CANTIDAD_OCUPADA: parseInt(inventarioInput.CANTIDAD_OCUPADA, 10),
            COSTO_GRUPO_PRODUCTO: parseInt(inventarioInput.COSTO_GRUPO_PRODUCTO, 10),
            MINIMO_RECOMPRA: parseInt(inventarioInput.MINIMO_RECOMPRA, 10)
        };
        setInventarios([...inventarios, newInventario]);
        setInventarioInput({});
    };

    const handleSubmitSucursal = () => {
        setInputData({
            ...inputData,
            6: inventarios
        });

        setInventarios([]);
        setInventarioInput({});
    };


    // Desde aquí es para manejar los inputs del req 3
    const [receps, setRecep] = useState([]);
    const [recepInput, setRecepInput] = useState({});

    const handleRecepInputChange = (e, attribute) => {
        const value = parseInt(e.target.value, 10);
        setRecepInput({
            ...recepInput,
            [attribute]: isNaN(value) ? '' : value
        });
    };

        const handleAddRecep = () => {
        const newRecep = {
            _id: parseInt(recepInput._id, 10),
            IDPRODUCTO: parseInt(recepInput.IDPRODUCTO, 10),
            IDORDEN: parseInt(recepInput.IDORDEN, 10),
            IDBODEGA: parseInt(recepInput.IDBODEGA, 10),
            CANTIDADENTREGADA: parseInt(recepInput.CANTIDADENTREGADA, 10),
            COSTOGRUPO: parseInt(recepInput.COSTOGRUPO, 10)
        };
        setRecep([...receps, newRecep]);
        setRecepInput({});
    };

    const handleSubmitProveedor = () => {
        setInputData({
            ...inputData,
            6: receps
        });

        setRecep([]);
        setRecepInput({});
    };


    // Esto es para manejar los submit de los forms; lo que llama al back
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            switch (selectedButton) {
                case 0: // RF1 Crear Sucursal
                const bodegasArray = inputData[5].split(',').map(bodega => parseInt(bodega.trim(), 10));
                    response = await axios.post('http://localhost:8080/superandes/sucursales/new/save', {
                        _id: parseInt(inputData[0]),
                        NOMBRE: inputData[1],
                        DIRECCION: inputData[2],
                        TELEFONO: parseInt(inputData[3]),
                        CIUDAD: inputData[4],
                        BODEGA: bodegasArray,
                        INVENTARIOS: inputData[6]
                    });
                    break;
                case 1: // RF2 Crear o Borrar Bodega
                    if (selectedSubMenu === 0) { // Crear Bodega
                        response = await axios.post(`http://localhost:8080/superandes/bodegas/new/${inputData[3]}`, {
                            _id: parseInt(inputData[2]),
                            NOMBRE: inputData[0],
                            TAMANIO: parseInt(inputData[1]),
                        })
                        ;
                    } else if (selectedSubMenu === 1) { // Borrar Bodega
                        response = await axios.delete(`http://localhost:8080/superandes/bodegas/${inputData[0]}/${inputData[1]}/delete`);
                    }
                    break;
                case 2: // RF3 Crear proveedor y actualizarlo
                if (selectedSubMenu === 0) { // Crear proveedor
                    response = await axios.post('http://localhost:8080/superandes/proveedores/new/save', {
                        _id: parseInt(inputData[0]),
                        NIT: inputData[1],
                        NOMBRE: inputData[2],
                        NOMBRECONTACTO: inputData[3],
                        TELCONTACTO: inputData[4],
                        DIRECCION: inputData[5],
                        RECEPCIONPRODUCTO: inputData[6]
                    });
                }
                else if (selectedSubMenu === 1) { // Actualizar proveedor
                    response = await axios.post(`http://localhost:8080/superandes/proveedores/${inputData[0]}/edit/save`, {
                        nit: inputData[0],
                        nombre: inputData[1],
                        direccion: inputData[2],
                        nombreContacto: inputData[3],
                        telefonoContacto: inputData[4]
                    });
                }
                break;
                case 3: // RF4 Crear categoría y leer
                if (selectedSubMenu === 0) { // Crear categoría
                    response = await axios.post('http://localhost:8080/superandes/categorias/new/save', {
                        NOMBRE: inputData[0],
                        DESCRIPCION: inputData[1],
                        CARACTERISTICAS: inputData[2],
                        _id: parseInt(inputData[3]),
                    });
                }
                else if (selectedSubMenu === 1) { // Leer por ID
                    response = await axios.get(`http://localhost:8080/superandes/categorias/id/${inputData[0]}`);
                }
                else if (selectedSubMenu === 2) { // Leer por nombre
                    response = await axios.get(`http://localhost:8080/superandes/categorias/nombre/${inputData[0]}`);
                }
                break;
                case 4: // RF5 Crear, leer (código o nombre) y actualizar un producto
                if (selectedSubMenu === 0) { // Crear
                    response = await axios.post('http://localhost:8080/superandes/productos/new/save', {
                        _id: parseInt(inputData[0]),
                        CODBARRAS: parseInt(inputData[0]),
                        NOMBRE: inputData[1],
                        PRECIOVENTA: parseInt(inputData[2]),
                        PRESENTACION: inputData[3],
                        UNIDAD_MEDIDA: inputData[4],
                        ESP_EMPACADO: inputData[5],
                        FECHA_EXP: inputData[6],
                        CATEGORIA: parseInt(inputData[7])
                    });
                }
                else if (selectedSubMenu === 1) { // Leer por ID
                    response = await axios.get(`http://localhost:8080/superandes/productos/id/${inputData[0]}`);
                }
                else if (selectedSubMenu === 2) { // Leer por nombre
                    response = await axios.get(`http://localhost:8080/superandes/productos/nombre/${inputData[0]}`);
                }
                else if (selectedSubMenu === 3) { // Actualizar
                    response = await axios.post(`http://localhost:8080/superandes/productos/${inputData[0]}/edit/save`, {
                        _id: parseInt(inputData[0]),
                        CODBARRAS: parseInt(inputData[0]),
                        NOMBRE: inputData[1],
                        PRECIOVENTA: parseInt(inputData[2]),
                        PRESENTACION: inputData[3],
                        UNIDAD_MEDIDA: inputData[4],
                        ESP_EMPACADO: inputData[5],
                        FECHA_EXP: inputData[6],
                        CATEGORIA: parseInt(inputData[7])
                    });
                }
                break;
                case 5: // RF6 Crear Orden para una sucursal

                    response = await axios.post('http://localhost:8080/superandes/ordenes/new/save', {
                        fechaEntrega: inputData[0],
                        estado: inputData[1],
                        sucursalEnvio: parseInt(inputData[2]),
                        proveedor: parseInt(inputData[3]),
                        productosExtra: inputData[4],
                        _id: parseInt(inputData[5]),
                    });
                    setResult("Mensaje personalizado");
                    break;
                case 6: // RF7 Leer orden por id
                    response = await axios.get(`http://localhost:8080/superandes/ordenes/${inputData[0]}`);
                    break;
                case 7: // RFC1 Ver productos que cumplen cierta característica
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
                    response = await axios.post('http://localhost:8080/superandes/productos/RFC1', params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setResult(response.data);
                    break;
                case 8: // RFC2 Inventario productos en una sucursal
                    response = await axios.get(`http://localhost:8080/superandes/sucursales/RFC2/${inputData[0]}`);
                    break;

                default:
                    return null;
            }
            if (selectedButton === 4|6){
            setResult(JSON.stringify(response.data, null, 2));
            }
            else {
                setResult(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                setResult(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
            } else {
                setResult('Error :(');
            }
        }
    };

    // Este pone los botones de los requerimientos
    const renderInputs = () => {
        switch (selectedButton) {
            case 0: // RF1 Crear Sucursal
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Id sucursal" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Nombre Sucursal" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Dirección" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Teléfono" />
                        <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Nombre ciudad asociada" />
                        <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="IDs bodegas(1,2,...)" />

                        <div className="inventarios-inputs">
                            <input type="text" value={inventarioInput._id || ''} onChange={(e) => handleInventarioInputChange(e, '_id')} placeholder="ID inventario" />
                            <input type="text" value={inventarioInput.CODIDIGOBARRAS || ''} onChange={(e) => handleInventarioInputChange(e, 'CODIDIGOBARRAS')} placeholder="Código barras" />
                            <input type="text" value={inventarioInput.IDBODEGA || ''} onChange={(e) => handleInventarioInputChange(e, 'IDBODEGA')} placeholder="ID Bodega" />
                            <input type="text" value={inventarioInput.CANTIDAD_OCUPADA || ''} onChange={(e) => handleInventarioInputChange(e, 'CANTIDAD_OCUPADA')} placeholder="Cantidad ocupada" />
                            <input type="text" value={inventarioInput.COSTO_GRUPO_PRODUCTO || ''} onChange={(e) => handleInventarioInputChange(e, 'COSTO_GRUPO_PRODUCTO')} placeholder="Costo grupo producto" />
                            <input type="text" value={inventarioInput.MINIMO_RECOMPRA || ''} onChange={(e) => handleInventarioInputChange(e, 'MINIMO_RECOMPRA')} placeholder="Mínimo recompra" />
                            <button type="button" className="add-inventario" onClick={handleAddInventario}>Agregar Inventario a la lista</button>
                        </div>

                        <ul>
                            {inventarios.map((inventario, index) => (
                                <li key={index}>
                                    {inventario._id}, {inventario.CODIDIGOBARRAS}, {inventario.IDBODEGA}, {inventario.CANTIDAD_OCUPADA}, {inventario.COSTO_GRUPO_PRODUCTO}, {inventario.MINIMO_RECOMPRA}
                                </li>
                            ))}
                        </ul>

                        <button type="button" className="add-inventario-list" onClick={handleSubmitSucursal}>Agregar lista de inventarios</button>

                    </>
                );
            case 1: // RF2 Crear o Borrar Bodega
                if (selectedSubMenu === 0) { // Crear Bodega
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre Bodega" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Tamanio" />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID bodega" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="ID Sucursal" />
                        </>
                    );
                } else if (selectedSubMenu === 1) { // Borrar Bodega
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID Sucursal" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="ID Bodega" />
                        </>
                    );
                }
                break;
            case 2: // RF3 Crear proveedor y actualizarlo
                if (selectedSubMenu === 0){
                    return (
                        <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID proveedor" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="NIT" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Nombre" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Nombre contacto" />
                        <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Teléfono contacto" />
                        <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="Dirección" />
                        
                        <div className="recep-inputs">
                            <input type="text" value={recepInput._id || ''} onChange={(e) => handleRecepInputChange(e, '_id')} placeholder="ID recepción producto" />
                            <input type="text" value={recepInput.IDPRODUCTO || ''} onChange={(e) => handleRecepInputChange(e, 'IDPRODUCTO')} placeholder="ID Producto" />
                            <input type="text" value={recepInput.IDORDEN || ''} onChange={(e) => handleRecepInputChange(e, 'IDORDEN')} placeholder="ID Orden" />
                            <input type="text" value={recepInput.IDBODEGA || ''} onChange={(e) => handleRecepInputChange(e, 'IDBODEGA')} placeholder="ID bodega" />
                            <input type="text" value={recepInput.CANTIDADENTREGADA || ''} onChange={(e) => handleRecepInputChange(e, 'CANTIDADENTREGADA')} placeholder="Cantidad entregada" />
                            <input type="text" value={recepInput.COSTOGRUPO || ''} onChange={(e) => handleRecepInputChange(e, 'COSTOGRUPO')} placeholder="Costo grupo" />
                            <button type="button" className="add-recep" onClick={handleAddRecep}>Agregar Recepción Producto a la lista</button>
                        </div>
            
                        <ul>
                            {receps.map((recep, index) => (
                                <li key={index}>
                                    {recep._id}, {recep.IDPRODUCTO}, {recep.IDORDEN}, {recep.IDBODEGA}, {recep.CANTIDADENTREGADA}, {recep.COSTOGRUPO}
                                </li>
                            ))}
                        </ul>
            
                        <button type="button" className="add-recep-list" onClick={handleSubmitProveedor}>Agregar lista de recepción producto</button>
                        
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
            case 3: // RF4 Crear categoría y leer
                if (selectedSubMenu === 0) {
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Descripción " />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Características" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="ID categoría" />
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
            case 4: // RF5 Crear, leer (código o nombre) y actualizar un producto
                if (selectedSubMenu === 0) { // Crear
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID del producto" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Nombre" />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Precio Venta" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Presentación" />
                            <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Unidad Medida" />
                            <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="Esp. empacado" />
                            <input type="text" value={inputData[6] || ''} onChange={(e) => handleInputChange(e, 6)} placeholder="Fecha Exp (YYYY-MM-DD)" />
                            <input type="text" value={inputData[7] || ''} onChange={(e) => handleInputChange(e, 7)} placeholder="ID categoría" />
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
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID del producto" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Nombre" />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="Precio Venta" />
                            <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="Presentación" />
                            <input type="text" value={inputData[4] || ''} onChange={(e) => handleInputChange(e, 4)} placeholder="Unidad Medida" />
                            <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="Esp. empacado" />
                            <input type="text" value={inputData[6] || ''} onChange={(e) => handleInputChange(e, 6)} placeholder="Fecha Exp (YYYY-MM-DD)" />
                            <input type="text" value={inputData[7] || ''} onChange={(e) => handleInputChange(e, 7)} placeholder="ID categoría" />
                        </>
                    );
                }
                break; 
            case 5: // RF6 Crear Orden para una sucursal
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Fecha entrega (YYYY-MM-DD)" />
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Estado: Poner vigente" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID sucursal envío" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="NIT proveedor" />
                        <input type="text" value={inputData[5] || ''} onChange={(e) => handleInputChange(e, 5)} placeholder="ID orden" />
            
                        <div className="product-inputs">
                            <input type="text" value={productInput.codigoBarras || ''} onChange={(e) => handleProductInputChange(e, 'codigoBarras')} placeholder="Producto Código de barras" />
                            <input type="text" value={productInput.cantidad || ''} onChange={(e) => handleProductInputChange(e, 'cantidad')} placeholder="Producto Cantidad" />
                            <input type="text" value={productInput.precioBodega || ''} onChange={(e) => handleProductInputChange(e, 'precioBodega')} placeholder="Producto Precio en bodega" />
                            <input type="text" value={productInput._id || ''} onChange={(e) => handleProductInputChange(e, '_id')} placeholder="Producto ID" />
                            <button type="button" className="add-product" onClick={handleAddProduct}>Agregar Producto a la lista</button>
                        </div>
            
                        <ul>
                            {products.map((product, index) => (
                                <li key={index}>
                                    {product.codigoBarras}, {product.cantidad}, {product.precioBodega}, {product._id}
                                </li>
                            ))}
                        </ul>
            
                        <button type="button" className="add-product-list" onClick={handleSubmit}>Agregar lista de productos</button>
                    </>
                );
            case 6: // RF7 Leer orden por id
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID de la sucursal" />
                    </>
                );
            case 7: // RFC1 Productos que cumplen cierta característica
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
            case 8: // RFC2 Inventario productos en una sucursal
                return (
                    <>
                        <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID sucursal" />
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
                return 'Crear Sucursal';
            case 1: // RF2
                if (selectedSubMenu === 0) {
                    return 'Crear Bodega';
                } else if (selectedSubMenu === 1) {
                    return 'Borrar Bodega';
                }
                break;
            case 2: // RF3
                if (selectedSubMenu === 0) {
                    return 'Crear proveedor';
                } else if (selectedSubMenu === 1) {
                    return 'Actualizar proveedor';
                }
                break;
            case 3: // RF4
                if (selectedSubMenu === 0) {
                    return 'Crear categoría';
                } else if (selectedSubMenu === 1) {
                    return 'Leer categoría por id';
                } else if (selectedSubMenu === 2) {
                    return 'Leer categoría por nombre';
                }
                break;
            case 4: // RF5
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
            case 5: // RF6
                return 'Crear Orden para una sucursal';
            case 6: // RF7
                return "Obtener Orden por su id";
            case 7: // RFC1
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
            case 8: // RFC2
                return "Inventario productos en una sucursal";
                
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
                        <button onClick={() => handleSubMenuClick(0)}>Crear Sucursal</button>
                    </div>
                );
            case 1: // RF2
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Bodega</button>
                        <button onClick={() => handleSubMenuClick(1)}>Borrar Bodega</button>
                    </div>
                );
            case 2: // RF3
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Proveedor</button>
                        <button onClick={() => handleSubMenuClick(1)}>Actualizar Proveedor</button>
                    </div>
                );
            case 3: // RF4
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear categoría</button>
                        <button onClick={() => handleSubMenuClick(1)}>Leer categoría ID</button>
                        <button onClick={() => handleSubMenuClick(2)}>Leer categoría Nombre</button>
                    </div>
                )
            case 4: // RF5
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear producto</button>
                        <button onClick={() => handleSubMenuClick(1)}>Leer producto ID</button>
                        <button onClick={() => handleSubMenuClick(2)}>Leer producto Nombre</button>
                        <button onClick={() => handleSubMenuClick(3)}>Actualizar producto</button>
                    </div>
                );
            case 5: // RF6
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Crear Orden para una sucursal</button>
                    </div>
                );
            case 6: // RF7
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Obtener Orden por su id</button>
                    </div>
                );
            case 7: // RFC1
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Productos por sucursal</button>
                        <button onClick={() => handleSubMenuClick(1)}>Productos por precio</button>
                        <button onClick={() => handleSubMenuClick(2)}>Productos por fecha</button>
                        <button onClick={() => handleSubMenuClick(3)}>Productos por categoría</button>
                    </div>
                );
            case 8: // RFC2
                return (
                    <div className="submenu">
                        <button onClick={() => handleSubMenuClick(0)}>Inventario productos en una sucursal</button>
                    </div>
                );
           

            default:
                return null;
        }
    };

    // Este pone el nombre del requerimiento arriba del form
    const getReqName = () => {
        if (selectedButton < 7) {
            return `RF${selectedButton + 1}`;
        } else {
            return `RFC${selectedButton - 6}`;
        }
    };


    // Este es el render final, con el html que muestra todo
    return (
        <div className="Reqs">
            <header>
                <h1>Requerimientos</h1>
            </header>
            <div className="container">
                <div className="menu">
                    {[...Array(7)].map((_, index) => (
                        <button key={index} onClick={() => handleButtonClick(index)}>
                            RF{index + 1}
                        </button>
                    ))}
                    {[...Array(2)].map((_, index) => (
                        <button key={index + 7} onClick={() => handleButtonClick(index + 7)}>
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
                                        <pre>{result}</pre> {} </div>
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




/*
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

    // Esto es para manejar los inputs del req 7
    const [products, setProducts] = useState([]);
    const [productInput, setProductInput] = useState({});
    const handleProductInputChange = (e, attribute) => { // Maneja los inputs de productos
        setProductInput({
            ...productInput,
            [attribute]: isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)
        });
    };

    const handleAddProduct = () => {
        setProducts([...products, productInput]); // Agrega el producto a la lista de productos y la limpia
        setProductInput({});
    };

    const handleSubmit = () => { // Agrega la lista de productos a la lista de inputs
        setInputData({
            ...inputData,
            4: products
        });

        setProducts([]);
        setProductInput({});
    }

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
                        response = await axios.post('http://localhost:8080/superandes/bodegas/new/save', {
                            nombre: inputData[0],
                            tamanio: inputData[1],
                            idsucursal: {
                                idSucursal: parseInt(inputData[2])
                            }
                        })
                        ;
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
                    console.log(inputData[4]);
                    console.log(inputData[2]);
                    response = await axios.post('http://localhost:8080/superandes/ordenes/new/save', {
                        fechaEntrega: inputData[0],
                        estado: inputData[1],
                        sucursalEnvio: parseInt(inputData[2]),
                        proveedor: parseInt(inputData[3]),
                        productosExtra: inputData[4]
                    });
                    setResult("Mensaje personalizado");
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
            if (selectedButton !== 6){
            setResult(JSON.stringify(response.data, null, 2));
            }
            else {
                setResult(response.data);
            }
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
            case 2: // RF3 Crear o Borrar Bodega
                if (selectedSubMenu === 0) { // Crear Bodega
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="Nombre Bodega" />
                            <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Tamanio" />
                            <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID Sucursal" />
                        </>
                    );
                } else if (selectedSubMenu === 1) { // Borrar Bodega
                    return (
                        <>
                            <input type="text" value={inputData[0] || ''} onChange={(e) => handleInputChange(e, 0)} placeholder="ID Bodega" />
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
                        <input type="text" value={inputData[1] || ''} onChange={(e) => handleInputChange(e, 1)} placeholder="Estado: Poner vigente" />
                        <input type="text" value={inputData[2] || ''} onChange={(e) => handleInputChange(e, 2)} placeholder="ID sucursal envío" />
                        <input type="text" value={inputData[3] || ''} onChange={(e) => handleInputChange(e, 3)} placeholder="NIT proveedor" />
            
                        <div className="product-inputs">
                            <input type="text" value={productInput.codBarras || ''} onChange={(e) => handleProductInputChange(e, 'codBarras')} placeholder="Producto Código de barras" />
                            <input type="text" value={productInput.cantidad || ''} onChange={(e) => handleProductInputChange(e, 'cantidad')} placeholder="Producto Cantidad" />
                            <input type="text" value={productInput.precioBodega || ''} onChange={(e) => handleProductInputChange(e, 'precioBodega')} placeholder="Producto Precio en bodega" />
                            <button type="button" className="add-product" onClick={handleAddProduct}>Agregar Producto a la lista</button>
                        </div>
            
                        <ul>
                            {products.map((product, index) => (
                                <li key={index}>
                                    {product.codBarras}, {product.cantidad}, {product.precioBodega}
                                </li>
                            ))}
                        </ul>
            
                        <button type="button" className="add-product-list" onClick={handleSubmit}>Agregar lista de productos</button>
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
                                        <pre>{result}</pre> {} </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reqs;*/