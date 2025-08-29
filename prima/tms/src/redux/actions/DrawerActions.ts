import DrawerMenuTypes from "../types/DrawerMenuTypes";

export const openSubMenu = (value: string) => ({
    type: DrawerMenuTypes.OPEN_SUB_MENU,
    value,
});

