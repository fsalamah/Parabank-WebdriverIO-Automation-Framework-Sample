class MoneyHelper 
{
    moneyStringToNumber(moneyString: string): number {
        // Remove currency symbols and commas
        const cleanedString = moneyString.replace(/[^0-9.-]+/g, '');                                
        // Convert to number
        return  (Number)(cleanedString);;
    }
}
export default new MoneyHelper();
