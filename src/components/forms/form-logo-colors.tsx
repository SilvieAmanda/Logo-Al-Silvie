"use client";

import { useContext, useState, useCallback } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { FormLogoContext } from "./context/form-logo-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const defaultColors = [
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

const ColorSelections = ({
  selected,
  onChange,
  allColors,
}: {
  selected: string[];
  onChange: (selected: string[]) => void;
  allColors: { color: string; psychology: string; itemStyle: string }[];
}) => {
  const toggleSelection = useCallback(
    (item: { color: string }) => {
      if (selected.includes(item.color)) {
        onChange(selected.filter((v) => v !== item.color));
      } else if (selected.length < 3) {
        onChange([...selected, item.color]);
      } else {
        alert("You can only select up to 3 colors.");
      }
    },
    [selected, onChange]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {allColors.map((item) => (
        <motion.button
          key={item.color}
          className={clsx(
            item.itemStyle,
            "relative rounded-lg p-4 text-start transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl",
            selected.includes(item.color) ? "border-4 border-black scale-110 shadow-lg" : "border-2 border-gray-300"
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
  const [customColors, setCustomColors] = useState<{ color: string; psychology: string; itemStyle: string }[]>([]);
  const [customColor, setCustomColor] = useState("#000000");
  const [customColorName, setCustomColorName] = useState("");

  const addCustomColor = () => {
    if (
      customColorName.trim() !== "" &&
      !selectedColors.includes(customColorName) &&
      selectedColors.length < 3
    ) {
      setCustomColors([
        ...customColors,
        {
          color: customColorName,
          psychology: "Custom Color",
          itemStyle: `text-white bg-[${customColor}]`,
        },
      ]);
      setSelectedColors([...selectedColors, customColorName]);
      setCustomColorName("");
      setCustomColor("#000000");
    } else {
      alert("Please enter a valid color name and ensure you select no more than 3 colors.");
    }
  };

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
      className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-center items-center"
    >
      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl border-none rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-gray-900 text-center">🎨 Choose Your Colors</CardTitle>
          <CardDescription className="text-md text-gray-700 text-center">
            Select up to <span className="font-bold text-indigo-600">3 colors</span> or skip this step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Custom Color Name</label>
              <input
                type="text"
                className="w-full border-2 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. My Blue"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Pick a Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 p-0 border rounded"
                />
                <Button
                  type="button"
                  onClick={addCustomColor}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Add Custom Color
                </Button>
              </div>
            </div>
          </div>

          <ColorSelections
            selected={selectedColors}
            onChange={setSelectedColors}
            allColors={[...defaultColors, ...customColors]}
          />

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => formLogoCtx?.setState({ name: "description" })}>
              <ArrowLeft /> Previous
            </Button>
            <div className="flex gap-4">
              <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white" onClick={() => onSubmit(true)}>
                Skip
              </Button>
              <Button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={selectedColors.length === 0}
                onClick={() => onSubmit()}
              >
                Next <ArrowRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
