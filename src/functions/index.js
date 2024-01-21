export const formatNumber = (num) => {
    return parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        .replace('.', ',');
}

//Currency
export const currency = '€';


//Get Order status
export const getStatus = (payload) => {
    let returnValue = "warten"
    switch (payload) {
        case "waiting": returnValue = "warten";
            break;
        case "delivering": returnValue = "warten";
            break;
        case "delivered": returnValue = "Geliefert";
            break;
        case "canceled": returnValue = "Abgesagt";
            break;
    }
    return returnValue;
}