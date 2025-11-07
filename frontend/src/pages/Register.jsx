import { useState } from "react"

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Register
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="usn"
          placeholder="USN"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded mb-6"
          onChange={handleChange}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
          Register
        </button>

        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => window.location.href = "/"}
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  )
}
