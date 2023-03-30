export * from "./interpolate-path"
import type { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios"
import type { SetOptional, Except, Simplify, Split } from "type-fest"

export type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD"

export type RouteDef = {
  route: string
  method: HTTPMethod
  queryParams?: Record<string, any>
  jsonBody?: Record<string, any>
  commonParams?: Record<string, any>
  formData?: Record<string, any>
  jsonResponse?: Record<string, any>
  // TODO support error responses
}

export type APIDef = Record<string, RouteDef> | RouteDef[]

export type APIDefToUnion<Routes extends APIDef> = Routes extends RouteDef[]
  ? Routes[number]
  : Routes extends Record<string, RouteDef>
  ? Routes[keyof Routes]
  : never

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

// Converts from `/things/example_thing_id/get` to `/things/${string}/get`
export type WidenConcretePathParams<
  Path extends AnyRoutePath<Route>,
  Route extends RouteDef
> = Route extends any
  ? Route extends { route: infer WidenedPath }
    ? Path extends WidenedPath
      ? WidenedPath
      : never
    : never
  : never

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

export type MatchingRouteByPath<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  RoutesWithReplacedPathParams extends RouteDef = ReplacePathParamsOnRouteDef<Routes>
> = Routes extends RouteDef
  ? Extract<
      Routes,
      { route: WidenConcretePathParams<Path, RoutesWithReplacedPathParams> }
    >
  : never

export type MatchingRoute<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = HTTPMethod
> = Routes extends infer Route
  ? Route extends RouteDef
    ? Split<Path, "/"> extends Split<Route["route"], "/">
      ? Route["method"] extends Method
        ? Route
        : never
      : never
    : never
  : never

export type RouteResponse<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"]
> = MatchingRoute<Routes, Path, Method>["jsonResponse"]

export type RouteRequestBody<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"],
  MR extends RouteDef = MatchingRoute<Routes, Path, Method>
> = MR["jsonBody"] & MR["commonParams"]

export type RouteRequestParams<
  Routes extends RouteDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"],
  MR extends RouteDef = MatchingRoute<Routes, Path, Method>
> = MR["queryParams"] & MR["commonParams"]

export interface ExtendedAxiosRequestConfig<
  Routes extends RouteDef,
  URL extends AnyRoutePath<Routes> = AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, URL>["method"]
> extends Omit<AxiosRequestConfig, "url" | "method" | "data" | "params"> {
  url: URL
  method: Method
  params?: RouteRequestParams<Routes, URL>
  data?: RouteRequestBody<Routes, URL>
}

export type ExtendedAxiosRequestConfigForMethod<
  Routes extends RouteDef,
  URL extends AnyRoutePath<Routes> = AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, URL>["method"]
> = SetOptional<
  ExtendedAxiosRequestConfig<Routes, URL, Method>,
  "url" | "method"
>

export interface TypedAxios<
  T extends APIDef,
  Routes extends RouteDef = ExplodeMethodsOnRouteDef<
    ReplacePathParamsOnRouteDef<APIDefToUnion<T>>
  >
> {
  defaults: AxiosInstance["defaults"]
  interceptors: AxiosInstance["interceptors"]
  getUri(config?: ExtendedAxiosRequestConfigForMethod<Routes>): string
  post<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "POST">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "POST">>>
  put<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "PUT">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PUT">>>
  get<URL extends PathWithMethod<Routes, "GET">>(
    url: URL,
    config?: ExtendedAxiosRequestConfigForMethod<Routes, URL, "GET">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "GET">>>
  head<URL extends PathWithMethod<Routes, "HEAD">>(
    url: URL,
    config?: ExtendedAxiosRequestConfigForMethod<Routes, URL, "HEAD">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "HEAD">>>
  delete<URL extends PathWithMethod<Routes, "DELETE">>(
    url: URL,
    config?: ExtendedAxiosRequestConfigForMethod<Routes, URL, "DELETE">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "DELETE">>>
  patch<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "PATCH">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PATCH">>>
  options<URL extends PathWithMethod<Routes, "OPTIONS">>(
    url: URL,
    config?: ExtendedAxiosRequestConfigForMethod<Routes, URL, "OPTIONS">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "OPTIONS">>>
  postForm<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "POST">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "POST">>>
  putForm<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "PUT">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PUT">>>
  patchForm<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<
      ExtendedAxiosRequestConfigForMethod<Routes, URL, "PATCH">,
      "data"
    >
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PATCH">>>
  request<
    URL extends AnyRoutePath<Routes>,
    Config extends ExtendedAxiosRequestConfig<Routes, URL>
  >(
    config: Config
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, Config["method"]>>>
}
