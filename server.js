const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err)
        return
    }
    console.log('Conectado ao banco de dados MySQL!')
});

function generalQuerry(query, res) {
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Erro ao buscar dados')
            return;
        }
        res.json(results)
    });
}

function paramsQuery(query, params, res) {
    db.query(query, params, (err, results) => {
        if(err) {
            return res.status(500).json({ error: 'Erro na consulta ao banco de dados' })
        }
        res.json(results)
    })
}

function excelDateToJSDate(serial) {
    const date = new Date(1900, 0, serial -1);
    if(serial >= 60) {
        date.setDate(date.getDate() - 1);
    }
    return date
}

app.post('/remove', (req, res) => {
    const { idProduct } = req.body
    query = `DELETE FROM produtos WHERE idProduto = ?`
    params = [idProduct]

    db.query(query, params, (err, results) => {
        if(err) {
            return res.status(500).json({ error: 'Erro na consulta ao banco de dados' })
        }
        res.json(results)
    })
})

app.post('/search', (req, res) => {
    const { fieldValue, filterValue } = req.body
    const regex = /^([<>]=?|==|!=)\s*(-?\d+(\.\d+)?)/

    let query = 'SELECT * FROM produtos'
    let newFilterValue
    let newFieldValue
    let params = []
    let match
    
    switch(filterValue) {
        case 'Fornecedor':
            newFilterValue = filterValue.toLowerCase()
            break
        case 'Código do produto':
            newFilterValue = 'idProduto'
            break
        case 'Nome':
            newFilterValue = 'nomeProduto'
            break
        case 'Quantidade':
            newFilterValue = 'quantidadeProduto'
            break
        case 'Data de validade':
            newFilterValue = 'dataValidade'
            break
        default:
            newFilterValue = null
    }
    
    if(fieldValue == null) {
    } else if(Array.isArray(fieldValue)) {
        if(fieldValue.length === 2) {
            query += ' WHERE ?? BETWEEN ? AND ?'

            if(Number(fieldValue[0]) > Number(fieldValue[1])) {
                params = [newFilterValue, fieldValue[1], fieldValue[0]]
            } else {
                params = [newFilterValue, fieldValue[0], fieldValue[1]]
            }
        } else {
            query += ' WHERE ?? IN ('
            params = [newFilterValue]
            fieldValue.forEach(element => {
                query += `?, `
                params.push(element)
            });
            query = query.slice(0, -2)
            query += ')'
        }
    } else {
        match = fieldValue?.match(regex)

        if(newFilterValue === 'dataValidade' && fieldValue === 'N/A') {
            query += ' WHERE ?? IS NULL'
            params = [newFilterValue]
        } else if(newFilterValue === 'dataValidade' && match) {
            query += ` WHERE DATEDIFF(??, CURDATE()) ${match[1]} ?`
            newFieldValue = match[2]
            params = [newFilterValue, newFieldValue]
        } else if(newFilterValue === 'quantidadeProduto' && match) {
            query += ` WHERE ?? ${match[1]} ?`
            newFieldValue = match[2]
            params = [newFilterValue, newFieldValue]
        } else if(newFilterValue === 'quantidadeProduto' && !match) {
            query += ' WHERE ?? = ?'
            newFieldValue = fieldValue
            params = [newFilterValue, newFieldValue]
        } else if(fieldValue.length > 0) {
            query += ' WHERE ?? LIKE ?'
            newFieldValue = !isNaN(Number(fieldValue)) ? fieldValue : `%${fieldValue}%`
            params = [newFilterValue, newFieldValue]
        }
    }

    if(newFilterValue) {
        paramsQuery(query, params, res)
    } else {
        generalQuerry(query, res)
    }
})

app.post('/register', (req, res) => {
    let { ProductName, ProductQuantity, ProductPrice, ProductExpiryDate, ProductSupplier, ProductDescription, ProductURL } = req.body
    const currentDate = new Date().toISOString().split('T')[0]
    if(ProductExpiryDate <= currentDate) {
        ProductExpiryDate = null
    }
    const params = [ProductName, ProductQuantity, ProductPrice, ProductExpiryDate, ProductSupplier, ProductDescription, ProductURL]
    const query = `INSERT INTO produtos (nomeProduto, quantidadeProduto, valorProduto, dataValidade, fornecedor, descricaoProduto, imagemProduto) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`

    paramsQuery(query, params, res)
})

app.post('/bulkRegister', (req, res) => {
    const products = req.body
    const params = []
    const currentDate = new Date().toISOString().split('T')[0]
    let query = `INSERT INTO produtos (nomeProduto, quantidadeProduto, valorProduto, dataValidade, fornecedor, descricaoProduto, imagemProduto) VALUES \n`
    
    products.forEach(product => {
        let { nomeProduto, quantidadeProduto, precoProduto, dataValidade, fornecedor, descricaoProduto, imagemProduto } = product
        const dataCorrected = excelDateToJSDate(dataValidade).toISOString().split('T')[0]

        dataCorrected <= currentDate ? dataValidade = null : dataValidade = dataCorrected
        query += `(?, ?, ?, ?, ?, ?, ?),\n`
        params.push(nomeProduto, quantidadeProduto, precoProduto, dataValidade, fornecedor, descricaoProduto, imagemProduto)
    })
    query = query.slice(0, -2)

    paramsQuery(query, params, res)
})

app.post('/editProduct', (req, res) => {
    const { productId, productName, productQuantity, productPrice, productExpiryDate, productSupplier, productDescription, productURL } = req.body
    const params = [ productName, productQuantity, productPrice, productExpiryDate, productSupplier, productDescription, productURL, productId ]
    const query = 'UPDATE produtos SET nomeProduto = ?, quantidadeProduto = ?, valorProduto = ?, dataValidade = ?, fornecedor = ?, descricaoProduto = ?, imagemProduto = ? WHERE idProduto = ?'

    paramsQuery(query, params, res)
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/negativados', (req, res) => {
    const query = 'SELECT * FROM produtos WHERE quantidadeProduto = 0';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar produtos negativados' });
        }
        res.json(results);  
    });
});


