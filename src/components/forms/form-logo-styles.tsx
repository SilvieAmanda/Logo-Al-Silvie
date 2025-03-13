"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { FormLogoContext } from "./context/form-logo-context";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

import ImgCartoon from "../../../public/images/cartoon.png";
import ImgMascott from "../../../public/images/mascott.png";
import ImgSimpleMinimalist from "../../../public/images/simple_minimalist.png";
import ImgAppLogo from "../../../public/images/app_logo.png";



const formSchema = z.object({
  style: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

type StyleItem = {
  name: string;
  imgSrc: StaticImageData;
};

const data: StyleItem[] = [
  { name: "Cartoon", imgSrc: ImgCartoon },
  { name: "Mascott", imgSrc: ImgMascott },
  { name: "App Logo", imgSrc: ImgAppLogo },
  { name: "Simple Minimalist", imgSrc: ImgSimpleMinimalist },
  
  
];

const ItemComp = ({
  item,
  isSelected,
  onSelect,
}: {
  item: StyleItem;
  isSelected: boolean;
  onSelect: (item: StyleItem) => void;
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={cn(
        "flex flex-col items-center gap-5 p-5 rounded-xl cursor-pointer shadow-lg transition-all transform hover:scale-110",
        isSelected
          ? "border-4 border-[#6C5DD3] bg-[#6C5DD3]/10 shadow-xl"
          : "border border-gray-300 bg-white"
      )}
    >
      <Image
        src={item.imgSrc}
        alt={item.name}
        width={250}
        height={250}
        className="rounded-lg object-cover"
      />
      <div className="text-3xl font-bold">{item.name}</div>
    </div>
  );
};

const StyleSelections = ({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (selected: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.map((item) => (
        <ItemComp
          key={item.name}
          item={item}
          isSelected={selected === item.name}
          onSelect={(v) => onChange(v.name)}
        />
      ))}
    </div>
  );
};

export const FormLogoStyles = () => {
  const formLogoCtx = useContext(FormLogoContext);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: formLogoCtx.values.style,
    },
  });

  function onSubmit(values: FormSchemaType) {
    formLogoCtx.setState({
      name: "generating",
      values: { ...formLogoCtx.values, style: values.style },
    });
  }

  return (
    <Card className="max-w-5xl mx-auto p-10 shadow-2xl rounded-3xl border border-[#6C5DD3]/50">
      <CardHeader className="text-center">
        <CardTitle className="text-5xl font-black text-[#6C5DD3]">Pick Style</CardTitle>
        <CardDescription className="text-xl text-gray-600">
          Select a style for your logo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <StyleSelections
                      selected={field.value}
                      onChange={(selected) => field.onChange(selected)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="px-8 py-4 text-2xl border-[#6C5DD3] text-[#6C5DD3] hover:bg-[#6C5DD3]/10"
                onClick={() => formLogoCtx.setState({ name: "colors" })}
              >
                <ArrowLeft className="mr-2 size-7" />
                Previous
              </Button>
              <Button
                type="submit"
                disabled={!form.getValues("style")}
                className="px-8 py-4 text-2xl bg-[#6C5DD3] hover:bg-[#5A4BCF] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate Logo
                <ArrowRight className="ml-2 size-7" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
