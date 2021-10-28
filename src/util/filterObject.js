export function filterObject(o, filterKeys) {
  return Object.keys(o)
    .filter((k) => Boolean(o[k]) && !['createdAt', 'updatedAt', ...(filterKeys || [])].includes(k))
    .reduce((accum, k) => ({ ...accum, [k]: o[k] }), {});
}
