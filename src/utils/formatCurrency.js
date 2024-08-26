const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US",{currency:"MYR", style:"currency"})

export const formatCurrency =(number) =>{
    return CURRENCY_FORMATTER.format(number)
}