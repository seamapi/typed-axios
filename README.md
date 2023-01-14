# TypedAxios

Typed Axios is a simple way to create an Axios instance that is fully typed with the routes from an application.

```ts
import type TypedAxios from "typed-axios"
import axios from "axios"

// Need help generating these routes? You can generate them from...
// openapi: https://openapi-to-route-types.com
// nextlove: https://github.com/seamapi/nextlove
type Routes = {
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

const myAxiosInstance: TypedAxios<Routes> = axios.create({
  baseURL: "http://example-api.com",
})

// myAxiosInstance now has intelligent autocomplete!
```
