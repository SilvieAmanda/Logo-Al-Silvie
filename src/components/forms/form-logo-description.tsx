"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { FormLogoContext } from "./context/form-logo-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";

const formSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Minimum 3 characters required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const FormLogoDescription = () => {
  const formLogoCtx = useContext(FormLogoContext);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: formLogoCtx.values.description,
    },
  });

  function onSubmit(values: FormSchemaType) {
    formLogoCtx.setState({
      name: "colors",
      values: { ...formLogoCtx.values, description: values.description },
    });
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-[90%] max-w-2xl max-h-screen shadow-2xl rounded-2xl border-none bg-white/90 backdrop-blur-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="font-black text-4xl flex items-center justify-center gap-2 text-gray-900">
            <Sparkles className="text-yellow-400 animate-pulse" />
            <span className="drop-shadow-lg">Describe Your Logo</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Give a brief idea about your logo to make it truly reflect your brand.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Ex. A modern tech startup, needs a sleek, minimalist logo with a blue and white color scheme."
                        className="p-4 border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition rounded-xl shadow-md text-lg bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="transition duration-300 hover:bg-gray-100 hover:shadow-md flex items-center gap-2 px-6 py-3 rounded-xl text-lg"
                    onClick={() => formLogoCtx.setState({ name: "category" })}
                  >
                    <ArrowLeft />
                    Previous
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-white flex items-center gap-2 py-3 px-8 rounded-xl text-lg"
                  >
                    Next
                    <ArrowRight />
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
