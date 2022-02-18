const btnAddProduct = document.querySelector('.btn-add-product');
const nameProduct = document.querySelector('.name-product');
const priceProduct = document.querySelector('.price-product');
const fileProduct = document.querySelector('.file-product');
const pError = document.createElement('p');

btnAddProduct.addEventListener('click', validateForm);

function validateForm() {
   
    const { flag, message } = validateInputs(nameProduct.value, priceProduct.value, fileProduct.files[0]) ;
    if ( !flag ) {
        pError.classList.add('bg-red-400','text-white', 'border-2', 'p-2',  'bg-red-400', 'mt-10', 'text-center', 'message-error')
        pError.textContent = message;
        document.querySelector('.form-add-product').appendChild(pError)
        return
    }else{
        if (document.querySelector('.message-error')) {
            document.querySelector('.message-error').remove();
        }
    }

    const formData = new FormData();
    formData.append('file', fileProduct.files[0])
    formData.append('name', nameProduct.value)
    formData.append('price', priceProduct.value)
    
    sendData(formData);
}

async function sendData(formData) {
    const data = await fetch('/api/products', {
        method:'POST',
        body: formData
    })
    const resp = await data.json();
    clearInputs();
}

function validateInputs(input1, input2, file) {
    console.log(!file)
    let flag = true;
    let message = ""
    if (input1 === "" && input2 === "" && !file) {
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
    }else if (!file) {
        flag = false
        message = "Ingrese una foto del producto";
        return { flag, message }
    }else{
        message = ""
        document.querySelector('.name-product').classList.remove('border-2', 'border-red-600');
        document.querySelector('.price-product').classList.remove('border-2', 'border-red-600');
    }

    return {flag, message}
}

function clearInputs () {
    document.querySelector('.name-product').value = "";
    document.querySelector('.price-product').value= "";
    document.querySelector('.file-product').value= "";
}