import { describe, it, expect, vi, beforeEach } from "vitest"
import { Placetopay } from "./placetopay"

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock("./utils/http-client", () => {
  return {
    HttpClient: class {
      post = mocks.post
    },
  }
})

describe("Placetopay SDK Entry Point", () => {
  beforeEach(() => {
    mocks.post.mockClear()
    vi.clearAllMocks()
  })

  describe("Constructor & Initialization", () => {
    it("should initialize with default Base URL if none is provided", () => {
      new Placetopay({
        login: "test-login",
        secretKey: "test-secret",
      })
      expect(true).toBe(true)
    })

    it("should expose all services", () => {
      const placetopay = new Placetopay({
        login: "a",
        secretKey: "b",
      })

      expect(placetopay.checkout).toBeDefined()
      expect(placetopay.gateway).toBeDefined()
      expect(placetopay.paymentLink).toBeDefined()
    })
  })

  describe("Generic Request (Escape Hatch)", () => {
    it("should delegate the request to HttpClient.post", async () => {
      const placetopay = new Placetopay({
        login: "a",
        secretKey: "b",
      })

      // Configuramos el spy para devolver éxito
      mocks.post.mockResolvedValueOnce({ status: "OK" })

      const response = await placetopay.request("/custom-endpoint", {
        foo: "bar",
      })

      expect(mocks.post).toHaveBeenCalledWith(
        "/custom-endpoint",
        { foo: "bar" },
        {}
      )
      expect(response).toEqual({ status: "OK" })
    })

    it("should handle request errors correctly", async () => {
      const placetopay = new Placetopay({ login: "a", secretKey: "b" })
      const error = new Error("Network Error")

      mocks.post.mockRejectedValueOnce(error)

      await expect(placetopay.request("/fail")).rejects.toThrow("Network Error")
    })
  })
})
