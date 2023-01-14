export type ExampleRouteTypes1 = {
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

export type ExampleRouteTypes2 = [
  {
    route: "/things/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      serial_number: number
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
  },
  {
    route: "/things/create"
    method: "PATCH"
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
]
