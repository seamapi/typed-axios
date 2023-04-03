import { Pipe, Strings, ComposeLeft, Tuples } from "hotscript";

type ParamsFromPathname<Pathname> = Pipe<
Pathname,
  [
    Strings.Split<"/">,
    Tuples.Filter<Strings.StartsWith<"[">>,

    Tuples.Map<
      ComposeLeft<[
        Strings.Trim<"[" | "]">,
      ]>
    >,
    Tuples.ToUnion,
  ]
>;

export function interpolatePath<
  Pathname extends string,
  Params extends ParamsFromPathname<Pathname> extends never
    ? [undefined?]
    : [Required<Record<ParamsFromPathname<Pathname>, string>>]
  >(
  path: Pathname,
  ...params: Params
) {
  let interpolatedPath: string = path;
  if (!params) return interpolatedPath as unknown as Pathname;

  for (const [key, value] of Object.entries(params)) {
    interpolatedPath = interpolatedPath.replace(`[${key}]`, value as string);
  }

  return interpolatedPath as unknown as Pathname;
}
