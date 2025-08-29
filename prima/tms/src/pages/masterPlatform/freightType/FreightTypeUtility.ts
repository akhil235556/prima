export function setClientFreightMapping(freightTypeList: any, clientFreightType: any) {
    if (freightTypeList && clientFreightType) {
        const list = freightTypeList && freightTypeList.map((element: any) => {
            const isActive = clientFreightType && clientFreightType.filter((innerElement: any) => innerElement.freightTypeId === element.id);
            return {
                ...element,
                isMapped: (isActive && isActive.length > 0),
                isClientActive: (isActive && isActive.length > 0 && isActive[0].isActive) ? isActive[0].isActive : false,
                isClientId: (isActive && isActive.length > 0) ? isActive[0].id : false,
            }
        });
        return list;
    } else {
        return freightTypeList && freightTypeList.map((element: any) => ({
            ...element,
            isMapped: false,
            isClientActive: false
        }));
    }

}