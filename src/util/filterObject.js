export function filterObject(o, filterKeys) {
  return Object.keys(o)
    .filter((k) => typeof o[k] !== 'undefined'
      && o[k] !== ''
      && o[k] !== null
      && !['createdAt', 'updatedAt', ...(filterKeys || [])].includes(k))
    .reduce((accum, k) => ({ ...accum, [k]: o[k] }), {});
}
