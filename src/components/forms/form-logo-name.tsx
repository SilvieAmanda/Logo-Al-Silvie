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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const FormLogoName = () => {
  const params = useSearchParams();
  const formLogoCtx = useContext(FormLogoContext);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formLogoCtx.values.name
        ? formLogoCtx.values.name
        : params.get("name") ?? "",
    },
  });

  function onSubmit(values: FormSchemaType) {
    formLogoCtx.setState({
      name: "category",
      values: { ...formLogoCtx.values, name: values.name },
    });
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-[90%] max-w-2xl max-h-screen shadow-2xl rounded-2xl border-none bg-white/90 backdrop-blur-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="font-black text-4xl flex items-center justify-center gap-2 text-gray-900">
            <Sparkles className="text-yellow-400 animate-pulse" />
            <span className="drop-shadow-lg">Logo Name</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Enter the perfect name for your logo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Ex. NameLogo"
                        className="border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-xl p-4 w-full bg-white shadow-md transition text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
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
