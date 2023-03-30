import test from "ava"
import { interpolatePath } from "../src"

test("interpolatePath", (t) => {
  t.is(
    interpolatePath("/api/[foo]/[bar]", {
      foo: "foo",
      bar: "bar",
    }),
    "/api/foo/bar" as "/api/[foo]/[bar]"
  )

  t.is(
    interpolatePath("/api/[foo]/[bar]", {
      foo: "bar",
      bar: "foo",
    }),
    "/api/bar/foo" as "/api/[foo]/[bar]"
  )
})

