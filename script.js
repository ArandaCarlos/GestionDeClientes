document.addEventListener("DOMContentLoaded", init)

const URL_API = 'http://localhost:3000/api'

var customers = [];
var customerEditId = null;

function init() {
    search()
}

function setCustomerEdit(id){
    customerEditId = id;
    customer = customers.find(cust => cust.id = id);
    arregloDeInputs = [customer.firstname, customer.lastname,customer.email,customer.phone,customer.address]
    const inputs = document.querySelectorAll('#inputName, #inputLastName, #inputEmail, #inputPhone,#inputAddress');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = arregloDeInputs[i]; 
    }
}

function clearInputs() {
    const inputs = document.querySelectorAll('#inputName, #inputLastName,#inputEmail, #inputPhone,#inputAddress');
    inputs.forEach(input => {
        input.value = '';
    });
}

async function deleteCustomer(id) {

    respuesta = confirm("Esta seguro de eliminarlo?")
    if (respuesta) {
        var url = URL_API + '/customers/' + id
        var response = await fetch(url, {
            "method": 'DELETE',
            "headers": {
                "Content-type": 'application/json'
            }
        })
        alert("eliminado")
    }

    init()
}

function saveCustomer() {
    var data = {
        "first_name": document.getElementById("inputName").value,
        "last_name": document.getElementById("inputLastName").value,
        "email": document.getElementById("inputEmail").value,
        "phone": document.getElementById("inputPhone").value,
        "address": document.getElementById("inputAddress").value
    }
    if(customerEditId == null){
        createCustomer(data)
    }else{
        editCustomer(data,customerEditId)
        customerEditId =null;
    }
    clearInputs()
    init()
}

async function createCustomer(data){

    var url = URL_API + '/customers'
    var response = await fetch(url, {
        "method": 'POST',
        "body": JSON.stringify(data),
        "headers": {
            "Content-type": 'application/json'
        }

    })
}
async function editCustomer(data,id){
    data.id = id;
    var url = URL_API + '/customers/'
    var response = await fetch(url, {
        "method": 'PUT',
        "body": JSON.stringify(data),
        "headers": {
            "Content-type": 'application/json'
        }

    })
}
async function search() {
    var url = URL_API + '/customers'
    var response = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-type": 'application/json'
        }
    })
    customers = await response.json();

    var rows = []
    customers.forEach(customer => {
        
        var row = `
        <tr>
            <th>${customer.firstname}</th>
            <td>${customer.lastname}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <button type="button" class="btn btn-primary" onClick={setCustomerEdit(${customer.id})} data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button>
                <button type="button" class="btn btn-danger" onClick={deleteCustomer(${customer.id})}>Eliminar</button>
            </td>
        </tr>`
        rows.push(row)
    });


    document.querySelector("#customers > tbody").outerHTML = rows;
}

