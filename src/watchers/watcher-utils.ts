export const intersectArrays = <T extends unknown>(array_1: T[], array_2: T[]) => {
    return array_1.filter((item_1) => array_2.includes(item_1));
};
