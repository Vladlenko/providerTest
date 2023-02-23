const providerDataObj = [
        {
            id: 1,
            name: 'backblaze.com',
            logo: "/logo/backblaze.png",
            minPay: 7,
            storage: 0.005,
            transfer: 0.01
        },
        {
            id: 2,
            name: 'bunny.net',
            logo: "/logo/bunny.png",
            maxPay: 10,
            storage: {
                hdd: 0.01,
                ssd: 0.02,
            },
            transfer: 0.01
        },
        {
            id: 3,
            name: 'scaleway.com',
            logo: "/logo/scaleway.png",
            storage: {
                multi: 0.06,
                single: 0.03
            },
            transfer: 0.02,
            extra: 75
        },
        {
            id: 4,
            name: 'vultr.com',
            logo: "/logo/vultr.png",
            minPay: 5,
            storage: 0.01,
            transfer: 0.01
        }
    ]

const graphContainer = document.querySelector('.graphBox')


const makeDisplaysDataProvider = function (parent, dataObj) {

    dataObj.forEach(provider => {
        const providerContainer = document.createElement('div')
        providerContainer.classList.add('providerContainer')
        parent.append(providerContainer)

        const providerName = document.createElement('h2')

        const providerData = document.createElement('div')
        providerData.classList.add('providerData')
        const optionsList = document.createElement('form')

        const providerLogo = document.createElement('img')
        providerLogo.classList.add('logo')
        providerData.append(providerLogo)
        providerLogo.src = provider.logo

        const graph = document.createElement('div')
        graph.classList.add('graph')
        graph.id = `${'graph' + provider.id}`

        const price = document.createElement('span')
        graph.append(price)
        price.classList.add('price')

        const graphContainer = document.createElement('div')
        graphContainer.classList.add('graphContainer')
        graphContainer.append(graph)

        if (typeof provider.storage === 'object') {
            Object.keys(provider.storage).forEach(items => {

                providerData.append(optionsList)
                optionsList.classList.add('optionsList')
                providerContainer.append(providerData)
                optionsList.prepend(providerName)
                providerName.innerText = provider.name
    
                const itemsLabel = document.createElement('label')
                optionsList.append(itemsLabel)
                itemsLabel.innerText = items

                const itemsInput = document.createElement('input')
                itemsLabel.append(itemsInput)
                itemsInput.id = items
                itemsInput.type = 'radio'
                itemsInput.name = 'disk'
                itemsInput.checked = true

                providerData.append(providerLogo)
                providerLogo.src = provider.logo

                providerContainer.append(graphContainer)
            })
        }
        else {
            providerContainer.prepend(providerData)
            providerData.prepend(providerName)
            providerName.innerText = provider.name
            providerContainer.append(graphContainer)
        }
    })
}

let storageValue = storage.value
let transferValue = transfer.value
let maxPrice = 0


const makeCalculatePrice = function (dataObj) {
    let storagePrice = dataObj.storage

    if ( typeof dataObj.storage === 'object') {
        Object.keys(dataObj.storage).forEach(data => {
            const dataVariable = document.getElementById(`${data}`)
            if (dataVariable.checked) {
                storagePrice = dataObj.storage[data]
            }
        })
    }

    let newPrice = storagePrice*storageValue + dataObj.transfer*transferValue

    if (newPrice < dataObj.minPay) {
        newPrice = dataObj.minPay
    }

    if (newPrice > dataObj.maxPay) {
        newPrice = dataObj.maxPay
    }

    if (dataObj.extra) {
        newPrice = (storagePrice*storageValue + dataObj.transfer*transferValue) - (dataObj.extra * (storagePrice + dataObj.transfer))
        if (newPrice < dataObj.extra * (storagePrice + dataObj.transfer)) {
            newPrice = 0
        }
    }

    dataObj.price = parseFloat(newPrice.toFixed(2))
}



const makeDisplaysGraph = function (obj) {
    const graph = document.getElementById(`${'graph' + obj.id}`)
    graph.style.width = `${(obj.price * 100)/maxPrice}%`
    const price = graph.querySelector('.price')
    price.innerText = obj.price
}





const calculatePriceProvider = function () {
    maxPrice = 0
    providerDataObj.forEach(provider => {
        makeCalculatePrice(provider)
    })

    providerDataObj.forEach( findPrice => {
        maxPrice = findPrice.price > maxPrice ? findPrice.price : maxPrice
    })

    providerDataObj.forEach(provider => {
        makeDisplaysGraph(provider)
    })

}


const changeColor = function() {
    const divs = document.querySelectorAll('.graph')
    let smallestWidthDiv = divs[0]
    
    for (let i = 1; i < divs.length; i++) {
      if (divs[i].offsetWidth < smallestWidthDiv.offsetWidth) {
        smallestWidthDiv = divs[i]
      }
    }
    smallestWidthDiv.style.backgroundColor = 'red'

    const newArr = Array.from(divs).filter(div => div !== smallestWidthDiv)

    newArr.forEach(div => {
        div.style.backgroundColor = 'grey'
    })

}


storage.addEventListener('input', e => {
    storageValue = ++e.target.value
    storageCounter.innerText = `${e.target.value}GB`
    calculatePriceProvider()
    changeColor()
})

transfer.addEventListener('input', e => {
    transferValue = ++e.target.value
    transferCounter.innerText = e.target.value + ' GB'
    calculatePriceProvider()
    changeColor()
})


makeDisplaysDataProvider(graphContainer, providerDataObj)

