export class RepoUtils {
  static generateOrderBy(orderBy?: { asc?: string[]; desc?: string[] }) {
    if (orderBy == undefined) return {};
    let asc = {},
      desc = {};
    if (orderBy.asc)
      orderBy.asc.forEach(e => {
        asc = { ...asc, [e]: 'ASC' };
      });
    if (orderBy.desc)
      orderBy.desc.forEach(e => {
        desc = { ...desc, [e]: 'DESC' };
      });
    return { ...asc, ...desc };
  }
}

export function fillNull<T>(a: T[]): T[] {
  return a.length == 0 ? [null] : a;
}
