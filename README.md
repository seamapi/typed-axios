# Typed Axios `typed-axios-instance`

![](https://user-images.githubusercontent.com/1910070/212500697-38b99c4f-6022-4c82-8615-846c50b77b6a.png)

Typed Axios Instance is a simple way to create an Axios instance that is fully typed with the routes from an API.

The benefit of using TypedAxiosInstance is you don't need to create or import a client
for a third party API, you can just apply types (generated from [OpenAPI](#) or
[Nextlove](https://github.com/seamapi/nextlove)) to an existing Axios instance.

```ts
import type { TypedAxios } from "typed-axios-instance"
import axios from "axios"

// Need help generating these routes? You can generate them from...
// nextlove: https://github.com/seamapi/nextlove
// openapi: TODO
type Routes = [
  {
    route: "/things/create"
    method: "POST"
    jsonBody: {
      name?: string | undefined
    }
    jsonResponse: {
      thing: {
        thing_id: string
        name: string
        created_at: string | Date
      }
    }
  }
]

const myAxiosInstance: TypedAxios<Routes> = axios.create({
  baseURL: "http://example-api.com",
})

// myAxiosInstance now has intelligent autocomplete!
```

![](https://user-images.githubusercontent.com/1910070/212500619-5d2f4568-7e8a-4a9f-9a4b-0c7c4fa4227a.png)

![](https://user-images.githubusercontent.com/1910070/212500659-9c9ff64d-5ffa-4033-81bb-c84a780587ad.png)

## Installation

```
npm add --dev typed-axios-instance

# yarn add --dev typed-axios-instance
```

## Route Definition

There are two ways of specifying routes for `TypedAxios<Routes>`

- `type Routes = RouteDef[]`
- `type Routes = { [route:string]: RouteDef }`

> Using `RouteDef[]` allows you to do [HTTP Method Discrimination](#http-method-discrimination)
> and is the recommended method.

This is the type for `RouteDef`:

```ts
export type RouteDef = {
  route: string
  method: HTTPMethod // you can supply multiple e.g. `"PATCH" | "POST"`

  // INPUTS
  queryParams?: Record<string, any>
  jsonBody?: Record<string, any>
  commonParams?: Record<string, any>
  formData?: Record<string, any>

  // RESPONSES
  jsonResponse?: Record<string, any>
}
```

## HTTP Method Discrimination

There are two ways of specifying route definitions, if you specify the route
definitions as an array (default for OpenAPI schemas), you'll get more specific
autocomplete results, e.g. the response or request type will be based on what
method is being used.
