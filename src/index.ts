import type { AxiosRequestConfig, AxiosInstance } from "axios"

type TestRoutes = {
  "/things/create": {
    route: "/things/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      name?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing: {
        thing_id: string
        name: string
        created_at: string | Date
      }
    }
  }
}

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
  URL extends keyof Routes,
  Method extends Routes[URL]["method"]
> extends Omit<AxiosRequestConfig, "url" | "method" | "data"> {
  url: URL
  method: Method
  params?: RouteRequestParams<Routes, URL>
  data?: RouteRequestBody<Routes, URL>
}

interface TypedAxios<Routes extends APIDef> {
  post<URL extends keyof Routes>(
    url: URL,
    data?: Routes[URL]["jsonBody"]
    // config?: Omit<ExtendedAxiosRequestConfig<URL, "POST">, "data">
  ): Promise<RouteResponse<Routes, URL>>
}
