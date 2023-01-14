export type ExampleRouteTypes = {
  "/things/create": {
    route: "/things/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      name: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }
}
