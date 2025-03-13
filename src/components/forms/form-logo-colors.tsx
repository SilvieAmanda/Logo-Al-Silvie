"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
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

const formSchema = z.object({
  colors: z.array(z.string()).max(3),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ColorItem = {
  color: string;
  psychology: string;
  itemStyle: string;
};

const colors: ColorItem[] = [
  { color: "Red", psychology: "Energy, Passion, Strength", itemStyle: "text-white bg-red-500" },
  { color: "Orange", psychology: "Creativity, Enthusiasm, Warmth", itemStyle: "text-white bg-orange-500" },
  { color: "Yellow", psychology: "Happiness, Optimism, Clarity", itemStyle: "text-black bg-yellow-400" },
  { color: "Green", psychology: "Growth, Harmony, Renewal", itemStyle: "text-white bg-green-500" },
  { color: "Blue", psychology: "Calm, Trust, Serenity", itemStyle: "text-white bg-blue-500" },
  { color: "Purple", psychology: "Luxury, Spirituality, Imagination", itemStyle: "text-white bg-purple-500" },
  { color: "Pink", psychology: "Love, Compassion, Playfulness", itemStyle: "text-white bg-pink-500" },
  { color: "Teal", psychology: "Calmness, Clarity, Emotional Balance", itemStyle: "text-white bg-teal-500" },
  { color: "Black", psychology: "Elegance, Power, Mystery", itemStyle: "text-white bg-black" },
  { color: "Brown", psychology: "Reliability, Stability, Warmth", itemStyle: "text-white bg-amber-800" },
  { color: "Cyan", psychology: "Freshness, Energy, Positivity", itemStyle: "text-white bg-cyan-500" },
  { color: "Magenta", psychology: "Creativity, Originality, Passion", itemStyle: "text-white bg-rose-500" },
  { color: "White", psychology: "Purity, Simplicity, Clarity", itemStyle: "text-black bg-white border" },
  { color: "Gray", psychology: "Neutrality, Balance, Sophistication", itemStyle: "text-white bg-gray-600" },
];

const ColorSelections = ({ selected, onChange }: { selected: string[]; onChange: (selected: string[]) => void }) => {
  const toggleSelection = useCallback(
    (item: ColorItem) => {
      if (selected.includes(item.color)) {
        onChange(selected.filter((v) => v !== item.color));
      } else if (selected.length < 3) {
        onChange([...selected, item.color]);
      }
    },
    [selected, onChange]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {colors.map((item) => (
        <motion.button
          key={item.color}
          className={clsx(
            item.itemStyle,
            "relative rounded-lg p-4 text-start transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg",
            selected.includes(item.color) ? "border-4 border-black scale-110 shadow-xl" : "border-2 border-gray-300"
          )}
          whileHover={{ scale: 1.05 }}
          onClick={() => toggleSelection(item)}
        >
          {selected.includes(item.color) && (
            <div className="absolute top-2 right-2 bg-black text-white p-2 rounded-full text-lg font-bold shadow-lg">
              {selected.indexOf(item.color) + 1}
            </div>
          )}
          <div className="text-xl font-bold">{item.color}</div>
          <div className="text-sm">{item.psychology}</div>
        </motion.button>
      ))}
    </div>
  );
};

export const FormLogoColors = () => {
  const formLogoCtx = useContext(FormLogoContext);
  const [selectedColors, setSelectedColors] = useState<string[]>(formLogoCtx?.values?.colors || []);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { colors: [] },
    mode: "onChange",
  });

  function onSubmit(skip = false) {
    formLogoCtx?.setState({
      name: "style",
      values: { ...formLogoCtx.values, colors: skip ? [] : selectedColors },
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4"
    >
      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl border-none rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-gray-900 text-center">🎨 Choose Your Colors</CardTitle>
          <CardDescription className="text-md text-gray-700 text-center">
            Select up to <span className="font-bold text-indigo-600">3 colors</span> or skip this step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColorSelections selected={selectedColors} onChange={setSelectedColors} />
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => formLogoCtx?.setState({ name: "description" })}>
              <ArrowLeft /> Previous
            </Button>
            <div className="flex gap-4">
              <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white" onClick={() => onSubmit(true)}>
                Skip
              </Button>
              <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={selectedColors.length === 0} onClick={() => onSubmit()}>
                Next <ArrowRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
