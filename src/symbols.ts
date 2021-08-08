/**Build description. */
const d = (s: string) => `vast-orm:${s}`;

export const TYPE = Symbol(d("type"));
export const FIELDS = Symbol(d("fields"));
export const PRIMARY = Symbol(d("primary-key-field"));
export const POPULATED = Symbol(d("populated"));
