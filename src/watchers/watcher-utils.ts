export const intersectArrays = <T extends unknown>(arrayA: T[], arrayB: T[]) => {
    return arrayA.filter((itemA) => arrayB.includes(itemA));
};
