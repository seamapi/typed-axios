import { expectTypeOf } from "expect-type"
import { interpolatePath } from "../src"

expectTypeOf(interpolatePath("/things/create")).toEqualTypeOf<"/things/create">
expectTypeOf(interpolatePath("/things/get")).toEqualTypeOf<"/things/get">
expectTypeOf(
  interpolatePath("/things/[thing_id]", {
    thing_id: "1234",
  })
).toEqualTypeOf<"/things/[thing_id]">
expectTypeOf(
  interpolatePath("/things/[thing_id]/get", {
    thing_id: "1234",
  })
).toEqualTypeOf<"/things/[thing_id]/get">
expectTypeOf(
  interpolatePath("/things/[thing_id]/get?device=1", {
    thing_id: "1234",
  })
).toEqualTypeOf<"/things/[thing_id]/get?device=1">
