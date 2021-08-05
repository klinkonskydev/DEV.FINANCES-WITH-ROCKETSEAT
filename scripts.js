const Modal = {
    tog(){
        document
            .querySelector('.modal-overlay')
            .classList
            .toggle('active')

    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;

        
            this.all.forEach((transaction) => {
                if (transaction.amount > 0){
                    income += transaction.amount
                }
            })

        return  income
    },

    expenses(){
        let expense = 0;

        this.all.forEach((transaction) => {
            if (transaction.amount < 0){
                expense += transaction.amount
            }
        })

        return expense
    },

    total(){
        let total = 0;
    
        total = Transaction.incomes() + Transaction.expenses();

        return total
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : '';

        return signal, value
        .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }, 

    formatAmount(amount){
        amount = Number(amount);

        return Number(amount)
    },

    formatDate(date){
        const splittedDate = date.split('-')
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const DOM = {
    tableContent: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')

        tr.innerHTML = this.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index

        this.tableContent.appendChild(tr)
    },
    
    innerHTMLTransaction(transaction, index){

        const CSSclass = transaction.amount < 0 ? "expense" : "income"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = 
        `
        <td class="description">${transaction.name}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>

        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt"Remover Transação">
        </td>
        `

        return html;
    },

    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
    
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.tableContent.innerHTML = ''
    }
}

const Form = {
    name: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            name: this.name.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateField(){
        const {name, amount, date} = this.getValues()
    
        if( name.trim() === "" || amount.trim() === "" || date.trim() === "")   {

            throw new Error('Por favor, Preencha os dados corretamente!')
        }
    },

    formatValues(){
        let {name, amount, date} = Form.getValues();

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            name,
            amount,
            date
        }
    },

    clearFields(){
        Form.name.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try{
            Form.validateField()

            // Formata os valores 
            const transaction = Form.formatValues()

            // Chama o de cima e adiciona 
            Transaction.add(transaction)

            // limpar filtros
            Form.clearFields()

            // fecha o modal
            Modal.tog()

        } catch (e){
            window.alert(e)
        }

        // this.formatDate()
    }
}

const App = {
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()