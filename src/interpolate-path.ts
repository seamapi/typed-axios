type PathParams<T extends string> = T extends `${infer Start}[${infer Param}]${infer End}`
  ? Param | PathParams<End>
  : never;

type InterpolatePath<T extends string, P extends Record<string, string>, U extends string = T> =
  PathParams<T> extends never
    ? U
    : PathParams<T> extends string
    ? ParamCase<PathParams<T>> extends keyof P
      ? InterpolatePath<
          string & T extends `${infer F}[${string & PathParams<T>}]${infer R}` ? `${F}${P[ParamCase<PathParams<T>>]}${R}` : never,
          P,
          U
        >
      : never
    : never;

type ParamCase<S extends string> = S extends `${infer Head}${infer Tail}`
? `${Head extends Uppercase<Head> ? '-' : ''}${Lowercase<Head>}${ParamCase<Tail>}`
: '';


export function interpolatePath<T extends string, P extends Record<string, string>>(
  path: T,
  params?: P
): InterpolatePath<T, P> {
  let interpolatedPath: string = path;
  if (!params) return interpolatedPath as InterpolatePath<T, P>;

  for (const [key, value] of Object.entries(params)) {
    interpolatedPath = interpolatedPath.replace(`[${key}]`, value);
  }

  return interpolatedPath as InterpolatePath<T, P>;
}