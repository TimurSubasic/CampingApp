import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";

const CheckList1 = () => {
  // Store checked states for each item in an array
  const [options, setOptions] = useState([
    { title: "Tent", state: false },
    { title: "Flashlight", state: false },
    { title: "Sleeping bag", state: false },
    { title: "First Aid kit", state: false },
    { title: "Powerbank", state: false },
    { title: "Knife", state: false },
    { title: "Lighter", state: false },
    { title: "Water", state: false },
  ]);

  const toggleCheckbox = (index: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((item, i) =>
        i === index ? { ...item, state: !item.state } : item
      )
    );
  };

  return (
    <View className="flex flex-col items-center justify-center gap-4 w-full">
      <Text className="my-3 font-bold text-2xl">Check List</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          className={`flex flex-row items-center justify-between w-full rounded-lg p-4 border ${
            option.state ? "border-[#0D7377]" : "border-[#ef4444]"
          } `}
          onPress={() => toggleCheckbox(index)}
        >
          <Text>{option.title}</Text>

          <Checkbox
            value={option.state}
            onValueChange={() => toggleCheckbox(index)}
            color={option.state ? "#0D7377" : "#ef4444"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CheckList1;
