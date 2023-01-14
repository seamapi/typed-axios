import type { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios"

type HTTPMethod =
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

export type AnyRoutePath<Routes extends APIDef> = Routes extends RouteDef[]
  ? Routes[number]["route"]
  : keyof Routes

export type PathWithMethod<
  Routes extends APIDef,
  Method extends HTTPMethod
> = MatchingRoute<Routes, AnyRoutePath<Routes>, Method>["route"]

export type MatchingRoute<
  Routes extends APIDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = HTTPMethod
> = Routes extends RouteDef[]
  ? Extract<Routes[number], { route: Path; method: Method }>
  : Extract<Routes[keyof Routes], { route: Path; method: Method }>

export type RouteResponse<
  Routes extends APIDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"]
> = MatchingRoute<Routes, Path, Method>["jsonResponse"]

export type RouteRequestBody<
  Routes extends APIDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"],
  MR extends RouteDef = MatchingRoute<Routes, Path, Method>
> = MR["jsonBody"] & MR["commonParams"]

export type RouteRequestParams<
  Routes extends APIDef,
  Path extends AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, Path>["method"],
  MR extends RouteDef = MatchingRoute<Routes, Path, Method>
> = MR["queryParams"] & MR["commonParams"]

export interface ExtendedAxiosRequestConfig<
  Routes extends APIDef,
  URL extends AnyRoutePath<Routes> = AnyRoutePath<Routes>,
  Method extends HTTPMethod = MatchingRoute<Routes, URL>["method"]
> extends Omit<AxiosRequestConfig, "url" | "method" | "data" | "params"> {
  url: URL
  method: Method
  params?: RouteRequestParams<Routes, URL>
  data?: RouteRequestBody<Routes, URL>
}

export interface TypedAxios<Routes extends APIDef> {
  defaults: AxiosInstance["defaults"]
  interceptors: AxiosInstance["interceptors"]
  getUri(config?: ExtendedAxiosRequestConfig<Routes>): string
  post<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "POST">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "POST">>>
  put<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "PUT">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PUT">>>
  get<URL extends PathWithMethod<Routes, "GET">>(
    url: URL,
    config?: ExtendedAxiosRequestConfig<Routes, URL, "GET">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "GET">>>
  head<URL extends PathWithMethod<Routes, "HEAD">>(
    url: URL,
    config?: ExtendedAxiosRequestConfig<Routes, URL, "HEAD">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "HEAD">>>
  delete<URL extends PathWithMethod<Routes, "DELETE">>(
    url: URL,
    config?: ExtendedAxiosRequestConfig<Routes, URL, "DELETE">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "DELETE">>>
  patch<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["jsonBody"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "PATCH">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PATCH">>>
  options<URL extends PathWithMethod<Routes, "OPTIONS">>(
    url: URL,
    config?: ExtendedAxiosRequestConfig<Routes, URL, "OPTIONS">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "OPTIONS">>>
  postForm<
    URL extends PathWithMethod<Routes, "POST">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "POST">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "POST">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "POST">>>
  putForm<
    URL extends PathWithMethod<Routes, "PUT">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PUT">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "PUT">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PUT">>>
  patchForm<
    URL extends PathWithMethod<Routes, "PATCH">,
    MR extends RouteDef = MatchingRoute<Routes, URL, "PATCH">
  >(
    url: URL,
    data: MR["formData"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "PATCH">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, "PATCH">>>
  request<
    URL extends AnyRoutePath<Routes>,
    Config extends ExtendedAxiosRequestConfig<Routes, URL>
  >(
    config: Config
  ): Promise<AxiosResponse<RouteResponse<Routes, URL, Config["method"]>>>
}
