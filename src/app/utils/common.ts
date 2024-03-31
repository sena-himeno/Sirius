export const getDate = ( ) => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-CA');
}
export const getDaysInMonth = () =>{
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    const nextMonth = new Date(year, month + 1, 0);

    return nextMonth.getDate()
}
