export const intersectArrays = <T>(arrayA: T[], arrayB: T[]) => {
    return arrayA.filter((itemA) => arrayB.includes(itemA));
};
