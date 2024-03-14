export const getDate = ( ) => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-CA');
}