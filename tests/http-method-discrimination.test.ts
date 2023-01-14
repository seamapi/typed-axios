import test from "ava"
import { expectTypeOf } from "expect-type"
import { MatchingRoute, TypedAxios } from "../src"
import { ExampleRouteTypes2 } from "./example-route-types"

test("TypedAxios should be able to discriminate http method request differences", async (t) => {
  const axios: TypedAxios<ExampleRouteTypes2> = null as any

  type RouteArr = ExampleRouteTypes2[number]
  type K = Extract<
    RouteArr,
    { route: "/things/create"; method: "PATCH" }
  >["jsonBody"]

  const createRes = await axios.post("/things/create", {
    serial_number: 123,
    name: "thing",
  })
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

  expectTypeOf(
    axios.patch("/things/create", { name: "new_thing_name" })
  ).resolves.toMatchTypeOf<{
    data: {
      thing: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }>()

  // The PATCH method can't update the serial number
  // @ts-expect-error
  axios.patch("/things/create", { serial_number: 123, name: "new_thing_name" })
})
