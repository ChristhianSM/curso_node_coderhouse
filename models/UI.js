class UI {
    constructor() {

    }
    showProducts( products = []) {
        return products.map( product => {
            return `
                <div class = "card-product">
                    ${product.name}
                </div>
            `
        })
    }
}

module.exports = {
    UI
}