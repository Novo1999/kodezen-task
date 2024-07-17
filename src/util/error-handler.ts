export const groupedSelectErrorHandler = (
  isGrouped: boolean,
  values: string[]
) => {
  if (
    isGrouped &&
    values.every(
      (value) => typeof value === 'string' || typeof value === 'number'
    )
  ) {
    throw new Error('Cannot use string of array in grouped value component')
  }
}

export const multiSelectErrorHandler = (isMulti: boolean, values: string[]) => {
  if (
    isMulti &&
    !values.every(
      (value) => typeof value === 'string' || typeof value === 'number'
    )
  ) {
    throw new Error(
      'Cannot use this data structure in multiple value component'
    )
  }
}
