let currentPage = 1
let totalPages = 1
let inputFieldValue
let dropdownButtonValue

const rowsPerPage = 10
const dropdownButton = document.getElementById('dropdownButton')
const dropdownMenu = document.getElementById('dropdownMenu')
const inputField = document.getElementById('inputField')
const selectedProducts = []
const ListaProdutos = []

/* CONTEUDO DAS POPUS*/
const overlay = document.getElementById('overlay')
const addProductPopup = document.getElementById('addProductPopup')
const editProductPopup = document.getElementById('editProductPopup')
const registerProduct = document.getElementById('registerProduct')
const editProduct = document.getElementById('editProduct')
const importProducts = document.getElementById('importProducts')
const generateEditReport = document.getElementById('generateEditReport')
const addFileInput = document.getElementById('addFileInput')
const editFileExtract = document.getElementById('editFileExtract')
const buttonBlue = document.getElementById('button blue')
const buttonGray = document.getElementById('button gray')
const buttonRed = document.getElementById('button red')
const testeNegativos = document.getElementById('testeNegativos')
const editRemove = document.getElementById('editRemove')
const buttonGreen = document.getElementById('button green')
const originalData = []
const updatedData = []

function fetchData(page = 1, rows = rowsPerPage, fieldValue, filterValue) {
    fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ 
            fieldValue: fieldValue,
            filterValue: filterValue 
        })
    })
    .then(response => response.json())
    .then(data => {
        updatePaginationButtons(page)
        renderTable(page, rows, data)
    })
}

function updatePaginationButtons(page) {
    const pageNumbers = document.getElementById('pageNumbers')
    pageNumbers.innerHTML = ''

    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, page - halfVisible)
    let endPage = Math.min(totalPages, page + halfVisible)

    if (page <= halfVisible) {
        endPage = Math.min(totalPages, maxVisiblePages)
    } else if (page + halfVisible >= totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    if (startPage > 1) {
        const dots = document.createElement('span')
        dots.innerHTML = '...'
        dots.classList.add('pagination', 'button', 'disabled')
        pageNumbers.appendChild(dots)
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button')
        button.innerHTML = i;
        button.classList.add('pagination', 'button')
        button.id = `currentPage${i}`

        if (i === page) {
            button.classList.add('active')
        }

        button.addEventListener('click', () => {
            currentPage = i
            fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
            updatePaginationButtons(currentPage)
        });

        pageNumbers.appendChild(button)
    }

    if (endPage < totalPages) {
        const dots = document.createElement('span')
        dots.innerHTML = '...'
        dots.classList.add('pagination', 'button', 'disabled')
        pageNumbers.appendChild(dots)
    }
}

function renderTable(page, rows, data) {
    const totalRecords = data.length
    totalPages = Math.ceil(totalRecords / rows)

    const start = (page - 1) * rows
    const end = start + rows

    const pageData = data.slice(start, end)

    const tabelaBody = document.querySelector('tbody')
    tabelaBody.innerHTML = ''

    pageData.forEach(produto => {
        const linha = document.createElement('tr')

        const dataFormatada = produto.dataValidade ?
            new Date(produto.dataValidade).toLocaleDateString('pt-BR') : 'N/A'

        const valorFormatado = Number(produto.valorProduto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        const totalFormatado = Number(produto.valorProduto * produto.quantidadeProduto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        let un = `style='background-color: red;'`;
        if (produto.quantidadeProduto <= 0) {
            un = `style='background-color: #f93e3e;'`;
            ListaProdutos.push(produto.idProduto);
            alert('A quantidade do produto está zerada!');
        } else if (produto.quantidadeProduto <= 10) {
            un = `style='background-color: #f6f93e;'`;
        } else {
            un = `style='background-color:#82f93e;'`;
        }
        
        
        linha.innerHTML = `  
            <td>${produto.idProduto}</td>
            <td>${produto.nomeProduto}</td>
            <td ${un}>${produto.quantidadeProduto}</td>
            <td>${valorFormatado}</td>
            <td>${totalFormatado}</td>
            <td>${dataFormatada}</td>
            <td>${produto.fornecedor}</td>
            <td>${produto.descricaoProduto}</td>
            <td>
                <input type="checkbox" class="product-checkbox" id="checkbox-${produto.idProduto}" data-id="${produto.idProduto}">
                <label for="checkbox-${produto.idProduto}">
                    <img src="${produto.imagemProduto}" alt="${produto.nomeProduto}" class="product-image" loading="lazy">
                </label>
            </td>
        `
        tabelaBody.appendChild(linha)
    })

    updatePaginationButtons(page)

    if(selectedProducts.length > 0) {
        markSelectedProducts() 
    }

    
    document.getElementById(`currentPage${currentPage}`).style.backgroundColor = '#c1ff72'
    document.getElementById(`currentPage${currentPage}`).style.color = '#7ed957'
    document.getElementById(`currentPage${currentPage}`).style.borderRadius = '20px'
}

function updateField(text) {
    dropdownButton.placeholder = text
    if (text.includes('Data') || text.includes('Quantidade')) {
        inputField.placeholder = `Digite a ${text.toLowerCase()} do produto procurado`
    } else {
        inputField.placeholder = `Digite o ${text.toLowerCase()} do produto procurado`
    }
    dropdownMenu.style.display = 'none'
}

function markSelectedProducts() {
    selectedProducts.forEach(element => {
        const selectedProduct = document.getElementById(`checkbox-${element}`)
        if(selectedProduct) {
            selectedProduct.closest('tr').classList.add('selected-product')
            selectedProduct.checked = true
        }
    });
}

document.addEventListener('change', (event) => {
    const checkbox = event.target
    const productId = checkbox.getAttribute('data-id')
    
    if(checkbox.checked && !selectedProducts.includes(productId)) {
        selectedProducts.push(productId)
        checkbox.closest('tr').classList.add('selected-product') 
    } else if(!checkbox.checked && selectedProducts.includes(productId)) {
        const index = selectedProducts.indexOf(productId)
        checkbox.closest('tr').classList.remove('selected-product')
        if(index > -1) {
            selectedProducts.splice(index, 1)
        }
    }
})

dropdownButton.addEventListener('click', () => {
    const rect = dropdownButton.getBoundingClientRect()
    dropdownMenu.style.top = `${rect.top + 40}px`
    dropdownMenu.style.left = `${rect.left + 15}px`
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'
})

window.addEventListener('click', (e) => {
    if(!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none'
    }
})

// EVENTO RELACIONADO AO FILTRO
inputField.addEventListener('keydown', function(event) {
    inputFieldValue = inputField.value;
    dropdownButtonValue = dropdownButton.placeholder;
    page = 1
    rows = rowsPerPage

    if(event.key === 'Enter' && dropdownButtonValue != 'Valor do filtro') {
        if(dropdownButtonValue === 'Código do produto') {
            if(inputFieldValue.includes('.') || inputFieldValue.includes(',')) {
                const idArray = []
                inputFieldValue = inputFieldValue.replace(/\./g, ',')
                idArray.push(...inputFieldValue.split(','))
                inputFieldValue = idArray
            }
        }

        if(dropdownButtonValue === 'Quantidade' && inputFieldValue.includes(',')) {
            inputFieldValue = inputFieldValue.replace(',', '.')
        }

        if(dropdownButtonValue === 'Data de validade') {
            const regex = /^([<>]=?|==|!=)\s*(-?\d+(\.\d+)?)/
            const match = inputFieldValue.match(regex)

            if(match) {
                inputFieldValue = inputFieldValue
            } else if(inputFieldValue.toUpperCase() === 'N/A') {
                inputFieldValue = inputFieldValue.toUpperCase()
            } else {
                let [day, month, year] = inputFieldValue.split('/').map(Number);

                if(year == undefined || year == 0) {
                    year = '%'
                }
    
                if(month == undefined || month == 0) {
                    month = '%'
                } else {
                    month = month.toString().padStart(2, '0')
                }
    
                if(day == undefined || day == 0) {
                    day = '%'
                } else {
                    day = day.toString().padStart(2, '0')
                }
    
                inputFieldValue = `${year}-${month}-${day}`
            }
        }

        if(inputFieldValue === "") {
            inputFieldValue = null
        }
        currentPage = 1 
        fetchData(page, rowsPerPage, inputFieldValue, dropdownButtonValue)
    }
})

document.getElementById('firstPage').addEventListener('click', () => {
    currentPage = 1
    fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
})

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 1
        fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
    }
})

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage += 1
        fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
    }
})

document.getElementById('lastPage').addEventListener('click', () => {
    currentPage = totalPages
    fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
})

fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)

/* CONTEUDO DAS POPUS */

function validateAddProductForm(registerData) {
    const errors = []

    registerData.forEach((item) => {
        const { field, value, element } = item

        if(!value) {
            errors.push(`O campo ${field} é obrigatório.`)
            element.placeholder = 'Esse campo é obrigatório.'
            element.style.border = '1px solid red'
        } else {
            element.style.border = 'none'
        }
    })

    return errors.length === 0;
}

function clearProductForm(popupFather) {
    const productPopupChildren = document.querySelectorAll(`.${popupFather} > *`)
    const productPopupInputs = document.querySelectorAll(`.${popupFather} input`)

    productPopupChildren.forEach(element => {
        element.style.display = ''
        if(element.classList.contains('removed')) {
            element.remove()
        }
    })

    productPopupInputs.forEach(element => {
        element.value = ''
    })
}

function sucessMsgSender(msg1, msg2, popupFather) {
    const h1Element = createTextElement('h1', msg1, 'removed')
    const h2Element = createTextElement('h2', msg2, 'removed', { marginTop: '-5px' })

    popupFather.append(h1Element, h2Element)
}

function convertFileToJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet)
                resolve(jsonData)
            } catch(error) {
                reject(error)
            }
        }
        reader.onerror = (error) => reject(error)
        reader.readAsArrayBuffer(file)
    })
}

function clearPopup(popupFatherID) {
    const productPopupChildren = document.querySelectorAll(`.${popupFatherID} > *`)
    productPopupChildren.forEach(element => {
        element.style.display = 'none'
    })
}

function togglePopupDisplay(buttonCollor, popupType) {
    if(overlay.style.display == 'block') {
        overlay.style.display = 'none'
        popupType.style.display = 'none'
        buttonCollor.style.zIndex = 0
        clearProductForm(popupType.id)
    } else {
        overlay.style.display = 'block'
        popupType.style.display = 'flex'
        buttonCollor.style.zIndex = 1000
    }
}

function escDisablePopupDisplay(buttonCollor, popupType) {
    popupType.style.display = 'none'
    buttonCollor.style.zIndex = 0
    clearProductForm(popupType.id)
}

function formatDateToISO(dateUnformated) {
    const date = new Date(dateUnformated)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2,'0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

function fetchSearchResults(fieldValue, filterValue) {
    return fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ 
            fieldValue: fieldValue,
            filterValue: filterValue
        })
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
    .catch(error => console.error('Erro ao buscar os dados: ', error))
}

function clearArray(arrayName) {
    arrayName.splice(0, arrayName.length)
}

function createReportPopup(popupFather) {
    const h1Element = createTextElement('h1', 'Gerar', 'removed')
    const h2Element = createTextElement('h2', 'Relátorio', 'removed', { marginTop: '-5px', marginBottom: '30px' })
    const nameInputGroup = createInputGroup('Nome do arquivo', 'text')
    const directoryInputGroup = createInputGroup('Diretório', 'text', { cursor: 'pointer', display: 'block' }, true)
    
    const anchorElements = createAnchorGroup([
        { id: 'backButton', name: 'Voltar' },
        { id: 'generateButton', name: 'Gerar relatório' }
    ])

    popupFather.append(h1Element, h2Element, nameInputGroup, directoryInputGroup, anchorElements);
}

function createTextElement(tag, text, className, style = {}) {
    const element = document.createElement(tag)
    element.textContent = text
    element.classList.add(className)
    Object.assign(element.style, style)
    return element
}

function createInputGroup(labelText, inputType, style = {}, readonly = false) {
    const divElement = document.createElement('div')
    divElement.classList.add('input-group', 'removed')

    const label = document.createElement('label')
    label.textContent = labelText

    const input = document.createElement('input')
    input.type = inputType;
    Object.assign(input.style, style)
    input.readOnly = readonly

    input.addEventListener('click', () => {
        editFileExtract.click()
    })

    divElement.append(label, input)
    return divElement
}

function createAnchorGroup(anchors) {
    const divElement = document.createElement('div')
    divElement.classList.add('links-container', 'removed')

    anchors.forEach(({ id, name }) => {
        const anchor = document.createElement('a')
        anchor.textContent = name
        anchor.id = id
        anchor.href = '#'

        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            handleAnchorClick(anchor)
        })

        divElement.append(anchor)
    })
    return divElement
}

function handleAnchorClick(anchor) {
    if(anchor.id == 'backButton') {
        buttonBlue.click()
        buttonBlue.click()
    } else if(anchor.id == 'generateButton') {
        const inputSelectors = [
            { selector: '#editProductPopup > div:nth-child(13) > input[type=text]' },
            { selector: '#editProductPopup > div:nth-child(14) > input[type=text]' }
        ]

        const inputData = inputSelectors.map(field => {
            const inputElement = document.querySelector(field.selector)
            return { value: inputElement.value, inputElement: inputElement }
        })

        inputData.forEach((item) => {
            const { value, inputElement } = item

            if(!value) {
                inputElement.placeholder = 'Esse campo é obrigatório'
                inputElement.style.border = '1px solid red'
            } else {
                inputElement.style.border = 'none'
            }
        })
    }   
}

buttonGreen.addEventListener('click', (e) => {
    togglePopupDisplay(buttonGreen, addProductPopup)
})


const negativadosPopup = document.getElementById('negativadosPopup');
buttonGray.addEventListener('click', function() {
    fetch('http://localhost:3000/negativados')
        .then(response => response.json())
        .then(data => {
            const negativadosPopup = document.getElementById('negativadosPopup');
            negativadosPopup.innerHTML = '<h1>Negativados</h1>'; 

            
            const table = document.createElement('table');
            table.classList.add('table-bordered');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th style="color: black;">ID</th>
                <th style="color: black;">Nome</th>
                <th style="color: black;">Quantidade</th>
            `;
            table.appendChild(headerRow);

            data.forEach(produto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${produto.idProduto}</td>
                    <td>${produto.nomeProduto}</td>
                    <td>${produto.quantidadeProduto}</td>
                `;
                table.appendChild(row);
            });

            negativadosPopup.appendChild(table);

            overlay.style.display = 'block';
            negativadosPopup.style.display = 'flex';
        });
});

overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    negativadosPopup.style.display = 'none';
});


overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    negativadosPopup.style.display = 'none';
});



buttonRed.addEventListener('click', (e) => {
    if (selectedProducts.length > 0) {
        data = fetchSearchResults(selectedProducts[0], 'Código do produto').then(data => {
            const productData = data[0];
            const formattedDate = formatDateToISO(productData.dataValidade);

            const fieldMapping = {
                '.productName': productData.nomeProduto,
                '.productQuantity': productData.quantidadeProduto,
                '.productPrice': productData.valorProduto,
                '.productExpiryDate': formattedDate,
                '.productSupplier': productData.fornecedor,
                '.productDescription': productData.descricaoProduto,
                '.productURL': productData.imagemProduto
            };

            for (const [selector, value] of Object.entries(fieldMapping)) {
                const field = editRemove.querySelector(selector);
                field.value = value;
                field.readOnly = true;  // Impede que o usuário edite o campo
                originalData.push(value);
            }
        });
    } else {
        clearPopup(editRemove.id);
        sucessMsgSender('Erro', 'Selecione uma mercadoria', editRemove);
    }

    if (editRemove.style.display == 'flex') {
        clearArray(originalData);
        clearArray(updatedData);
    }

    togglePopupDisplay(buttonRed, editRemove);
});

document.getElementById('removProduct').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('http://localhost:3000/remove', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
            idProduct: selectedProducts[0] 
        })
    })
    .then(response => response.json())
    .then(data => {
        inputFieldValue = null
        dropdownButtonValue = 'Nome'
        currentPage = 1
        fetchData(currentPage, rowsPerPage, inputFieldValue, dropdownButtonValue)
        clearPopup(editRemove.id)
        sucessMsgSender('Sucesso', 'mercadoria removida', editRemove)
    })
});

buttonBlue.addEventListener('click', (e) => {
    if(selectedProducts.length > 0) {
        data = fetchSearchResults(selectedProducts[0], 'Código do produto').then(data => {
            const productData = data[0]
            const formattedDate = formatDateToISO(data[0].dataValidade)
            const fieldMapping = {
                '.productName': productData.nomeProduto,
                '.productQuantity': productData.quantidadeProduto,
                '.productPrice': productData.valorProduto,
                '.productExpiryDate': formattedDate,
                '.productSupplier': productData.fornecedor,
                '.productDescription': productData.descricaoProduto,
                '.productURL': productData.imagemProduto
            }

            for (const [selector, value] of Object.entries(fieldMapping)) {
                editProductPopup.querySelector(selector).value = value
                originalData.push(value)
            }
        })
    } else {
        clearPopup(editProductPopup.id)
        sucessMsgSender('Erro', 'Selecione uma mercadoria', editProductPopup)
    }

    if(editProductPopup.style.display == 'flex') {
        clearArray(originalData)
        clearArray(updatedData)
    }

    togglePopupDisplay(buttonBlue, editProductPopup)
})

// Redireciona o click no elemento de importar produtos para o input
importProducts.addEventListener('click', (e) => {
    e.preventDefault()
    addFileInput.click()
})

addFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]

    if(file.name.includes('.xlsx')) {
        importProducts.style.color == 'red' ? importProducts.style.color = 'black' : null
        convertFileToJSON(file).then((jsonData) => {
            fetch('http://localhost:3000/bulkRegister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.json())
            .then(data => {
                fetchData(1, rowsPerPage, inputFieldValue, dropdownButtonValue)
            })
            clearPopup(addProductPopup.id)
            sucessMsgSender('Mercadorias', 'Cadastradas', addProductPopup)
        })
    } else {
        importProducts.style.color = 'red'
    }
})

function exportToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    XLSX.writeFile(workbook, 'dados.xlsx')
}

registerProduct.addEventListener('click', () => {
    const fields = [
        { name: 'Nome do produto', selector: '.productName' },
        { name: 'Quantidade do Produto', selector: '.productQuantity' },
        { name: 'Preço do Produto', selector: '.productPrice' },
        { name: 'Data de Validade', selector: '.productExpiryDate' },
        { name: 'Fornecedor', selector: '.productSupplier' },
        { name: 'Descrição', selector: '.productDescription' },
        { name: 'URL do Produto', selector: '.productURL' }
    ]

    const registerData = fields.map(field => {
        const element = addProductPopup.querySelector(field.selector)
        return { field: field.name, value: element.value, element: element }
    })

    if(validateAddProductForm(registerData)) {
        [productName, productQuantity, productPrice, productExpiryDate, productSupplier, productDescription, productURL] = registerData.map(data => data.value)
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({
                ProductName: productName,
                ProductQuantity: productQuantity,
                ProductPrice: productPrice,
                ProductExpiryDate: productExpiryDate,
                ProductSupplier: productSupplier,
                ProductDescription: productDescription,
                ProductURL: productURL
            })
        })
        .then(response => response.json())
        .then(data => {
            inputFieldValue = null
            dropdownButtonValue = 'Nome'
            fetchData(1, rowsPerPage, inputFieldValue, dropdownButtonValue)
        })
        clearPopup(addProductPopup.id)
        sucessMsgSender('Mercadoria', 'Cadastrada', addProductPopup)
    }
})

editProduct.addEventListener('click', (e) => {
    const fieldMapping = [
        '.productName',
        '.productQuantity',
        '.productPrice',
        '.productExpiryDate',
        '.productSupplier',
        '.productDescription',
        '.productURL',
    ]

    for(const selector of fieldMapping) {
        const value = editProductPopup.querySelector(selector).value
        if(Number(value)) {
            updatedData.push(Number(value))
        } else {
            updatedData.push(value)
        }
    }

    if(JSON.stringify(originalData) != JSON.stringify(updatedData)) {
        fetch('http://localhost:3000/editProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: Number(selectedProducts[0]),
                productName: updatedData[0],
                productQuantity: updatedData[1],
                productPrice: updatedData[2],
                productExpiryDate: updatedData[3],
                productSupplier: updatedData[4],
                productDescription: updatedData[5],
                productURL: updatedData[6]
            })
        })
        .then(response => response.json())
        .then(data => {
            inputFieldValue = selectedProducts[0]
            dropdownButtonValue = 'Código do produto'
            currentPage = 1
            fetchData(1, rowsPerPage, inputFieldValue, dropdownButtonValue)
        })
        clearPopup(editProductPopup.id)
        sucessMsgSender('Mercadoria', 'Editada', editProductPopup)

        clearArray(originalData)
        clearArray(updatedData)
    } else {
        clearArray(updatedData)
    }
})

document.addEventListener('keydown', function(event) {
    if(event.key === 'Escape') {
        if(overlay.style.display == 'block') {
            overlay.style.display = 'none'

            if(addProductPopup.style.display = 'flex') {
                escDisablePopupDisplay(buttonGreen, addProductPopup)
            }

            if(editProductPopup.style.display = 'flex') {
                escDisablePopupDisplay(buttonBlue, editProductPopup)
                clearArray(originalData)
                clearArray(updatedData)
            }

            if(editRemove.style.display = 'flex') {
                escDisablePopupDisplay(buttonRed, editRemove)
            }
        }
    }
})





