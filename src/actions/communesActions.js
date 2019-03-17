export const communesUpdate = (mask, i) => {
    console.log('COMMUNESUPDATE', {mask, i})
    return {
        type: 'COMMUNESUPDATE',
        mask,
        i
    }
}

export const communesCompletion = (mask, i) => {
    console.log('COMPLETIONUPDATE', {mask, i})
    return {
        type: 'COMPLETIONUPDATE',
        mask,
        i
    }
}   