export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full p-3 border rounded mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
          Send Reset Link
        </button>
      </div>
    </div>
  )
}
