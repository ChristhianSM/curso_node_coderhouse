const btnAddProduct = document.querySelector('.btn-add-product');
const nameProduct = document.querySelector('.name-product');
const priceProduct = document.querySelector('.price-product');
const pError = document.createElement('p');

btnAddProduct.addEventListener('click', validateForm);

function validateForm() {
   
    const { flag, message } = validateInputs(nameProduct.value, priceProduct.value) ;
    if ( !flag ) {
        pError.classList.add('bg-red-400','text-white', 'border-2', 'p-2',  'bg-red-400', 'mt-10', 'text-center', 'message-error')
        pError.textContent = message;
        document.querySelector('.form-add-product').appendChild(pError)
        return
    }else{
        document.querySelector('.message-error').remove();
    }

    const newProduct = {
        name : nameProduct.value,
        price: priceProduct.value,
        img : 'http://'
    }
    
    sendData(newProduct);
}

async function sendData(product) {
    const data = await fetch('/api/products', {
        method:'POST',
        body: JSON.stringify({product}),
        headers: {
            "Content-type":"application/json"
        }
    })
    const resp = await data.json();
}

function validateInputs(input1, input2) {
    let flag = true;
    let message = ""
    if (input1 === "" && input2 === "") {
        flag = false;
        message = "Campos obligatorios";
        nameProduct.classList.add('border-2', 'border-red-600');
        priceProduct.classList.add('border-2', 'border-red-600');
        return { flag, message }
    }else if(input1 === "") {
        flag = false;
        message = "Nombre del producto es obligatorio"
        nameProduct.classList.add('border-2', 'border-red-600');
        priceProduct.classList.remove('border-2', 'border-red-600');
        return { flag, message }
    }else if(input2 === "") {
        flag = false;
        message = "Precio del producto es obligatorio";
        nameProduct.classList.remove('border-2', 'border-red-600');
        priceProduct.classList.add('border-2', 'border-red-600');
        return { flag, message }
    }else if(input1.length < 3) {
        flag = false;
        message = "Ingrese un nombre de producto correcto"
        nameProduct.classList.add('border-2', 'border-red-600');
        priceProduct.classList.remove('border-2', 'border-red-600');
        return { flag, message }
    }else{
        message = ""
        document.querySelector('.name-product').classList.remove('border-2', 'border-red-600');
        document.querySelector('.price-product').classList.remove('border-2', 'border-red-600');
    }

    return {flag, message}
}