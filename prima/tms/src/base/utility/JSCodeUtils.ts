export const deprecationWarning = (message: string) => {
    const host = window.location.host
    if (host.includes('.ai')) {
        // () => { };
        return
    } else if (host.includes('.live')) {
        // () => { };
        return
    }
    console.warn(message)

}
