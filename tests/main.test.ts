import test from "ava"
import { expectTypeOf } from "expect-type"
import { TypedAxios } from "../src"
import {
  ExampleRouteTypes1,
  ExampleRouteTypes3,
  ExampleRouteTypes4,
  WildcardAndSpecificEndpointExample,
} from "./example-route-types"

test("TypedAxios should create nicely typed AxiosInstance", async (t) => {
  const axios: TypedAxios<ExampleRouteTypes1> = null as any
  const createRes = await axios.post("/things/create", { name: "thing" })
  expectTypeOf(createRes.data).toMatchTypeOf<{
    thing: {
      thing_id: string
      name: string
      created_at: string
    }
  }>()

  // @ts-expect-error
  axios.post("/things/create", { name: 123 })

  // @ts-expect-error
  axios.post("/tings/crate", { name: "123" })

  // @ts-expect-error
  axios.post("/things/create")

  // @ts-expect-error
  axios.post("/things/create", {})

  // @ts-expect-error (wrong method)
  axios.get("/things/create")
})

test("works with RouteDef object that has multiple methods", async (t) => {
  const axios: TypedAxios<ExampleRouteTypes3> = null as any
  const getRes = await axios.get("/things/get", {
    params: {
      thing_id: "123",
    },
  })

  expectTypeOf(getRes.data).toMatchTypeOf<{
    thing: {
      thing_id: string
      name: string
      created_at: string
    }
  }>()
})

test("parses path parameters", async (t) => {
  const axios: TypedAxios<ExampleRouteTypes4> = null as any
  const getRes = await axios.get("/things/10/get")

  expectTypeOf(getRes.data).toMatchTypeOf<{
    thing: {
      thing_id: string
      name: string
      created_at: string
    }
  }>()

  const topRes = await axios.get("/things/10")

  expectTypeOf(topRes.data).toMatchTypeOf<{
    thing_get: {
      thing_id: string
      name: string
      created_at: string
    }
  }>()
})

test("selects most specific type available", async (t) => {
  const axios: TypedAxios<WildcardAndSpecificEndpointExample> = null as any

  const getByIdRes = await axios.get("/things/10")
  expectTypeOf(getByIdRes.data).toMatchTypeOf<{
    thing_get: {
      thing_id: string
      name: string
      created_at: string
    }
  }>()

  const getAllRes = await axios.get("/things/all")
  expectTypeOf(getAllRes.data).toMatchTypeOf<{
    all_things: Array<{
      thing_id: string
      name: string
      created_at: string
    }>
  }>()
})
