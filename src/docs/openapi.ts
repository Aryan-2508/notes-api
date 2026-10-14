export const openapiSpec = {
  openapi: "3.0.3",

  info: {
    title: "Notes API",
    version: "1.0.0",
    description:
      "A REST API for creating, retrieving, updating, and deleting notes.",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Health",
      description: "API health check",
    },
    {
      name: "Notes",
      description: "Operations for managing notes",
    },
  ],

  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Notes API is running",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/notes": {
      get: {
        tags: ["Notes"],
        summary: "Get all notes",
        description: "Returns notes with pagination.",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 10,
            },
            description: "Number of notes per page",
          },
        ],
        responses: {
          "200": {
            description: "Notes retrieved successfully",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },

      post: {
        tags: ["Notes"],
        summary: "Create a note",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NoteInput",
              },
              example: {
                title: "My first note",
                content: "This is the content of my note.",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Note created successfully",
          },
          "400": {
            description: "Validation failed",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/notes/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB note ID",
          schema: {
            type: "string",
          },
        },
      ],

      get: {
        tags: ["Notes"],
        summary: "Get a note by ID",
        responses: {
          "200": {
            description: "Note retrieved successfully",
          },
          "400": {
            description: "Invalid note ID",
          },
          "404": {
            description: "Note not found",
          },
        },
      },

      put: {
        tags: ["Notes"],
        summary: "Update a note",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NoteInput",
              },
              example: {
                title: "Updated note",
                content: "Updated note content.",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Note updated successfully",
          },
          "400": {
            description: "Validation failed or invalid note ID",
          },
          "404": {
            description: "Note not found",
          },
        },
      },

      delete: {
        tags: ["Notes"],
        summary: "Delete a note",
        responses: {
          "200": {
            description: "Note deleted successfully",
          },
          "400": {
            description: "Invalid note ID",
          },
          "404": {
            description: "Note not found",
          },
        },
      },
    },
  },

  components: {
    schemas: {
      NoteInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: {
            type: "string",
            minLength: 1,
            example: "My first note",
          },
          content: {
            type: "string",
            example: "This is the content of my note.",
          },
        },
      },
    },
  },
};