const accesToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZGUxYzk5Yy0yZDBiLTQwMDAtYTEwZC1mZjNkMTRmMDk3NTAiLCJqdGkiOiIxOWFlMTVhOWM3YzQwOWY3ZmNkYTAxOTAyNTQwMGRkZjQ5NjQ3YzIzNWM1ZTRiNzkwN2E4NmY5NjFlMDA1MzM1NWNiZWY5MDJkNmRjMjM4NSIsImlhdCI6MTczNzYzNDQ1MC41ODc3OTIsIm5iZiI6MTczNzYzNDQ1MC41ODc3OTMsImV4cCI6MTczNzYzODA1MC41Nzc4OTEsInN1YiI6IjMiLCJzY29wZXMiOltdfQ.VWEGsmBSr4Dc8eAWGfDPMVzGztzwTGUtejTwBcb6tLiRFuvSinmVHy-UBytO75F87eB0aJ0ElMBjyQjFwGmgj3uzdNZ_9VIp6irgNteVlBtJR2WNdHnqAhycW0KgiMVEuQqrlPAm-uGnYs5XWsFGGrlVdPGmGYBtTq3o3C4ePhgk17wZkv2fkU_w-18SSS-WS0gQlYFkIRo51ZcYLEAGkBtPDyXIp5yVc-_7s4Vgw9zlUJPRGitGkPcKypf0YPhO5nLok4iEuUhh34hLYzWJ6Dn5t5D25SGvPJJ5UWRGUDfc4R25XxbQ7z6vOVPwYMk5C1xjuqB3io3Q61iyg5y1jw6wqIB7uN8URa_-YzNbgTS-Zs6Xcau5TJaO3cHK5iuBsUjVL1ASlBRPP_mrzk-tcn2DtLDki3BYGi11gn1JXYaUafxr3mtimC3-1Iwjn7cBY7g7yG4BcD-Fpb9yrV5FpZQ-PTaGV71GEFoxHLfxh3KWiSsy-3JZb71nzgWN_wBs71BgDJgrLaOXIXxQpsBjxdG_Dk9r9AD9SxdEvu1hboVb8aYeMMwzXaSpKphiimG0CyL-QIEydPr1UEyBPDw_0_Q-WF7i5ViTWFHTiOAs79-Mac_W5KfGt43yr92iICvO-eph-Cmcva9IkF84lnxpRZ3uKcNm8cTwtT2EnGZm24A";



let data = {
  numbering_range_id: "",
  reference_code: "",
  observation: "",
  payment_method_code: "",
  customer: {
    identification: "",
    dv: "",
    company: "",
    trade_name: "",
    names: "",
    address: "",
    email: "",
    phone: "",
    legal_organization_id: "",
    tribute_id: "",
    identification_document_id: "",
    municipality_id: ""
  },
  items: [],
  
}

// esperar que la pagina este completamente cargada
document.addEventListener("DOMContentLoaded", function () {

  // Lógica para "buscarFactura"
  const verFacturasBtn = document.getElementById("ver_facturas");

  if (verFacturasBtn) {
    verFacturasBtn.onclick = function (event) {
      event.preventDefault();
  
      // Obtener los valores de los filtros (suponiendo que los tienes en inputs de formulario)
      const number = document.getElementById("numero").value || '';
      const names = document.getElementById("nombre").value || '';
      const identification = document.getElementById("identificacion").value || '';
      const reference_code = document.getElementById("codigo_referencia").value || '';
      const status = document.getElementById("estado").value || '';
  
      // Crear un objeto para los filtros que no estén vacíos
      const filter = {};

      if (number) filter["filter[number]"] = number;
      if (names) filter["filter[names]"] = names;
      if (identification)filter["filter[identification]"] = identification;
      if (reference_code)filter["filter[reference_code]"] = reference_code;
      if (status) filter["filter[status]"] = status;
  
      // Convertir el objeto de filtros en un query string
      const queryString = new URLSearchParams(filter).toString();

      // Construir la URL con los filtros aplicados (si hay filtros, se los añade al URL, si no, muestra todas las facturas)
      const url_2 = queryString ? `https://api-sandbox.factus.com.co/v1/bills?${queryString}` : 'https://api-sandbox.factus.com.co/v1/bills';
  
      fetch(url_2, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accesToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const facturasList = document.getElementById("facturas_list");
          facturasList.innerHTML = ""; // Limpia la tabla
  
          const facturas = data.data?.data || [];
          if (facturas.length === 0) {
            facturasList.innerHTML = `<tr><td colspan="6">No hay facturas disponibles</td></tr>`;
            return;
          }
  
          facturas.forEach(factura => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${factura.number}</td>
              <td>${factura.names || "Sin nombre"}</td>
              <td>${factura.identification || "N/A"}</td>
              <td>${factura.status === 1 ? 'Validada' : 'Pendiente'}</td>
              <td>${factura.total}</td>
              <td>${factura.reference_code}</td>
              <td>${factura.created_at}</td>
              <td><button type="button" class="descargar-pdf" data-number="${factura.number}" >Descargar</button></td>
              <td><button type="button" class="ver-pdf" data-number="${factura.number}">Ver</button></td>
            `;
            facturasList.appendChild(row);
          });
        })
        .catch(error => {
          alert("Error al cargar los datos: " + error.message);
        });
    };
  };
  

  // Lógica para "enviar"
  const enviarBtn = document.getElementById("enviar");
  if (enviarBtn) {
    enviarBtn.onclick = function (event) {
      event.preventDefault();


      // Obtener los valores de los campos y asignarlos al objeto
      data.numbering_range_id = document.getElementById("rango_Numeracion").value;
      data.reference_code = document.getElementById("código_Referencia").value;
      data.observation = document.getElementById("observación").value;
      data.payment_method_code = document.getElementById("código_método_pago").value;  
      
      
      // Obtener los valores para la propiedad "clientes"
      data.customer.identification = document.getElementById("identificación").value;
      data.customer.dv = document.getElementById("dv").value;
      data.customer.company = document.getElementById("compañía").value;
      data.customer.trade_name = document.getElementById("nombre_comercial").value;
      data.customer.names = document.getElementById("nombres").value;
      data.customer.address = document.getElementById("direccion").value;
      data.customer.email = document.getElementById("correo_electrónico").value;
      data.customer.phone = document.getElementById("teléfono").value;
      data.customer.legal_organization_id = document.getElementById("id_organización_legal").value;
      data.customer.tribute_id = document.getElementById("tributo_id").value;
      data.customer.identification_document_id = document.getElementById("identificación_documento_id").value;
      data.customer.municipality_id = document.getElementById("municipio_id").value;
      
      fetch(`https://api-sandbox.factus.com.co/v1/bills/validate`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accesToken}`, 
          'Accept': `application/json`, 
        },
        body: JSON.stringify(data)  
      })
      .then(response => {
        if (!response.ok) {
          // Si la respuesta no es OK, lanzamos un error con el mensaje
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Error en la solicitud');
          });
        }
        
        return response.json();
      })
      .then(data => {
        alert(`${data.message}`);
      })
        .catch(error => {
        // console.error("Error en la solicitud:", error);
        alert(`${error}`);
      });
    };
  };

  // Lógica para "agregarProducto"
  const agregarProductoBtn = document.getElementById("agregarProducto");
  if (agregarProductoBtn) {
    agregarProductoBtn.onclick = function (event) {
      event.preventDefault();

      let referencia_código = document.getElementById("referencia_código").value;
      let nombre = document.getElementById("nombre").value;
      let cantidad = document.getElementById("cantidad").value;
      let descuento = document.getElementById("descuento").value;
      let tasa_descuento = document.getElementById("tasa_descuento").value;
      let precio = document.getElementById("precio").value;
      let valor_descuento = document.getElementById("valor_descuento").value;
      let id_medida_unidad = document.getElementById("id_medida_unidad").value;
      let id_código_estándar = document.getElementById("id_código_estándar").value;
      let está_excluido = document.getElementById("está_excluido").value;
      let tributto_aplicado = document.getElementById("tributto_aplicado").value;
      let codigo = document.getElementById("codigo").value;
      let tasa_de_retención_impositiva = document.getElementById("tasa_de_retención_impositiva").value;

      data.items.push({

        code_reference: referencia_código,
          name: nombre,
          quantity: descuento,
          discount_rate: tasa_descuento,
          price: precio,
          tax_rate: valor_descuento,
          unit_measure_id: id_medida_unidad,
          standard_code_id: id_código_estándar,
          is_excluded: está_excluido,
          tribute_id: tributto_aplicado,
          withholding_taxes: [
          {
            code: codigo,
            withholding_tax_rate: tasa_de_retención_impositiva
          }
        ]
    
      });
    
      let container = document.getElementById("tabla_container");
      if (!document.getElementById("tabla")) {
        let tabla =`<table id="tabla"><thead>
                        <tr>
                            <th>Referencia_código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Valor_descuento</th>
                            <th>Tributto_aplicado</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>`
        container.innerHTML = tabla
        
      }
    
      let tablaBody = document.querySelector("#tabla tbody");
            let nuevaFila = `
                <tr>
                    <td>${referencia_código}</td>
                    <td>${nombre}</td>
                    <td>${precio}</td>
                    <td>${valor_descuento}</td>
                    <td>${tributto_aplicado}</td>
                    <td>${cantidad}</td>
                    
                </tr>
            `;
      tablaBody.innerHTML += nuevaFila;
      
    }
    
  };

// Lógica para "descargarFactura"
  document.addEventListener("click", function (event) {

    if (event.target.matches(".descargar-pdf")) { // Clase del botón de descargar
      const facturaNumber = event.target.dataset.number; // Número de factura

      const url_3 = `https://api-sandbox.factus.com.co/v1/bills/download-pdf/${facturaNumber}`;

      fetch(url_3, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accesToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK") {
          const base64String = data.data.pdf_base_64_encoded;
          const decodedData = atob(base64String); // Decodifica el Base64
    
          // Crear un Blob para el PDF y crear un enlace para descargarlo
          const blob = new Blob([new Uint8Array([...decodedData].map(c => c.charCodeAt(0)))], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "Factura"/*data.data.file_name*/ + ".pdf"; // Nombre del archivo
          link.click();
        } else {
          alert('Error al obtener el PDF:', data.message);
        }
      })
      .catch(error => {
        alert("Error al descargar la factura: " + error.message);
      });

    }
  });

// Lógica para "verfactura"
  document.addEventListener("click", function (event) {
    
    if (event.target && event.target.classList.contains("ver-pdf")) {
      const numeroFactura = event.target.dataset.number;

      
  
      fetch(`https://api-sandbox.factus.com.co/v1/bills/show/${numeroFactura}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accesToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const factura = data.data.bill
          const cliente = data.data.customer
          const modal = document.querySelector(".modal");
          const modalContainer = document.querySelector(".modal__container");
         
          if (factura) {
            modalContainer.innerHTML = `
              <h3>Factura: ${factura.number}</h3>
              <p>Cliente: ${cliente.names}</p>
              <p>Total: ${factura.total}</p>
              <p>Estado: ${factura.status === 1 ? "Validada" : "Pendiente"}</p>
              <p>Fecha: ${factura.created_at}</p>
              <div id="qrcode"></div>
              <a href="${factura.qr}" target="_blank" rel="noopener noreferrer">ver QR</a>
              <button class="modal__close">Cerrar</button>
            `;
            modal.classList.add("modal--show");

            // Generar el código QR dentro del modal
            new QRCode(document.getElementById("qrcode"), {
              text: factura.qr,
              width: 128, // Ajusta el tamaño según sea necesario
              height: 128,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });

  
            // Agregar evento para cerrar el modal
            const closeModal = modal.querySelector(".modal__close");
            closeModal.addEventListener("click", () => {
              modal.classList.remove("modal--show");
            });
          } else {
            alert("Factura no encontrada");
          }
        })
        .catch(() => {
          alert("Error al cargar los datos de la factura");
        });
    }
  });
      


  
  

  
});