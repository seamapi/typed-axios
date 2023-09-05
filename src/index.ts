import type { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios"
import type { Except, SetRequired, Simplify, Split } from "type-fest"
import { APIDef, APIDefToUnion, RouteDef } from "./route-def"
import { HTTPMethod } from "./http-method"

// Given a union of {method: "GET" | "POST", ...} | {method: "PATCH", ...} converts it to a union of
// {method: "GET", ...} | {method: "POST", ...} | {method: "PATCH", ...}
export type ExplodeMethodsOnRouteDef<Route extends RouteDef> = Route extends any
  ? Route extends { method: infer Method }
    ? Method extends HTTPMethod
      ? Simplify<
          {
            method: Method
          } & Except<Route, "method">
        >
      : never
    : never
  : never

// Converts from `/things/[thing_id]/get` to `/things/${string}/get`
export type ReplacePathParams<Path extends string> =
  Path extends `${infer Before}[${infer Param}]${infer After}`
    ? ReplacePathParams<`${Before}${string}${After}`>
    : Path

export type ReplacePathParamsOnRouteDef<Route extends RouteDef> =
  Route extends any
    ? Simplify<
        {
          route: ReplacePathParams<Route["route"]>
        } & Except<Route, "route">
      >
    : never

export type AnyRoutePath<Routes extends RouteDef> = Routes["route"]

export type PathWithMethod<
  Routes extends RouteDef,
  Method extends HTTPMethod
> = Extract<Routes, { method: Method }>["route"]

export type ExactMatchingRouteByPath<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>
> = Routes extends RouteDef ? Extract<Routes, { route: Path }> : never

type FilterToMostSpecificRoute<
  Path extends string,
  MatchedRoutes extends RouteDef
> = ExactMatchingRouteByPath<MatchedRoutes, Path> extends never
  ? MatchedRoutes
  : ExactMatchingRouteByPath<MatchedRoutes, Path>

export type MatchingRoute<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = HTTPMethod
> = FilterToMostSpecificRoute<
  Path,
  Routes extends infer Route
    ? Route extends RouteDef
      ? Split<Path, "/"> extends Split<Route["route"], "/">
        ? Route["method"] extends Method
          ? Route
          : never
        : never
      : never
    : never
>

export interface AxiosConfigForRouteDef<Route extends RouteDef>
  extends Omit<AxiosRequestConfig, "url" | "method" | "data" | "params"> {
  // todo: separate type
  url?: Route["route"]
  method?: Route["method"]
  params?: Route["queryParams"] & Route["commonParams"]
  data?: Route["jsonBody"] & Route["commonParams"]
}

export interface TypedAxios<
  T extends APIDef,
  Routes extends RouteDef = ExplodeMethodsOnRouteDef<
    ReplacePathParamsOnRouteDef<APIDefToUnion<T>>
  >
> {
  defaults: AxiosInstance["defaults"]
  interceptors: AxiosInstance["interceptors"]
  getUri(config?: AxiosConfigForRouteDef<Routes>): string
  post<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: keyof MR["formData"] extends never
      ? MR["jsonBody"]
      : TypedURLSearchParams<MR["formData"]>,
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  put<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  get<
    URL extends PathWithMethod<Routes, "GET">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "GET">
  >(
    url: URL,
    config?: AxiosConfigForRouteDef<MR>
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  head<
    URL extends PathWithMethod<Routes, "HEAD">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "HEAD">
  >(
    url: URL,
    config?: AxiosConfigForRouteDef<MR>
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  delete<
    URL extends PathWithMethod<Routes, "DELETE">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "DELETE">
  >(
    url: URL,
    config?: AxiosConfigForRouteDef<MR>
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  patch<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  options<
    URL extends PathWithMethod<Routes, "OPTIONS">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "OPTIONS">
  >(
    url: URL,
    config?: AxiosConfigForRouteDef<MR>
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  postForm<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  putForm<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  patchForm<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<AxiosConfigForRouteDef<MR>, "data">
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
  request<
    URL extends AnyRoutePath<Routes>,
    MR extends RouteDef = MatchingRoute<Routes, URL>,
    Config extends AxiosRequestConfig = SetRequired<
      AxiosConfigForRouteDef<MR>,
      "method" | "url"
    >
  >(
    config: Config
  ): Promise<AxiosResponse<MR["jsonResponse"]>>
}

export type TypedURLSearchParams<_T> = URLSearchParams & {
  __URLSearchParamsType?: _T
}

export const createTypedURLSearchParams = <T>(
  data: T
): TypedURLSearchParams<T> => {
  return new URLSearchParams(data as any)
}

export * from "./helpers"
export * from "./route-def"
