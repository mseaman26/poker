export const formatDateFromMongo = (date) => {
    const splitDate = date.split('-')
    const year = splitDate[0]
    const month = splitDate[1]
    const day = splitDate[2].split('T')[0]
    return `${month}/${day}/${year}`
}