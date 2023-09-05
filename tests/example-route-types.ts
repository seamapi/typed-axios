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

export type ExampleRouteTypes3 = {
  "/things/get": {
    route: "/things/get"
    method: "POST" | "GET"
    queryParams: {}
    commonParams: {
      thing_id: string
    }
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

export type ExampleRouteTypes4 = {
  "/things/[thing_id]": {
    route: "/things/[thing_id]"
    method: "GET"
    queryParams: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing_get: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }
  "/things/[thing_id]/get": {
    route: "/things/[thing_id]/get"
    method: "POST" | "GET"
    queryParams: {}
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
  "/things/[thing_id]/update": {
    route: "/things/[thing_id]/update"
    method: "POST"
    queryParams: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing_update: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }
}

export type DifferentDomainsAsPathsExample = {
  "/example.com/things/create": {
    route: "/example.com/things/create"
    method: "POST"
    queryParams: {}
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

  "/foo.example.com/things/create": {
    route: "/foo.example.com/things/create"
    method: "POST"
    queryParams: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing_from_foo: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }
}

export type WildcardAndSpecificEndpointExample = {
  "/things/[thing_id]": {
    route: "/things/[thing_id]"
    method: "GET"
    queryParams: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      thing_get: {
        thing_id: string
        name: string
        created_at: string
      }
    }
  }
  "/things/all": {
    route: "/things/all"
    method: "GET"
    queryParams: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      all_things: Array<{
        thing_id: string
        name: string
        created_at: string
      }>
    }
  }
}

export type FormDataExample = {
  "/things/create": {
    route: "/things/create"
    method: "POST"
    queryParams: {}
    commonParams: {}
    formData: {
      resourceId: number
      timestamp: string
      slug: string
    }
    jsonResponse: {}
  }
}
