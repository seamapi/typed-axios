import { HTTPMethod } from "./http-method"

export type RouteDef = {
  route: string
  method: HTTPMethod
  queryParams?: Record<string, any>
  jsonBody?: Record<string, any>
  commonParams?: Record<string, any>
  formData?: Record<string, any>
  jsonResponse?: Record<string, any>
  urlEncodedFormData?: Record<string, any>
  // TODO support error responses
}

export type APIDef = Record<string, RouteDef> | RouteDef[]

export type APIDefToUnion<Routes extends APIDef> = Routes extends RouteDef[]
  ? Routes[number]
  : Routes extends Record<string, RouteDef>
  ? Routes[keyof Routes]
  : never
