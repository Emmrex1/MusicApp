import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useUserData } from "../../context/Usercontext";
import { useNavigate } from "react-router-dom";

// Validation schema
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useUserData();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerUser(values.name, values.email, values.password, navigate);
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-black text-white overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#181818] to-black opacity-95"></div>
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-green-500 blur-[120px] opacity-10 animate-pulse"></div>

      <div className="relative z-10 bg-[#181818]/90 backdrop-blur-md border border-[#282828] rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/spotify logo.png" alt="Spotify" className="w-12 h-12" />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sign up for Spotify
        </h2>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="bg-transparent border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="bg-transparent border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="bg-transparent border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus:border-green-500 pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      className="bg-transparent border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-green-500 text-black font-semibold py-3 rounded-full hover:bg-green-400 transition-all duration-300"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="my-6 border-t border-gray-700"></div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-white font-semibold hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
