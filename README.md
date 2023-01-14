# TypedAxios

Typed Axios is a simple way to create an Axios instance that is fully typed with the routes from an application.


```ts
import type TypedAxios from "typed-axios"
import axios from "axios"


const myAxiosInstance: TypedAxios<Routes> = axios.create({
  baseURL: "http://example-api.com"
})
```
