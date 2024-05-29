
export function findOrThrow<T>(arr: T[], callback: (item: T) => boolean): T {
    const foundItem = arr.find(callback);
    if (foundItem === undefined) {
      throw new Error('Item not found in the array');
    }
    return foundItem;
  }