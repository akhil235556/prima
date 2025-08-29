export const getLogoBaseUrl = (partitionCode: any) => {
    const host = window.location.host
    let url = `https://storage.googleapis.com/gobolt-partitions-assets/logo/${partitionCode}.jpg`;
    if (host.includes('.ai')) {
        url = `https://storage.googleapis.com/partitions-assets/logo/${partitionCode}.jpg`;
    }
    // else if (host.includes('.live')) {
    //     url = `https://storage.googleapis.com/gobolt-partitions-assets/logo/${partitionCode}.jpg`;
    // }
    return url;
}