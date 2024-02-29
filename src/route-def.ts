import { HTTPMethod } from "./http-method"

export type RouteDef = {
  route: string
  method: HTTPMethod
  queryParams?: Record<string, any> | undefined
  jsonBody?: Record<string, any> | undefined
  commonParams?: Record<string, any> | undefined
  formData?: Record<string, any> | undefined
  jsonResponse?: Record<string, any> | undefined
  urlEncodedFormData?: Record<string, any> | undefined
  // TODO support error responses
}

export type APIDef = Record<string, RouteDef> | RouteDef[]

export type APIDefToUnion<Routes extends APIDef> = Routes extends RouteDef[]
  ? Routes[number]
  : Routes extends Record<string, RouteDef>
  ? Routes[keyof Routes]
  : never
