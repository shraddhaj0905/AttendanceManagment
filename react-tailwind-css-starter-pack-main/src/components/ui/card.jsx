import React from "react";

export function Card({ children }) {
  return <div className="border rounded-lg p-4 shadow">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="font-bold text-lg">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function CardDescription({ children }) {
  return <p className="text-gray-500">{children}</p>;
}
