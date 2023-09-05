import type { Replace, Except } from "type-fest"
import { APIDef, RouteDef } from "./route-def"

/**
 * Use this to select a subset of your routes and strip a prefix from the route path.
 *
 * Not currently supported for the RouteDef[] input syntax.
 */
export type FilterByAndStripPrefix<
  Prefix extends `/${string}/`,
  API extends APIDef
> = API extends Record<string, RouteDef>
  ? {
      [K in keyof API as Replace<
        K extends string ? K : never,
        Prefix,
        "/"
      >]: K extends `${Prefix}${string}`
        ? Except<API[K], "route"> & {
            route: Replace<API[K]["route"], Prefix, "/">
          }
        : never
    }
  : never
