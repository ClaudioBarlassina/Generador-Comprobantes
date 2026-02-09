import { useState } from 'react'
import jsPDF from 'jspdf'
import basura from '../src/assets/eliminar.png'

import './App.css'

function App() {
  const [ConjuntClien, setConjuntoClien] = useState({
    Fecha: '',
    Nombre: '',
  })
  const [productos, setProductos] = useState({
    Descripcion: '',
    Cantidad: 0,
    Importe: 0,
    Total: 0,
  })
  const [Pedido, setPedido] = useState([])
  const [Orden, setOrden] = useState([])
  const [Select, setSelect] = useState('Resumen de Compra')

  const handler1 = (e) => {
    const { name, value } = e.target
    setConjuntoClien((prev) => ({ ...prev, [name]: value }))
  }
  const handler2 = (e) => {
    const { name, value } = e.target
    setProductos((prev) => {
      const updated = { ...prev, [name]: value }
      // Si cambia cantidad o importe, recalculamos el total
      if (name === 'Cantidad' || name === 'Importe') {
        const cantidad = parseFloat(updated.Cantidad) || 0
        const importe = parseFloat(updated.Importe) || 0
        updated.Total = cantidad * importe
      }
      return updated
    })
  }
  const handlerSelect = (e) => {
    const valor = e.target.value
    console.log(valor)
    setSelect(e.target.value)
  }
  const handlerAgregar = (e) => {
    e.preventDefault()
    setPedido((prev) => [...prev, productos])

    setProductos({
      Descripcion: '',
      Cantidad: 0,
      Importe: 0,
    })
  }
  const handlerGenerar = (e) => {
    e.preventDefault()

    const nuevaOrden = {
      Cliente: ConjuntClien,
      Productos: Pedido,
      Total: total,
    }
    setOrden((prev) => [...prev, nuevaOrden])
    console.log(nuevaOrden)

    const doc = new jsPDF()

    // === Encabezado principal ===
    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.5)
    doc.rect(10, 10, 190, 277) // marco general

    doc.setFont('helvetica')
    doc.setFontSize(45)
    doc.setTextColor(30, 30, 30)
    doc.text('Star', 20, 30)

    doc.setFontSize(14)
    doc.setTextColor(80, 80, 80)
    doc.text(Select, 22, 40)

    doc.setFontSize(11)
    doc.text(
      `Fecha: ${ConjuntClien.Fecha || new Date().toLocaleDateString()}`,
      195,
      40,
      { align: 'right' }
    )

    // === Línea separadora bajo el encabezado ===
    doc.line(15, 45, 195, 45)

    let y = 55 // posición vertical inicial

    // === Mostrar datos del cliente solo si NO es Presupuesto ===
    if (Select !== 'Presupuesto') {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text('Datos del Cliente', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      y += 8
      doc.text(`Nombre: ${ConjuntClien.Nombre || '-'}`, 23, y)
      y += 8

      // línea debajo de los datos del cliente
      doc.line(15, y + 2, 195, y + 2)
      y += 15
    } else {
      // si es Presupuesto, simplemente seguimos más abajo sin mostrar nada
      y = 55
    }

    // === Detalle de productos ===
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text('Detalle de Productos', 20, y)
    y += 8

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Descripción', 23, y)
    doc.text('Cant.', 115, y)
    doc.text('Importe', 145, y)
    doc.text('Total', 175, y)

    doc.line(15, y + 2, 195, y + 2)
    doc.setFont('helvetica', 'normal')
    y += 8

    Pedido.forEach((p) => {
      doc.text(p.Descripcion, 25, y)
      doc.text(String(p.Cantidad), 120, y)
      doc.text(`$${p.Importe}`, 145, y)
      doc.text(`$${p.Total}`, 175, y)
      y += 8
    })

    // === Total ===
    doc.line(15, y + 2, 195, y + 2)
    y += 12
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(20, 20, 20)
    doc.text(`TOTAL A PAGAR: $${total.toFixed(2)}`, 130, y)

    // === Pie de página ===
    y += 25
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text('Gracias por su compra', 20, y)

    doc.save(`${Select}_${ConjuntClien.Nombre || 'Cliente'}.pdf`)
  }
  const handlerlimpiar = (index) => {
    setPedido((prev) => prev.filter((_, i) => i !== index))
  }

  const total = Pedido.reduce((acc, item) => acc + item.Total, 0)

  return (
    <div className="general">
      <h2>GENERADOR DE COMPROBANTES</h2>
      <div className="conteiner-menu">
        <label htmlFor="">
          Tipo Comprobante
          <select name="" id="" onChange={handlerSelect}>
            <option value="Trabajo Realizado">Resumen de Compra</option>
            <option value="Presupuesto">Presupuesto</option>
            <option value="Resumen de Entrega">Resumen de Entrega</option>
          </select>
        </label>
      </div>

      <form action="" className="conteiner-formulario">
        <div className="conteiner-cliente">
          <label htmlFor="">
            Fecha
            <input type="text" name="Fecha" id="" onChange={handler1} />
          </label>
          {Select !== 'Presupuesto' && (
            <label htmlFor="">
              Nombre
              <input type="text" name="Nombre" id="" onChange={handler1} />
            </label>
          )}
        </div>
        <div className="conteiner-productos">
          <label htmlFor="">
            Descripcion
            <input
              type="text"
              name="Descripcion"
              id=""
              onChange={handler2}
              value={productos.Descripcion}
            />
          </label>

          <label htmlFor="">
            Cantidad
            <input
              type="text"
              name="Cantidad"
              id=""
              onChange={handler2}
              value={productos.Cantidad}
            />
          </label>
          <label htmlFor="">
            Importe
            <input
              type="text"
              name="Importe"
              id=""
              onChange={handler2}
              value={productos.Importe}
            />
          </label>
          <button className="buttonAgregar" onClick={handlerAgregar}>
            {' '}
            +{' '}
          </button>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Cant</th>
                  <th>Imp</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Pedido.map((item, index) => (
                  <tr key={index}>
                    <th>{item.Descripcion}</th>
                    <th>{item.Cantidad}</th>
                    <th>${item.Importe}</th>
                    <th>${item.Total}</th>
                    <th>
                      <button
                        type="button"
                        onClick={() => handlerlimpiar(index)}
                      >
                        <img
                          src={basura}
                          alt=""
                          style={{ width: 15, 'height ': 15 }}
                        />
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="conteiner-about">
          <h3> Total ${total} </h3>
          <button
            type="submit"
            className="buttonSubmit"
            onClick={handlerGenerar}
          >
            Generar
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
