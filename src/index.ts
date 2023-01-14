import type { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS"

export type RouteDef = {
  route: string
  method: HTTPMethod
  queryParams: Record<string, any>
  jsonBody: Record<string, any>
  commonParams: Record<string, any>
  formData: Record<string, any>
  jsonResponse: Record<string, any>
}

export type APIDef = Record<string, RouteDef>

export type RouteResponse<
  Routes extends APIDef,
  Path extends keyof Routes
> = Routes[Path]["jsonResponse"]

export type RouteRequestBody<
  Routes extends APIDef,
  Path extends keyof Routes
> = Routes[Path]["jsonBody"] & Routes[Path]["commonParams"]

export type RouteRequestParams<
  Routes extends APIDef,
  Path extends keyof Routes
> = Routes[Path]["queryParams"] & Routes[Path]["commonParams"]

export interface ExtendedAxiosRequestConfig<
  Routes extends APIDef,
  URL extends keyof Routes = keyof Routes,
  Method extends Routes[URL]["method"] = Routes[URL]["method"]
> extends Omit<AxiosRequestConfig, "url" | "method" | "data"> {
  url: URL
  method: Method
  params?: RouteRequestParams<Routes, URL>
  data?: RouteRequestBody<Routes, URL>
}

export interface TypedAxios<Routes extends APIDef> {
  defaults: AxiosInstance["defaults"]
  interceptors: AxiosInstance["interceptors"]
  getUri(config?: ExtendedAxiosRequestConfig<Routes>): string
  post<URL extends keyof Routes>(
    url: URL,
    data: Routes[URL]["jsonBody"],
    config?: Omit<ExtendedAxiosRequestConfig<Routes, URL, "POST">, "data">
  ): Promise<AxiosResponse<RouteResponse<Routes, URL>>>

  // request<T = any, R = AxiosResponse<T>, D = any>(
  //   config: AxiosRequestConfig<D>
  // ): Promise<R>
  // get<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // delete<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // head<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // options<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // put<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // patch<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // postForm<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // putForm<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
  // patchForm<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>
}
