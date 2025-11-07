export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Student Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
        />

        <button
        onClick={() => window.location.href = "/home"}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
        Login
        </button>


        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => window.location.href = "/register"}
            className="text-blue-600 hover:underline mr-3"
            >
            Register
        </button>

          <button
            onClick={() => window.location.href = "/forgot-password"}
            className="text-blue-600 hover:underline"
            >
            Forgot Password?
          </button>

        </div>
      </div>
    </div>
  )
}
